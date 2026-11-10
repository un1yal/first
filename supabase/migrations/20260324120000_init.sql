-- AnalyticX initial schema
-- Supabase PostgreSQL + RLS

create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'creator', 'admin')),
  is_suspended boolean not null default false,
  theme_preference text not null default 'dark' check (theme_preference in ('dark', 'light', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  x_user_id text not null unique,
  username text not null,
  display_name text,
  profile_image_url text,
  banner_url text,
  biography text,
  location text,
  website text,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  posts_count integer not null default 0,
  media_count integer,
  favourites_count integer,
  is_blue_verified boolean not null default false,
  verified_type text,
  account_created_at timestamptz,
  claimed_status text not null default 'unclaimed'
    check (claimed_status in ('unclaimed', 'pending_verification', 'claimed', 'unavailable')),
  marketplace_enabled boolean not null default false,
  connected_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists creator_accounts_username_lower_idx
  on public.creator_accounts (lower(username));
create index if not exists creator_accounts_claimed_status_idx
  on public.creator_accounts (claimed_status);
create index if not exists creator_accounts_user_id_idx
  on public.creator_accounts (user_id);

create table if not exists public.claim_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  x_user_id text not null,
  username text not null,
  verification_code_hash text not null,
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists claim_verifications_user_idx
  on public.claim_verifications (user_id, created_at desc);

create table if not exists public.creator_snapshots (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid not null references public.creator_accounts(id) on delete cascade,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  posts_count integer not null default 0,
  recorded_at timestamptz not null default now()
);

create index if not exists creator_snapshots_creator_recorded_idx
  on public.creator_snapshots (creator_account_id, recorded_at desc);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid not null references public.creator_accounts(id) on delete cascade,
  x_post_id text not null,
  post_text text,
  post_url text,
  published_at timestamptz,
  lang text,
  is_reply boolean not null default false,
  media_type text,
  hashtags text[],
  mentions text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_account_id, x_post_id)
);

create index if not exists posts_creator_published_idx
  on public.posts (creator_account_id, published_at desc);

create table if not exists public.post_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  views integer,
  likes integer,
  replies integer,
  reposts integer,
  quotes integer,
  bookmarks integer,
  recorded_at timestamptz not null default now()
);

create index if not exists post_metric_snapshots_post_recorded_idx
  on public.post_metric_snapshots (post_id, recorded_at desc);

create table if not exists public.public_profiles (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid not null unique references public.creator_accounts(id) on delete cascade,
  slug text not null unique,
  is_published boolean not null default false,
  visibility_settings jsonb not null default '{
    "show_followers": true,
    "show_following": true,
    "show_engagement": true,
    "show_impressions": true,
    "show_growth": true,
    "show_posts": true,
    "show_biography": true
  }'::jsonb,
  public_bio text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists public_profiles_published_idx
  on public.public_profiles (is_published) where is_published = true;

create table if not exists public.leaderboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid not null references public.creator_accounts(id) on delete cascade,
  leaderboard_type text not null check (leaderboard_type in ('engagement', 'impressions')),
  metric_value numeric not null default 0,
  window_start timestamptz not null,
  window_end timestamptz not null,
  rank integer not null,
  calculated_at timestamptz not null default now(),
  coverage_valid boolean not null default true
);

create index if not exists leaderboard_snapshots_type_rank_idx
  on public.leaderboard_snapshots (leaderboard_type, calculated_at desc, rank asc);

