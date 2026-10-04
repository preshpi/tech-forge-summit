export type QuestionEvent = { id: string; slug: string; title: string; edition: number; published: boolean; event_date: string | null; kind?: string };
export type QuestionSession = { id: string; event_id: string; slug: string; title: string; speaker: string | null; starts_at: string | null; published: boolean; intake_open: boolean; position: number };
export type AudienceQuestion = { id: string; session_id: string; name: string; speaker_point: string | null; body: string; created_at: string; visible: boolean };
export async function questionApi(path: string, body?: unknown) {
 const res = await fetch(`/api/questions/${path}`, { cache: 'no-store', ...(body !== undefined ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error === 'rate_limited' ? 'Too many requests. Please try again in 10 minutes.' : data.error === 'intake_closed' ? 'Question intake is now closed.' : data.error === 'deletion_denied' ? 'This browser cannot delete that question.' : data.error ?? 'Request failed.');
 return data;
}
export function questionDate(date: string, short = false) {
 return new Date(date).toLocaleString('en-NG', { timeZone: 'Africa/Lagos', day: 'numeric', month: short ? 'short' : 'long', ...(short ? {} : { year: 'numeric' }), hour: 'numeric', minute: '2-digit' });
}
