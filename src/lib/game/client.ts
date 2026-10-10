export type GamePrize = { id: string; name: string; description: string; image: string | null; quantity: number; active: boolean };
export type GameWin = { id: string; name: string; email: string; prize_name: string; created_at: string };
export type SpinResult = { id: string; prize_name: string; prize_image: string | null; wheel: { id: string; name: string }[]; prize_id: string };
export async function gameApi(path: string, body?: unknown) {
  const response = await fetch(`/api/questions/game/${path}`, {
    cache: 'no-store',
    ...(body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'Please try again.');
  return data;
}
