"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { barraLaterale } from "@/lib/sito";
import Icona from "@/components/ui/Icona";

/**
 * Colonna di icone fissa a sinistra (solo da xl in su).
 * Contiene esclusivamente destinazioni che esistono davvero.
 */
export default function BarraLaterale() {
  const percorso = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[var(--rail)] flex-col items-center gap-1 border-r border-line bg-white pt-4 2xl:flex">
      {barraLaterale.map((voce) => {
        const attivo =
          voce.href === "/" ? percorso === "/" : percorso.startsWith(voce.href);
        return (
          <Link
            key={voce.href}
            href={voce.href}
            title={voce.label}
            data-comando
            className={`group flex w-[60px] flex-col items-center gap-1 rounded-[var(--radius-controllo)] py-2.5 transition-colors ${
              attivo ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-surface-alt hover:text-ink-800"
            }`}
          >
            <Icona misura="sm" nome={voce.icona} />
            <span className="text-micro font-medium leading-tight">{voce.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
