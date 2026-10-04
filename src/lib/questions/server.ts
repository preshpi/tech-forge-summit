import 'server-only';
import { cookies } from 'next/headers';
export function config() {
 const url = process.env.SUPABASE_PROJ_URL;
 const key = process.env.SUPABASE_PUB_KEY;
 if (!url || !key) throw new Error('Questions are not configured yet.');
 return { url: url.replace(/\/$/, ''), key };
}
export async function database(path: string, token?: string, method = 'GET', body?: unknown) {
 const { url, key } = config();
 const res = await fetch(`${url}/rest/v1/${path}`, { method, cache: 'no-store', headers: {
  apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json', Prefer: 'return=representation'
 }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
 if (!res.ok) throw new Error('Database request failed.');
 return res.json();
}
export async function adminToken() {
 const token = (await cookies()).get('tf_admin')?.value;
 if (!token) throw new Error('Unauthorized');
 const { url, key } = config();
 const user = await fetch(`${url}/auth/v1/user`, { cache: 'no-store', headers: { apikey: key, Authorization: `Bearer ${token}` } });
 if (!user.ok || !(await database('rpc/is_question_admin', token, 'POST', {}))) throw new Error('Unauthorized');
 return token;
}
