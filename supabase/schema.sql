create extension if not exists "pgcrypto";

create type listing_category as enum ('single', 'graded', 'sealed', 'collection');
create type listing_intent as enum ('buy', 'sell', 'trade');
create type listing_status as enum ('draft', 'published', 'sold', 'archived');
create type order_status as enum ('pending', 'paid', 'cancelled', 'fulfilled');
create type stream_status as enum ('queued', 'opened', 'ready_to_ship', 'fulfilled');

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category listing_category not null,
  intent listing_intent not null default 'buy',
  status listing_status not null default 'draft',
  set_name text,
  card_number text,
  rarity text,
  sealed_type text,
  condition text,
  grade text,
  price_cents integer check (price_cents is null or price_cents >= 0),
  quantity integer not null default 1 check (quantity >= 0),
  description text,
  notes text,
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  stripe_checkout_session_id text not null unique,
  buyer_email text,
  quantity integer not null default 1 check (quantity > 0),
  amount_total_cents integer not null check (amount_total_cents >= 0),
  currency text not null default 'usd',
  status order_status not null default 'pending',
  stream_open_required boolean not null default false,
  stream_customer_name text,
  stream_queue_number integer unique,
  stream_status stream_status,
  paid_at timestamptz,
  shipping_name text,
  shipping_address jsonb,
  shipping_amount_cents integer check (
    shipping_amount_cents is null or shipping_amount_cents >= 0
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stream_queue_counters (
  id text primary key,
  next_number integer not null default 1 check (next_number > 0),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger stream_queue_counters_set_updated_at
before update on public.stream_queue_counters
for each row execute function public.set_updated_at();

create or replace function public.next_stream_queue_number(counter_id text default 'global')
returns integer as $$
declare
  assigned_number integer;
begin
  insert into public.stream_queue_counters (id, next_number)
  values (counter_id, 1)
  on conflict (id) do nothing;

  select next_number
  into assigned_number
  from public.stream_queue_counters
  where id = counter_id
  for update;

  update public.stream_queue_counters
  set next_number = assigned_number + 1
  where id = counter_id;

  return assigned_number;
end;
$$ language plpgsql;

alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.stream_queue_counters enable row level security;

create policy "Published listings are publicly readable"
on public.listings for select
using (status = 'published');

create policy "Orders are service-role managed"
on public.orders for all
using (false)
with check (false);

create policy "Stream counters are service-role managed"
on public.stream_queue_counters for all
using (false)
with check (false);

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload listing images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'listing-images');

create policy "Listing images are publicly readable"
on storage.objects for select
using (bucket_id = 'listing-images');
