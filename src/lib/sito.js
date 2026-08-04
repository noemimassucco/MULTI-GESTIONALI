/** Configurazione trasversale del sito: marchio, contatti, navigazione. */

export const sito = {
  nome: "GestioniSuMisura",
  nomeBreve: "GestioniSuMisura",
  claim: "Il gestionale che si adatta a te, non il contrario.",
  descrizione:
    "Gestionali semplici e personalizzabili per piccole aziende, professionisti e artigiani. Scegli il tuo settore, guarda cosa puoi gestire e chiedi il tuo gestionale su misura.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gestionisumisura.it",
  email: "info@gestionisumisura.it",
  telefono: "",
  citta: "Torino",
  autore: "Noemi Massucco",
};

/** Voci della barra di navigazione principale. */
/* Etichette corte: nella barra si legge di sfuggita, e ogni parola in più
   toglie respiro. I titoli distesi restano dentro le pagine. */
export const navigazione = [
  { href: "/gestionali", label: "Gestionali" },
  { href: "/categorie", label: "Settori" },
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/personalizzazioni", label: "Personalizzazioni" },
  { href: "/chi-sono", label: "Chi sono" },
  { href: "/contatti", label: "Contatti" },
];

/** Colonna di icone a sinistra: solo destinazioni che esistono davvero. */
export const barraLaterale = [
  { href: "/", label: "Home", icona: "House" },
  { href: "/categorie", label: "Categorie", icona: "LayoutGrid" },
  { href: "/demo", label: "Demo", icona: "PlayCircle" },
  { href: "/come-funziona", label: "Come funziona", icona: "Compass" },
  { href: "/personalizzazioni", label: "Personalizza", icona: "SlidersHorizontal" },
  { href: "/contatti", label: "Contatti", icona: "MessageCircle" },
];

export const piePagina = {
  informazioni: [
    { href: "/come-funziona", label: "Come funziona" },
    { href: "/personalizzazioni", label: "Personalizzazioni" },
    { href: "/demo", label: "Demo" },
    { href: "/chi-sono", label: "Chi sono" },
  ],
  legali: [
    { href: "/privacy", label: "Privacy policy" },
    { href: "/cookie", label: "Cookie policy" },
    { href: "/note-legali", label: "Note legali" },
  ],
};
