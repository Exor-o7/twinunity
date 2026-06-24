do $$
begin
  create type stream_status as enum ('queued', 'opened', 'ready_to_ship', 'fulfilled');
exception
  when duplicate_object then null;
end $$;

alter table public.orders
add column if not exists quantity integer not null default 1 check (quantity > 0),
add column if not exists stream_open_required boolean not null default false,
add column if not exists stream_customer_name text,
add column if not exists stream_queue_number integer unique,
add column if not exists stream_status stream_status,
add column if not exists paid_at timestamptz,
add column if not exists shipping_name text,
add column if not exists shipping_address jsonb,
add column if not exists shipping_amount_cents integer check (
  shipping_amount_cents is null or shipping_amount_cents >= 0
);

create table if not exists public.stream_queue_counters (
  id text primary key,
  next_number integer not null default 1 check (next_number > 0),
  updated_at timestamptz not null default now()
);

drop trigger if exists stream_queue_counters_set_updated_at
on public.stream_queue_counters;

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

alter table public.stream_queue_counters enable row level security;

drop policy if exists "Stream counters are service-role managed"
on public.stream_queue_counters;

create policy "Stream counters are service-role managed"
on public.stream_queue_counters for all
using (false)
with check (false);
