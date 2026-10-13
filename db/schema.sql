-- Tabele tworzą się same przy pierwszym wejściu na stronę.
-- Ten plik jest na wypadek, gdybyś wolał odpalić SQL ręcznie w Neon SQL Editor.

create table if not exists site_content (
  id integer primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id integer generated always as identity primary key,
  name text not null,
  email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on messages (created_at desc);
