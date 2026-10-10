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
  const migration = await readFile(`supabase/migrations/${name}`,'utf8');
  if (name === '202610100002_spin_game_chance.sql') {
   await db.exec(`begin;
    insert into public.game_prizes(name,quantity,active) values('Historical prize',2,true);
    select public.spin_game('42000000-0000-4000-8000-000000000001','Historical attendee','history@example.invalid',repeat('f',64));`);
   await db.exec(migration);
   const { rows } = await db.query(`select a.id=w.id as same_id, a.outcome='won' as won, a.win_chance=100 as old_odds, i.attempt_id=a.id as ip_retained
    from public.game_attempts a join public.game_wins w using(request_id) join private.game_ip_attempts i on i.attempt_id=a.id`);
   if (rows.length !== 1 || Object.values(rows[0]).some(value => value !== true)) throw new Error('Historical win/IP migration failed');
   await db.exec('rollback;');
   console.log('PASS: existing winner IDs, receipts, odds and IP restrictions survive the chance migration.');
  }
  if (name === '202610100003_spin_game_retry_segments.sql') await db.exec(await readFile('supabase/tests/spin_game_chance.sql','utf8'));
  await db.exec(migration);
  console.log(`Migration passed: ${name}`);
 }
 await db.exec(await readFile('supabase/tests/questions.sql','utf8'));
 await db.exec(await readFile('supabase/tests/question_deletion.sql','utf8'));
 await db.exec(await readFile('supabase/tests/spin_game.sql','utf8'));
 await db.exec(await readFile('supabase/tests/spin_game_retries.sql','utf8'));
 console.log('PASS: retry segments, same-attendee/network restrictions, replay safety, final outcomes and stock invariants.');
 console.log('PASS: 20% default, admin-only odds settings, 0% losses, 100% wins, losing-attempt limits, recovery and stock invariants.');
 console.log('PASS: spin awards, stock, retries, email and IP uniqueness, private winner records, and prize admin access.');
 console.log('PASS: public restrictions, session isolation, admin permissions, self-promotion prevention, closed intake, retries, moderation, persistent limits, session dates, private deletion ownership, and deletion retries.');
} catch(e) { console.error(e.message); process.exitCode=1; }
finally { await db.close(); }
