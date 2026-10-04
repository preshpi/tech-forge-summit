import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'node:crypto';
import { adminToken, config, database } from '@/lib/questions/server';
import { questionClientIdentity } from '@/lib/questions/ingress';
const uuid = /^[0-9a-f-]{36}$/i;
const tables = { events: 'question_events', sessions: 'question_sessions', questions: 'audience_questions' } as const;
type Resource = keyof typeof tables;
const reply = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
 try {
  const { path } = await context.params;
  const admin = path[0] === 'admin';
  const resource = path[admin ? 1 : 0] as Resource;
  if (!Object.hasOwn(tables, resource)) return reply({ error: 'Not found' }, 404);
  const token = admin ? await adminToken() : undefined;
  const query = new URLSearchParams({ select: '*', order: resource === 'questions' ? 'created_at.desc,id.desc' : resource === 'sessions' ? 'position.asc,id.asc' : 'edition.desc,slug.asc', limit: resource === 'questions' ? '21' : '1000' });
  for (const field of ['slug','event_id','session_id']) {
   const value = req.nextUrl.searchParams.get(field);
   if (value) query.set(field, `eq.${value}`);
  }
  const offset = Math.max(0, Math.min(100000, Number(req.nextUrl.searchParams.get('offset') ?? 0) || 0));
  query.set('offset', String(Math.floor(offset)));
  return reply(await database(`${tables[resource]}?${query}`, token));
 } catch (e) { return reply({ error: e instanceof Error && e.message === 'Unauthorized' ? 'Admin sign-in required.' : 'Questions are temporarily unavailable.' }, e instanceof Error && e.message === 'Unauthorized' ? 401 : 503); }
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
 const origin = req.headers.get('origin');
 if (!origin || origin !== req.nextUrl.origin) return reply({ error: 'Invalid origin' }, 403);
 try {
  const { path } = await context.params;
  const raw = await req.text();
  if (Buffer.byteLength(raw) > 12000) return reply({ error: 'Request too large' }, 413);
  const b = JSON.parse(raw);
  if (path[0] === 'login') {
   if (typeof b.email !== 'string' || typeof b.password !== 'string') return reply({ error: 'Email and password required' }, 400);
   const { url, key } = config();
   const res = await fetch(`${url}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: b.email, password: b.password }) });
   const data = await res.json();
   if (!res.ok || !(await database('rpc/is_question_admin', data.access_token, 'POST', {}))) return reply({ error: 'Sign-in failed or account is not authorised.' }, 401);
   (await cookies()).set('tf_admin', data.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/questions', maxAge: Math.min(data.expires_in, 3600) });
   return reply({ ok: true });
  }
  if (path[0] === 'logout') { (await cookies()).set('tf_admin', '', { path: '/api/questions', maxAge: 0 }); return reply({ ok: true }); }
  if (path[0] === 'submit' || path[0] === 'delete') {
   const secret = process.env.QUESTION_PROXY_SECRET;
   if (!secret || secret.length < 32 || secret.startsWith('YOUR_')) return reply({ error: 'Submissions are not configured yet.' }, 503);
   // Use only a header overwritten by the trusted hosting ingress. Fail closed if absent.
   const ip = questionClientIdentity(req.headers, process.env.NODE_ENV, process.env.QUESTION_TRUSTED_IP_HEADER);
   if (!ip) return reply({ error: 'Submission ingress is not configured.' }, 503);
   const { url, key } = config();
   const res = await fetch(`${url}/functions/v1/submit-question`, { method: 'POST', headers: { apikey: key, 'x-question-secret': secret, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...b, action: path[0] === 'delete' ? 'delete' : 'submit', identity: createHmac('sha256', secret).update(ip).digest('hex') }) });
   return reply(await res.json(), res.status);
  }
  if (path[0] !== 'admin') return reply({ error: 'Not found' }, 404);
  const token = await adminToken();
  const resource = path[1] as Resource;
  if (!Object.hasOwn(tables, resource)) return reply({ error: 'Not found' }, 404);
  const allowed = resource === 'events' ? ['slug','title','edition','published','event_date','kind'] : resource === 'sessions' ? ['event_id','slug','title','speaker','starts_at','published','intake_open','position'] : ['visible'];
  const body = Object.fromEntries(Object.entries(b).filter(([k]) => allowed.includes(k)));
  const id = path[2];
  if (id && !uuid.test(id)) return reply({ error: 'Invalid ID' }, 400);
  if (!id && resource === 'questions') return reply({ error: 'Not allowed' }, 403);
  return reply(await database(`${tables[resource]}${id ? `?id=eq.${id}` : ''}`, token, id ? 'PATCH' : 'POST', body));
 } catch (e) { return reply({ error: e instanceof Error && e.message === 'Unauthorized' ? 'Admin sign-in required.' : 'Request failed. Check fields and configuration.' }, e instanceof Error && e.message === 'Unauthorized' ? 401 : 400); }
}
