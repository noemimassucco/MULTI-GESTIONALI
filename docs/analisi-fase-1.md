# Progetto Multi-Gestionali — Analisi Fase 1

Documento di impostazione. Nessun codice: struttura, dati, piano di lavoro.
Data: 4 agosto 2026

---

## 0. Tre correzioni che propongo prima di partire

Prima dell'analisi, tre cose che nella tua traccia non tornano del tutto. Le segnalo subito perché cambiano il resto del documento.

**a) La categoria 12 ha due nomi diversi.** In home la chiami "Associazioni e cooperative", nel catalogo "Associazioni e assistenza" — e le cooperative le hai già messe sotto "Servizi alle aziende". Propongo di tenere **"Associazioni e assistenza"** ovunque e lasciare le cooperative dove sono. Un gestionale in due categorie confonde il visitatore e complica i filtri.

**b) Manca una base.** Con le 8 basi che hai elencato, l'intera categoria "Sport e formazione" (7 gestionali) più "Associazioni" restano scoperti: palestre, scuole di danza, associazioni sportive, scuole private, centri di formazione, autoscuole e associazioni ruotano tutti attorno a iscritti / corsi / abbonamenti / presenze / quote / certificati in scadenza. Non è "Appuntamenti" e non è "Personale e turni". Propongo una **Base 9 — Corsi e iscrizioni**. Sono 7 gestionali su 54: è la terza base per copertura, dopo "Clienti e attività" e "Interventi". La aggiungo alla mappa, ma resta fra le ultime da costruire.

**c) Il collo di bottiglia non è il codice, sono i contenuti.** 54 pagine di gestionale con descrizione, problemi, funzioni, moduli, personalizzazioni, FAQ e screenshot sono circa 54 × 600 parole = oltre 30.000 parole di testo commerciale, più le immagini. Hai scritto "non creare pagine vuote", ed è la regola giusta: quindi propongo di **pubblicare al lancio 12-15 gestionali** (uno o due per categoria, partendo da quelli che conosci davvero: immobiliare, edile, manutentori, pulizie, elettricisti, idraulici) e tenere gli altri 40 in stato *bozza*, invisibili al pubblico, da pubblicare uno alla volta. Il campo `stato` che hai già previsto serve esattamente a questo.

---

## 1. Struttura completa del sito

### Mappa

```
SITO PUBBLICO
├── Home                                  /
├── Tutti i gestionali (catalogo+filtri)  /gestionali
├── Categorie (elenco 12)                 /categorie
│   └── Pagina categoria                  /categorie/[slug]
├── Pagina gestionale                     /gestionali/[slug]
├── Demo (vetrina delle basi)             /demo
│   └── Demo navigabile                   /demo/[base]
├── Come funziona                         /come-funziona
├── Personalizzazioni                     /personalizzazioni
├── Chi sono                              /chi-sono
├── Contatti                              /contatti
├── Richiedi il tuo gestionale            /richiedi
└── Legali                                /privacy · /cookie · /note-legali

AREA AMMINISTRATIVA (protetta)
├── Login                                 /admin/login
├── Dashboard                             /admin
├── Categorie                             /admin/categorie
├── Gestionali (lista + editor)           /admin/gestionali · /admin/gestionali/[id]
├── Basi                                  /admin/basi
├── Richieste ricevute                    /admin/richieste · /admin/richieste/[id]
├── FAQ                                   /admin/faq
├── Media / screenshot                    /admin/media
└── Contenuti del sito                    /admin/contenuti
```

### Menu principale

Barra fissa, sette voci al massimo — di più e diventa illeggibile su tablet:

`Gestionali ▾` (mega-menu con le 12 categorie) · `Demo` · `Come funziona` · `Personalizzazioni` · `Chi sono` · `Contatti` · **[Richiedi il tuo gestionale]** (bottone accento)

Su mobile: logo + hamburger, con il bottone CTA sempre visibile in fondo allo schermo.

### Footer

Quattro colonne: categorie principali · gestionali più richiesti · pagine informative (come funziona, personalizzazioni, chi sono) · contatti + P.IVA + link legali.

### Percorso dell'utente

È il cuore del progetto, ed è uno solo:

```
Home → riconosce il proprio problema → clicca la propria categoria
     → vede i gestionali di quel settore → apre "il suo"
     → legge cosa gestisce → APRE LA DEMO
     → torna indietro → compila la richiesta con le sue modifiche
```

