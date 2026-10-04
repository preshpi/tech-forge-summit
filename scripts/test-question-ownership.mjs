import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';
const source = ts.transpileModule(readFileSync('src/lib/questions/ownership.ts', 'utf8'), {
 compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;
const exports = {};
let value = null;
let blocked = false;
const storage = { getItem() { if (blocked) throw new Error('Unavailable'); return value; }, setItem(_key, next) { if (blocked) throw new Error('Unavailable'); value = next; } };
vm.runInNewContext(source, { exports, localStorage: storage, crypto: webcrypto });
const token = exports.newDeletionToken();
assert.match(token, /^[a-f0-9]{64}$/);
assert.notEqual(exports.newDeletionToken(), token);
const id = '40000000-0000-4000-8000-000000000001';
const owner = { token, sessionId: id, path: 'event/session', submittedAt: '2026-10-04T10:00:00Z' };
assert.equal(exports.writeQuestionOwnership({ [id]: owner }), true);
assert.equal(exports.readQuestionOwnership()[id].token, token);
value = JSON.stringify({ [id]: { ...owner, token: 'bad' }, injected: owner });
assert.equal(Object.keys(exports.readQuestionOwnership()).length, 0);
value = 'invalid JSON';
assert.equal(Object.keys(exports.readQuestionOwnership()).length, 0);
blocked = true;
assert.equal(exports.writeQuestionOwnership({ [id]: owner }), false);
assert.equal(Object.keys(exports.readQuestionOwnership()).length, 0);
console.log('PASS: random per-question tokens, stored ownership retrieval, malformed-storage rejection, and unavailable-storage handling.');
