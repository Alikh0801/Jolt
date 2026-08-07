-- Jolt — initial database schema (Supabase / PostgreSQL + PostGIS)
--
-- Business model encoded here:
--   * Each service category has a "starting from" minimum price.
--   * Providers BID on a request (price >= minimum). The stranded driver sees
--     every nearby provider's price + distance + rating and picks one.
--   * Providers do NOT see each other's offers (RLS). No "reject": accepting one
--     offer CLOSES the others, and those providers see the request went inactive.
--   * Commission is a FIXED, TIERED fee per completed job: 1 AZN for the first
--     5 AZN, then +0.5 AZN per additional 5 AZN (no upper limit).
--   * Two payment methods, both supported:
--       - CASH: customer pays the provider directly; the provider then OWES the
--         platform the commission and is BLOCKED until they settle it.
--       - CARD: payment flows through the app; commission is auto-collected and
--         the provider receives the rest into their in-app wallet (no block).
--
-- Scale decisions: PostGIS + GiST indexes, city fields for nationwide growth,
-- any profile can be both customer and provider, financial data kept private.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists postgis;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type request_status as enum (
  'searching', 'accepted', 'en_route', 'arrived',
  'in_progress', 'completed', 'cancelled', 'expired'
);
create type offer_status   as enum ('pending', 'accepted', 'closed', 'withdrawn');
create type payment_method as enum ('cash', 'card');
create type ledger_type    as enum ('charge', 'payment', 'adjustment');

-- ---------------------------------------------------------------------------
-- Shared updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- platform_settings — one row of tunable commission parameters
-- ---------------------------------------------------------------------------
create table platform_settings (
  id                boolean primary key default true check (id),  -- single row
  price_step        numeric(10,2) not null default 5,     -- bracket width (AZN)
  base_commission   numeric(10,2) not null default 1.0,   -- fee for the first bracket
  commission_step   numeric(10,2) not null default 0.5,   -- added per extra bracket
  updated_at        timestamptz not null default now()
);
insert into platform_settings (id) values (true) on conflict do nothing;

-- Tiered fixed commission with no upper limit:
--   ≤5 -> 1.0, 6–10 -> 1.5, 11–15 -> 2.0, 16–20 -> 2.5, 21–25 -> 3.0 ...
create or replace function commission_for(p_price numeric)
returns numeric language sql stable as $$
  select case
    when p_price <= 0 then 0
    else s.base_commission + (ceil(p_price / s.price_step) - 1) * s.commission_step
  end
  from platform_settings s
  limit 1
$$;

-- ---------------------------------------------------------------------------
-- profiles — 1:1 with Supabase auth.users
-- ---------------------------------------------------------------------------
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text unique,
  avatar_url  text,
  home_city   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- vehicles