Ogni pagina deve avere sempre visibile il passo successivo. La demo è il momento di conversione: è lì che il visitatore capisce che è una cosa vera. Per questo la demo va costruita bene, e per questo ne serve **una sola all'inizio, ma perfetta**.

---

## 2. Le 12 categorie

| # | Categoria | Slug | Gestionali |
|---|-----------|------|-----------|
| 1 | Immobili e amministrazione | `immobili-amministrazione` | 4 |
| 2 | Edilizia e lavori tecnici | `edilizia-lavori-tecnici` | 4 |
| 3 | Manutenzione e assistenza | `manutenzione-assistenza` | 4 |
| 4 | Servizi alle aziende | `servizi-alle-aziende` | 4 |
| 5 | Studi professionali | `studi-professionali` | 5 |
| 6 | Commercio e produzione | `commercio-produzione` | 6 |
| 7 | Trasporti e veicoli | `trasporti-veicoli` | 5 |
| 8 | Bellezza e benessere | `bellezza-benessere` | 4 |
| 9 | Sport e formazione | `sport-formazione` | 7 |
| 10 | Turismo e ristorazione | `turismo-ristorazione` | 4 |
| 11 | Eventi e servizi personali | `eventi-servizi-personali` | 4 |
| 12 | Associazioni e assistenza | `associazioni-assistenza` | 3 |
| | **Totale** | | **54** |

Ordine in home: metto per prime le categorie in cui hai esperienza diretta e credibilità (1, 2, 3, 4), perché sono quelle su cui puoi vendere davvero adesso. Le altre servono a farti trovare e a non far sentire escluso nessuno.

---

## 3. Le 54 sottocategorie con la base collegata

Formato: **gestionale** → base primaria *(+ moduli presi da altre basi)*

### 1. Immobili e amministrazione
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale immobiliare | `gestionale-immobiliare` | **B6 Immobiliare** |
| Gestionale agenzia immobiliare | `gestionale-agenzia-immobiliare` | **B6** + moduli CRM (B1) e appuntamenti/visite (B4) |
| Gestionale amministratore di condominio | `gestionale-amministratore-condominio` | **B6** + modulo assemblee/millesimi |
| Gestionale affitti brevi e case vacanza | `gestionale-affitti-brevi` | **B8 Prenotazioni** + modulo pulizie/manutenzioni |

### 2. Edilizia e lavori tecnici
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale impresa edile | `gestionale-impresa-edile` | **B2 Commesse** + modulo SAL e ritenuta a garanzia |
| Gestionale geometri e studi tecnici | `gestionale-geometri` | **B1 Clienti e attività** + modulo pratiche/protocolli |
| Gestionale architetti e ingegneri | `gestionale-architetti-ingegneri` | **B1** + modulo progetti/versioni + ore |
| Gestionale serramentisti e falegnami | `gestionale-serramentisti-falegnami` | **B2** + modulo misure/sopralluoghi |

### 3. Manutenzione e assistenza
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale manutentori | `gestionale-manutentori` | **B3 Interventi** |
| Gestionale elettricisti | `gestionale-elettricisti` | **B3** + modulo certificazioni |
| Gestionale idraulici e termoidraulici | `gestionale-idraulici-termoidraulici` | **B3** + modulo richiami periodici caldaie |
| Gestionale assistenza tecnica | `gestionale-assistenza-tecnica` | **B3** + modulo ticket/priorità |

### 4. Servizi alle aziende
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale impresa di pulizie | `gestionale-impresa-pulizie` | **B5 Personale e turni** + modulo controlli qualità e fatturazione mensile |
| Gestionale cooperative | `gestionale-cooperative` | **B5** + modulo soci/appalti/rendicontazione |
| Gestionale vigilanza e portierato | `gestionale-vigilanza-portierato` | **B5** + modulo sostituzioni/rapportini |
| Gestionale consulenti aziendali | `gestionale-consulenti-aziendali` | **B1** |

### 5. Studi professionali
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale commercialisti | `gestionale-commercialisti` | **B1** + modulo adempimenti ricorrenti |
| Gestionale consulenti del lavoro | `gestionale-consulenti-lavoro` | **B1** + modulo dipendenti dei clienti |
| Gestionale avvocati | `gestionale-avvocati` | **B1** + modulo udienze/termini |
| Gestionale studi amministrativi | `gestionale-studi-amministrativi` | **B1** |
| Gestionale agenzie marketing | `gestionale-agenzie-marketing` | **B1** + modulo calendario editoriale/approvazioni |

