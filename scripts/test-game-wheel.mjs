import assert from 'node:assert/strict';
import { createPrizeWheel, displayWheel, isNoPrizeSegment, resultRotation, resultSegment, wheelAngles } from '../src/lib/game/wheel.ts';

const prizes = [{ id: 'cap', name: 'Cap' }, { id: 'shirt', name: 'T-shirt' }];
const wheel = createPrizeWheel(prizes, 20);
const angles = wheelAngles(wheel);
assert.deepEqual(angles.map(segment => segment.angle), [36, 72, 36, 72, 72, 72]);
assert.equal(wheel.filter(segment => segment.name === 'Try again').length, 3);
assert.equal(wheel.filter(segment => segment.name === 'Nothing For You').length, 1);
assert.equal(wheel.filter(segment => isNoPrizeSegment(segment.id)).reduce((sum, segment) => sum + segment.weight, 0), 80);
assert.deepEqual(displayWheel(wheel), wheel, 'Already expanded wheels remain unchanged');
assert.equal(angles.at(-1).end, 360);
for (const segment of angles) {
  const rotation = resultRotation(wheel, segment.id);
  assert.equal((rotation + segment.center) % 360, 0, 'Pointer lands at the saved outcome');
}
assert.equal(createPrizeWheel(prizes, 0).length, 4);
assert.ok(createPrizeWheel(prizes, 0).every(segment => isNoPrizeSegment(segment.id) && segment.weight === 25));
const oldWheel = [...prizes.map(prize => ({ ...prize, weight: 10 })), { id: 'no-prize', name: 'No prize this time', weight: 80 }];
const selected = new Set();
for (let index = 0; index < 4; index++) {
  const segmentId = index === 3 ? 'no-prize' : `no-prize-try-${index + 1}`;
  const segment = resultSegment(oldWheel, null, segmentId);
  selected.add(segment.id);
  assert.equal((resultRotation(oldWheel, null, 6, segmentId) + segment.center) % 360, 0);
  assert.equal((resultRotation(oldWheel, null, 0, segmentId) + segment.center) % 360, 0, 'Reload preserves the loss segment');
}
assert.equal(selected.size, 4, 'Every loss label can be selected');
assert.equal(createPrizeWheel(prizes, 100).some(segment => segment.id === 'no-prize'), false);
assert.deepEqual(createPrizeWheel([], 20), []);
assert.deepEqual(wheelAngles(prizes).map(segment => segment.angle), [180, 180], 'Historical wheels still render');
assert.throws(() => resultRotation(wheel, 'missing'));
console.log('PASS: proportional wheel segments, winning and losing pointer alignment, edge chances and historical results.');
