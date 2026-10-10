// Executes PostgreSQL migrations and RLS tests in disposable PGlite, with Supabase Auth role stubs.
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const modulePath = process.env.QUESTION_TEST_PGLITE_PATH;
if (!modulePath) throw new Error('Set QUESTION_TEST_PGLITE_PATH to the temporary PGlite dist/index.js path; see docs.');
const { PGlite } = await import(pathToFileURL(resolve(modulePath)).href);
const db = new PGlite();
try {
 await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key,email text); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to anon,authenticated,service_role; grant execute on function auth.uid() to anon,authenticated,service_role;`);
 for(const name of (await readdir('supabase/migrations')).sort()) {
  await db.exec(await readFile(`supabase/migrations/${name}`,'utf8'));
  console.log(`Migration passed: ${name}`);
 }
 await db.exec(await readFile('supabase/tests/questions.sql','utf8'));
 await db.exec(await readFile('supabase/tests/question_deletion.sql','utf8'));
 await db.exec(await readFile('supabase/tests/spin_game.sql','utf8'));
 console.log('PASS: spin awards, stock, retries, email uniqueness, private winner records, and prize admin access.');
 console.log('PASS: public restrictions, session isolation, admin permissions, self-promotion prevention, closed intake, retries, moderation, persistent limits, session dates, private deletion ownership, and deletion retries.');
} catch(e) { console.error(e.message); process.exitCode=1; }
finally { await db.close(); }