create table if not exists public.sync_jobs (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid references public.creator_accounts(id) on delete set null,
  job_type text not null check (job_type in ('profile', 'posts', 'metrics', 'leaderboard', 'visitors')),
  status text not null default 'pending'
    check (status in ('pending', 'running', 'succeeded', 'failed', 'cancelled')),
  records_processed integer not null default 0,
  pages_processed integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists sync_jobs_status_created_idx
  on public.sync_jobs (status, created_at desc);

create table if not exists public.api_usage (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid references public.creator_accounts(id) on delete set null,
  endpoint text not null,
  request_count integer not null default 1,
  items_returned integer not null default 0,
  estimated_cost_credits numeric not null default 0,
  estimated_cost_usd numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists api_usage_created_idx
  on public.api_usage (created_at desc);
create index if not exists api_usage_endpoint_created_idx
  on public.api_usage (endpoint, created_at desc);

create table if not exists public.flex_cards (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid not null references public.creator_accounts(id) on delete cascade,
  template text not null check (template in ('minimal', 'dark', 'light', 'analytics')),
  metrics_snapshot jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now()
);

create table if not exists public.visitor_events (
  id uuid primary key default gen_random_uuid(),
  anonymous_visitor_id text not null,
  page_path text not null,
  event_type text not null default 'page_view' check (event_type in ('page_view')),
  is_admin boolean not null default false,
  visited_at timestamptz not null default now()
);

create index if not exists visitor_events_visited_idx
  on public.visitor_events (visited_at desc);
create index if not exists visitor_events_visitor_week_idx
  on public.visitor_events (anonymous_visitor_id, visited_at desc);

create table if not exists public.featured_placements (
  id uuid primary key default gen_random_uuid(),
  slot_index integer not null check (slot_index between 1 and 3),
  creator_account_id uuid references public.creator_accounts(id) on delete set null,
  title text,
  image_url text,
  destination_url text,
  is_sponsored boolean not null default false,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slot_index)
);

create table if not exists public.creator_packages (
  id uuid primary key default gen_random_uuid(),
  creator_account_id uuid not null references public.creator_accounts(id) on delete cascade,
  package_name text not null,
  description text,
  package_type text not null check (package_type in (
    'sponsored_post', 'pinned_post', 'product_announcement',
    'product_review', 'brand_mention', 'campaign_promotion', 'custom'
  )),
  price numeric not null check (price >= 0),
  currency text not null default 'USD',
  duration_days integer,
  deliverables text,
  terms text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_packages_active_idx
  on public.creator_packages (is_active, created_at desc);

create table if not exists public.promotion_offers (
  id uuid primary key default gen_random_uuid(),
  creator_package_id uuid not null references public.creator_packages(id) on delete cascade,
  buyer_user_id uuid not null references public.profiles(id) on delete cascade,
  creator_user_id uuid not null references public.profiles(id) on delete cascade,
  offer_amount numeric not null check (offer_amount >= 0),
  currency text not null default 'USD',
  duration_days integer,
  campaign_description text,
  campaign_url text,
  status text not null default 'pending' check (status in (
    'pending', 'accepted', 'rejected', 'counter_offered', 'cancelled', 'completed'
  )),
  counter_amount numeric,
  counter_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promotion_offers_creator_status_idx
  on public.promotion_offers (creator_user_id, status, created_at desc);
create index if not exists promotion_offers_buyer_status_idx
  on public.promotion_offers (buyer_user_id, status, created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'general',
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx
  on public.audit_logs (created_at desc);

create table if not exists public.platform_config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.search_cache (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  result jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create unique index if not exists search_cache_query_idx
  on public.search_cache (lower(query));

-- Default platform config
insert into public.platform_config (key, value)
values
  ('api_limits', '{
    "max_posts_per_creator": 40,
    "max_pages_per_sync": 2,
    "max_metric_snapshots_per_creator": 200,
    "daily_api_budget_credits": 5000,
    "monthly_api_budget_credits": 100000,
    "manual_refresh_cooldown_seconds": 900,
    "retry_limits": 3,
    "snapshot_frequency_hours": 24,
    "leaderboard_enabled": true,
    "commercial_benchmarking_enabled": false
  }'::jsonb),
  ('pricing', '{
    "credits_per_usd": 100000,
    "tweet_credits": 15,
    "user_profile_credits": 18,
    "minimum_credits": 15
  }'::jsonb)
on conflict (key) do nothing;

insert into public.featured_placements (slot_index, is_active)
values (1, false), (2, false), (3, false)
on conflict (slot_index) do nothing;

-- Updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger creator_accounts_updated_at before update on public.creator_accounts
  for each row execute function public.set_updated_at();
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();
create trigger public_profiles_updated_at before update on public.public_profiles
  for each row execute function public.set_updated_at();
create trigger featured_placements_updated_at before update on public.featured_placements
  for each row execute function public.set_updated_at();
create trigger creator_packages_updated_at before update on public.creator_packages
  for each row execute function public.set_updated_at();
create trigger promotion_offers_updated_at before update on public.promotion_offers
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.is_suspended = false
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.creator_accounts enable row level security;
alter table public.claim_verifications enable row level security;
alter table public.creator_snapshots enable row level security;
alter table public.posts enable row level security;
alter table public.post_metric_snapshots enable row level security;
alter table public.public_profiles enable row level security;
alter table public.leaderboard_snapshots enable row level security;
alter table public.sync_jobs enable row level security;
alter table public.api_usage enable row level security;
alter table public.flex_cards enable row level security;
alter table public.visitor_events enable row level security;
alter table public.featured_placements enable row level security;
alter table public.creator_packages enable row level security;
alter table public.promotion_offers enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.platform_config enable row level security;
alter table public.search_cache enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Admins manage profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- Creator accounts
create policy "Public can view claimed creators for discovery"
  on public.creator_accounts for select
  using (
    claimed_status = 'claimed'
    or user_id = auth.uid()
    or public.is_admin()
  );

create policy "Owners update own creator account"
  on public.creator_accounts for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "Authenticated insert creator accounts"
  on public.creator_accounts for insert
  with check (auth.uid() = user_id or public.is_admin());

-- Claim verifications (owner only)
create policy "Users manage own claim verifications"
  on public.claim_verifications for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Private analytics: owner or admin
create policy "Owners view creator snapshots"
  on public.creator_snapshots for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

create policy "Service inserts creator snapshots"
  on public.creator_snapshots for insert
  with check (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

create policy "Owners view posts"
  on public.posts for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
    or exists (
      select 1 from public.public_profiles pp
      where pp.creator_account_id = posts.creator_account_id
        and pp.is_published = true
        and (pp.visibility_settings->>'show_posts')::boolean = true
    )
  );

create policy "Owners manage posts"
  on public.posts for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

create policy "Owners view post metrics"
  on public.post_metric_snapshots for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.posts p
      join public.creator_accounts c on c.id = p.creator_account_id
      where p.id = post_id and c.user_id = auth.uid()
    )
  );

create policy "Owners manage post metrics"
  on public.post_metric_snapshots for insert
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.posts p
      join public.creator_accounts c on c.id = p.creator_account_id
      where p.id = post_id and c.user_id = auth.uid()
    )
  );

-- Public profiles
create policy "Anyone can view published profiles"
  on public.public_profiles for select
  using (
    is_published = true
    or public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

create policy "Owners manage public profiles"
  on public.public_profiles for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

-- Leaderboards (public read of valid claimed ranks when enabled)
create policy "Anyone can view leaderboard snapshots"
  on public.leaderboard_snapshots for select
  using (coverage_valid = true or public.is_admin());

create policy "Admins manage leaderboard snapshots"
  on public.leaderboard_snapshots for all
  using (public.is_admin())
  with check (public.is_admin());

-- Sync jobs / API usage / config / audit: admin or owner read where applicable
create policy "Admins manage sync jobs"
  on public.sync_jobs for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Owners view own sync jobs"
  on public.sync_jobs for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

create policy "Admins manage api usage"
  on public.api_usage for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Owners view flex cards"
  on public.flex_cards for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

-- Visitor events: insert via service role / anon through API; select admin only
create policy "Admins view visitor events"
  on public.visitor_events for select
  using (public.is_admin());

create policy "Anyone can insert visitor events"
  on public.visitor_events for insert
  with check (true);

create policy "Anyone can view active featured placements"
  on public.featured_placements for select
  using (is_active = true or public.is_admin());

create policy "Admins manage featured placements"
  on public.featured_placements for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can view active packages"
  on public.creator_packages for select
  using (
    is_active = true
    or public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

create policy "Owners manage packages"
  on public.creator_packages for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.creator_accounts c
      where c.id = creator_account_id and c.user_id = auth.uid()
    )
  );

create policy "Participants view offers"
  on public.promotion_offers for select
  using (
    buyer_user_id = auth.uid()
    or creator_user_id = auth.uid()
    or public.is_admin()
  );

create policy "Buyers create offers"
  on public.promotion_offers for insert
  with check (buyer_user_id = auth.uid());

create policy "Participants update offers"
  on public.promotion_offers for update
  using (
    buyer_user_id = auth.uid()
    or creator_user_id = auth.uid()
    or public.is_admin()
  );

create policy "Users manage own notifications"
  on public.notifications for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "Admins view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

create policy "Admins manage platform config"
  on public.platform_config for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Authenticated can read non-secret config keys"
  on public.platform_config for select
  using (auth.role() = 'authenticated' or public.is_admin());

create policy "Admins manage search cache"
  on public.search_cache for all
  using (public.is_admin())
  with check (public.is_admin());

-- Weekly unique visitors helper view
create or replace view public.weekly_unique_visitors as
select
  count(distinct anonymous_visitor_id) filter (where is_admin = false) as unique_visitors,
  count(*) filter (where is_admin = false) as page_views,
  now() - interval '7 days' as window_start,
  now() as window_end
from public.visitor_events
where visited_at >= now() - interval '7 days';

grant select on public.weekly_unique_visitors to anon, authenticated;