### 6. Commercio e produzione
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale negozi | `gestionale-negozi` | **B7 Magazzino e ordini** |
| Gestionale grossisti | `gestionale-grossisti` | **B7** + modulo listini/agenti |
| Gestionale laboratori artigianali | `gestionale-laboratori-artigianali` | **B2** + modulo materiali |
| Gestionale piccola produzione | `gestionale-piccola-produzione` | **B2** + moduli fasi produttive e magazzino (B7) |
| Gestionale tipografie | `gestionale-tipografie` | **B2** + modulo bozze/approvazioni |
| Gestionale sartorie | `gestionale-sartorie` | **B2** + modulo misure/prove |

### 7. Trasporti e veicoli
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale officine | `gestionale-officine` | **B3** + modulo veicoli/storico veicolo |
| Gestionale carrozzerie | `gestionale-carrozzerie` | **B3** + modulo sinistri/assicurazioni |
| Gestionale autotrasportatori | `gestionale-autotrasportatori` | **B3** (viaggio = intervento) + modulo mezzi/carburante/costi |
| Gestionale corrieri locali | `gestionale-corrieri-locali` | **B3** + modulo percorsi/prova di consegna |
| Gestionale noleggio mezzi e attrezzature | `gestionale-noleggio` | **B8** + modulo cauzioni/danni |

> Nota onesta: autotrasportatori e corrieri sono i due adattamenti più forzati di tutta la mappa. Funzionano sulla base Interventi, ma se un giorno diventassero un mercato interessante meriterebbero una base propria (viaggi/tratte/mezzi). Per ora li terrei in bozza.

### 8. Bellezza e benessere
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale parrucchieri | `gestionale-parrucchieri` | **B4 Appuntamenti** |
| Gestionale centri estetici | `gestionale-centri-estetici` | **B4** + modulo cabine/pacchetti/consensi foto |
| Gestionale centri benessere e spa | `gestionale-centri-benessere-spa` | **B4** + modulo ingressi/promozioni |
| Gestionale tatuatori | `gestionale-tatuatori` | **B4** + modulo progetti/sedute/consensi |

### 9. Sport e formazione
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale palestre | `gestionale-palestre` | **B9 Corsi e iscrizioni** |
| Gestionale personal trainer | `gestionale-personal-trainer` | **B4** + modulo schede/progressi |
| Gestionale scuole di danza | `gestionale-scuole-danza` | **B9** + modulo saggi |
| Gestionale associazioni sportive | `gestionale-associazioni-sportive` | **B9** + modulo tesseramenti |
| Gestionale scuole private | `gestionale-scuole-private` | **B9** |
| Gestionale centri di formazione | `gestionale-centri-formazione` | **B9** + modulo edizioni/aziende clienti |
| Gestionale autoscuole | `gestionale-autoscuole` | **B9** + modulo pratiche/guide/veicoli |

### 10. Turismo e ristorazione
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale B&B e strutture ricettive | `gestionale-bb-strutture-ricettive` | **B8** |
| Gestionale ristoranti | `gestionale-ristoranti` | **B8** (tavoli) + moduli turni (B5) e magazzino (B7) |
| Gestionale catering | `gestionale-catering` | **B2** (evento = commessa) + modulo menu/personale |
| Gestionale agenzie di viaggio | `gestionale-agenzie-viaggio` | **B1** + modulo prenotazioni/fornitori |

### 11. Eventi e servizi personali
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale wedding planner | `gestionale-wedding-planner` | **B1** + modulo evento/invitati/budget |
| Gestionale organizzatori di eventi | `gestionale-organizzatori-eventi` | **B1** + modulo location/staff |
| Gestionale fotografi e videomaker | `gestionale-fotografi-videomaker` | **B1** + modulo shooting/consegne/liberatorie |
| Gestionale agenzie funebri | `gestionale-agenzie-funebri` | **B1** + modulo stato pratica |

### 12. Associazioni e assistenza
| Gestionale | Slug | Base |
|---|---|---|
| Gestionale associazioni | `gestionale-associazioni` | **B9** + modulo volontari/donazioni |
| Gestionale assistenza domiciliare | `gestionale-assistenza-domiciliare` | **B5** + modulo assistiti/prestazioni |
| Gestionale servizi alla persona | `gestionale-servizi-alla-persona` | **B5** + modulo prestazioni |

---

## 4. Le basi gestionali

Nove basi, ordinate per copertura del catalogo. **Questo ordine è anche l'ordine di sviluppo consigliato**, perché ogni base costruita "sblocca" un tot di pagine con demo attiva.