-- ---------------------------------------------------------------------------
create table vehicles (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  make        text,
  model       text,
  color       text,
  plate       text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index idx_vehicles_owner on vehicles(owner_id);

-- ---------------------------------------------------------------------------
-- service_categories — lookup + "starting from" minimum price
-- ---------------------------------------------------------------------------
create table service_categories (
  id          text primary key,
  title       text not null,
  subtitle    text,
  icon        text,
  min_price   numeric(10,2) not null default 0,
  sort_order  int not null default 0,
  is_active   boolean not null default true
);

-- ---------------------------------------------------------------------------
-- provider_profiles — PUBLIC-facing usta info (name via profiles, rating, etc.)
-- Any profile can opt in as a provider.
-- ---------------------------------------------------------------------------
create table provider_profiles (
  id                   uuid primary key references profiles(id) on delete cascade,
  is_online            boolean not null default false,
  current_location     geography(Point, 4326),
  location_updated_at  timestamptz,
  service_city         text,
  rating_avg           numeric(2,1) not null default 0,
  rating_count         int not null default 0,
  jobs_done            int not null default 0,
  is_verified          boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create trigger trg_provider_updated before update on provider_profiles
  for each row execute function set_updated_at();
create index idx_provider_location on provider_profiles using gist (current_location);
create index idx_provider_online on provider_profiles(is_online);

-- provider_wallets — PRIVATE financial state (only the provider can read it)
--   commission_balance : unpaid commission from CASH jobs (owe > 0 => blocked)
--   wallet_balance     : net earnings from CARD jobs, withdrawable
create table provider_wallets (
  id                  uuid primary key references provider_profiles(id) on delete cascade,
  commission_balance  numeric(10,2) not null default 0,
  wallet_balance      numeric(10,2) not null default 0,
  is_blocked          boolean not null default false,
  updated_at          timestamptz not null default now()
);

-- Auto-create the wallet row whenever a provider profile is created.
create or replace function create_provider_wallet()
returns trigger language plpgsql security definer as $$
begin
  insert into provider_wallets (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
create trigger trg_provider_wallet after insert on provider_profiles
  for each row execute function create_provider_wallet();

-- provider_skills
create table provider_skills (
  provider_id  uuid references provider_profiles(id) on delete cascade,
  category_id  text references service_categories(id),
  primary key (provider_id, category_id)
);

-- ---------------------------------------------------------------------------
-- requests — the stranded driver's request and its lifecycle
-- ---------------------------------------------------------------------------
create table requests (
  id               uuid primary key default uuid_generate_v4(),
  customer_id      uuid not null references profiles(id),
  category_id      text not null references service_categories(id),
  status           request_status not null default 'searching',
  payment_method   payment_method not null default 'cash',
  pickup_location  geography(Point, 4326) not null,
  address_text     text,
  note             text,
  photo_url        text,
  agreed_price     numeric(10,2),                 -- winning offer, set on accept
  city             text,
  provider_id      uuid references provider_profiles(id),
  accepted_at      timestamptz,
  completed_at     timestamptz,
  cancelled_at     timestamptz,
  cancel_reason    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_requests_updated before update on requests
  for each row execute function set_updated_at();
create index idx_requests_pickup on requests using gist (pickup_location);
create index idx_requests_status on requests(status);
create index idx_requests_customer on requests(customer_id);
create index idx_requests_provider on requests(provider_id);
create index idx_requests_city on requests(city);

-- ---------------------------------------------------------------------------
-- offers — each provider's PRIVATE bid on a request
-- ---------------------------------------------------------------------------
create table offers (
  id           uuid primary key default uuid_generate_v4(),
  request_id   uuid not null references requests(id) on delete cascade,
  provider_id  uuid not null references provider_profiles(id) on delete cascade,
  price        numeric(10,2) not null check (price >= 0),
  status       offer_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (request_id, provider_id)
);
create trigger trg_offers_updated before update on offers
  for each row execute function set_updated_at();
create index idx_offers_request on offers(request_id);
create index idx_offers_provider on offers(provider_id);

-- ---------------------------------------------------------------------------
-- ratings — two-way
-- ---------------------------------------------------------------------------
create table ratings (
  id          uuid primary key default uuid_generate_v4(),
  request_id  uuid not null references requests(id) on delete cascade,
  rater_id    uuid not null references profiles(id),
  ratee_id    uuid not null references profiles(id),
  stars       int not null check (stars between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (request_id, rater_id)
);
create index idx_ratings_ratee on ratings(ratee_id);

-- ---------------------------------------------------------------------------
-- commission_ledger — platform money trail per provider
-- ---------------------------------------------------------------------------
create table commission_ledger (
  id           uuid primary key default uuid_generate_v4(),
  provider_id  uuid not null references provider_profiles(id) on delete cascade,
  request_id   uuid references requests(id),
  amount       numeric(10,2) not null,
  type         ledger_type not null,
  note         text,
  created_at   timestamptz not null default now()
);
create index idx_ledger_provider on commission_ledger(provider_id);

-- ===========================================================================
-- Business-rule functions (SECURITY DEFINER — rules enforced server-side)
-- ===========================================================================

-- Provider submits/updates their private bid.
create or replace function submit_offer(p_request_id uuid, p_price numeric)
returns offers language plpgsql security definer as $$
declare
  v_provider uuid := auth.uid();
  v_min      numeric;
  v_status   request_status;
  v_blocked  boolean;
  v_offer    offers;
begin
  select is_blocked into v_blocked from provider_wallets where id = v_provider;
  if v_blocked is null then raise exception 'Not a provider'; end if;
  if v_blocked then raise exception 'Provider is blocked (unpaid commission)'; end if;

  select r.status, c.min_price into v_status, v_min
  from requests r
  join service_categories c on c.id = r.category_id
  where r.id = p_request_id;

  if v_status is null then raise exception 'Request not found'; end if;
  if v_status <> 'searching' then raise exception 'Request is not open'; end if;
  if p_price < v_min then raise exception 'Price below minimum of % AZN', v_min; end if;

  insert into offers (request_id, provider_id, price)
  values (p_request_id, v_provider, p_price)
  on conflict (request_id, provider_id)
  do update set price = excluded.price, status = 'pending', updated_at = now()
  returning * into v_offer;

  return v_offer;
end;
$$;

-- Customer accepts one offer; every other pending offer is CLOSED.
create or replace function accept_offer(p_offer_id uuid)
returns requests language plpgsql security definer as $$
declare
  v_customer uuid := auth.uid();
  v_offer    offers;
  v_req      requests;
begin
  select * into v_offer from offers where id = p_offer_id;
  if v_offer is null then raise exception 'Offer not found'; end if;

  select * into v_req from requests where id = v_offer.request_id for update;
  if v_req.customer_id <> v_customer then raise exception 'Not your request'; end if;
  if v_req.status <> 'searching' then raise exception 'Request no longer open'; end if;

  update requests
     set provider_id = v_offer.provider_id,
         agreed_price = v_offer.price,
         status = 'accepted',
         accepted_at = now()
   where id = v_req.id
  returning * into v_req;

  update offers set status = 'accepted' where id = v_offer.id;
  update offers set status = 'closed'
   where request_id = v_req.id and id <> v_offer.id and status = 'pending';

  return v_req;
end;
$$;

-- Complete a job: mark done and settle commission per payment method.
--   CASH -> add commission to the provider's debt; block while they owe > 0.
--   CARD -> commission auto-collected; net earnings go to the provider wallet.
create or replace function complete_request(p_request_id uuid)
returns requests language plpgsql security definer as $$
declare
  v_uid        uuid := auth.uid();
  v_req        requests;
  v_commission numeric;
begin
  select * into v_req from requests where id = p_request_id for update;
  if v_req is null then raise exception 'Request not found'; end if;
  if v_uid <> v_req.customer_id and v_uid <> v_req.provider_id then
    raise exception 'Not a participant';
  end if;
  if v_req.status not in ('accepted','en_route','arrived','in_progress') then
    raise exception 'Cannot complete from status %', v_req.status;
  end if;

  v_commission := commission_for(coalesce(v_req.agreed_price, 0));

  update requests set status = 'completed', completed_at = now()
   where id = v_req.id returning * into v_req;

  if v_req.payment_method = 'cash' then
    insert into commission_ledger (provider_id, request_id, amount, type, note)
    values (v_req.provider_id, v_req.id, v_commission, 'charge', 'Cash job commission (owed)');

    update provider_wallets
       set commission_balance = commission_balance + v_commission,
           is_blocked = (commission_balance + v_commission) > 0,
           updated_at = now()
     where id = v_req.provider_id;
  else  -- card: gateway captured payment; platform keeps commission
    insert into commission_ledger (provider_id, request_id, amount, type, note)
    values (v_req.provider_id, v_req.id, v_commission, 'charge', 'Card job commission (auto-collected)');

    update provider_wallets
       set wallet_balance = wallet_balance + (coalesce(v_req.agreed_price, 0) - v_commission),
           updated_at = now()
     where id = v_req.provider_id;
  end if;

  update provider_profiles set jobs_done = jobs_done + 1 where id = v_req.provider_id;

  return v_req;
end;
$$;

-- Provider settles CASH commission debt; unblocks once the balance hits zero.
create or replace function pay_commission(p_amount numeric)
returns numeric language plpgsql security definer as $$
declare
  v_provider uuid := auth.uid();
  v_balance  numeric;
begin
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;

  insert into commission_ledger (provider_id, amount, type, note)
  values (v_provider, -p_amount, 'payment', 'Commission payment');

  update provider_wallets
     set commission_balance = commission_balance - p_amount,
         is_blocked = (commission_balance - p_amount) > 0,
         updated_at = now()
   where id = v_provider
  returning commission_balance into v_balance;

  return v_balance;
end;
$$;

-- Providers: open requests near me (RLS also hides these when blocked), nearest first.
create or replace function nearby_open_requests(
  lat double precision,
  lng double precision,
  radius_m integer default 8000
)
returns setof requests language sql stable as $$
  select *
  from requests
  where status = 'searching'
    and ST_DWithin(pickup_location, ST_MakePoint(lng, lat)::geography, radius_m)
  order by ST_Distance(pickup_location, ST_MakePoint(lng, lat)::geography)
$$;
