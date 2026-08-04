# Far arrivare davvero le richieste

Oggi il modulo "Richiedi il tuo gestionale" funziona, ma **solo quando il sito
gira sul tuo computer**: le richieste finiscono in un file. Online no — il
disco di Vercel è di sola lettura, quindi chi compila il modulo riceve un
errore e la richiesta non arriva a nessuno.

Per sistemarlo serve un archivio esterno. Usiamo Supabase: è gratuito per
quello che ci serve e il codice è già scritto e collegato.

Sono **dieci minuti**, una volta sola.

---

## 1 · Crea il progetto (3 minuti)

1. Vai su **supabase.com** e crea un account (va bene entrare con GitHub).
2. Premi **New project**.
3. Compila:
   - **Name**: `gestionisumisura`
   - **Database password**: premi *Generate a password* e **salvala** nel tuo
     gestore di password. Non serve per il sito, ma se la perdi non si recupera.
   - **Region**: `Central EU (Frankfurt)` — è la più vicina.
4. Premi **Create new project** e aspetta un paio di minuti che finisca.

---

## 2 · Crea le tabelle (2 minuti)

1. Nel menu a sinistra apri **SQL Editor**.
2. Premi **New query**.
3. Apri sul tuo computer il file
   `supabase/migrations/0001_schema_iniziale.sql`, copia **tutto** il
   contenuto e incollalo nel riquadro.
4. Premi **Run** (in basso a destra).

Deve comparire *Success. No rows returned*. Se compare un errore rosso,
mandamelo e lo guardiamo.

Da qui in poi, in **Table Editor**, vedrai la tabella `richieste` vuota.

---

## 3 · Copia le due chiavi (1 minuto)

Nel menu a sinistra: **Project Settings** → **API**.

Ti servono due valori:

| Dove lo trovi | Come si chiamerà su Vercel |
|---|---|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **Service role** (sotto *Project API keys*, va rivelata con l'occhio) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **La chiave *service role* è come la chiave di casa.** Non incollarla in
> chat, non mandarla per email, non metterla in un file del progetto. Va
> scritta soltanto dentro Vercel, dove resta nascosta. Se per sbaglio finisce
> in giro, da Supabase la si rigenera in un clic.

---

## 4 · Incollale su Vercel (2 minuti)

1. Apri **vercel.com**, entra nel progetto **MULTI-GESTIONALI**.
2. **Settings** → **Environment Variables**.
3. Aggiungi la prima:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: il Project URL copiato prima
   - Spunta tutti e tre gli ambienti (Production, Preview, Development)
   - **Save**
4. Aggiungi la seconda allo stesso modo, con `SUPABASE_SERVICE_ROLE_KEY`.
5. Vai su **Deployments**, apri l'ultimo e premi **Redeploy**.

Le variabili si leggono solo quando il sito viene ricostruito: senza il
redeploy non cambia niente.

---

## 5 · Prova che funzioni (2 minuti)

1. Apri il sito online e vai su **Richiedi il tuo gestionale**.
2. Compila il modulo con i tuoi dati e invialo.
3. Torna su Supabase, **Table Editor** → tabella `richieste`: la riga deve
   esserci.

Fatto. Da adesso ogni richiesta resta lì e non si perde.

---

## E l'area amministrativa?

`/admin/richieste` legge dallo stesso archivio: quando le chiavi ci sono,
in alto a destra compare la pastiglia verde **"Archivio online"** invece di
quella arancione **"File sul computer"**.

Sul sito online l'amministrazione resta in **sola lettura**: puoi leggere le
richieste, ma per modificare i testi dei gestionali serve ancora far girare
il sito sul tuo computer. È una scelta di sicurezza — l'area non ha ancora
una password.

---

## Se qualcosa non torna

**Il modulo dà errore anche dopo il redeploy.**
Quasi sempre è una chiave incollata con uno spazio davanti o dietro.
Riaprila su Vercel e ricontrolla.

**La riga non compare nella tabella.**
Controlla di aver eseguito il file SQL nel progetto giusto: se hai creato più
progetti Supabase, le chiavi devono essere quelle dello stesso.

**Vuoi essere avvisata per email quando arriva una richiesta.**
Si fa, ma è un altro pezzo: serve un servizio di invio email. Dimmelo e lo
aggiungiamo.
