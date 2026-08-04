import { FornitoreStatoDemo } from "@/components/demo/StatoDemo";
import DemoShell from "@/components/demo/DemoShell";
import PercorsoGuidato from "@/components/demo/PercorsoGuidato";
import { statoIniziale, studio } from "@/data/demo/clienti-attivita";

export const metadata = {
  title: "Demo — Gestionale clienti e attività",
  description:
    "Prova la base Clienti e attività con dati inventati: dashboard, clienti, attività, scadenze, documenti, preventivi e report.",
  robots: { index: false, follow: false },
};

const BASE = "/demo/clienti-attivita";

const voci = [
  { href: BASE, label: "Oggi", icona: "House", esatta: true },
  { href: `${BASE}/clienti`, label: "Clienti", icona: "Users" },
  { href: `${BASE}/attivita`, label: "Attività", icona: "CheckCircle2" },
  { href: `${BASE}/scadenze`, label: "Scadenze", icona: "Clock" },
  { href: `${BASE}/documenti`, label: "Documenti", icona: "FolderOpen" },
  { href: `${BASE}/preventivi`, label: "Preventivi", icona: "FileStack" },
  { href: `${BASE}/report`, label: "Report", icona: "LayoutGrid" },
];

const passi = [
  {
    titolo: "Il cliente chiede qualcosa",
    testo:
      "Ogni azienda che segui ha la sua scheda: contatti, note, tutto lo storico. Da lì parte ogni lavoro.",
    dove: `${BASE}/clienti`,
  },
  {
    titolo: "Diventa un'attività con un responsabile",
    testo:
      "Chi la fa, entro quando, a che punto è. Niente più «pensavo l'avessi fatto tu».",
    dove: `${BASE}/attivita`,
  },
  {
    titolo: "Le scadenze arrivano prima, non dopo",
    testo:
      "Adempimenti, rinnovi e pagamenti in un unico scadenzario: quello che è in ritardo si vede subito.",
    dove: `${BASE}/scadenze`,
  },
  {
    titolo: "I documenti stanno dove servono",
    testo:
      "Ogni file collegato al cliente giusto. Nel gestionale vero si caricano a cartelle intere e si archiviano da soli.",
    dove: `${BASE}/documenti`,
  },
  {
    titolo: "Alla fine si guardano i numeri",
    testo:
      "Quanto è stato incassato, quanto manca, quali clienti pesano di più. Calcolati, non ricopiati a mano.",
    dove: `${BASE}/report`,
  },
];

/** La demo vive fuori dalla cornice del sito: interfaccia a schermo pieno. */
export default function LayoutDemo({ children }) {
  return (
    <FornitoreStatoDemo statoIniziale={statoIniziale()}>
      <DemoShell studio={studio} voci={voci} nomeBase="Clienti e attività">
        <PercorsoGuidato chiave="clienti-attivita" titolo="Come lavora uno studio" passi={passi} />
        {children}
      </DemoShell>
    </FornitoreStatoDemo>
  );
}
