-- Closer Stats Dashboard — Supabase schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
--
-- Security model: this app never uses the Supabase anon/public key. All
-- reads and writes go through Next.js server code using the SERVICE ROLE
-- key, which bypasses Row Level Security. RLS is still enabled below and
-- left with NO policies, so even if the anon key ever leaked it could not
-- read or write anything.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- app_config: single-row table holding the admin login and the shared
-- visitor access code. Values are stored as bcrypt hashes, never in
-- plain text.
-- ---------------------------------------------------------------------
create table if not exists app_config (
  id smallint primary key default 1,
  is_configured boolean not null default false,
  admin_username text,
  admin_password_hash text,
  visitor_code_hash text,
  updated_at timestamptz not null default now(),
  constraint app_config_singleton check (id = 1)
);

insert into app_config (id, is_configured)
values (1, false)
on conflict (id) do nothing;

alter table app_config enable row level security;

-- ---------------------------------------------------------------------
-- kpis: single-row table with the headline stats shown on the dashboard.
-- ---------------------------------------------------------------------
create table if not exists kpis (
  id smallint primary key default 1,
  calls_count integer not null default 0,
  closing_rate numeric(5, 2) not null default 0,
  show_up_rate numeric(5, 2) not null default 0,
  cash_contracted numeric(12, 2) not null default 0,
  cash_collected numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now(),
  constraint kpis_singleton check (id = 1)
);

insert into kpis (id)
values (1)
on conflict (id) do nothing;

alter table kpis enable row level security;

-- ---------------------------------------------------------------------
-- calls: list of sales calls and roleplays.
-- ---------------------------------------------------------------------
create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  call_date date not null,
  call_type text not null check (call_type in ('client', 'roleplay')),
  recording_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table calls enable row level security;

create index if not exists calls_call_date_idx on calls (call_date desc);
