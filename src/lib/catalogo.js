import { categorie } from "@/data/seed/categorie";
import { basi, funzionalita } from "@/data/seed/basi";
import { gestionaliImmobiliEdilizia } from "@/data/seed/gestionali/immobili-edilizia";
import { gestionaliManutenzioneServizi } from "@/data/seed/gestionali/manutenzione-servizi";
import { gestionaliStudiCommercio } from "@/data/seed/gestionali/studi-commercio";
import { gestionaliTrasportiBellezzaSport } from "@/data/seed/gestionali/trasporti-bellezza-sport";
import { gestionaliTurismoEventiAssociazioni } from "@/data/seed/gestionali/turismo-eventi-associazioni";

/**
 * Accesso al catalogo.
 *
 * Oggi i dati arrivano dai file in src/data/seed.
 * Quando l'area amministrativa sarà pronta, basta riscrivere le funzioni di
 * questo file perché leggano da Supabase: il resto del sito non cambia.
 *
 * @typedef {Object} Categoria
 * @property {string} slug
 * @property {string} nome
 * @property {string} sottotitolo
 * @property {string} descrizione
 * @property {string} icona           nome dell'icona lucide-react
 * @property {string} colore          chiave colore (vedi globals.css)
 * @property {number} ordine
 * @property {boolean} pubblicata
 *
 * @typedef {Object} Base
 * @property {string} slug
 * @property {string} nome
 * @property {string} descrizione
 * @property {string[]} adattoA
 * @property {string[]} funzioni
 * @property {string[]} entita
 * @property {string|null} demoPath
 * @property {boolean} demoPronta
 * @property {number} ordine
 *
 * @typedef {Object} Gestionale
 * @property {string} slug
 * @property {string} nome
 * @property {string} sottotitolo
 * @property {string} categoriaSlug
 * @property {string} baseSlug
 * @property {string[]} moduliAggiuntivi
 * @property {string} descrizione
 * @property {string[]} problemi
 * @property {string[]} funzioni
 * @property {string[]} moduli
 * @property {string[]} personalizzazioni
 * @property {string[]} utenti
 * @property {{titolo: string, testo: string}[]} vantaggi
 * @property {{domanda: string, risposta: string}[]} faq
 * @property {string[]} funzionalita
 * @property {"bozza"|"pubblicato"} stato
 * @property {boolean} demoDisponibile
 * @property {number} ordine
 * @property {string} metaTitle
 * @property {string} metaDescription
 */

/** Tutti i gestionali, bozze incluse. Da usare solo lato amministrazione. */
const tuttiIGestionali = [
  ...gestionaliImmobiliEdilizia,
  ...gestionaliManutenzioneServizi,
  ...gestionaliStudiCommercio,
  ...gestionaliTrasportiBellezzaSport,
  ...gestionaliTurismoEventiAssociazioni,
];

const perOrdine = (a, b) => a.ordine - b.ordine;

/* ------------------------------------------------------------------ */
/*  Categorie                                                          */
/* ------------------------------------------------------------------ */

/** @returns {Categoria[]} categorie pubblicate, in ordine */
export function getCategorie() {
  return categorie.filter((c) => c.pubblicata).sort(perOrdine);
}

/** @returns {Categoria|undefined} */
export function getCategoria(slug) {
  return categorie.find((c) => c.slug === slug && c.pubblicata);
}

/* ------------------------------------------------------------------ */
/*  Basi                                                               */
/* ------------------------------------------------------------------ */

/** @returns {Base[]} */
export function getBasi() {
  return [...basi].sort(perOrdine);
}

/** @returns {Base|undefined} */
export function getBase(slug) {
  return basi.find((b) => b.slug === slug);
}

/* ------------------------------------------------------------------ */
/*  Gestionali                                                         */
/* ------------------------------------------------------------------ */

/** @returns {Gestionale[]} solo i gestionali pubblicati */
export function getGestionali() {
  return tuttiIGestionali.filter((g) => g.stato === "pubblicato");
}

/** @returns {Gestionale|undefined} */
export function getGestionale(slug) {
  return tuttiIGestionali.find((g) => g.slug === slug && g.stato === "pubblicato");
}

/** @returns {Gestionale[]} gestionali pubblicati di una categoria, in ordine */
export function getGestionaliPerCategoria(categoriaSlug) {
  return getGestionali()
    .filter((g) => g.categoriaSlug === categoriaSlug)
    .sort(perOrdine);
}

/** @returns {Gestionale[]} gestionali pubblicati che partono da una certa base */
export function getGestionaliPerBase(baseSlug) {
  return getGestionali()
    .filter((g) => g.baseSlug === baseSlug)
    .sort(perOrdine);
}

/**
 * Fino a `limite` gestionali affini a quello indicato:
 * prima gli altri della stessa categoria, poi quelli che condividono la base.
 * @returns {Gestionale[]}
 */
export function getGestionaliCorrelati(gestionale, limite = 3) {
  const stessaCategoria = getGestionaliPerCategoria(gestionale.categoriaSlug).filter(
    (g) => g.slug !== gestionale.slug,
  );
  const stessaBase = getGestionaliPerBase(gestionale.baseSlug).filter(
    (g) => g.slug !== gestionale.slug && !stessaCategoria.some((s) => s.slug === g.slug),
  );
  return [...stessaCategoria, ...stessaBase].slice(0, limite);
}

/* ------------------------------------------------------------------ */
/*  Viste aggregate                                                    */
/* ------------------------------------------------------------------ */

/** Quanti gestionali pubblicati ha una categoria */
export function contaGestionali(categoriaSlug) {
  return getGestionaliPerCategoria(categoriaSlug).length;
}

/** Categorie pubblicate che hanno almeno un gestionale pubblicato */
export function getCategorieConGestionali() {
  return getCategorie()
    .map((c) => ({ ...c, totale: contaGestionali(c.slug) }))
    .filter((c) => c.totale > 0);
}

/** Elenco dei filtri disponibili nel catalogo */
export function getFunzionalita() {
  return funzionalita;
}

/** Numeri reali usati nelle intestazioni del sito */
export function getStatistiche() {
  const gestionali = getGestionali();
  return {
    gestionali: gestionali.length,
    categorie: getCategorieConGestionali().length,
    basi: basi.length,
    inArrivo: tuttiIGestionali.length - gestionali.length,
  };
}
