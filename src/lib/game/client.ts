export type GamePrize = { id: string; name: string; description: string; image: string | null; quantity: number; active: boolean };
export type GameWin = { id: string; name: string; email: string; prize_name: string; created_at: string };
export type GameAttempt = Omit<GameWin, 'prize_name'> & { outcome: 'won' | 'no_prize' | 'try_again'; prize_name: string | null; win_chance: number };
export type WheelSegment = { id: string; name: string; weight?: number };
export type SpinResult = { id: string; segment_id?: string; request_id?: string; outcome: 'won' | 'no_prize' | 'try_again'; prize_name: string | null; prize_image: string | null; wheel: WheelSegment[]; prize_id: string | null; win_chance: number };
export async function gameApi(path: string, body?: unknown) {
  const response = await fetch(`/api/questions/game/${path}`, {
    cache: 'no-store',
    ...(body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'Please try again.');
  return data;
}
