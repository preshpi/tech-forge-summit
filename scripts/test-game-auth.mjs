import assert from 'node:assert/strict';
import { gameServiceHeaders } from '../src/lib/game/auth.ts';

const secret = 'sb_secret_test_only';
assert.equal(gameServiceHeaders(secret).apikey, secret);
assert.equal(Object.hasOwn(gameServiceHeaders(secret), 'Authorization'), false, 'Secret API keys must not be sent as JWT bearer tokens');
const legacy = 'eyJtest.legacy.signature';
assert.equal(gameServiceHeaders(legacy).apikey, legacy);
assert.equal(gameServiceHeaders(legacy).Authorization, `Bearer ${legacy}`);
assert.equal(gameServiceHeaders(secret)['Content-Type'], 'application/json');
console.log('PASS: secret API key and legacy JWT service authentication headers.');
