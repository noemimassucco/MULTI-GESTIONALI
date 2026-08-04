/**
 * Dati di esempio della demo "Clienti e attività" — Studio Rossi, consulenza
 * aziendale (Torino). Tutto inventato ma plausibile.
 *
 * Le date sono calcolate rispetto a oggi, così la demo sembra sempre viva:
 * le scadenze "fra 3 giorni" restano fra 3 giorni anche fra sei mesi.
 */

const OGGI = new Date();

/** @param {number} n giorni da oggi (negativi = passato) @returns {string} AAAA-MM-GG */
export function giorni(n) {
  const d = new Date(OGGI);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const studio = {
  nome: "Studio Rossi",
  sottotitolo: "Consulenza aziendale · Torino",
  utente: { nome: "Laura Rossi", iniziali: "LR", ruolo: "Titolare" },
};

export const team = ["Laura Rossi", "Marco Vitale", "Elena Ferrero"];

export const clienti = [
  {
    id: "c1",
    nome: "Meccanica Bruno Srl",
    referente: "Paolo Bruno",
    email: "amministrazione@meccanicabruno.it",
    telefono: "011 456 7821",
    citta: "Collegno (TO)",
    settore: "Officina meccanica di precisione",
    stato: "attivo",
    dalAnno: 2022,
    note: "Preferisce essere chiamato il pomeriggio. Fattura a 60 giorni.",
  },
  {
    id: "c2",
    nome: "Panificio F.lli Greco",
    referente: "Salvatore Greco",
    email: "info@panificiogreco.it",
    telefono: "011 887 2210",
    citta: "Torino",
    settore: "Panificio con tre punti vendita",
    stato: "attivo",
    dalAnno: 2023,
    note: "Passaggio generazionale in corso: coinvolgere anche il figlio Andrea.",
  },
  {
    id: "c3",
    nome: "Idrotermica Sabaudia",
    referente: "Franca Peluso",
    email: "franca@idrotermicasabaudia.it",
    telefono: "011 234 9987",
    citta: "Moncalieri (TO)",
    settore: "Impianti termoidraulici",
    stato: "attivo",
    dalAnno: 2021,
    note: "Contratto di consulenza continuativa, revisione a settembre.",
  },
  {
    id: "c4",
    nome: "Bar Centrale di Marino & C.",
    referente: "Giuseppe Marino",
    email: "barcentrale.marino@gmail.com",
    telefono: "348 552 1190",
    citta: "Rivoli (TO)",
    settore: "Bar e piccola ristorazione",
    stato: "attivo",
    dalAnno: 2024,
    note: "",
  },
  {
    id: "c5",
    nome: "Autotrasporti Vinci",
    referente: "Rosa Vinci",
    email: "segreteria@autotrasportivinci.it",
    telefono: "011 665 4478",
    citta: "Grugliasco (TO)",
    settore: "Trasporto merci conto terzi",
    stato: "attivo",
    dalAnno: 2020,
    note: "Sta valutando l'acquisto di due nuovi mezzi: preparare simulazione.",
  },
  {
    id: "c6",
    nome: "Studio Dentistico Albera",
    referente: "Dott. Stefano Albera",
    email: "info@studioalbera.it",
    telefono: "011 776 3325",
    citta: "Torino",
    settore: "Studio odontoiatrico",
    stato: "attivo",
    dalAnno: 2023,
    note: "",
  },
  {
    id: "c7",
    nome: "Verde Piemonte Giardini",
    referente: "Luca Ostuni",
    email: "luca@verdepiemonte.it",
    telefono: "339 210 4456",
    citta: "Pinerolo (TO)",
    settore: "Manutenzione del verde",
    stato: "prospect",
    dalAnno: null,
    note: "Conosciuto in camera di commercio. Interessato al controllo di gestione.",
  },
  {
    id: "c8",
    nome: "Cartotecnica Lumen Sas",
    referente: "Marta Oddone",
    email: "m.oddone@cartotecnicalumen.it",
    telefono: "011 903 5561",
    citta: "Settimo Torinese (TO)",
    settore: "Stampa e cartotecnica",
    stato: "prospect",
    dalAnno: null,
    note: "Inviato preventivo, in attesa di risposta.",
  },
];

export const attivita = [
  { id: "a1", titolo: "Chiudere il bilancino primo semestre", clienteId: "c1", responsabile: "Laura Rossi", scadenza: giorni(2), stato: "in_corso", priorita: "alta", descrizione: "Mancano gli ammortamenti dei due centri di lavoro nuovi." },
  { id: "a2", titolo: "Preparare riunione passaggio generazionale", clienteId: "c2", responsabile: "Laura Rossi", scadenza: giorni(5), stato: "da_fare", priorita: "alta", descrizione: "Scaletta: governance, deleghe, patto di famiglia." },
  { id: "a3", titolo: "Analisi marginalità commesse 2025", clienteId: "c3", responsabile: "Marco Vitale", scadenza: giorni(-3), stato: "in_corso", priorita: "alta", descrizione: "Il file ore della squadra B è arrivato incompleto: richiesto di nuovo." },
  { id: "a4", titolo: "Verifica costi del personale", clienteId: "c4", responsabile: "Elena Ferrero", scadenza: giorni(8), stato: "da_fare", priorita: "media", descrizione: "" },
  { id: "a5", titolo: "Simulazione acquisto due motrici", clienteId: "c5", responsabile: "Marco Vitale", scadenza: giorni(6), stato: "in_corso", priorita: "alta", descrizione: "Confronto leasing vs finanziamento, con ipotesi Sabatini." },
  { id: "a6", titolo: "Revisione listino prestazioni", clienteId: "c6", responsabile: "Laura Rossi", scadenza: giorni(12), stato: "da_fare", priorita: "bassa", descrizione: "" },
  { id: "a7", titolo: "Prima analisi conti — incontro conoscitivo", clienteId: "c7", responsabile: "Laura Rossi", scadenza: giorni(4), stato: "da_fare", priorita: "media", descrizione: "Portare esempio di cruscotto mensile." },
  { id: "a8", titolo: "Richiamare per esito preventivo", clienteId: "c8", responsabile: "Elena Ferrero", scadenza: giorni(1), stato: "da_fare", priorita: "media", descrizione: "" },
  { id: "a9", titolo: "Cruscotto mensile giugno", clienteId: "c3", responsabile: "Elena Ferrero", scadenza: giorni(-1), stato: "in_attesa", priorita: "media", descrizione: "In attesa dell'estratto conto banca." },
  { id: "a10", titolo: "Aggiornare budget di cassa", clienteId: "c1", responsabile: "Marco Vitale", scadenza: giorni(9), stato: "da_fare", priorita: "media", descrizione: "" },
  { id: "a11", titolo: "Report visita punto vendita di corso Giulio", clienteId: "c2", responsabile: "Elena Ferrero", scadenza: giorni(-6), stato: "completata", priorita: "media", descrizione: "" },
  { id: "a12", titolo: "Verifica affidamenti bancari", clienteId: "c5", responsabile: "Laura Rossi", scadenza: giorni(-8), stato: "completata", priorita: "alta", descrizione: "" },
  { id: "a13", titolo: "Impostare controllo di gestione per reparto", clienteId: "c4", responsabile: "Marco Vitale", scadenza: giorni(15), stato: "da_fare", priorita: "bassa", descrizione: "" },
  { id: "a14", titolo: "Analisi scostamenti budget vs consuntivo", clienteId: "c6", responsabile: "Marco Vitale", scadenza: giorni(-12), stato: "completata", priorita: "media", descrizione: "" },
  { id: "a15", titolo: "Preparare bozza contratto di rete", clienteId: "c3", responsabile: "Laura Rossi", scadenza: giorni(18), stato: "da_fare", priorita: "bassa", descrizione: "Con Idraulica Chierese e TermoUno." },
  { id: "a16", titolo: "Cruscotto mensile giugno", clienteId: "c1", responsabile: "Elena Ferrero", scadenza: giorni(-4), stato: "completata", priorita: "media", descrizione: "" },
];

export const scadenze = [
  { id: "s1", titolo: "Invio situazione contabile trimestrale", clienteId: "c1", data: giorni(2), tipo: "adempimento", fatta: false },
  { id: "s2", titolo: "Rinnovo contratto di consulenza", clienteId: "c3", data: giorni(24), tipo: "rinnovo", fatta: false },
  { id: "s3", titolo: "Saldo fattura 2026/041", clienteId: "c2", data: giorni(-5), tipo: "pagamento", fatta: false },
  { id: "s4", titolo: "Riunione soci — presenza richiesta", clienteId: "c5", data: giorni(7), tipo: "adempimento", fatta: false },
  { id: "s5", titolo: "Scadenza offerta preventivo", clienteId: "c8", data: giorni(3), tipo: "rinnovo", fatta: false },
  { id: "s6", titolo: "Acconto fattura 2026/037", clienteId: "c6", data: giorni(-2), tipo: "pagamento", fatta: false },
  { id: "s7", titolo: "Consegna cruscotto mensile", clienteId: "c3", data: giorni(1), tipo: "adempimento", fatta: false },
  { id: "s8", titolo: "Verifica copertura assicurativa studio", clienteId: null, data: giorni(30), tipo: "rinnovo", fatta: false },
];

export const documenti = [
  { id: "d1", nome: "Bilancio 2025 definitivo.pdf", clienteId: "c1", tipo: "Bilancio", caricatoIl: giorni(-40), dimensione: "1,2 MB" },
  { id: "d2", nome: "Situazione contabile 1° trim 2026.xlsx", clienteId: "c1", tipo: "Situazione contabile", caricatoIl: giorni(-12), dimensione: "356 KB" },
  { id: "d3", nome: "Visura camerale aggiornata.pdf", clienteId: "c2", tipo: "Visura", caricatoIl: giorni(-30), dimensione: "410 KB" },
  { id: "d4", nome: "Bozza patto di famiglia v2.docx", clienteId: "c2", tipo: "Contratto", caricatoIl: giorni(-7), dimensione: "88 KB" },
  { id: "d5", nome: "Ore squadre gen-mag 2026.xlsx", clienteId: "c3", tipo: "Dati di produzione", caricatoIl: giorni(-9), dimensione: "1,8 MB" },
  { id: "d6", nome: "Contratto consulenza 2025-2026.pdf", clienteId: "c3", tipo: "Contratto", caricatoIl: giorni(-320), dimensione: "240 KB" },
  { id: "d7", nome: "Corrispettivi 2025 per punto vendita.xlsx", clienteId: "c4", tipo: "Dati contabili", caricatoIl: giorni(-25), dimensione: "512 KB" },
  { id: "d8", nome: "Piano ammortamento mezzi attuali.pdf", clienteId: "c5", tipo: "Finanziamenti", caricatoIl: giorni(-15), dimensione: "620 KB" },
  { id: "d9", nome: "Preventivo leasing Iveco.pdf", clienteId: "c5", tipo: "Preventivo fornitore", caricatoIl: giorni(-3), dimensione: "180 KB" },
  { id: "d10", nome: "Listino prestazioni 2024.pdf", clienteId: "c6", tipo: "Listino", caricatoIl: giorni(-60), dimensione: "95 KB" },
  { id: "d11", nome: "Ultimi due bilanci depositati.pdf", clienteId: "c7", tipo: "Bilancio", caricatoIl: giorni(-5), dimensione: "2,1 MB" },
  { id: "d12", nome: "Preventivo consulenza 2026.pdf", clienteId: "c8", tipo: "Preventivo", caricatoIl: giorni(-10), dimensione: "150 KB" },
];

export const preventivi = [
  { id: "p1", numero: "2026-014", clienteId: "c8", oggetto: "Controllo di gestione — impostazione e primo anno", importo: 6800, stato: "inviato", data: giorni(-10) },
  { id: "p2", numero: "2026-013", clienteId: "c7", oggetto: "Check-up aziendale iniziale", importo: 1900, stato: "bozza", data: giorni(-4) },
  { id: "p3", numero: "2026-011", clienteId: "c5", oggetto: "Assistenza operazione acquisto mezzi", importo: 3200, stato: "accettato", data: giorni(-18) },
  { id: "p4", numero: "2026-009", clienteId: "c2", oggetto: "Accompagnamento passaggio generazionale", importo: 8400, stato: "accettato", data: giorni(-35) },
  { id: "p5", numero: "2026-006", clienteId: "c4", oggetto: "Revisione assetto societario", importo: 2600, stato: "rifiutato", data: giorni(-50) },
];

export const pagamenti = [
  { id: "g1", clienteId: "c1", descrizione: "Fattura 2026/044 — consulenza maggio", importo: 1450, data: giorni(-6), stato: "incassato" },
  { id: "g2", clienteId: "c2", descrizione: "Fattura 2026/041 — acconto progetto", importo: 2800, data: giorni(-5), stato: "in_ritardo" },
  { id: "g3", clienteId: "c3", descrizione: "Fattura 2026/046 — canone giugno", importo: 1200, data: giorni(4), stato: "in_attesa" },
  { id: "g4", clienteId: "c5", descrizione: "Fattura 2026/043 — assistenza operazione", importo: 1600, data: giorni(-12), stato: "incassato" },
  { id: "g5", clienteId: "c6", descrizione: "Fattura 2026/037 — acconto listino", importo: 900, data: giorni(-2), stato: "in_ritardo" },
  { id: "g6", clienteId: "c4", descrizione: "Fattura 2026/045 — consulenza maggio", importo: 750, data: giorni(-8), stato: "incassato" },
  { id: "g7", clienteId: "c1", descrizione: "Fattura 2026/047 — canone giugno", importo: 1450, data: giorni(9), stato: "in_attesa" },
  { id: "g8", clienteId: "c3", descrizione: "Fattura 2026/040 — canone maggio", importo: 1200, data: giorni(-28), stato: "incassato" },
];

/** Stato iniziale completo della demo. */
export function statoIniziale() {
  return {
    clienti: [...clienti],
    attivita: [...attivita],
    scadenze: [...scadenze],
    documenti: [...documenti],
    preventivi: [...preventivi],
    pagamenti: [...pagamenti],
  };
}
