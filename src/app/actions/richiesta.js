"use server";

import { z } from "zod";
import { salvaRichiesta } from "@/lib/richieste";

const schema = z.object({
  nome: z.string().trim().min(2, "Scrivi il tuo nome").max(120),
  azienda: z.string().trim().max(160).optional().or(z.literal("")),
  settore: z.string().trim().max(160).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(200)
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), {
      message: "Controlla l'indirizzo email",
    }),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  gestionaleInteresse: z.string().trim().max(200).optional().or(z.literal("")),
  numeroUtenti: z.string().trim().max(40).optional().or(z.literal("")),
  strumentiAttuali: z.array(z.string().max(60)).max(12),
  difficolta: z.string().trim().max(2000).optional().or(z.literal("")),
  funzioniNecessarie: z.string().trim().max(2000).optional().or(z.literal("")),
  datiDaImportare: z.string().trim().max(2000).optional().or(z.literal("")),
  personalizzazioni: z.string().trim().max(2000).optional().or(z.literal("")),
  messaggio: z.string().trim().max(4000).optional().or(z.literal("")),
  consensoPrivacy: z.boolean().refine((v) => v === true, {
    message: "Serve il consenso per poterti rispondere",
  }),
});

/**
 * Server action del modulo "Richiedi il tuo gestionale".
 * @returns {Promise<{ok: boolean, errori?: Record<string,string>, messaggio?: string}>}
 */
export async function inviaRichiesta(_statoPrecedente, formData) {
  // Campo trappola: se è pieno è quasi certamente un bot. Rispondiamo ok senza salvare.
  if (formData.get("indirizzo")) {
    return { ok: true };
  }

  const grezzi = {
    nome: formData.get("nome") || "",
    azienda: formData.get("azienda") || "",
    settore: formData.get("settore") || "",
    email: formData.get("email") || "",
    telefono: formData.get("telefono") || "",
    gestionaleInteresse: formData.get("gestionaleInteresse") || "",
    numeroUtenti: formData.get("numeroUtenti") || "",
    strumentiAttuali: formData.getAll("strumentiAttuali").map(String),
    difficolta: formData.get("difficolta") || "",
    funzioniNecessarie: formData.get("funzioniNecessarie") || "",
    datiDaImportare: formData.get("datiDaImportare") || "",
    personalizzazioni: formData.get("personalizzazioni") || "",
    messaggio: formData.get("messaggio") || "",
    consensoPrivacy: formData.get("consensoPrivacy") === "on",
  };

  const esito = schema.safeParse(grezzi);

  if (!esito.success) {
    const errori = {};
    for (const problema of esito.error.issues) {
      const campo = problema.path[0];
      if (campo && !errori[campo]) errori[campo] = problema.message;
    }
    return { ok: false, errori, messaggio: "Controlla i campi segnalati." };
  }

  try {
    await salvaRichiesta(esito.data);
    return { ok: true };
  } catch (errore) {
    console.error("Salvataggio richiesta non riuscito:", errore);
    return {
      ok: false,
      messaggio:
        "Non siamo riusciti a registrare la richiesta. Riprova fra poco oppure scrivi direttamente via email.",
    };
  }
}
