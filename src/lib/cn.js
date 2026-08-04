import { extendTailwindMerge } from "tailwind-merge";

/**
 * Unisce classi Tailwind risolvendo i conflitti: l'ultima vince davvero.
 *
 * Serve per due motivi:
 *
 * 1. senza, `<Bottone className="hidden sm:inline-flex">` non nascondeva niente,
 *    perché la classe `inline-flex` interna al componente restava valida;
 *
 * 2. la nostra scala tipografica ha nomi nostri (text-corrente, text-t1…) che
 *    tailwind-merge non conosce: senza dichiararli qui li scambiava per colori
 *    di testo e cancellava il `text-white` dei bottoni.
 */
const DIMENSIONI_TESTO = [
  "micro",
  "mini",
  "piccolo",
  "corrente",
  "testo",
  "guida",
  "t3",
  "t2",
  "t1",
  "titolo",
  "mega",
  "eroe",
];

const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: DIMENSIONI_TESTO }],
      rounded: [{ rounded: ["[var(--radius-controllo)]", "[var(--radius-scheda)]"] }],
    },
  },
});

export function cn(...classi) {
  return merge(classi.filter(Boolean).join(" "));
}
