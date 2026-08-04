import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { categorie as categorieSeed } from "@/data/seed/categorie";
import { basi as basiSeed } from "@/data/seed/basi";
import { gestionaliImmobiliEdilizia } from "@/data/seed/gestionali/immobili-edilizia";
import { gestionaliManutenzioneServizi } from "@/data/seed/gestionali/manutenzione-servizi";
import { gestionaliStudiCommercio } from "@/data/seed/gestionali/studi-commercio";
import { gestionaliTrasportiBellezzaSport } from "@/data/seed/gestionali/trasporti-bellezza-sport";
import { gestionaliTurismoEventiAssociazioni } from "@/data/seed/gestionali/turismo-eventi-associazioni";

/**
 * Archivio dei contenuti modificabili dall'area amministrativa.
 *
 * COME FUNZIONA, detto chiaro:
 * i testi di partenza restano nei file di src/data/seed. Quello che modifichi
 * dall'amministrazione finisce in un unico file, src/data/contenuti.json, che
 * viene sovrapposto ai testi di partenza: cambia solo ciò che hai toccato.
 *
 * Il file va poi committato come qualsiasi altra modifica. È il motivo per cui
 * l'amministrazione funziona quando il sito gira sul tuo computer (npm run dev)
 * e non quando è pubblicato online: là il disco è di sola lettura.
 * Quando collegheremo Supabase, cambierà solo questo file.
 */

const PERCORSO = path.join(process.cwd(), "src", "data", "contenuti.json");

const gestionaliSeed = [
  ...gestionaliImmobiliEdilizia,
  ...gestionaliManutenzioneServizi,
  ...gestionaliStudiCommercio,
  ...gestionaliTrasportiBellezzaSport,
  ...gestionaliTurismoEventiAssociazioni,
];

/** Vero se il disco è scrivibile: falso quando il sito è pubblicato online. */
export function modificheAbilitate() {
  return process.env.NODE_ENV !== "production" || process.env.ABILITA_AMMINISTRAZIONE === "1";
}

async function leggiSovrapposizioni() {
  try {
    return JSON.parse(await fs.readFile(PERCORSO, "utf8"));
  } catch {
    return { gestionali: {}, categorie: {}, basi: {} };
  }
}

async function scriviSovrapposizioni(dati) {
  await fs.mkdir(path.dirname(PERCORSO), { recursive: true });
  await fs.writeFile(PERCORSO, `${JSON.stringify(dati, null, 2)}\n`, "utf8");
}

const unisci = (base, sopra) => (sopra ? { ...base, ...sopra } : base);

/* ------------------------------------------------------------------ */
/*  Letture                                                            */
/* ------------------------------------------------------------------ */

export async function tuttiIGestionali() {
  const { gestionali = {} } = await leggiSovrapposizioni();
  return gestionaliSeed
    .map((g) => unisci(g, gestionali[g.slug]))
    .sort((a, b) => a.categoriaSlug.localeCompare(b.categoriaSlug) || a.ordine - b.ordine);
}

export async function unGestionale(slug) {
  return (await tuttiIGestionali()).find((g) => g.slug === slug);
}

export async function tutteLeCategorie() {
  const { categorie = {} } = await leggiSovrapposizioni();
  return categorieSeed.map((c) => unisci(c, categorie[c.slug])).sort((a, b) => a.ordine - b.ordine);
}

export async function tutteLeBasi() {
  const { basi = {} } = await leggiSovrapposizioni();
  return basiSeed.map((b) => unisci(b, basi[b.slug])).sort((a, b) => a.ordine - b.ordine);
}

/* ------------------------------------------------------------------ */
/*  Scritture                                                          */
/* ------------------------------------------------------------------ */

/**
 * Salva le modifiche di un elemento.
 * @param {"gestionali"|"categorie"|"basi"} collezione
 * @param {string} slug
 * @param {object} campi solo i campi cambiati
 */
export async function salva(collezione, slug, campi) {
  if (!modificheAbilitate()) {
    throw new Error(
      "Le modifiche sono disponibili solo quando il sito gira sul tuo computer.",
    );
  }
  const dati = await leggiSovrapposizioni();
  dati[collezione] = dati[collezione] || {};
  dati[collezione][slug] = { ...(dati[collezione][slug] || {}), ...campi };
  await scriviSovrapposizioni(dati);
}

/** Rimette un elemento com'era nei file di partenza. */
export async function ripristina(collezione, slug) {
  if (!modificheAbilitate()) throw new Error("Modifiche non disponibili qui.");
  const dati = await leggiSovrapposizioni();
  if (dati[collezione]) delete dati[collezione][slug];
  await scriviSovrapposizioni(dati);
}

/** Quante modifiche non sono ancora state riportate nei file di partenza. */
export async function contaModifiche() {
  const d = await leggiSovrapposizioni();
  return ["gestionali", "categorie", "basi"].reduce(
    (n, k) => n + Object.keys(d[k] || {}).length,
    0,
  );
}

/* ------------------------------------------------------------------ */
/*  Richieste ricevute dal modulo del sito                             */
/* ------------------------------------------------------------------ */

export async function richiesteRicevute() {
  try {
    const testo = await fs.readFile(
      path.join(process.cwd(), ".richieste-locali.jsonl"),
      "utf8",
    );
    return testo
      .split("\n")
      .filter(Boolean)
      .map((riga, i) => {
        try {
          return { id: `r${i}`, ...JSON.parse(riga) };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .reverse();
  } catch {
    return [];
  }
}
