"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { salva, ripristina } from "@/lib/contenuti-store";

/* Un campo per riga: è così che si scrivono gli elenchi nei moduli. */
const righe = (testo) =>
  String(testo || "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

const schemaGestionale = z.object({
  nome: z.string().trim().min(3).max(120),
  sottotitolo: z.string().trim().max(300),
  descrizione: z.string().trim().max(6000),
  stato: z.enum(["bozza", "pubblicato"]),
  ordine: z.coerce.number().int().min(0).max(999),
  metaTitle: z.string().trim().max(120),
  metaDescription: z.string().trim().max(300),
});

/**
 * Salva la scheda di un gestionale.
 * @returns {Promise<{ok: boolean, messaggio: string}>}
 */
export async function salvaGestionale(_precedente, formData) {
  const slug = String(formData.get("slug") || "");
  if (!slug) return { ok: false, messaggio: "Manca il riferimento al gestionale." };

  const esito = schemaGestionale.safeParse({
    nome: formData.get("nome"),
    sottotitolo: formData.get("sottotitolo"),
    descrizione: formData.get("descrizione"),
    stato: formData.get("stato"),
    ordine: formData.get("ordine"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
  });

  if (!esito.success) {
    return { ok: false, messaggio: "Controlla i campi: qualcosa non va." };
  }

  try {
    await salva("gestionali", slug, {
      ...esito.data,
      problemi: righe(formData.get("problemi")),
      funzioni: righe(formData.get("funzioni")),
      moduli: righe(formData.get("moduli")),
      moduliAggiuntivi: righe(formData.get("moduliAggiuntivi")),
      personalizzazioni: righe(formData.get("personalizzazioni")),
      utenti: righe(formData.get("utenti")),
    });
    revalidatePath("/", "layout");
    return { ok: true, messaggio: "Salvato." };
  } catch (errore) {
    return { ok: false, messaggio: errore.message };
  }
}

/** Pubblica o rimette in bozza, dall'elenco. */
export async function cambiaStato(_precedente, formData) {
  const slug = String(formData.get("slug") || "");
  const stato = formData.get("stato") === "pubblicato" ? "pubblicato" : "bozza";
  try {
    await salva("gestionali", slug, { stato });
    revalidatePath("/", "layout");
    return { ok: true, messaggio: stato === "pubblicato" ? "Pubblicato." : "Rimesso in bozza." };
  } catch (errore) {
    return { ok: false, messaggio: errore.message };
  }
}

/** Attiva o disattiva la demo su un gestionale. */
export async function cambiaDemo(_precedente, formData) {
  const slug = String(formData.get("slug") || "");
  const attiva = formData.get("demo") === "1";
  try {
    await salva("gestionali", slug, { demoDisponibile: attiva });
    revalidatePath("/", "layout");
    return { ok: true, messaggio: attiva ? "Demo attivata." : "Demo disattivata." };
  } catch (errore) {
    return { ok: false, messaggio: errore.message };
  }
}

const schemaCategoria = z.object({
  nome: z.string().trim().min(3).max(120),
  sottotitolo: z.string().trim().max(300),
  descrizione: z.string().trim().max(3000),
  ordine: z.coerce.number().int().min(0).max(99),
  pubblicata: z.coerce.boolean(),
});

export async function salvaCategoria(_precedente, formData) {
  const slug = String(formData.get("slug") || "");
  const esito = schemaCategoria.safeParse({
    nome: formData.get("nome"),
    sottotitolo: formData.get("sottotitolo"),
    descrizione: formData.get("descrizione"),
    ordine: formData.get("ordine"),
    pubblicata: formData.get("pubblicata") === "on",
  });
  if (!esito.success) return { ok: false, messaggio: "Controlla i campi." };
  try {
    await salva("categorie", slug, esito.data);
    revalidatePath("/", "layout");
    return { ok: true, messaggio: "Salvato." };
  } catch (errore) {
    return { ok: false, messaggio: errore.message };
  }
}

/** Rimette un elemento com'era nei file di partenza. */
export async function annullaModifiche(_precedente, formData) {
  const collezione = String(formData.get("collezione") || "");
  const slug = String(formData.get("slug") || "");
  if (!["gestionali", "categorie", "basi"].includes(collezione)) {
    return { ok: false, messaggio: "Collezione non valida." };
  }
  try {
    await ripristina(collezione, slug);
    revalidatePath("/", "layout");
    return { ok: true, messaggio: "Ripristinato il testo di partenza." };
  } catch (errore) {
    return { ok: false, messaggio: errore.message };
  }
}
