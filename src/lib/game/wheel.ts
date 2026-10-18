import type { WheelSegment } from './client';

export function createPrizeWheel(prizes: { id: string; name: string; win_chance?: number }[], chance: number): WheelSegment[] {
  if (!prizes.length) return [];
  const usesPrizeChances = prizes.every(prize => Number.isInteger(prize.win_chance));
  const prizeChance = usesPrizeChances ? prizes.reduce((total, prize) => total + (prize.win_chance ?? 0), 0) : chance;
  return displayWheel([
    ...prizes.filter(prize => usesPrizeChances ? prize.win_chance! > 0 : chance > 0).map(prize => ({ id: prize.id, name: prize.name, weight: usesPrizeChances ? prize.win_chance : chance / prizes.length })),
    ...(prizeChance < 100 ? [{ id: 'no-prize', name: 'No prize this time', weight: 100 - prizeChance }] : []),
  ]);
}

export function isNoPrizeSegment(id: string) {
  return id === 'no-prize' || id.startsWith('no-prize-try-');
}

// Split the server's loss weight into four visual segments without changing odds.
export function displayWheel(wheel: WheelSegment[]): WheelSegment[] {
  const loss = wheel.find(segment => segment.id === 'no-prize');
  if (!loss || wheel.some(segment => segment.id.startsWith('no-prize-try-'))) return wheel;
  const prizes = wheel.filter(segment => segment.id !== 'no-prize');
  const losses = [1, 2, 3].map(index => ({ id: `no-prize-try-${index}`, name: 'Try again', weight: (loss.weight ?? 1) / 4 }));
  const blanks = [...losses, { id: 'no-prize', name: 'Nothing For You', weight: (loss.weight ?? 1) / 4 }];
  const result: WheelSegment[] = [];
  for (let index = 0; index < Math.max(prizes.length, blanks.length); index++) {
    if (prizes[index]) result.push(prizes[index]);
    if (blanks[index]) result.push(blanks[index]);
  }
  return result;
}

export function resultSegment(wheel: WheelSegment[], prizeId: string | null, segmentId?: string) {
  const segments = wheelAngles(displayWheel(wheel));
  return segments.find(segment => segment.id === (segmentId ?? prizeId ?? 'no-prize'));
}

export function wheelAngles(wheel: WheelSegment[]) {
  // Slice size is visual only. The server chooses the outcome using the configured odds.
  const angle = 360 / wheel.length;
  return wheel.map((segment, index) => {
    const start = index * angle;
    return { ...segment, start, end: (index + 1) * angle, center: start + angle / 2, angle };
  });
}

export function resultRotation(wheel: WheelSegment[], prizeId: string | null, turns = 6, segmentId?: string) {
  const segment = resultSegment(wheel, prizeId, segmentId);
  if (!segment) throw new Error('The saved result does not match the wheel.');
  return turns * 360 + 360 - segment.center;
}
