"use client";

import { Toaster } from "sonner";

/**
 * Gli avvisi brevi: "salvato", "fattura registrata", "demo ripristinata".
 * Compaiono in basso a destra e se ne vanno da soli.
 *
 * Regola d'uso: solo quando qualcosa è successo davvero e non si vede
 * altrove. Non a ogni clic.
 */
export default function Avvisi() {
  return (
    <Toaster
      position="bottom-right"
      offset={20}
      gap={10}
      duration={3600}
      toastOptions={{
        classNames: {
          toast:
            "rounded-[var(--radius-scheda)] border border-line bg-white px-4 py-3 shadow-[var(--shadow-lift)]",
          title: "text-corrente font-semibold text-ink-900",
          description: "mt-0.5 text-piccolo leading-relaxed text-ink-600",
          icon: "text-brand-600",
        },
      }}
    />
  );
}
