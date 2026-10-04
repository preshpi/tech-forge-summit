// Run only on a trusted operator machine; never execute from a public HTTP route.
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
const { SUPABASE_PROJ_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, ADMIN_EMAIL: email, ADMIN_SETUP_PASSWORD: password } = process.env;
if (!url || !key || !email) throw new Error('Set SUPABASE_PROJ_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAIL securely.');
if ([url, key, email].some(value => value.includes('YOUR_'))) throw new Error('Replace the Supabase URL, privileged key, and ADMIN_EMAIL placeholders in your secure environment before provisioning.');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('ADMIN_EMAIL must be the actual email address of the authorised admin.');
let serviceJwt = false;
if (!key.startsWith('sb_secret_')) {
 try { serviceJwt = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role === 'service_role'; } catch { /* Reject unrecognised credentials without printing them. */ }
 if (!serviceJwt) throw new Error('SUPABASE_SERVICE_ROLE_KEY must contain a Supabase secret key or legacy service_role key, not a publishable or anon key.');
}
const headers = { apikey: key, ...(serviceJwt ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json' };
async function api(path, method = 'GET', body) {
 const res = await fetch(`${url.replace(/\/$/,'')}/${path}`, { method, headers, ...(body ? {body:JSON.stringify(body)}:{}) });
 if (!res.ok) throw new Error(res.status === 401 ? 'Supabase rejected the privileged key. Use a current secret or service_role key from the same project as SUPABASE_PROJ_URL. No credentials were logged.' : `Admin setup request failed (${res.status}); no credentials were logged.`);
 const text = await res.text();
 if (!text.trim()) return null;
 try { return JSON.parse(text); } catch { throw new Error('Admin setup received an unexpected response format; no response contents or credentials were logged.'); }
}
let user;
for (let page=1; ;page++) {
 const data=await api(`auth/v1/admin/users?page=${page}&per_page=100`);
 user=data.users.find(u=>u.email?.toLowerCase()===email.toLowerCase());
 if(user || data.users.length<100)break;
}
if (!user) {
 if (!password || password.length<16 || password.startsWith('YOUR_')) throw new Error('First-time creation requires ADMIN_SETUP_PASSWORD of at least 16 characters.');
 user=await api('auth/v1/admin/users','POST',{email,password,email_confirm:true});
}
if (!user.email_confirmed_at) throw new Error('Existing account email is unconfirmed. Verify ownership in Supabase Auth before authorising it.');
// The RPC does not exist in the public schema: grant the allowlist through SQL via a one-time admin-only function.
await api('rest/v1/rpc/provision_question_admin','POST',{p_user:user.id});
console.log('The configured admin account is authorised. Sign in at /questions/admin.');