| # | Base | Slug | Gestionali coperti | Entità principali |
|---|------|------|:---:|---|
| B1 | **Clienti e attività** | `clienti-attivita` | **13** | Cliente · Contatto · Attività · Scadenza · Documento · Preventivo · Pagamento · Nota |
| B3 | **Interventi** | `interventi` | **8** | Cliente · Sede · Impianto/Veicolo · Richiesta · Intervento · Tecnico · Materiale · Rapportino |
| B9 | **Corsi e iscrizioni** *(nuova)* | `corsi-iscrizioni` | **7** | Iscritto · Corso/Edizione · Lezione · Presenza · Abbonamento/Quota · Docente · Certificato |
| B2 | **Commesse** | `commesse` | **7** | Cliente · Commessa · Fase · Attività · Materiale · Fornitore · Costo · Ora · Avanzamento |
| B4 | **Appuntamenti** | `appuntamenti` | **5** | Cliente · Appuntamento · Operatore · Servizio · Pacchetto · Pagamento |
| B5 | **Personale e turni** | `personale-turni` | **5** | Dipendente · Sede/Cantiere · Turno · Presenza · Assenza · Documento · Scadenza |
| B8 | **Prenotazioni e noleggio** | `prenotazioni-noleggio` | **4** | Risorsa · Disponibilità · Prenotazione · Cliente · Contratto · Cauzione |
| B6 | **Immobiliare** | `immobiliare` | **3** | Immobile · Unità · Proprietario · Inquilino · Contratto · Canone · Scadenza · Manutenzione |
| B7 | **Magazzino e ordini** | `magazzino-ordini` | **2** | Prodotto · Fornitore · Cliente · Ordine · Carico · Scarico · Giacenza · Inventario |

### Lo scheletro comune a tutte e nove

Questa è la parte che paga davvero. Ogni base, qualunque sia il settore, è fatta delle stesse sei cose:

1. **Dashboard** — 4 KPI + "cosa scade" + "cosa è fermo"
2. **Anagrafica principale** (clienti / iscritti / immobili / prodotti) — lista filtrabile + scheda dettaglio
3. **Entità operativa** (attività / intervento / commessa / appuntamento / turno / prenotazione) — lista + dettaglio + cambio di stato
4. **Scadenzario** — trasversale, sempre presente
5. **Documenti** — allegati organizzati per entità
6. **Report / riepilogo** — poche cifre, leggibili

Cambiano i nomi e i campi, non la struttura. Per questo la prima base costa 3-4 volte le successive: costruendola costruisci lo scheletro di tutte.

---

## 5. Struttura del database del sito

Attenzione alla distinzione: **questo è il database del sito vetrina**, non dei gestionali. Le demo non scrivono qui (vedi §6).

