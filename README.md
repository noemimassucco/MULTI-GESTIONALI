# GestioniSuMisura

Sito vetrina del catalogo di gestionali su misura per piccole aziende, professionisti e artigiani.

Tre parti, tenute separate fin dall'inizio: il **sito pubblico** (fatto), l'**area amministrativa**
per gestire i contenuti (da fare), le **demo dei gestionali** (da fare).

---

## Avvio in locale

```bash
npm install
npm run dev
```

Il sito parte su http://localhost:3000

Altri comandi:

```bash
npm run build   # build di produzione
npm start       # avvia la build di produzione
npm run lint    # controllo del codice
```

---

## Come è fatto

- **Next.js 16** con App Router — React, JavaScript puro (niente TypeScript)
- **Tailwind CSS 4** — i colori e i font stanno tutti in `src/app/globals.css`
- **Supabase** — previsto per database, autenticazione e archiviazione (non ancora collegato)
- Font ospitati nel progetto (`@fontsource-variable`): il build non chiama Google Fonts

### Cartelle

```
src/
├── app/
│   ├── (legali)/          privacy, cookie, note legali
│   ├── actions/           server action del modulo richiesta
│   ├── categorie/         elenco e pagina di categoria
│   ├── gestionali/        catalogo e pagina di ogni gestionale
│   ├── chi-sono/  come-funziona/  contatti/  demo/  personalizzazioni/  richiedi/
│   ├── layout.jsx         intelaiatura comune: navbar, barra laterale, piè di pagina
│   ├── globals.css        COLORI E FONT DI TUTTO IL SITO
│   ├── sitemap.js  robots.js  not-found.jsx
│
├── components/
│   ├── ui/                mattoni riutilizzabili (bottone, pastiglia, sezione, icona)
│   └── sito/              componenti del sito pubblico
│
├── data/seed/             IL CATALOGO: categorie, basi, 54 gestionali
│   ├── categorie.js
│   ├── basi.js
│   └── gestionali/        cinque file, raggruppati per categoria
│
├── lib/
│   ├── catalogo.js        tutte le letture del catalogo passano da qui
│   ├── sito.js            marchio, email, voci di menu
│   └── richieste.js       salvataggio delle richieste ricevute
│
supabase/migrations/       schema SQL da eseguire su Supabase
```

---

## Modificare i contenuti

Finché l'area amministrativa non è pronta, il catalogo si modifica nei file dentro
`src/data/seed/`. Sono normali file JavaScript: si aprono, si cambia il testo, si salva.

**Per pubblicare un gestionale** che è ancora in bozza, cerca il suo `slug` in
`src/data/seed/gestionali/` e cambia:

```js
stato: "bozza"   →   stato: "pubblicato"
```

Un gestionale in bozza non compare da nessuna parte sul sito: né nel catalogo, né nelle
categorie, né nella mappa del sito.

**Per cambiare i colori** apri `src/app/globals.css`: il blu del marchio è in `--color-brand-*`,
i colori delle categorie sono le variabili `--cat-*`. Non ci sono colori scritti a mano altrove.

**Per cambiare email, nome o voci di menu** apri `src/lib/sito.js`.

---

## Stato del progetto

| Parte | Stato |
|---|---|
| Sito pubblico | fatto |
| Catalogo: 12 categorie, 9 basi, 54 gestionali | fatto (18 pubblicati, 36 in bozza) |
| Modulo di richiesta con validazione e anti-bot | fatto |
| Schema del database | scritto, non ancora eseguito |
| Area amministrativa | da fare |
| Demo dei gestionali | da fare — la prima sarà la base "Clienti e attività" |

Nessun pulsante finto: dove una demo non esiste, il sito lo dice invece di fingerla.

---

## Prima della pubblicazione

Queste cose vanno completate, altrimenti il sito non è pubblicabile:

1. **Dati fiscali nelle pagine legali.** In `src/app/(legali)/` ci sono dei
   `[DA COMPLETARE PRIMA DELLA PUBBLICAZIONE]`: ragione sociale, indirizzo, partita IVA, e i nomi
   dei fornitori usati per hosting e database. Fai anche controllare i testi a un consulente:
   sono una base ragionevole, non un parere legale.
2. **Email e dominio reali.** In `src/lib/sito.js` e in `.env.example`.
3. **Supabase.** Vedi sotto.

---

## Collegare Supabase

Finché le variabili non sono impostate, le richieste inviate dal modulo vengono salvate in
`.richieste-locali.jsonl` nella cartella del progetto — funziona davvero, ma è pensato solo per
le prove in locale.

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Apri **SQL Editor** ed esegui `supabase/migrations/0001_schema_iniziale.sql`
3. Copia `.env.example` in `.env.local` e riempi:

```
NEXT_PUBLIC_SITE_URL=https://iltuodominio.it
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> `SUPABASE_SERVICE_ROLE_KEY` non deve mai finire in una pagina né su GitHub: sta solo nelle
> variabili d'ambiente del server. `.env.local` è già escluso dal repository.

---

## Pubblicare online

Consigliato **Vercel**, che è la piattaforma di chi fa Next.js:

1. Collega il repository GitHub
2. Inserisci le stesse variabili d'ambiente nelle impostazioni del progetto
3. Ogni push sul ramo principale pubblica automaticamente

Il build non richiede accesso a internet per i font, quindi funziona anche in ambienti chiusi.
