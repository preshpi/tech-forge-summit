import assert from 'node:assert/strict';
import { isIP } from 'node:net';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync('src/lib/questions/ingress.ts', 'utf8'), {
 compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;
const exports = {};
vm.runInNewContext(source, { exports, require: name => { assert.equal(name, 'node:net'); return { isIP }; } });
const resolve = exports.questionClientIdentity;
const empty = new Headers();
for (const header of [undefined, '', 'YOUR_HOSTING_TRUSTED_IP_HEADER', 'x-vercel-forwarded-for']) {
 assert.equal(resolve(empty, 'development', header), 'local-development');
 assert.equal(resolve(empty, 'production', header), null);
}
assert.equal(resolve(new Headers({ 'x-forwarded-for': '198.51.100.5' }), 'production', undefined), null);
assert.equal(resolve(new Headers({ 'x-client-ip': '198.51.100.5, 198.51.100.6' }), 'production', 'x-client-ip'), '198.51.100.5');
assert.equal(resolve(new Headers({ 'x-client-ip': '2001:db8::1' }), 'production', 'x-client-ip'), '2001:db8::1');
assert.equal(resolve(new Headers({ 'x-client-ip': 'arbitrary-spoofed-identity' }), 'production', 'x-client-ip'), null);
assert.equal(resolve(new Headers({ 'x-client-ip': '198.51.100.5' }), 'development', 'x-client-ip'), 'local-development');
assert.equal(resolve(empty, 'production', 'invalid header'), null);
console.log('PASS: development uses one persistent identity; production requires explicit trusted ingress and a valid IP.');
