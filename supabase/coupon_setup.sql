-- supabase/coupon_setup.sql
-- Coupon system: unlock Maqtab Intermediate/Advanced levels
-- One-time use per user, with expiry dates and deactivation support

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) unique not null,
  unlock_level text not null default 'intermediate', -- 'intermediate' | 'advanced'
  valid_from timestamptz default now(),
  valid_until timestamptz not null,
  max_uses int default 1,
  current_uses int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  description text
);

create table if not exists coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  coupon_id uuid not null references coupons(id),
  redeemed_at timestamptz not null default now(),
  unique(user_id, coupon_id)
);

create index if not exists coupons_code on coupons (code);
create index if not exists coupons_active on coupons (is_active, valid_until);
create index if not exists coupon_redemptions_user on coupon_redemptions (user_id);
create index if not exists coupon_redemptions_coupon on coupon_redemptions (coupon_id);
