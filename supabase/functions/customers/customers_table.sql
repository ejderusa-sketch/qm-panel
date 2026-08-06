-- QM PANEL — Müşteri tablosu (Supabase SQL editor'de bir kez çalıştır)
-- ShipStation siparişlerinden çıkan müşteriler burada tutulur (tarayıcı 5MB sınırı yok).

create table if not exists public.customers (
  ckey   text primary key,          -- benzersiz anahtar: "kaynak||(email VEYA isim|adres)"
  name   text,
  email  text,
  addr   text,
  state  text,
  source text,                      -- hangi ShipStation hesabı: "ejderusa" (ileride başka hesaplar)
  updated_at timestamptz default now()
);

-- (Tablo zaten varsa source kolonunu ekle)
alter table public.customers add column if not exists source text;
create index if not exists customers_source_idx on public.customers (source);

-- Arama için index'ler (isim / email / adres ilike)
create index if not exists customers_name_idx  on public.customers using gin (name  gin_trgm_ops);
create index if not exists customers_email_idx on public.customers using gin (email gin_trgm_ops);
create index if not exists customers_state_idx on public.customers (state);

-- gin_trgm_ops için (ilike hızlansın); yoksa üstteki gin index'leri atlayıp düz index kullan:
create extension if not exists pg_trgm;

-- RLS: edge function service_role ile yazar; anon erişimi kapalı kalsın (panel edge function üzerinden okur/yazar).
alter table public.customers enable row level security;
-- (İstersen anon okuma açmak için: create policy "read" on public.customers for select using (true);)
