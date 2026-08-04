import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Salvataggio delle richieste di contatto.
 *
 * Se le variabili Supabase sono configurate (vedi .env.example) la richiesta
 * viene scritta nella tabella `richieste`. Altrimenti — tipicamente in locale,
 * prima di aver creato il progetto Supabase — viene appesa a
 * .richieste-locali.jsonl nella cartella del progetto, così il modulo è
 * comunque provabile davvero e nessuna richiesta va persa in silenzio.
 */

const FILE_LOCALE = path.join(process.cwd(), ".richieste-locali.jsonl");

function supabaseConfigurato() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function salvaSuSupabase(richiesta) {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const { error } = await client.from("richieste").insert({
    nome: richiesta.nome,
    azienda: richiesta.azienda || null,
    settore: richiesta.settore || null,
    email: richiesta.email,
    telefono: richiesta.telefono || null,
    gestionale_interesse: richiesta.gestionaleInteresse || null,
    numero_utenti: richiesta.numeroUtenti || null,
    strumenti_attuali: richiesta.strumentiAttuali || [],
    difficolta: richiesta.difficolta || null,
    funzioni_necessarie: richiesta.funzioniNecessarie || null,
    dati_da_importare: richiesta.datiDaImportare || null,
    personalizzazioni: richiesta.personalizzazioni || null,
    messaggio: richiesta.messaggio || null,
    consenso_privacy: richiesta.consensoPrivacy,
  });

  if (error) throw new Error(error.message);
}

async function salvaSuFile(richiesta) {
  const riga = JSON.stringify({ ...richiesta, ricevutaIl: new Date().toISOString() });
  await fs.appendFile(FILE_LOCALE, `${riga}\n`, "utf8");
}

/**
 * @param {Object} richiesta dati già validati
 * @returns {Promise<"supabase"|"file">} dove è stata salvata
 */
export async function salvaRichiesta(richiesta) {
  if (supabaseConfigurato()) {
    await salvaSuSupabase(richiesta);
    return "supabase";
  }
  await salvaSuFile(richiesta);
  return "file";
}
