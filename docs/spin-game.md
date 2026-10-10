# Spin & win

The audience page is `/game`. Prize management and winner records are in the existing `/admin` workspace, below event management. Sign in with an existing authorised admin account.

Add prizes with a name, optional description and image (PNG/JPG/WebP under 350 KB), and remaining quantity. Activate a prize to add it to the wheel; pause it to remove it. Zero-stock prizes disappear automatically. Editing a prize does not alter historical winner names or images.

Attendees click **Spin the wheel**, enter their name and email, then click **Continue spin**. The server draws an available prize, decrements stock, and records their details in one database transaction. The wheel animates to that saved result. Each available prize type has equal odds. One win is allowed per normalized email address; this is not email verification. Retrying the same request returns the same award without using more stock. The browser retains its request ID in session storage to support retries after a refresh.

Admins see name, email, prize, Lagos time, and collection reference. Records refresh every 15 seconds and paginate in groups of 50. Winner data is never exposed by public listing APIs. Prize uploads are stored as small image data URLs in Supabase; no storage bucket is required.

## Setup

The game migration was applied to the linked Supabase project on 9 October 2026. The following setup also covers additional deployments.

Apply `supabase/migrations/202610090001_spin_game.sql` to the linked Supabase project using `npx supabase db push`. The existing question migrations must already be installed. Set these **server-only** variables in the website hosting environment:

- `SUPABASE_PROJ_URL`
- `SUPABASE_PUB_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for game awards; never expose it with a `NEXT_PUBLIC_` prefix)

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
```

The tests cover stock decrements and exhaustion, idempotent and conflicting retries, email normalization and uniqueness, retained historical prize names, public/non-admin access restrictions, and admin prize management. Do not run fixture tests against production data.

Implementation verification passed: production build, TypeScript, ESLint, all disposable database tests, and local HTTP checks for the page, public prize listing, admin protection, invalid input and origin checks. Browser visual testing remains pending because no connected browser was available.
