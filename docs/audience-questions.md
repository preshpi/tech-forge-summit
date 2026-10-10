# Audience questions: setup and deployment

## Implementation and current status

The implementation follows the existing Next.js 16 App Router, Navbar, fonts, CSS tokens, and Node deployment. There was no existing authentication or backend integration. It uses Supabase Auth for password-based admin sign-in and the Supabase REST API for database access, without adding a frontend Supabase SDK. The earlier implementation plan mentioned in the request was not present in this chat; the supplied product and security requirements were used.

Routes:

- `/questions`: published event selection.
- `/questions/[event]`: published session listing.
- `/questions/[event]/[session]`: shareable session page, optional name and speaker point, question submission, 20-question pages, 15-second polling while open, and retained questions when closed.
- `/admin`: admin sign-in, event/session creation and editing, intake controls, and paginated hide/restore moderation.

All dates are displayed and entered in Africa/Lagos (WAT). Published Pre-TechForge sessions must have distinct dates. Published Main Event sessions must match the event's date. Counts come from database records; no frontend session count is fixed. Slugs form the shareable URLs; keep them stable after sharing.

The audience interface follows TechForge's existing blue/yellow palette, typography, rounded cards, Navbar, and footer. Session pages put the question form beside the feed on desktop and stack them on mobile. Optional name/reference fields expand on demand; Everyone/My questions filters, sharing, refresh, status messages, and a deletion confirmation keep actions close to the conversation. The admin workspace groups sessions and moderation by event and uses focused create/edit dialogs. The mobile navigation supports keyboard activation and Escape. These interface changes require only a website rebuild/deployment, with no additional Supabase migration.

Migrations seed the **2026 Pre-TechForge and Main Event** records, five Pre-TechForge draft sessions and two Main Event draft sessions. Everything starts unpublished with closed intake. Titles are draft labels, and dates/speakers are null. Existing marketing session data is marked as placeholders and is deliberately not imported as confirmed information. Add or unpublish sessions through the admin interface to configure counts.

The local `.env` and process environment inspected during implementation did not contain `SUPABASE_PROJ_URL`, `SUPABASE_PUB_KEY`, or `ADMIN_EMAIL`. At the initial implementation handoff, no remote Supabase migrations, functions, admin provisioning, or website deployment had been executed. The owner subsequently completed backend setup. On 4 October 2026, the question deletion migration and updated Edge Function were deployed to the linked project; this does not deploy the Next.js website. Tests below cover local PostgreSQL behavior and the Edge Function handler, not the live Supabase gateway/Auth. No branch or commit was pushed.

## Security model

Public reads use the publishable key and RLS. Only published events, published sessions of published events, and visible questions of those sessions are readable. Closure affects submission, not reading. Public database inserts and the submission RPC are blocked. Authenticated attendees are also blocked from direct inserts and management.

The browser POSTs to the same-origin Next.js submission proxy. The proxy derives an HMAC of the trusted client IP and calls the Edge Function with a server-only shared secret. The Edge Function validates the secret, method, size, types, UUIDs, and lengths before calling a service-role-only RPC. The database transaction locks session/event rows, checks publication/intake, applies persistent counters, and inserts the question and idempotency receipt together. Do not expose the proxy secret or service-role key through `NEXT_PUBLIC_*`, client props, or logs. The website runtime needs no service-role key; the Edge runtime and one-time operator setup do.

Limits are five submissions per client IP across sessions per rolling-start 10-minute window and 100 per session per 10-minute window. These are persistent, atomic fixed windows starting with the first request; browser cooldowns are not used. Attendees sharing a network share the IP limit. Tune the two SQL constants through a subsequent migration if expected audience traffic needs higher limits. Client IPs are HMACed, not stored directly. Infrastructure access logs may still record IP addresses according to the hosting platform's retention policy.

Idempotency keys are client-generated UUIDs retained for retries of the unchanged form during the page visit. Receipts bind session, client identity, and normalized content. A repeated key returns the original ID without consuming another rate-limit slot, including after intake closes; changing content/session returns 409. A committed retry does not expose a hidden question's text. Refreshing the page starts a new form attempt; an IP change during a retry causes an identity conflict. Keep receipts for as long as the corresponding questions exist. Rate-limit rows older than a day may be deleted by a trusted scheduled SQL job; do not delete active windows. Archive events by unpublishing rather than deleting retained questions.

Admins are UUIDs in `private.admins`, unrelated to user-editable metadata. Every admin API operation validates the Auth token against Supabase and checks that allowlist; RLS also checks the allowlist independently. Only privileged operator provisioning can change it. Admin question writes can change only visibility. Sessions/events support insert/update, not destructive deletion. HTTP-only, SameSite=Strict cookies last up to one hour; sign in again on expiry. Supabase manages password sign-in rate limits. No passwords, Auth tokens, IPs, or database errors are logged by this feature.

## 1. Supply secure configuration

```bash
npm ci --include=optional
npx supabase --version
cp .env.example .env.local
chmod 600 .env.local
```

