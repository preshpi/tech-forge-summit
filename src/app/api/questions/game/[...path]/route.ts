import { NextRequest } from 'next/server';
import { adminToken, config, database } from '@/lib/questions/server';
import { gameServiceHeaders } from '@/lib/game/auth';
import { gameClientIdentity } from '@/lib/game/identity';

const reply = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Context = { params: Promise<{ path: string[] }> };
function failure(error: unknown) {
  const unauthorized = error instanceof Error && error.message === 'Unauthorized';
  return reply({ error: unauthorized ? 'Admin sign-in required.' : 'The game is temporarily unavailable. Please try again.' }, unauthorized ? 401 : 503);
}
export async function GET(req: NextRequest, context: Context) {
  try {
    const { path } = await context.params;
    if (path.join('/') === 'prizes') return reply(await database('game_prizes?select=id,name,description,image&active=eq.true&quantity=gt.0&order=id.asc'));
    if (path.join('/') === 'config') {
      const [prizes, settings] = await Promise.all([
        database('game_prizes?select=id,name,description,image&active=eq.true&quantity=gt.0&order=id.asc'),
        database('game_settings?select=win_chance&id=eq.true'),
      ]);
      if (!settings[0]) return reply({ error: 'The game is not configured yet.' }, 503);
      return reply({ prizes, win_chance: settings[0].win_chance });
    }
    const token = await adminToken();
    if (path.join('/') === 'admin/settings') return reply((await database('game_settings?select=win_chance&id=eq.true', token))[0]);
    if (path.join('/') === 'admin/prizes') return reply(await database('game_prizes?select=*&order=created_at.asc,id.asc', token));
    if (path.join('/') === 'admin/wins' || path.join('/') === 'admin/attempts') {
      const offset = Math.max(0, Math.min(1000000, Math.floor(Number(req.nextUrl.searchParams.get('offset')) || 0)));
      if (path[1] === 'attempts') return reply(await database(`game_attempts?select=id,name,email,outcome,prize_name,win_chance,created_at&order=created_at.desc,id.desc&limit=51&offset=${offset}`, token));
      return reply(await database(`game_wins?select=id,name,email,prize_name,created_at&order=created_at.desc,id.desc&limit=51&offset=${offset}`, token));
    }
    return reply({ error: 'Not found' }, 404);
  } catch (error) { return failure(error); }
}
export async function POST(req: NextRequest, context: Context) {
  if (req.headers.get('origin') !== req.nextUrl.origin) return reply({ error: 'Invalid origin' }, 403);
  try {
    const { path } = await context.params;
    const raw = await req.text();
    if (Buffer.byteLength(raw) > 490000) return reply({ error: 'Image too large. Use an image under 350 KB.' }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return reply({ error: 'Invalid request' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ error: 'Invalid request' }, 400);
    if (path.join('/') === 'result-status') {
      if (typeof body.result_id !== 'string' || !uuid.test(body.result_id)) return reply({ error: 'Invalid result reference.' }, 400);
      const { url } = config();
      const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!service) return reply({ error: 'The game is not configured yet.' }, 503);
      // A receipt can confirm its existence, but never exposes attendee or prize details.
      const res = await fetch(`${url}/rest/v1/game_attempts?select=id&id=eq.${body.result_id}&limit=1`, {
        cache: 'no-store', headers: gameServiceHeaders(service),
      });
      if (!res.ok) return reply({ error: 'Unable to verify your saved spin. Please try again.' }, 503);
      const rows = await res.json();
      if (!Array.isArray(rows)) return reply({ error: 'Unable to verify your saved spin. Please try again.' }, 503);
      return reply({ exists: rows.length > 0 });
    }
    if (path.join('/') === 'spin') {
      if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > 100 || typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) || typeof body.request_id !== 'string' || !uuid.test(body.request_id)) return reply({ error: 'Please enter a valid name and email address.' }, 400);
      const { url } = config();
      const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!service) return reply({ error: 'The game is not configured yet.' }, 503);
      const identity = gameClientIdentity(req.headers, process.env.NODE_ENV, process.env.QUESTION_TRUSTED_IP_HEADER, process.env.QUESTION_PROXY_SECRET);
      if (!identity) return reply({ error: 'The game’s network verification is not configured yet. Please contact the event team.' }, 503);
      const res = await fetch(`${url}/rest/v1/rpc/spin_game`, { method: 'POST', cache: 'no-store', headers: gameServiceHeaders(service), body: JSON.stringify({ p_request: body.request_id, p_name: body.name.trim(), p_email: body.email.trim().toLowerCase(), p_identity: identity }) });
      if (!res.ok) {
        const details = await res.json().catch(() => ({}));
        // Log transport diagnostics without attendee details, request IDs or credentials.
        console.error('Spin RPC failed', { status: res.status, code: details.code });
        return reply({ error: 'Unable to complete your spin. Please retry with the same details.' }, 503);
      }
      const data = await res.json();
      return reply(data, data.error ? 409 : 200);
    }
    const token = await adminToken();
    if (path.join('/') === 'admin/settings') {
      if (!Number.isInteger(body.win_chance) || body.win_chance < 0 || body.win_chance > 100) return reply({ error: 'Winning chance must be a whole number from 0 to 100.' }, 400);
      return reply((await database('game_settings?id=eq.true', token, 'PATCH', { win_chance: body.win_chance }))[0]);
    }
    if (path[0] !== 'admin' || path[1] !== 'prizes' || path.length > 3 || (path[2] && !uuid.test(path[2]))) return reply({ error: 'Not found' }, 404);
    const data = Object.fromEntries(Object.entries(body).filter(([field]) => ['name', 'description', 'image', 'quantity', 'active'].includes(field)));
    if (('name' in data && (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 100)) || ('quantity' in data && (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity) || data.quantity < 0 || data.quantity > 100000)) || ('active' in data && typeof data.active !== 'boolean') || ('description' in data && (typeof data.description !== 'string' || data.description.length > 500)) || ('image' in data && data.image !== null && (typeof data.image !== 'string' || data.image.length > 480000 || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(data.image)))) return reply({ error: 'Check the prize details and image size.' }, 400);
    return reply(await database(`game_prizes${path[2] ? `?id=eq.${path[2]}` : ''}`, token, path[2] ? 'PATCH' : 'POST', data));
  } catch (error) { return failure(error); }
}
