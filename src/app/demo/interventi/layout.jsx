import { FornitoreStatoDemo } from "@/components/demo/StatoDemo";
import DemoShell from "@/components/demo/DemoShell";
import PercorsoGuidato from "@/components/demo/PercorsoGuidato";
import { statoIniziale, studio } from "@/data/demo/interventi";

export const metadata = {
  title: "Demo — Gestionale interventi per termoidraulici",
  description:
    "Prova la base Interventi con dati inventati: richieste in arrivo, giornata dei tecnici, rapportino con ore e materiali, impianti, richiami stagionali e fatturazione.",
  robots: { index: false, follow: false },
};

const BASE = "/demo/interventi";

const voci = [
  { href: BASE, label: "Giornata", icona: "House", esatta: true },
  { href: `${BASE}/richieste`, label: "Richieste", icona: "MessageCircle" },
  { href: `${BASE}/interventi`, label: "Interventi", icona: "Wrench" },
  { href: `${BASE}/impianti`, label: "Impianti", icona: "Blocks" },
  { href: `${BASE}/richiami`, label: "Richiami", icona: "RefreshCw" },
  { href: `${BASE}/clienti`, label: "Clienti", icona: "Users" },
  { href: `${BASE}/documenti`, label: "Documenti", icona: "FolderOpen" },
  { href: `${BASE}/fatturare`, label: "Da fatturare", icona: "FileStack" },
];

/* I cinque passaggi di una giornata vera, nell'ordine in cui succedono. */
const passi = [
  {
    titolo: "1. Squilla il telefono",
    testo:
      "«Non esce acqua calda». La chiamata entra come richiesta, con urgenza e canale. Non resta su un foglietto.",
    dove: `${BASE}/richieste`,
  },
  {
    titolo: "2. La programmi a un tecnico",
    testo:
      "Scegli chi va e a che ora: la richiesta diventa un intervento con un numero. Il tecnico se lo trova sul telefono.",
    dove: `${BASE}/richieste`,
  },
  {
    titolo: "3. Il tecnico lo chiude sul posto",
    testo:
      "Ore, ricambi usati, foto e firma del cliente. Il rapportino si compila lì, non la sera in ufficio.",
    dove: `${BASE}/interventi`,
  },
  {
    titolo: "4. Le caldaie si ricordano da sole",
    testo:
      "Ogni impianto ha il suo storico e la data del prossimo controllo. A luglio hai già la lista di chi richiamare.",
    dove: `${BASE}/richiami`,
  },
  {
    titolo: "5. E a fine mese fatturi",
    testo:
      "Quello che è stato chiuso e non ancora fatturato è già lì, con ore e materiali sommati. Niente da ricostruire.",
    dove: `${BASE}/fatturare`,
  },
  {
    titolo: "6. E i dieci anni di prima?",
    testo:
      "Trascini la cartella condivisa e basta: il sistema legge i documenti, capisce cosa sono, li collega alla scheda giusta. Quelli dubbi te li mette da parte.",
    dove: `${BASE}/documenti`,
  },
];

/** La demo vive fuori dalla cornice del sito: interfaccia a schermo pieno. */
export default function LayoutDemoInterventi({ children }) {
  return (
    <FornitoreStatoDemo statoIniziale={statoIniziale()}>
      <DemoShell studio={studio} voci={voci} nomeBase="Interventi">
        <PercorsoGuidato
          chiave="interventi"
          titolo="Una giornata in azienda"
          passi={passi}
        />
        {children}
      </DemoShell>
    </FornitoreStatoDemo>
  );
}