```sql
-- ─────────────────────────  CATALOGO  ─────────────────────────

create table categorie (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  nome          text not null,
  sottotitolo   text,
  descrizione   text,
  icona         text,                       -- nome icona lucide-react
  ordine        int  not null default 0,
  pubblicata    boolean not null default false,
  created_at    timestamptz default now()
);

create table basi (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,       -- 'clienti-attivita'
  nome          text not null,
  descrizione   text,
  adatto_a      text[] default '{}',
  funzioni      text[] default '{}',
  demo_path     text,                       -- '/demo/clienti-attivita'
  demo_pronta   boolean not null default false,
  ordine        int default 0
);

create table gestionali (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  nome               text not null,
  sottotitolo        text,
  categoria_id       uuid not null references categorie(id) on delete restrict,
  base_id            uuid references basi(id) on delete set null,
  descrizione        text,
  problemi           text[] default '{}',   -- "problemi che risolve"
  funzioni           text[] default '{}',
  moduli             text[] default '{}',
  personalizzazioni  text[] default '{}',
  utenti             text[] default '{}',   -- chi lo usa in azienda
  vantaggi           text[] default '{}',
  immagine_url       text,
  stato              text not null default 'bozza'
                     check (stato in ('bozza','pubblicato')),
  demo_disponibile   boolean not null default false,
  ordine             int default 0,
  meta_title         text,
  meta_description   text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);
create index on gestionali (categoria_id);
create index on gestionali (base_id);
create index on gestionali (stato);

-- ─────────────────────────  FILTRI  ─────────────────────────
-- solo i tag su cui si filtra nel catalogo; le funzioni descrittive
-- restano nell'array 'funzioni' del gestionale

create table funzionalita (
  id     uuid primary key default gen_random_uuid(),
  slug   text unique not null,
  nome   text not null,
  gruppo text                                -- 'operativo' | 'amministrativo'
);
-- seed: appuntamenti, documenti, personale, magazzino, interventi,
--       commesse, fatturazione, scadenze, preventivi, presenze

create table gestionali_funzionalita (
  gestionale_id  uuid references gestionali(id) on delete cascade,
  funzionalita_id uuid references funzionalita(id) on delete cascade,
  primary key (gestionale_id, funzionalita_id)
);

-- ─────────────────────────  CONTENUTI  ─────────────────────────

create table screenshot (
  id            uuid primary key default gen_random_uuid(),
  gestionale_id uuid references gestionali(id) on delete cascade,
  base_id       uuid references basi(id) on delete cascade,
  url           text not null,
  alt           text not null,
  didascalia    text,
  ordine        int default 0,
  check (gestionale_id is not null or base_id is not null)
);

create table faq (
  id            uuid primary key default gen_random_uuid(),
  gestionale_id uuid references gestionali(id) on delete cascade,
  categoria_id  uuid references categorie(id) on delete cascade,
  globale       boolean not null default false,
  domanda       text not null,
  risposta      text not null,
  ordine        int default 0
);

create table contenuti_sito (
  chiave        text primary key,            -- 'home.hero', 'home.problemi'
  valore        jsonb not null,
  aggiornato_at timestamptz default now()
);

-- ─────────────────────────  RICHIESTE  ─────────────────────────

create table richieste (
  id                    uuid primary key default gen_random_uuid(),
  nome                  text not null,
  azienda               text,
  settore               text,
  email                 text not null,
  telefono              text,
  gestionale_id         uuid references gestionali(id) on delete set null,
  gestionale_interesse  text,                -- testo libero se non a catalogo
  numero_utenti         text,
  strumenti_attuali     text[] default '{}', -- excel, carta, whatsapp, email...
  difficolta            text,
  funzioni_necessarie   text,
  dati_da_importare     text,
  personalizzazioni     text,
  messaggio             text,
  allegato_url          text,
  consenso_privacy      boolean not null default false,
  stato                 text not null default 'nuova'
                        check (stato in ('nuova','in_lavorazione',
                                         'preventivo_inviato','chiusa','scartata')),
  note_interne          text,
  created_at            timestamptz default now()
);
create index on richieste (stato, created_at desc);
```

### Sicurezza (RLS)

| Tabella | Pubblico (anon) | Admin |
|---|---|---|
| `categorie`, `gestionali` | `select` solo se pubblicato | tutto |
| `basi`, `funzionalita`, `screenshot`, `faq`, `contenuti_sito` | `select` | tutto |
| `richieste` | **niente** | tutto |

L'invio del modulo **non** passa da `insert` diretto del client: passa da una *server action* Next.js che valida con Zod, controlla honeypot + rate-limit per IP, carica l'eventuale allegato e poi scrive con la service key. Se lasci l'insert al client anon, in due settimane la tabella è piena di spam.

