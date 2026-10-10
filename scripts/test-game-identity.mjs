import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, imports) {
  const source = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, URL, require: name => { assert.ok(Object.hasOwn(imports, name)); return imports[name]; } });
  return exports;
}
const ingress = load('src/lib/questions/ingress.ts', { 'node:net': { isIP } });
const { gameClientIdentity: identity } = load('src/lib/game/identity.ts', { 'node:crypto': { createHmac }, '@/lib/questions/ingress': ingress });
const secret = 'test-only-secret-for-game-ip-hashing';
const headers = ip => new Headers({ 'x-client-ip': ip });
const resolve = ip => identity(headers(ip), 'production', 'x-client-ip', secret);
assert.equal(identity(new Headers({ 'x-forwarded-for': '198.51.100.1' }), 'production', undefined, secret), null, 'No guessing untrusted headers');
assert.equal(identity(headers('198.51.100.1'), 'production', 'x-client-ip', undefined), null);
assert.equal(identity(headers('198.51.100.1'), 'production', 'x-client-ip', 'short'), null);
assert.equal(identity(headers('198.51.100.1'), 'production', 'x-client-ip', 'YOUR_RANDOM_PROXY_SECRET_PLACEHOLDER'), null);
assert.equal(resolve('invalid'), null);
assert.match(resolve('198.51.100.1'), /^[a-f0-9]{64}$/);
assert.equal(resolve('198.51.100.1'), resolve('198.51.100.1'));
assert.notEqual(resolve('198.51.100.1'), resolve('198.51.100.2'));
assert.equal(resolve('2001:db8::1'), resolve('2001:0db8:0:0:0:0:0:1'));
assert.equal(resolve('::ffff:198.51.100.1'), resolve('198.51.100.1'));
assert.equal(resolve('::ffff:c633:6401'), resolve('198.51.100.1'));
assert.equal(resolve('198.51.100.1, 198.51.100.2'), resolve('198.51.100.1'));
assert.equal(identity(headers('198.51.100.1'), 'development', undefined, secret), identity(headers('198.51.100.2'), 'development', undefined, secret), 'Local development shares one IP bucket');
assert.notEqual(resolve('198.51.100.1'), identity(headers('198.51.100.1'), 'production', 'x-client-ip', `${secret}-changed`));
console.log('PASS: trusted ingress, missing configuration, private stable IP hashes, IPv6 normalization, mapped IPv4 and shared local development identity.');
