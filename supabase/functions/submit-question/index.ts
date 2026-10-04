// Only the Next.js server may call this function. No browser receives the proxy secret.
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
Deno.serve(async (req: Request) => {
 const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
 if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
 const secret = Deno.env.get('QUESTION_PROXY_SECRET');
 if (!secret || secret.length < 32 || secret.startsWith('YOUR_') || req.headers.get('x-question-secret') !== secret) return reply({ error: 'Unauthorized' }, 401);
 try {
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > 12000) return reply({ error: 'Request too large' }, 413);
  const b = JSON.parse(raw);
  const deleting = b.action === 'delete';
  if (deleting && (typeof b.question_id !== 'string' || typeof b.deletion_token !== 'string' || !uuid.test(b.question_id ?? '') || !/^[a-f0-9]{64}$/.test(b.deletion_token ?? '') || !/^[a-f0-9]{64}$/.test(b.identity ?? ''))) return reply({ error: 'Invalid deletion request' }, 400);
  if (!deleting && b.deletion_token != null && (typeof b.deletion_token !== 'string' || !/^[a-f0-9]{64}$/.test(b.deletion_token))) return reply({ error: 'Invalid deletion token' }, 400);
  if (!deleting && (!uuid.test(b.session_id ?? '') || !uuid.test(b.request_id ?? '') || !/^[a-f0-9]{64}$/.test(b.identity ?? '') ||
      typeof b.body !== 'string' || b.body.trim().length < 10 || b.body.trim().length > 2000 ||
      (b.name != null && (typeof b.name !== 'string' || b.name.trim().length > 80)) ||
      (b.speaker_point != null && (typeof b.speaker_point !== 'string' || b.speaker_point.trim().length > 300))))
   return reply({ error: 'Check the question fields.' }, 400);
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const url = Deno.env.get('SUPABASE_URL');
  if (!key || !url) return reply({ error: 'Submission service unavailable' }, 503);
  const rpc = deleting ? 'delete_audience_question' : 'submit_audience_question';
  const payload = deleting ? { p_question: b.question_id, p_delete_token: b.deletion_token, p_identity: b.identity } : { p_session: b.session_id, p_request: b.request_id, p_identity: b.identity, p_name: b.name ?? '', p_point: b.speaker_point ?? '', p_body: b.body, ...(b.deletion_token ? { p_delete_token: b.deletion_token } : {}) };
  const result = await fetch(`${url}/rest/v1/rpc/${rpc}`, {
   method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
   body: JSON.stringify(payload)
  });
  if (!result.ok) return reply({ error: 'Submission service unavailable' }, 503);
  const data = await result.json();
  return reply(data, data.status ?? 200);
 } catch { return reply({ error: 'Invalid request or unavailable service' }, 400); }
});
