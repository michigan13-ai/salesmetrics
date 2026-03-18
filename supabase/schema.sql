create extension if not exists "pgcrypto";

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists integration_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null default 'pending',
  last_sync_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists ingestion_uploads (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  source_type text,
  storage_path text,
  status text not null default 'queued',
  uploaded_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid references ingestion_uploads(id) on delete cascade,
  provider text,
  status text not null default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  error_message text
);

create table if not exists buyers (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  first_name text,
  last_name text,
  email text,
  phone text,
  state text,
  city text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists buyer_interactions (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references buyers(id) on delete cascade,
  interaction_type text not null,
  interaction_at timestamptz,
  source_system text,
  notes text
);

create table if not exists lots (
  id uuid primary key default gen_random_uuid(),
  lot_number text not null unique,
  lot_type text,
  status text,
  list_price numeric,
  sold_price numeric,
  created_at timestamptz not null default now()
);

create table if not exists lot_sales (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references lots(id),
  buyer_id uuid references buyers(id),
  contract_date date,
  close_date date,
  sale_price numeric,
  source_system text
);

create table if not exists mailchimp_campaigns (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  title text not null,
  send_time timestamptz,
  audience_name text,
  emails_sent integer,
  delivered integer,
  opens integer,
  unique_clicks integer,
  open_rate numeric,
  click_rate numeric,
  click_to_open_rate numeric,
  hard_bounces integer,
  soft_bounces integer,
  unsubscribes integer,
  spam_complaints integer
);

create table if not exists reservation_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_system text not null default 'streamline',
  snapshot_date date not null,
  occupancy_rate numeric,
  arrivals integer,
  departures integer,
  revenue numeric
);
