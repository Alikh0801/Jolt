-- Jolt — Row Level Security (RLS) policies
--
-- The database itself enforces who can read/write what. Two rules here are
-- core to the business model:
--   * A provider sees ONLY their own offer; the customer sees ALL offers on
--     their request. Providers never see each other's bids.
--   * A BLOCKED provider (unpaid commission) cannot see open requests.

-- ---------------------------------------------------------------------------
-- platform_settings — read-only for clients (so the app can compute the fee)
-- ---------------------------------------------------------------------------
alter table platform_settings enable row level security;
create policy "platform settings are readable"
  on platform_settings for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;

create policy "profiles readable by authenticated users"
  on profiles for select to authenticated using (true);

create policy "users manage their own profile"
  on profiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- vehicles — owner only
-- ---------------------------------------------------------------------------
alter table vehicles enable row level security;
create policy "owner manages own vehicles"
  on vehicles for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- service_categories — public read
-- ---------------------------------------------------------------------------
alter table service_categories enable row level security;
create policy "service categories are public"
  on service_categories for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- provider_profiles — public read; self write
-- (commission_balance / is_blocked are only changed by SECURITY DEFINER funcs)
-- ---------------------------------------------------------------------------
alter table provider_profiles enable row level security;

create policy "provider profiles readable"
  on provider_profiles for select to authenticated using (true);

create policy "provider manages own provider profile"
  on provider_profiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- provider_wallets — PRIVATE: only the provider can read their own balances.
-- All writes happen through SECURITY DEFINER functions, so no write policy.
alter table provider_wallets enable row level security;
create policy "provider reads own wallet"
  on provider_wallets for select to authenticated
  using (id = auth.uid());

-- provider_skills
alter table provider_skills enable row level security;
create policy "provider skills readable"
  on provider_skills for select to authenticated using (true);
create policy "provider manages own skills"
  on provider_skills for all to authenticated
  using (provider_id = auth.uid()) with check (provider_id = auth.uid());

-- ---------------------------------------------------------------------------
-- requests
-- ---------------------------------------------------------------------------
alter table requests enable row level security;

create policy "customer reads own requests"
  on requests for select to authenticated
  using (customer_id = auth.uid());

create policy "assigned provider reads the request"
  on requests for select to authenticated
  using (provider_id = auth.uid());

-- Open requests are visible to providers ONLY if they are not blocked.
create policy "unblocked providers see open requests"
  on requests for select to authenticated
  using (
    status = 'searching'
    and exists (
      select 1 from provider_wallets w
      where w.id = auth.uid() and not w.is_blocked
    )
  );

create policy "customer creates own requests"
  on requests for insert to authenticated
  with check (customer_id = auth.uid());

create policy "customer updates own requests"
  on requests for update to authenticated
  using (customer_id = auth.uid());

create policy "assigned provider updates the request"
  on requests for update to authenticated
  using (provider_id = auth.uid());

-- ---------------------------------------------------------------------------
-- offers — the privacy-critical table
-- ---------------------------------------------------------------------------
alter table offers enable row level security;

-- A provider can see and manage only their OWN offers.
create policy "provider manages own offers"
  on offers for all to authenticated
  using (provider_id = auth.uid()) with check (provider_id = auth.uid());

-- The customer can read ALL offers placed on their own request.
create policy "customer reads offers on own request"
  on offers for select to authenticated
  using (
    exists (
      select 1 from requests r
      where r.id = offers.request_id and r.customer_id = auth.uid()
    )
  );
-- (No policy grants a provider access to another provider's offer.)

-- ---------------------------------------------------------------------------
-- ratings
-- ---------------------------------------------------------------------------
alter table ratings enable row level security;
create policy "participants read ratings"
  on ratings for select to authenticated
  using (rater_id = auth.uid() or ratee_id = auth.uid());
create policy "user writes own rating"
  on ratings for insert to authenticated
  with check (rater_id = auth.uid());

-- ---------------------------------------------------------------------------
-- commission_ledger — provider reads own; writes go through functions only
-- ---------------------------------------------------------------------------
alter table commission_ledger enable row level security;
create policy "provider reads own ledger"
  on commission_ledger for select to authenticated
  using (provider_id = auth.uid());
