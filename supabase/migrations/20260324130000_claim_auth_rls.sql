-- StatisticX: claim flow RLS + profile insert for SSR auth (publishable key only)
-- Run this on project acyzomxqrxhdthtthnvd (statisticx) after deploying the app fix.

-- Allow a signed-in user to create their own profile row if the auth trigger missed it.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Allow authenticated users to read unclaimed / pending rows during the claim flow
-- (needed to find an existing x_user_id before insert).
drop policy if exists "Authenticated can read unclaimed creators for claiming" on public.creator_accounts;
create policy "Authenticated can read unclaimed creators for claiming"
  on public.creator_accounts for select
  using (
    auth.role() = 'authenticated'
    and claimed_status in ('unclaimed', 'pending_verification', 'unavailable')
  );

-- Allow claiming: update an unclaimed/pending row and set user_id = auth.uid().
drop policy if exists "Users can claim unclaimed creator accounts" on public.creator_accounts;
create policy "Users can claim unclaimed creator accounts"
  on public.creator_accounts for update
  using (
    public.is_admin()
    or user_id = auth.uid()
    or (
      user_id is null
      and claimed_status in ('unclaimed', 'pending_verification', 'unavailable')
    )
  )
  with check (
    public.is_admin()
    or user_id = auth.uid()
  );

-- claim_verifications already has owner-scoped ALL policy; ensure select works for verify.
-- (no schema change — challenge id is claim_verifications.id)
