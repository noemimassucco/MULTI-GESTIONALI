import { FornitoreStatoDemo } from "@/components/demo/StatoDemo";
import DemoShell from "@/components/demo/DemoShell";

export const metadata = {
  title: "Demo — Gestionale clienti e attività",
  description:
    "Prova la base Clienti e attività con dati inventati: dashboard, clienti, attività, scadenze, documenti, preventivi e report.",
  robots: { index: false, follow: false },
};

/** La demo vive fuori dalla cornice del sito: interfaccia a schermo pieno. */
export default function LayoutDemo({ children }) {
  return (
    <FornitoreStatoDemo>
      <DemoShell>{children}</DemoShell>
    </FornitoreStatoDemo>
  );
}
