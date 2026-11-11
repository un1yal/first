# StatisticX

Creator analytics, discovery, and promotional marketplace for X (Twitter).

**Positioning:** Discover creators. Measure influence. Find your next promotion.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn-style UI
- Supabase Auth + PostgreSQL + RLS
- TwitterAPI.io (server-side only)
- Vercel hosting + Cron
- First-party visitor analytics in Supabase
- Browser-side Flex Card JPG generation (`html-to-image`)

## Architecture (brief)

1. **Public surface** — Marketing landing page (hero, dashboard preview, features), discover, marketplace, public creator profiles, and leaderboards.
2. **Auth & claim** — Supabase email auth. Ownership via time-limited, single-use bio verification code (not X OAuth).
3. **Ingestion** — `/lib/twitterapi` wraps documented TwitterAPI.io endpoints with timeouts, retries, cost estimates, and mock mode.
4. **Analytics engine** — Stores creator + post metric snapshots; 24h engagement/impressions are **deltas between timestamped observations**, never lifetime totals labelled as daily.
5. **Jobs** — `/api/cron/sync` (Vercel Cron) syncs profiles/posts, writes snapshots, recalculates leaderboards.
6. **Marketplace** — Packages + offer workflow (pending/accepted/rejected/counter/cancelled/completed). **No payments** in this version.
7. **Admin** — Usage, visitors, placements, leaderboard visibility.

## TwitterAPI.io endpoints used

| Endpoint | Purpose | Metrics / fields |
| --- | --- | --- |
| `GET /twitter/user/info?userName=` | Profile lookup & bio verification | `id`, `userName`, `name`, `profilePicture`, `coverPicture`, `description`, `followers`, `following`, `statusesCount`, `mediaCount`, `isBlueVerified`, `createdAt`, unavailable flags |
| `GET /twitter/user/tweet_timeline?userId=` | Incremental posts | `id`, `text`, `url`, `createdAt`, `likeCount`, `replyCount`, `retweetCount`, `quoteCount`, `viewCount`, `bookmarkCount`, entities |
| `GET /twitter/user/last_tweets?userName=` | Alternate timeline by username | Same tweet metrics |
| `GET /twitter/user/search?query=` | Discovery suggestions | User profile fields |
| `GET /oapi/my/info` | Credit balance (admin) | Provider balance when available |

**Cost model (from docs):** ~18 credits/profile, ~15 credits/tweet, minimum 15 credits/request, 100,000 credits = $1.00.

If `TWITTERAPI_IO_KEY` is missing, the app uses **labelled mock responses** so development continues.

## Supabase setup

1. Create a Supabase project (free tier).
2. Run `supabase/migrations/20260324120000_init.sql` in the SQL editor (or via Supabase CLI).
3. Enable Email auth; configure site URL + redirect URLs for your Vercel domain and `http://localhost:3000`.
4. Copy project URL, anon key, and service role key into `.env.local`.
5. Promote an admin by setting `profiles.role = 'admin'` for your user after signup.

### Required env

See `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
TWITTERAPI_IO_KEY=
NEXT_PUBLIC_APP_URL=
CRON_SECRET=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are public/client-safe (project **statisticx**). Never put a service-role/secret key in the repo or in `NEXT_PUBLIC_` variables. Keep `TWITTERAPI_IO_KEY` server-only.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without Supabase credentials the app runs in **demo mode** with clearly labelled sample creators, snapshots, leaderboards, marketplace packages, and visitor stats.

```bash
npm test
npm run build
```

## Deployment (Vercel)

1. Import the repo into Vercel.
2. Set environment variables.
3. Deploy. `vercel.json` registers a daily cron (`0 0 * * *`) hitting `/api/cron/sync` (Vercel Hobby limit: at most once per day).
4. Set `CRON_SECRET` and ensure Vercel sends `Authorization: Bearer $CRON_SECRET` (Vercel Cron does this when configured for protected routes — also callable manually for testing).

### Free-tier notes

- **Vercel Hobby** — limited cron frequency; sync may run less often than hourly. If only daily snapshots exist, label windows as completed daily measurements (engine already uses timestamp gaps + coverage checks).
- **Supabase free** — adequate for early creator counts; watch row + egress limits.
- **TwitterAPI.io** — pay-per-use credits; admin budgets live in `platform_config`.

## Design

- Light-first StatisticX UI inspired by Wise / Brainwave: off-white page (`#F4F4F2`), white cards with large radius, soft shadows, lime accent (`#C8F169`), near-black pill CTAs.
- Clean left sidebar + search pill for authenticated app pages; Geist typography; tabular stats; soft lime area charts.
- Optional dark mode tokens (Workly / Lunor style) are available; light is the default.

## Testing

Vitest covers:

- Snapshot engagement / impressions deltas
- Missing coverage exclusion
- Leaderboard ranking / tie handling inputs
- Claim code hashing + expiry
- Weekly unique visitors + admin exclusion
- Marketplace offer status transitions

TwitterAPI calls are mocked; tests do not consume paid credits.

## Policy / known limitations

1. **Commercial public benchmarking** defaults off via `platform_config.api_limits.commercial_benchmarking_enabled`. Confirm X + provider redistribution rules before enabling public competitive leaderboards commercially.
2. **Bio verification ≠ OAuth** — clearly disclosed in onboarding.
3. **No payment processing** — marketplace enquiries/offers only.
4. **Cron not “active” until** credentials + Vercel Cron are configured in a deployed environment.
5. **Featured placements** start empty; admins assign creators/images/URLs (no fabricated advertisers).
6. **Media metadata** beyond counts depends on fields TwitterAPI.io returns per tweet; unavailable fields stay `null`.

## Project scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm test` | Vitest suite |
| `npm run lint` | ESLint |
