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
    <aside className="fixed left-0 top-[68px] z-40 hidden h-[calc(100vh-68px)] w-[76px] flex-col items-center gap-1 border-r border-line bg-white pt-5 2xl:flex">
      {barraLaterale.map((voce) => {
        const attivo =
          voce.href === "/" ? percorso === "/" : percorso.startsWith(voce.href);
        return (
          <Link
            key={voce.href}
            href={voce.href}
            title={voce.label}
            className={`group flex w-[60px] flex-col items-center gap-1 rounded-xl py-2.5 transition-colors ${
              attivo ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-surface-alt hover:text-ink-800"
            }`}
          >
            <Icona nome={voce.icona} className="size-[19px]" />
            <span className="text-[10px] font-medium leading-tight">{voce.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
