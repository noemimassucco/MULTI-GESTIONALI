import { z } from "zod";

/**
 * Le regole dei moduli della demo, in un posto solo.
 *
 * Zod resta l'unica fonte della validazione: gli stessi schemi valgono
 * per il modulo nel browser (react-hook-form li usa tramite il resolver)
 * e per qualsiasi controllo lato server che verrà dopo.
 *
 * I messaggi sono scritti per chi li legge, non per chi li ha scritti.
 */

const numeroPositivo = (etichetta) =>
  z.coerce
    .number({ message: `${etichetta}: scrivi un numero.` })
    .positive(`${etichetta}: dev'essere maggiore di zero.`);

/** Nuova variante di cantiere. */
export const schemaVariante = z.object({
  commessaId: z.string().min(1, "Scegli su quale cantiere è stato fatto il lavoro."),
  titolo: z
    .string()
    .trim()
    .min(3, "Scrivi in due parole cosa è stato fatto in più.")
    .max(160, "Troppo lungo: la descrizione va nel campo sotto."),
  descrizione: z.string().trim().max(1200, "Troppo lungo.").optional(),
  importo: numeroPositivo("Prezzo al cliente"),
  costoStimato: z.coerce
    .number({ message: "Costo: scrivi un numero." })
    .min(0, "Il costo non può essere negativo.")
    .optional(),
});

/** Registrazione delle ore di una squadra su un cantiere. */
export const schemaOre = z.object({
  commessaId: z.string().min(1, "Scegli il cantiere su cui sono state fatte le ore."),
  squadraId: z.string().min(1, "Scegli quale squadra c'era."),
  fase: z.string().optional(),
  ore: numeroPositivo("Ore").max(400, "Ore: più di 400 in una settimana non tornano."),
});