Edit `.env.local` with the actual URL, publishable key, and admin email. Supply the legacy Supabase `service_role` JWT key to the **operator environment only** for the setup script. Generate a shared proxy secret without displaying it:

```bash
node --input-type=module -e 'import {randomBytes} from "node:crypto"; import {appendFileSync} from "node:fs"; appendFileSync(".env.local", "\nQUESTION_PROXY_SECRET=" + randomBytes(32).toString("hex") + "\n");'
```

Remove the original placeholder `QUESTION_PROXY_SECRET` entry; retain the generated entry. All `.env*` files except `.env.example` are ignored. Never commit the populated file.

For Vercel, set `QUESTION_TRUSTED_IP_HEADER=x-vercel-forwarded-for` in production. Vercel supplies this header through its ingress ([Vercel request headers](https://vercel.com/docs/headers/request-headers)). For another host, configure an ingress that **overwrites**, rather than appends user-supplied values to, a dedicated client-IP header and restrict direct access to the Node server; put that header's name in this variable. Do not trust a client-controlled header or expose an unprotected origin. Production submissions fail closed if the variable/header is absent. Local `npm run dev` always shares a `local-development` bucket and ignores this setting; its requests still pass through the Edge Function and persistent database limits.

## 2. Apply migrations and deploy the function

The CLI is pinned as a project development dependency. Use `npx supabase` for every command; this does not install a global `supabase` command. The repository already contains `supabase/config.toml`, so skip `supabase init` and do not overwrite the existing configuration. If an old npx cache reports a missing Linux binary, run `npm install --include=optional` in this project and retry `npx supabase --version`.

Requires Supabase CLI access to the project and its database password. Use the project's actual reference in place of `YOUR_PROJECT_REF`:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
node --env-file=.env.local --input-type=module -e 'import {writeFileSync} from "node:fs"; const s=process.env.QUESTION_PROXY_SECRET; if(!s || s.length<32) throw new Error("Configure a strong proxy secret first"); writeFileSync(".env.edge.local", "QUESTION_PROXY_SECRET=" + s + "\n", {mode:0o600});'
npx supabase secrets set --env-file .env.edge.local
npx supabase functions deploy submit-question --use-api
```

The deployment command uses `--use-api` to bundle on Supabase rather than pulling a local Docker image. If a deployment without this flag stalls with an image-download TLS timeout, stop that attempt and retry the command above.

The Edge Function uses Supabase's built-in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. `verify_jwt=false` is intentional: the function enforces the private proxy secret itself, and publishable keys are not JWTs ([Supabase function authentication](https://supabase.com/docs/guides/functions/auth)). No browser can successfully invoke it without that secret. Function secrets and the Next.js server must have the same `QUESTION_PROXY_SECRET`. Delete `.env.edge.local` when the CLI has saved it.

For a fresh disposable local Supabase stack instead:

```bash
npx supabase start
npx supabase db reset
npx supabase functions serve submit-question --env-file .env.edge.local
```

Use the local URL, publishable/anon key, and service-role key from the local stack in secure local environment configuration. Do not put local keys in source.

## 3. Provision the specific admin

Set `ADMIN_EMAIL` to the owner's actual email. For a new account, securely supply `ADMIN_SETUP_PASSWORD` (at least 16 characters, password-manager generated). The trusted operator script creates that account and explicitly confirms the operator-supplied email, so the operator must verify it is the intended owner's address. If an account already exists, it must have a confirmed email; the script does not reset its password. The script grants only that UUID membership in the private allowlist, using a service-role-only RPC.

```bash
node scripts/provision-question-admin.mjs
```

The script reads `.env.local` using Next's environment loader. It never prints credentials or the configured email. Sign in at `/admin` with that email and password. Remove the setup password from the website runtime environment after provisioning. Keep the service-role key server-side when the spin game is enabled, because prize awards require it; a questions-only deployment can remove it after provisioning. Supply the credentials privately to the owner using the password manager's secure sharing process. Do not send them in source, logs, or this chat.

For password recovery, use Supabase Auth's normal recovery process or the Supabase dashboard. This feature does not add a public registration or password reset flow. To revoke an admin, a trusted operator runs this in the Supabase SQL editor using the actual UUID:

```sql
delete from private.admins where user_id = 'ADMIN_USER_UUID';
```

Revocation takes effect at the next admin request, even if the session cookie has not expired. Do not grant `anon` or `authenticated` access to the private schema or provisioning RPC.

## 4. Confirm and publish sessions

In admin, enter confirmed titles, speakers if supplied, and dates/times. Set Main Event's event date before publishing its sessions. Publish events and sessions, then open intake. Uncheck intake and save to close; questions stay readable. Unpublishing a parent hides its sessions and questions. To change a Main Event date, first unpublish its sessions. Draft sessions do not require dates.

## 5. Run and deploy the website

```bash
npm run dev
# Production Node deployment:
npm run build
npm start
```

For the repository's documented Vercel deployment path, add `SUPABASE_PROJ_URL`, `SUPABASE_PUB_KEY`, `QUESTION_PROXY_SECRET`, and `QUESTION_TRUSTED_IP_HEADER` in the Vercel project's secure environment settings, then deploy from the operator machine:

```bash
npx vercel --prod
```

`ADMIN_EMAIL` is needed only for provisioning. Never add `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_SETUP_PASSWORD` to frontend variables; the Next.js production runtime does not need either. Preserve the site's existing CAPTCHA configuration for its existing flows. Question submission uses the protected ingress and database limits, independently of those CAPTCHA settings. No changes to existing marketing session schedules are required.

## Verification

Local implementation checks:

```bash
npx tsc --noEmit
npx eslint src/components/QuestionHub.tsx src/app/questions src/app/api/questions src/lib/questions scripts/provision-question-admin.mjs scripts/test-question-edge.mjs scripts/test-question-database.mjs
node scripts/test-question-edge.mjs
node scripts/test-question-ingress.mjs
node scripts/test-question-ownership.mjs
npm install --prefix /tmp/techforge-question-tests @electric-sql/pglite
QUESTION_TEST_PGLITE_PATH=/tmp/techforge-question-tests/node_modules/@electric-sql/pglite/dist/index.js node scripts/test-question-database.mjs
npm run build
```

PGlite executes the actual unmodified PostgreSQL migrations and SQL tests in a disposable database, with minimal Supabase Auth users/roles/`auth.uid()` stubs. It checks isolation, hidden drafts, public write/RPC denial, non-admin permissions, self-promotion denial, admin moderation, closed intake, retained reads, duplicate/conflicting retries, persistent limits, and scheduling. The Edge handler test mocks its privileged RPC transport; it validates authentication and request validation/error mapping, not the remote gateway. The SQL test also runs on a **fresh disposable migrated Supabase database** (never a production database):

```bash
psql "$QUESTION_TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/questions.sql
```

After deployment, use disposable test sessions to check the real gateway/Auth/ingress integration: submit to each session and confirm isolation; retry the identical request ID and confirm one record; close intake and confirm new requests reject; unpublish the event and confirm its sessions/questions disappear even via the Supabase REST API; attempt direct anonymous inserts and the submission RPC and confirm denial; sign in as an ordinary account and confirm admin APIs reject; hide/restore a question and confirm public polling reflects moderation; send six distinct submissions from one IP and confirm the sixth gets 429. Test a spoofed client-IP header at the deployed ingress to confirm it is overwritten. Verify the mobile menu, form, pagination, and closed-intake archive on a phone.

During implementation, production build, new-code lint, TypeScript, local database tests, and Edge handler tests passed. Browser checks covered mobile navigation, menu closure, no horizontal overflow, unavailable-backend state, and admin sign-in presentation. Full browser submission/polling/moderation against a real Supabase project remains pending configuration and deployment.

## Delete your own question without an account

New submissions include a random 256-bit deletion token generated by the browser. Only the SHA-256 hash is stored in `private.question_owners`; neither the token nor hash is publicly readable. The browser stores ownership in local storage and shows **Delete my question** under **Your questions on this browser**. Clearing storage or moving to another browser loses that capability. A browser with storage disabled can delete until the page is closed. Treat the token as a password: anyone possessing it can delete that one question.

Deletion uses the same same-origin Next.js proxy and secret-protected Edge Function. It requires a matching question/token pair and applies a persistent 20-request per-IP limit per 10-minute window, including failed guesses. Direct anonymous/authenticated table deletes and deletion RPC calls are denied. The owner can delete after closure, moderation, or unpublication. Deletion erases the body, name, and speaker-point field, hides the row from public and admin reads, and cannot be undone by moderation. A minimal tombstone, token hash, and original request receipt remain so duplicate submissions cannot recreate deleted content. This does not erase copies in backups or hosting logs.

Questions submitted before this update have no deletion token and cannot be claimed by a browser. Their authors may request admin moderation. The old six-argument submission RPC remains for compatibility; new token-bearing submissions use the seven-argument RPC. The frontend only offers deletion when the backend explicitly confirms that it registered ownership.

Deploy in this order:

```bash
npx supabase db push
npx supabase functions deploy submit-question --use-api
# Restart local development, or build/deploy the updated website:
npm run dev
```

Security tests also execute `supabase/tests/question_deletion.sql`, which verifies hashed storage, wrong/missing tokens, cross-question denial, restricted RPC/table access, closed/hidden-question deletion, text erasure, duplicate deletes, no resurrection on submission retry, moderation restrictions, and persistent deletion limits. To run it on a fresh disposable migrated Supabase database:

```bash
psql "$QUESTION_TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/question_deletion.sql
```

Deletion update verification: production build, TypeScript, lint, local database deletion/security tests, Edge handler tests, and browser ownership storage tests passed. The migration and updated Edge Function were deployed on 4 October 2026. Refresh/restart the local development site to load the new UI. Older submissions have no owner token.