**Storage Supabase**: bucket `screenshot` pubblico, bucket `allegati` privato (accesso solo via signed URL dall'area admin).

**Autenticazione**: Supabase Auth, un solo utente admin (tu). Nessuna registrazione pubblica.

---

## 6. Struttura delle cartelle

```
progetto-multi-gestionali/
├── src/
│   ├── app/
│   │   ├── (sito)/                    ← SITO PUBBLICO
│   │   │   ├── layout.tsx             navbar + footer
│   │   │   ├── page.tsx               home
│   │   │   ├── gestionali/
│   │   │   │   ├── page.tsx           catalogo + filtri
│   │   │   │   └── [slug]/page.tsx    pagina gestionale
│   │   │   ├── categorie/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── demo/page.tsx          vetrina delle basi
│   │   │   ├── come-funziona/page.tsx
│   │   │   ├── personalizzazioni/page.tsx
│   │   │   ├── chi-sono/page.tsx
│   │   │   ├── contatti/page.tsx
│   │   │   ├── richiedi/page.tsx
│   │   │   └── (legali)/privacy · cookie · note-legali
│   │   │
│   │   ├── (admin)/admin/             ← AREA AMMINISTRATIVA
│   │   │   ├── layout.tsx             shell + guardia auth
│   │   │   ├── page.tsx               dashboard
│   │   │   ├── categorie/
│   │   │   ├── gestionali/[id]/
│   │   │   ├── basi/
│   │   │   ├── richieste/[id]/
│   │   │   ├── faq/
│   │   │   ├── media/
│   │   │   └── contenuti/
│   │   │
│   │   ├── demo/                      ← DEMO GESTIONALI
│   │   │   ├── layout.tsx             banner "dati di esempio"
│   │   │   └── [base]/
│   │   │       ├── layout.tsx         sidebar + topbar del gestionale
│   │   │       ├── page.tsx           dashboard
│   │   │       └── [sezione]/         liste e dettagli
│   │   │
│   │   ├── api/                       webhook, download allegati
│   │   ├── sitemap.ts · robots.ts
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                        primitive, zero logica di dominio
│   │   ├── sito/                      componenti del sito pubblico
│   │   ├── admin/                     componenti area amministrativa
│   │   └── demo/                      shell riutilizzabile dei gestionali
│   │
│   ├── lib/
│   │   ├── supabase/                  client.ts · server.ts · admin.ts
│   │   ├── queries/                   query tipizzate per tabella
│   │   ├── validators/                schemi Zod (richiesta, gestionale...)
│   │   ├── seo.ts
│   │   └── utils.ts
│   │
│   ├── data/
│   │   ├── seed/                      categorie · gestionali · basi (TS)
│   │   └── demo/                      dati finti per ogni demo
│   │
│   └── types/                         database.types.ts (generato) + domain.ts
│
├── supabase/migrations/
├── public/
├── scripts/seed.ts
└── config vari (next, tailwind, tsconfig, .env.example)
```

Regola pratica: **niente file oltre le 200 righe**. Se una pagina cresce, il pezzo che è cresciuto diventa un componente.

### Come funzionano le demo (decisione importante)

Le demo **non usano Supabase**. I dati stanno in file TypeScript sotto `src/data/demo/`, caricati in uno stato React alla prima apertura.

Il visitatore può navigare, filtrare, ordinare, aprire schede, cambiare stati, aggiungere righe: tutto funziona davvero, ma **al ricaricamento della pagina torna tutto com'era**. Il motivo è pratico: nessun costo di database, nessuna demo rovinata dal visitatore precedente, nessun dato personale raccolto per sbaglio. Un banner discreto in alto lo dichiara: *"Demo con dati di esempio — le modifiche non vengono salvate"*.

---

## 7. Pagine da creare

**Sito pubblico — 14 file, 78 pagine generate**

| Pagina | File | Pagine reali |
|---|---|---|
| Home | 1 | 1 |
| Catalogo gestionali | 1 | 1 |
| Elenco categorie | 1 | 1 |
| Pagina categoria | 1 dinamico | 12 |
| Pagina gestionale | 1 dinamico | 54 (12-15 pubblicate al lancio) |
| Vetrina demo | 1 | 1 |
| Come funziona | 1 | 1 |
| Personalizzazioni | 1 | 1 |
| Chi sono | 1 | 1 |
| Contatti | 1 | 1 |
| Richiedi | 1 | 1 |
| Grazie (post-invio) | 1 | 1 |
| Legali | 3 | 3 |
| 404 | 1 | 1 |

**Area amministrativa — 13 pagine** · **Demo B1 — 9 schermate** (dashboard, clienti lista/dettaglio, attività lista/dettaglio, scadenze, documenti, preventivi, report).

---

## 8. Componenti riutilizzabili

### `components/ui/` — primitive
`Button` · `Card` · `Badge` · `Input` · `Textarea` · `Select` · `Checkbox` · `Modal` · `Tabs` · `Accordion` · `Tooltip` · `Breadcrumb` · `Pagination` · `Skeleton` · `EmptyState` · `Toast` · `Icon`

### `components/sito/` — sito pubblico
| Componente | Dove si usa |
|---|---|
| `Navbar` + `MegaMenuGestionali` | ovunque |
| `Footer` | ovunque |
| `Hero` | home, categoria, gestionale |
| `ProblemiGrid` | home, gestionale |
| `CategoriaCard` | home, elenco categorie |
| `GestionaleCard` | catalogo, categoria, correlati |
| `FiltriCatalogo` (+ `FiltroChip`) | catalogo |
| `PassiSection` | home, come funziona |
| `VantaggiGrid` | home, gestionale |
| `FunzioniList` | gestionale, base |
| `ModuliList` | gestionale |
| `PersonalizzazioniList` | gestionale, personalizzazioni |
| `ScreenshotGallery` + `Lightbox` | gestionale, base |
| `FaqAccordion` | gestionale, categoria, home |
| `CtaBanner` | fondo di ogni pagina |
| `BaseCollegataBox` | gestionale ("questo gestionale nasce dalla base X") |
| `DemoCta` | gestionale, catalogo |
| `FormRichiesta` (multi-step) | richiedi, contatti |
| `SezioneAlternata` | wrapper di sfondo alternato |

### `components/admin/`
`AdminShell` (sidebar+topbar) · `DataTable` (ordinamento, ricerca, paginazione) · `FormField` · `ArrayField` (per gli array `funzioni`, `problemi`…) · `StatoBadge` · `ImageUploader` · `RichiestaCard` · `ConfirmDialog` · `SalvaBar` (barra fissa in fondo con Salva/Annulla)

### `components/demo/` — lo shell dei gestionali
Questi otto componenti sono il vero investimento: costruiti una volta per B1, riusati da tutte le altre otto basi.

`DemoBanner` · `DemoShell` (sidebar+topbar+area) · `DemoSidebar` (voci da config) · `KpiCard` · `DemoTable` (filtri, ordinamento, ricerca) · `DemoDetail` (scheda a due colonne + tab) · `StatoPill` · `Timeline` (storico) · `ScadenzeWidget` · `AllegatiList` · `DemoForm`

---

## 9. Proposta grafica

L'obiettivo è che un idraulico di 55 anni apra il sito e pensi *"questa è una cosa seria"* — non *"che bel sito"*. Sobrietà, non decorazione.

### Colori

| Ruolo | Colore | Uso |
|---|---|---|
| Fondo principale | `#FFFFFF` | pagine |
| Fondo alternato | `#F7F7F5` | sezioni a fasce alterne |
| Testo principale | `#16211C` | titoli, corpo |
| Testo secondario | `#5A625C` | descrizioni, label |
| Bordi | `#E4E4DE` | card, tabelle, divisori |
| **Accento primario** | `#1E4B3A` verde profondo | link, bottoni primari, sidebar demo |
| **Accento caldo** | `#C4643C` terracotta | solo CTA principali e badge "Personalizzabile" |
| Successo / Attenzione / Errore | `#2F7D5D` · `#B8802A` · `#B3453C` | stati nelle demo |

Tre colori più i neutri. Il terracotta compare al massimo **due volte per schermata**: è quello che guida l'occhio verso l'azione. Se lo usi ovunque, non guida più niente.

### Tipografia

- **Fraunces** — solo H1 e H2 delle pagine pubbliche. Dà un'impronta editoriale riconoscibile, evita l'effetto template.
- **Inter** — tutto il resto: H3, corpo, interfaccia, tabelle, e **tutta** l'area demo e admin (dove serve leggibilità, non carattere).

Corpo 17px con interlinea 1.65 — sopra la media, perché il pubblico non è ventenne.

### Forma

Angoli 10px (card) / 8px (bottoni, input). Ombre quasi assenti: le card si definiscono con un bordo `1px #E4E4DE`, non con l'ombra. Icone `lucide-react`, tratto 1.5px, mai colorate a caso: neutre, o accento primario se attive. Griglia a 12 colonne, contenuto max 1200px, sezioni con respiro verticale generoso (80-120px).

### Cosa evitare

Niente illustrazioni stock di gente che sorride in ufficio; niente gradienti viola/blu da startup; niente animazioni di ingresso su ogni elemento; niente emoji nell'interfaccia; niente numeri inventati ("+500 aziende") finché non sono veri.

### L'elemento di credibilità

Sono **gli screenshot veri delle demo**. Una pagina di gestionale con tre schermate reali, nitide, con dati sensati, vende dieci volte più di qualsiasi testo. È un'altra ragione per cui la prima demo va costruita prima delle pagine di catalogo definitive: le sue schermate diventano il materiale visivo del sito.

---

## 10. Ordine di sviluppo

Le stime sono a giornate piene di lavoro e sono approssimative — servono a dare proporzioni, non scadenze.

### Fase 0 — Fondamenta *(2-3 giorni)*
Setup Next.js + TypeScript + Tailwind + Supabase; design tokens in `globals.css`; componenti `ui/` di base; migrazioni SQL; seed di categorie, basi e primi gestionali; deploy su Vercel con dominio provvisorio. **Fine fase: un sito vuoto ma online e pubblicabile.**

### Fase 1 — Analisi ✅
Questo documento.

### Fase 2 — Sito pubblico *(8-12 giorni)*
2.1 Navbar, footer, layout · 2.2 Home completa · 2.3 Elenco e pagine categoria · 2.4 Catalogo con filtri · 2.5 Pagina gestionale (il template più complesso) · 2.6 Come funziona, Personalizzazioni, Chi sono · 2.7 Modulo richiesta + server action + email di notifica · 2.8 SEO, sitemap, pagine legali, responsive.
**Fine fase: sito navigabile con 12-15 gestionali pubblicati, senza demo.**

### Fase 3 — Area amministrativa *(5-7 giorni)*
Login, dashboard, CRUD categorie/gestionali/basi/FAQ, gestione richieste con cambio stato e note, upload immagini, editor contenuti home.
**Fine fase: non tocchi più il codice per aggiungere un gestionale.**

### Fase 4 — Prima demo *(8-12 giorni)*
Shell demo riutilizzabile + Base 1 completa con dati finti realistici + screenshot inseriti nelle pagine dei 13 gestionali collegati.
**Fine fase: il sito converte davvero.**

### Fase 5 — Altre basi *(3-5 giorni ciascuna)*
Ordine consigliato, per copertura decrescente e per vicinanza alla tua esperienza:

**B3 Interventi** (8) → **B2 Commesse** (7, include il modulo SAL/ritenuta a garanzia che ti interessa) → **B6 Immobiliare** (3, ma è il tuo dominio e hai già gestionale-v3 da cui attingere) → **B5 Personale e turni** (5) → **B4 Appuntamenti** (5) → **B9 Corsi e iscrizioni** (7) → **B8 Prenotazioni** (4) → **B7 Magazzino** (2).

> B6 è messo terzo pur avendo solo 3 gestionali perché è il settore in cui puoi vendere subito e sai esattamente cosa serve.

**Dalla Fase 2 in poi ogni fase finisce online.** Non aspettare la fine di tutto per pubblicare: il sito senza demo può già ricevere richieste.

---

## 11. Prima demo da realizzare

### Raccomandazione: **Base 1 — Clienti e attività**

Hai lasciato la scelta fra questa e l'immobiliare. Scelgo Clienti e attività per tre motivi:

**È il generatore di schema.** Dashboard, anagrafica, entità operativa, scadenzario, documenti, report: è lo scheletro comune a tutte e nove le basi, nella sua forma più pulita. Costruendola costruisci `components/demo/` per intero, e le basi successive costano un terzo.

**Copre 13 gestionali su 54** — un quarto del catalogo si accende con una sola demo. L'immobiliare ne accende 3.

**È la più semplice**, quindi la prima ha meno probabilità di impantanarsi. La prima demo è quella in cui sbagli le scelte di architettura: meglio sbagliarle su un dominio semplice.

### Perché *non* l'immobiliare per prima

È il tuo dominio più forte, ed è esattamente per questo che è una trappola: è anche il più complesso (immobili → unità → subalterni → contratti → canoni → scadenze → manutenzioni). Rischi di passare tre settimane sulla prima demo perché conosci troppo bene tutti i casi particolari. Inoltre gestionale-v3 è su un altro stack: non è codice da copiare, è conoscenza da riusare — e quella non scade.

**L'immobiliare come terza base**, dopo Interventi, quando lo shell è collaudato e puoi versarci dentro tutto quello che sai senza combattere anche con l'architettura.

### Demo di partenza: *Studio Rossi — consulenza aziendale*

8 clienti finti, 20 attività in stati diversi, 6 scadenze (di cui 2 in ritardo, in rosso — serve a mostrare il valore), 12 documenti, 4 preventivi. Dati italiani, plausibili, con nomi che non sembrano generati a caso.

---

## 12. Decisioni aperte

Cinque cose che decidi tu prima che io inizi la Fase 0.

1. **Base 9 (Corsi e iscrizioni)**: la aggiungiamo o mappiamo Sport e formazione altrove accettando che siano adattamenti forzati?
2. **Quanti gestionali pubblicare al lancio**: confermi 12-15, o preferisci tutti e 54 anche a costo di rimandare il lancio di mesi?
3. **Nome e dominio del progetto**: serve prima del deploy. Il nome del marchio è anche il tono del sito.
4. **Chi sono**: vuoi presentarti come persona (il tuo percorso, l'esperienza in ufficio tecnico-amministrativo) o come studio/azienda? Per questo pubblico la persona funziona meglio, ma è una tua scelta.
5. **Prezzi**: il sito li mostra (anche solo "a partire da"), oppure tutto passa da preventivo? Non mostrare nulla riduce le richieste ma le rende più qualificate; mostrare qualcosa fa il contrario.

---

*Fine analisi Fase 1. In attesa di conferma per iniziare la Fase 0.*
