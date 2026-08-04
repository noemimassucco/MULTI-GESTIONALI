-- =====================================================================
--  GestioniSuMisura — schema iniziale del sito vetrina
--  Da eseguire nel SQL Editor di Supabase.
--  Nota: questo è il database del SITO, non dei gestionali dei clienti.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------ CATALOGO

create table if not exists categorie (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nome        text not null,
  sottotitolo text,
  descrizione text,
  icona       text,
  colore      text,
  ordine      int not null default 0,
  pubblicata  boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists basi (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nome        text not null,
  descrizione text,
  adatto_a    text[] not null default '{}',
  funzioni    text[] not null default '{}',
  entita      text[] not null default '{}',
  demo_path   text,
  demo_pronta boolean not null default false,
  ordine      int not null default 0
);

create table if not exists gestionali (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  nome              text not null,
  sottotitolo       text,
  categoria_id      uuid not null references categorie(id) on delete restrict,
  base_id           uuid references basi(id) on delete set null,
  descrizione       text,
  problemi          text[] not null default '{}',
  funzioni          text[] not null default '{}',
  moduli            text[] not null default '{}',
  moduli_aggiuntivi text[] not null default '{}',
  personalizzazioni text[] not null default '{}',
  utenti            text[] not null default '{}',
  vantaggi          jsonb  not null default '[]',
  faq               jsonb  not null default '[]',
  immagine_url      text,
  stato             text not null default 'bozza' check (stato in ('bozza','pubblicato')),
  demo_disponibile  boolean not null default false,
  ordine            int not null default 0,
  meta_title        text,
  meta_description  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists gestionali_categoria_idx on gestionali (categoria_id);
create index if not exists gestionali_base_idx      on gestionali (base_id);
create index if not exists gestionali_stato_idx     on gestionali (stato);

-- -------------------------------------------------------------- FILTRI

create table if not exists funzionalita (
  id     uuid primary key default gen_random_uuid(),
  slug   text unique not null,
  nome   text not null,
  gruppo text check (gruppo in ('operativo','amministrativo'))
);

create table if not exists gestionali_funzionalita (
  gestionale_id   uuid references gestionali(id)   on delete cascade,
  funzionalita_id uuid references funzionalita(id) on delete cascade,
  primary key (gestionale_id, funzionalita_id)
);

-- ----------------------------------------------------------- CONTENUTI

create table if not exists screenshot (
  id            uuid primary key default gen_random_uuid(),
  gestionale_id uuid references gestionali(id) on delete cascade,
  base_id       uuid references basi(id)       on delete cascade,
  url           text not null,
  alt           text not null,
  didascalia    text,
  ordine        int not null default 0,
  constraint screenshot_appartenenza check (gestionale_id is not null or base_id is not null)
);

create table if not exists faq (
  id            uuid primary key default gen_random_uuid(),
  gestionale_id uuid references gestionali(id) on delete cascade,
  categoria_id  uuid references categorie(id)  on delete cascade,
  globale       boolean not null default false,
  domanda       text not null,
  risposta      text not null,
  ordine        int not null default 0
);

create table if not exists contenuti_sito (
  chiave        text primary key,
  valore        jsonb not null,
  aggiornato_at timestamptz not null default now()
);

-- ----------------------------------------------------------- RICHIESTE

create table if not exists richieste (
  id                   uuid primary key default gen_random_uuid(),
  nome                 text not null,
  azienda              text,
  settore              text,
  email                text not null,
  telefono             text,
  gestionale_id        uuid references gestionali(id) on delete set null,
  gestionale_interesse text,
  numero_utenti        text,
  strumenti_attuali    text[] not null default '{}',
  difficolta           text,
  funzioni_necessarie  text,
  dati_da_importare    text,
  personalizzazioni    text,
  messaggio            text,
  allegato_url         text,
  consenso_privacy     boolean not null default false,
  stato                text not null default 'nuova'
                       check (stato in ('nuova','in_lavorazione','preventivo_inviato','chiusa','scartata')),
  note_interne         text,
  created_at           timestamptz not null default now()
);

create index if not exists richieste_stato_idx on richieste (stato, created_at desc);

-- =====================================================================
--  SICUREZZA (Row Level Security)
--  Regola generale: il pubblico legge solo ciò che è pubblicato,
--  e non legge MAI le richieste. Le scritture passano dal server.
-- =====================================================================

alter table categorie                enable row level security;
alter table basi                     enable row level security;
alter table gestionali               enable row level security;
alter table funzionalita             enable row level security;
alter table gestionali_funzionalita  enable row level security;
alter table screenshot               enable row level security;
alter table faq                      enable row level security;
alter table contenuti_sito           enable row level security;
alter table richieste                enable row level security;

-- Lettura pubblica dei contenuti pubblicati
create policy "categorie pubbliche"  on categorie
  for select using (pubblicata = true);

create policy "gestionali pubblicati" on gestionali
  for select using (stato = 'pubblicato');

create policy "basi leggibili"        on basi                    for select using (true);
create policy "funzionalita leggibili" on funzionalita            for select using (true);
create policy "collegamenti leggibili" on gestionali_funzionalita for select using (true);
create policy "screenshot leggibili"  on screenshot              for select using (true);
create policy "faq leggibili"         on faq                     for select using (true);
create policy "contenuti leggibili"   on contenuti_sito          for select using (true);

-- Amministrazione: accesso completo agli utenti autenticati
create policy "admin categorie"    on categorie               for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin basi"         on basi                    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin gestionali"   on gestionali              for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin funzionalita" on funzionalita            for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin collegamenti" on gestionali_funzionalita for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin screenshot"   on screenshot              for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin faq"          on faq                     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin contenuti"    on contenuti_sito          for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin richieste"    on richieste               for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- NESSUNA policy di insert pubblica su `richieste`: l'invio del modulo passa
-- dalla server action, che scrive con la service role key dopo aver validato
-- i dati e controllato il campo trappola anti-bot.

-- ----------------------------------------------------- aggiornamento data
create or replace function tocca_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists gestionali_updated_at on gestionali;
create trigger gestionali_updated_at
  before update on gestionali
  for each row execute function tocca_updated_at();
