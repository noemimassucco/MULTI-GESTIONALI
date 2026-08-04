import { FornitoreStatoDemo } from "@/components/demo/StatoDemo";
import DemoShell from "@/components/demo/DemoShell";
import PercorsoGuidato from "@/components/demo/PercorsoGuidato";
import { statoIniziale, azienda } from "@/data/demo/commesse";

export const metadata = {
  title: "Demo — Gestionale commesse per imprese edili",
  description:
    "Prova la base Commesse con dati inventati: cantieri con fasi e avanzamento, costo reale di ore, materiali e subappalti, varianti da far approvare, stati di avanzamento da fatturare.",
  robots: { index: false, follow: false },
};

const BASE = "/demo/commesse";

const voci = [
  { href: BASE, label: "Cantieri", icona: "House", esatta: true },
  { href: `${BASE}/commesse`, label: "Commesse", icona: "Blocks" },
  { href: `${BASE}/varianti`, label: "Varianti", icona: "RefreshCw" },
  { href: `${BASE}/ore`, label: "Ore", icona: "Clock" },
  { href: `${BASE}/acquisti`, label: "Acquisti", icona: "Truck" },
  { href: `${BASE}/avanzamento`, label: "Avanzamento", icona: "FileStack" },
  { href: `${BASE}/documenti`, label: "Documenti", icona: "FolderOpen" },
  { href: `${BASE}/clienti`, label: "Clienti", icona: "Users" },
];

/* Il giro che fa un lavoro, dal sopralluogo al saldo. */
const passi = [
  {
    titolo: "1. Il preventivo diventa cantiere",
    testo:
      "Quando il cliente firma, il preventivo non si ricopia: diventa una commessa con le sue fasi e il suo importo.",
    dove: `${BASE}/commesse`,
  },
  {
    titolo: "2. Le ore entrano ogni settimana",
    testo:
      "Il capo squadra segna le giornate. Ogni ora ha un costo: è la voce che decide se il cantiere guadagna.",
    dove: `${BASE}/ore`,
  },
  {
    titolo: "3. Materiali e subappalti si attaccano al cantiere",
    testo:
      "Il DDT non finisce in un raccoglitore: si aggancia alla commessa, e il costo compare subito nei conti.",
    dove: `${BASE}/acquisti`,
  },
  {
    titolo: "4. Il lavoro in più si mette per iscritto",
    testo:
      "Le varianti fatte e mai approvate sono il modo più comune di regalare lavoro. Qui non si perdono.",
    dove: `${BASE}/varianti`,
  },
  {
    titolo: "5. Guardi il margine mentre sei in tempo",
    testo:
      "Costo sostenuto contro lavoro prodotto, aggiornato ogni giorno. Non a fine cantiere, quando non si può più fare niente.",
    dove: `${BASE}/commesse/k2`,
  },
  {
    titolo: "6. E fatturi quello che hai già fatto",
    testo:
      "L'avanzamento dice quanto vale il lavoro eseguito. Il SAL esce da lì, senza ricostruire niente.",
    dove: `${BASE}/avanzamento`,
  },
];

/** La demo vive fuori dalla cornice del sito: interfaccia a schermo pieno. */
export default function LayoutDemoCommesse({ children }) {
  return (
    <FornitoreStatoDemo statoIniziale={statoIniziale()}>
      <DemoShell studio={azienda} voci={voci} nomeBase="Commesse">
        <PercorsoGuidato
          chiave="commesse"
          titolo="Un cantiere dall'inizio alla fine"
          passi={passi}
        />
        {children}
      </DemoShell>
    </FornitoreStatoDemo>
  );
}
