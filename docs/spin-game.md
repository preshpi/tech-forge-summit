# Spin & win

The audience page is `/game`. Prize management and winner records are in the existing `/admin` workspace, below event management. Sign in with an existing authorised admin account.

Add prizes with a name, optional description and image (PNG/JPG/WebP under 350 KB), and remaining quantity. Activate a prize to add it to the wheel; pause it to remove it. Zero-stock prizes disappear automatically. Editing a prize does not alter historical winner names or images.

Attendees click **Spin the wheel**, enter their name and email, then click **Continue spin**. The server uses the configured winning chance (20% by default) to choose a prize, **Try again**, or **Nothing For You**. A 20% setting gives each eligible spin an independent 1-in-5 chance; it does not guarantee exactly 20 winners in every 100 attempts. Winning draws then choose equally among available prize types. All wheel slices have the same visual size. The server selects the outcome using the configured odds, and the animation lands on that saved outcome; equal slice sizes do not mean equal winning chances.

In `/admin`, use **Winning chance (%)** and **Save chance** to set a whole percentage from 0 to 100. 0% produces only retries or Nothing For You; 100% produces a prize on each eligible spin. Changes apply to new attempts. Stock must be available to start any new attempt; no-stock errors do not consume the attempt.

Three **Try again** segments each grant another spin with the same name, email and network; the single **Nothing For You** segment ends the game. A win also ends the game. Every spin is recorded, including retries. At 20%, each spin has a 20% prize chance, 60% retry chance and 20% final-loss chance. With unlimited earned retries and sufficient stock, the eventual prize probability is 50%, not 20%. The outcome, odds at the time, and wheel snapshot are stored atomically with the IP claim and any prize stock deduction. Retrying the same request returns the original outcome even if the admin changes the odds or the attendee changes networks. The browser keeps all results and pending retry requests for recovery after refresh. Historical winner records and known IP restrictions are preserved in the new attempt history.

The server hashes the IP using a stable HMAC secret. Only this hash is stored in `private.game_ip_attempts`; raw IPs and hashes are absent from the admin winner listing. IPs come exclusively from the configured trusted hosting header. Missing configuration blocks new spins. People on shared Wi-Fi or carrier networks may share an IP and block one another. Changing networks, using VPNs, or obtaining a different IP can bypass an IP limit. This enforces one attempt per address; it does not verify one human. Earlier wins did not record IPs, so this restriction applies to new wins after the update.

Admins see name, email, winning, retry or Nothing For You result, prize if won, the percentage used, Lagos time, and reference in **Spin records**. Records refresh every 15 seconds and paginate in groups of 50. Winner data is never exposed by public listing APIs. Prize uploads are stored as small image data URLs in Supabase; no storage bucket is required.

## Setup

The game migration was applied to the linked Supabase project on 9 October 2026, and the IP-limit, winning-chance and retry-segment migrations on 10 October 2026. The following setup also covers additional deployments.

Apply the game migrations, including `supabase/migrations/202610100003_spin_game_retry_segments.sql`, to the linked Supabase project using `npx supabase db push`, then deploy/restart the updated website. The existing question migrations must already be installed. Set these **server-only** variables in the website hosting environment:

- `SUPABASE_PROJ_URL`
- `SUPABASE_PUB_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for game awards; never expose it with a `NEXT_PUBLIC_` prefix)
- `QUESTION_PROXY_SECRET` (at least 32 characters; keep this stable, because changing it changes the IP hashes)
- `QUESTION_TRUSTED_IP_HEADER` (a header overwritten by your hosting ingress; on Vercel, `x-vercel-forwarded-for`)

The game reuses the audience-question ingress configuration. Local development intentionally shares one persistent IP identity, so one game is shared across local browsers/emails; earned retries must use the same details. An isolated database should be used for repeated successful-spin testing.

The server supports both Supabase `sb_secret_` API keys and legacy service-role JWTs. Secret API keys are sent through the `apikey` header; only legacy JWTs are sent as bearer tokens.

The admin uses the existing sign-in and allowlist. Restart/build the website after changing environment variables. No email is sent automatically. The event team handles prize collection using winner records.

## Verification

Run TypeScript and ESLint for the changed files, then run the existing disposable database test runner, which now includes `supabase/tests/spin_game.sql`:

```bash
npm install --prefix /tmp/techforge-game-tests @electric-sql/pglite
QUESTION_TEST_PGLITE_PATH=/tmp/techforge-game-tests/node_modules/@electric-sql/pglite/dist/index.js node scripts/test-question-database.mjs
# With the local app running:
GAME_TEST_BASE_URL=http://localhost:3000 node scripts/test-game-routes.mjs
node scripts/test-game-auth.mjs
node scripts/test-game-identity.mjs
node scripts/test-game-wheel.mjs
```

The tests cover default odds, admin-only settings, 0% losses and 100% wins, losing-attempt limits, equal-size wheel geometry and result alignment, historical data migration, stock decrements and exhaustion, idempotent and conflicting retries, email and IP uniqueness, rejected attempts leaving stock unchanged, missing/malformed IP identities, removed legacy RPC access, retained historical prize names, public/non-admin access restrictions, admin prize management, trusted ingress and equivalent IPv6/IPv4 address forms. Do not run fixture tests against production data.

Implementation verification passed: production build, TypeScript, ESLint, all disposable database tests, and local HTTP checks for the page, public prize listing, admin protection, invalid input and origin checks. Browser visual testing remains pending because no connected browser was available.
