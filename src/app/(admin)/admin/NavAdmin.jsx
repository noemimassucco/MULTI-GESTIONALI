"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icona from "@/components/ui/Icona";
import { cn } from "@/lib/cn";

/**
 * Le voci dell'amministrazione. Stanno qui perché servono in due forme:
 * colonna a sinistra da lg in su, fila di schede scorrevoli sotto.
 */
const voci = [
  { href: "/admin", label: "Riepilogo", icona: "LayoutGrid", esatta: true },
  { href: "/admin/gestionali", label: "Gestionali", icona: "FileStack" },
  { href: "/admin/categorie", label: "Categorie", icona: "Shapes" },
  { href: "/admin/basi", label: "Basi", icona: "Blocks" },
  { href: "/admin/richieste", label: "Richieste", icona: "Mail" },
];

/**
 * Navigazione dell'area amministrativa.
 * Client component solo per sapere qual è la voce aperta.
 *
 * @param {{variante?: "laterale"|"schede"}} props
 */
export default function NavAdmin({ variante = "laterale" }) {
  const percorso = usePathname() || "";
  const attiva = (v) => (v.esatta ? percorso === v.href : percorso.startsWith(v.href));

  if (variante === "schede") {
    return (
      <nav
        aria-label="Sezioni dell'amministrazione"
        className="scroll-orizzontale sticky top-0 z-40 flex gap-1 overflow-x-auto border-b border-line bg-brand-700 px-3 py-2 lg:hidden"
      >
        {voci.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            data-comando
            aria-current={attiva(v) ? "page" : undefined}
            className={cn(
              "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-piccolo font-medium",
              attiva(v) ? "bg-accento-500 text-ink-900" : "text-white/70",
            )}
          >
            <Icona misura="sm" nome={v.icona} />
            {v.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex-1 space-y-0.5 px-3" aria-label="Sezioni dell'amministrazione">
      {voci.map((v) => (
        <Link
          key={v.href}
          href={v.href}
          data-comando
          aria-current={attiva(v) ? "page" : undefined}
          className={cn(
            "flex h-10 items-center gap-3 rounded-[var(--radius-controllo)] px-3 text-corrente font-medium transition-colors",
            attiva(v)
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white",
          )}
        >
          <Icona
            misura="sm"
            nome={v.icona}
            className={attiva(v) ? "text-accento-400" : "text-white/40"}
          />
          {v.label}
          {attiva(v) ? (
            <span className="ml-auto size-1.5 rounded-full bg-accento-400" aria-hidden="true" />
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
