/**
 * Dati di esempio della demo "Commesse" — Costruzioni Ferraris,
 * impresa edile ad Alba (CN). Tre squadre, un ufficio tecnico.
 *
 * Tutto inventato ma plausibile: importi, costi orari, fasi di cantiere,
 * ritenute e SAL sono quelli veri del mestiere. Le date sono relative a
 * oggi, così la demo non invecchia.
 *
 * Il filo del racconto: il cantiere di Bra sta perdendo margine e in
 * ufficio non se ne è accorto nessuno. È il motivo per cui esiste questa
 * base.
 */

const OGGI = new Date();

/** @param {number} n giorni da oggi (negativi = passato) @returns {string} AAAA-MM-GG */
export function giorni(n) {
  const d = new Date(OGGI);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const azienda = {
  nome: "Costruzioni Ferraris",
  sottotitolo: "Impresa edile · Alba (CN)",
  utente: { nome: "Giulia Ferraris", iniziali: "GF", ruolo: "Ufficio tecnico" },
};

/* ------------------------------------------------------------------ */
/*  Squadre: il costo orario è quello aziendale, non la paga netta.     */
/* ------------------------------------------------------------------ */

export const squadre = [
  { id: "s1", nome: "Murature e strutture", iniziali: "MU", capo: "Ilir Hoxha", persone: 4, costoOrario: 32 },
  { id: "s2", nome: "Finiture e cartongesso", iniziali: "FI", capo: "Denis Marku", persone: 3, costoOrario: 30 },
  { id: "s3", nome: "Impianti interni", iniziali: "IM", capo: "Sergio Rolando", persone: 2, costoOrario: 38 },
];

/* ------------------------------------------------------------------ */
/*  Clienti                                                            */
/* ------------------------------------------------------------------ */

export const clienti = [
  { id: "c1", nome: "Sig. e Sig.ra Rissone", tipo: "privato", referente: "Marco Rissone", telefono: "347 220 1184", indirizzo: "Via Cavour 12, Alba", note: "Pagano puntuali, chiedono sempre il dettaglio delle voci." },
  { id: "c2", nome: "Immobiliare Langhe srl", tipo: "azienda", referente: "Geom. Pautasso", telefono: "0173 44 2210", indirizzo: "Corso Piave 3, Alba", note: "Tre cantieri negli ultimi due anni. Trattano sul prezzo, non sui tempi." },
  { id: "c3", nome: "Condominio Il Cortile", tipo: "condominio", referente: "Amm. Boffa", telefono: "0173 29 7745", indirizzo: "Via Ospedale 8, Alba", note: "Delibere lente: mettere sempre in conto due mesi in più." },
  { id: "c4", nome: "Sig.ra Delpiano", tipo: "privato", referente: "Anna Delpiano", telefono: "339 774 2019", indirizzo: "Fraz. San Rocco 5, Neive", note: "" },
  { id: "c5", nome: "Vinicola Bricco Alto", tipo: "azienda", referente: "Paolo Cerrato", telefono: "0173 61 8890", indirizzo: "Str. Bricco 21, Bra", note: "Lavorano solo fuori stagione vendemmia." },
  { id: "c6", nome: "Studio Notarile Bosio", tipo: "azienda", referente: "Dott.ssa Bosio", telefono: "0173 33 5512", indirizzo: "Corso Langhe 44, Alba", note: "" },
];

/* ------------------------------------------------------------------ */
/*  Commesse: il cuore. Ogni cantiere ha le sue fasi, ognuna col peso  */
/*  che ha sul totale e la percentuale di avanzamento.                 */
/* ------------------------------------------------------------------ */

export const commesse = [
  {
    id: "k1",
    numero: "2026/04",
    clienteId: "c1",
    titolo: "Ristrutturazione appartamento Via Cavour",
    indirizzo: "Via Cavour 12, Alba",
    tipo: "Ristrutturazione",
    stato: "in_corso",
    importoContratto: 78000,
    ritenutaGaranzia: 5,
    inizio: giorni(-62),
    finePrevista: giorni(26),
    fasi: [
      { nome: "Demolizioni e sgombero", peso: 10, avanzamento: 100 },
      { nome: "Impianti e tracce", peso: 22, avanzamento: 100 },
      { nome: "Massetti e intonaci", peso: 24, avanzamento: 95 },
      { nome: "Pavimenti e rivestimenti", peso: 26, avanzamento: 60 },
      { nome: "Finiture e tinteggi", peso: 18, avanzamento: 0 },
    ],
  },
  {
    id: "k2",
    numero: "2026/02",
    clienteId: "c5",
    titolo: "Recupero cascina e sala degustazione",
    indirizzo: "Str. Bricco 21, Bra",
    tipo: "Recupero",
    stato: "in_corso",
    importoContratto: 145000,
    ritenutaGaranzia: 5,
    inizio: giorni(-118),
    finePrevista: giorni(9),
    fasi: [
      { nome: "Consolidamento murature", peso: 26, avanzamento: 100 },
      { nome: "Rifacimento tetto", peso: 24, avanzamento: 100 },
      { nome: "Impianti e serramenti", peso: 22, avanzamento: 85 },
      { nome: "Sala degustazione", peso: 18, avanzamento: 40 },
      { nome: "Esterni e cortile", peso: 10, avanzamento: 0 },
    ],
  },
  {
    id: "k3",
    numero: "2026/01",
    clienteId: "c6",
    titolo: "Riqualificazione uffici Corso Langhe",
    indirizzo: "Corso Langhe 44, Alba",
    tipo: "Riqualificazione",
    stato: "consegnata",
    importoContratto: 52000,
    ritenutaGaranzia: 5,
    inizio: giorni(-160),
    finePrevista: giorni(-22),
    fasi: [
      { nome: "Demolizioni leggere", peso: 12, avanzamento: 100 },
      { nome: "Impianti elettrici e dati", peso: 30, avanzamento: 100 },
      { nome: "Cartongessi e controsoffitti", peso: 28, avanzamento: 100 },
      { nome: "Pavimenti e tinteggi", peso: 30, avanzamento: 100 },
    ],
  },
  {
    id: "k4",
    numero: "2026/06",
    clienteId: "c4",
    titolo: "Nuovo bagno e impianto termico",
    indirizzo: "Fraz. San Rocco 5, Neive",
    tipo: "Ristrutturazione",
    stato: "in_corso",
    importoContratto: 24500,
    ritenutaGaranzia: 0,
    inizio: giorni(-9),
    finePrevista: giorni(32),
    fasi: [
      { nome: "Demolizioni", peso: 15, avanzamento: 100 },
      { nome: "Idraulica e scarichi", peso: 30, avanzamento: 45 },
      { nome: "Rivestimenti", peso: 35, avanzamento: 0 },
      { nome: "Sanitari e finiture", peso: 20, avanzamento: 0 },
    ],
  },
  {
    id: "k5",
    numero: "2026/08",
    clienteId: "c3",
    titolo: "Rifacimento facciata e balconi",
    indirizzo: "Via Ospedale 8, Alba",
    tipo: "Facciata",
    stato: "in_preventivo",
    importoContratto: 96000,
    ritenutaGaranzia: 5,
    inizio: null,
    finePrevista: null,
    fasi: [
      { nome: "Ponteggio", peso: 18, avanzamento: 0 },
      { nome: "Ripristino cemento armato", peso: 30, avanzamento: 0 },
      { nome: "Rasature e tinteggio", peso: 34, avanzamento: 0 },
      { nome: "Lattonerie e ringhiere", peso: 18, avanzamento: 0 },
    ],
  },
  {
    id: "k6",
    numero: "2025/19",
    clienteId: "c2",
    titolo: "Frazionamento trilocale Corso Piave",
    indirizzo: "Corso Piave 3, Alba",
    tipo: "Frazionamento",
    stato: "chiusa",
    importoContratto: 41000,
    ritenutaGaranzia: 5,
    inizio: giorni(-410),
    finePrevista: giorni(-330),
    fasi: [
      { nome: "Opere murarie", peso: 40, avanzamento: 100 },
      { nome: "Impianti", peso: 30, avanzamento: 100 },
      { nome: "Finiture", peso: 30, avanzamento: 100 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Ore di squadra: è la voce di costo che nessuno tiene aggiornata,   */
/*  ed è quella che decide se il cantiere guadagna.                    */
/* ------------------------------------------------------------------ */

/** Righe di ore già registrate. `ore` = ore uomo totali della settimana. */
export const ore = [
  /* k1 — Via Cavour: registrate fino a settimana scorsa */
  { id: "o1", commessaId: "k1", squadraId: "s1", data: giorni(-60), ore: 128, fase: "Demolizioni e sgombero" },
  { id: "o2", commessaId: "k1", squadraId: "s1", data: giorni(-46), ore: 96, fase: "Impianti e tracce" },
  { id: "o3", commessaId: "k1", squadraId: "s3", data: giorni(-44), ore: 84, fase: "Impianti e tracce" },
  { id: "o4", commessaId: "k1", squadraId: "s1", data: giorni(-30), ore: 112, fase: "Massetti e intonaci" },
  { id: "o5", commessaId: "k1", squadraId: "s2", data: giorni(-16), ore: 90, fase: "Pavimenti e rivestimenti" },
  { id: "o6", commessaId: "k1", squadraId: "s2", data: giorni(-9), ore: 72, fase: "Pavimenti e rivestimenti" },

  /* k2 — Bra: il cantiere che sta scappando di mano */
  { id: "o7", commessaId: "k2", squadraId: "s1", data: giorni(-114), ore: 168, fase: "Consolidamento murature" },
  { id: "o8", commessaId: "k2", squadraId: "s1", data: giorni(-100), ore: 168, fase: "Consolidamento murature" },
  { id: "o9", commessaId: "k2", squadraId: "s1", data: giorni(-86), ore: 152, fase: "Rifacimento tetto" },
  { id: "o10", commessaId: "k2", squadraId: "s1", data: giorni(-72), ore: 160, fase: "Rifacimento tetto" },
  { id: "o11", commessaId: "k2", squadraId: "s3", data: giorni(-58), ore: 112, fase: "Impianti e serramenti" },
  { id: "o12", commessaId: "k2", squadraId: "s2", data: giorni(-44), ore: 128, fase: "Impianti e serramenti" },
  { id: "o13", commessaId: "k2", squadraId: "s2", data: giorni(-30), ore: 120, fase: "Sala degustazione" },
  { id: "o14", commessaId: "k2", squadraId: "s2", data: giorni(-16), ore: 104, fase: "Sala degustazione" },
  { id: "o15", commessaId: "k2", squadraId: "s1", data: giorni(-6), ore: 72, fase: "Sala degustazione" },

  /* k3 — uffici, chiuso come lavori */
  { id: "o16", commessaId: "k3", squadraId: "s1", data: giorni(-150), ore: 96, fase: "Demolizioni leggere" },
  { id: "o17", commessaId: "k3", squadraId: "s3", data: giorni(-120), ore: 176, fase: "Impianti elettrici e dati" },
  { id: "o18", commessaId: "k3", squadraId: "s2", data: giorni(-80), ore: 208, fase: "Cartongessi e controsoffitti" },
  { id: "o19", commessaId: "k3", squadraId: "s2", data: giorni(-40), ore: 184, fase: "Pavimenti e tinteggi" },

  /* k4 — Neive, appena partito */
  { id: "o20", commessaId: "k4", squadraId: "s1", data: giorni(-8), ore: 32, fase: "Demolizioni" },
  { id: "o21", commessaId: "k4", squadraId: "s3", data: giorni(-3), ore: 28, fase: "Idraulica e scarichi" },

  /* k6 — vecchia commessa chiusa */
  { id: "o22", commessaId: "k6", squadraId: "s1", data: giorni(-400), ore: 240, fase: "Opere murarie" },
  { id: "o23", commessaId: "k6", squadraId: "s3", data: giorni(-370), ore: 152, fase: "Impianti" },
  { id: "o24", commessaId: "k6", squadraId: "s2", data: giorni(-345), ore: 168, fase: "Finiture" },
];

/* ------------------------------------------------------------------ */
/*  Acquisti e subappalti: i costi che arrivano da fuori.              */
/*  `fattura` distingue il DDT arrivato dalla fattura registrata.      */
/* ------------------------------------------------------------------ */

export const acquisti = [
  { id: "a1", commessaId: "k1", tipo: "materiale", fornitore: "Edilcentro Alba", descrizione: "Laterizi, malte e massetto", importo: 6820, data: giorni(-55), documento: "DDT 1142", fattura: true },
  { id: "a2", commessaId: "k1", tipo: "materiale", fornitore: "Ceramiche Roero", descrizione: "Gres 60×60 e rivestimenti bagno", importo: 5240, data: giorni(-20), documento: "DDT 0338", fattura: true },
  { id: "a3", commessaId: "k1", tipo: "subappalto", fornitore: "Elettro Bosca snc", descrizione: "Impianto elettrico completo", importo: 8900, data: giorni(-42), documento: "SAL 1", fattura: true },
  { id: "a4", commessaId: "k1", tipo: "materiale", fornitore: "Edilcentro Alba", descrizione: "Colle, stucchi, profili", importo: 1180, data: giorni(-7), documento: "DDT 1509", fattura: false },

  { id: "a5", commessaId: "k2", tipo: "materiale", fornitore: "Legnami Bertolino", descrizione: "Travi lamellari e perline tetto", importo: 18400, data: giorni(-92), documento: "DDT 0771", fattura: true },
  { id: "a6", commessaId: "k2", tipo: "subappalto", fornitore: "Coperture Valle", descrizione: "Posa manto di copertura e lattonerie", importo: 15400, data: giorni(-78), documento: "SAL 1", fattura: true },
  { id: "a7", commessaId: "k2", tipo: "materiale", fornitore: "Edilcentro Alba", descrizione: "Cemento, ferro, tiranti consolidamento", importo: 11200, data: giorni(-104), documento: "DDT 0902", fattura: true },
  { id: "a8", commessaId: "k2", tipo: "subappalto", fornitore: "Serramenti Cortese", descrizione: "Serramenti legno-alluminio su misura", importo: 17600, data: giorni(-52), documento: "SAL 1", fattura: true },
  { id: "a9", commessaId: "k2", tipo: "materiale", fornitore: "Ceramiche Roero", descrizione: "Pavimento sala degustazione", importo: 6400, data: giorni(-26), documento: "DDT 0451", fattura: false },
  { id: "a10", commessaId: "k2", tipo: "subappalto", fornitore: "Elettro Bosca snc", descrizione: "Impianto sala e illuminazione tecnica", importo: 8600, data: giorni(-14), documento: "SAL 1", fattura: false },
  { id: "a11", commessaId: "k2", tipo: "materiale", fornitore: "Noleggi Piemonte", descrizione: "Ponteggio e piattaforma, 4 mesi", importo: 6200, data: giorni(-110), documento: "DDT 0119", fattura: true },

  { id: "a12", commessaId: "k3", tipo: "subappalto", fornitore: "Elettro Bosca snc", descrizione: "Impianto elettrico e rete dati", importo: 14200, data: giorni(-118), documento: "SAL 2", fattura: true },
  { id: "a13", commessaId: "k3", tipo: "materiale", fornitore: "Edilcentro Alba", descrizione: "Cartongesso, orditure, isolante", importo: 6100, data: giorni(-84), documento: "DDT 1204", fattura: true },
  { id: "a14", commessaId: "k3", tipo: "materiale", fornitore: "Colorificio Tanaro", descrizione: "Idropitture e finiture", importo: 1950, data: giorni(-44), documento: "DDT 0288", fattura: true },

  { id: "a15", commessaId: "k4", tipo: "materiale", fornitore: "Idraulica Cuneese", descrizione: "Tubazioni, collettori, scarichi", importo: 2380, data: giorni(-5), documento: "DDT 0092", fattura: false },

  { id: "a16", commessaId: "k6", tipo: "materiale", fornitore: "Edilcentro Alba", descrizione: "Materiali opere murarie", importo: 7400, data: giorni(-395), documento: "DDT 0655", fattura: true },
  { id: "a17", commessaId: "k6", tipo: "subappalto", fornitore: "Elettro Bosca snc", descrizione: "Impianti due unità", importo: 8200, data: giorni(-368), documento: "SAL 1", fattura: true },
];

/* ------------------------------------------------------------------ */
/*  Varianti: il buco nero dell'edilizia. Il lavoro in più si fa       */
/*  subito e si mette per iscritto mai.                                */
/* ------------------------------------------------------------------ */

export const varianti = [
  { id: "v1", commessaId: "k2", titolo: "Rinforzo solaio primo piano non previsto", descrizione: "Aperto il solaio si è visto che le travi erano marce. Rifatte quattro campate.", importo: 8400, costoStimato: 6100, data: giorni(-74), stato: "eseguita" },
  { id: "v2", commessaId: "k2", titolo: "Spostamento quadro elettrico e nuova linea", descrizione: "Richiesto dal cliente in corso d'opera per la sala degustazione.", importo: 2600, costoStimato: 1900, data: giorni(-31), stato: "eseguita" },
  { id: "v3", commessaId: "k1", titolo: "Nicchia doccia e faretti aggiuntivi", descrizione: "Chiesta a voce dalla proprietà durante il sopralluogo.", importo: 1450, costoStimato: 900, data: giorni(-18), stato: "approvata" },
  { id: "v4", commessaId: "k1", titolo: "Cambio pavimento zona giorno", descrizione: "Formato più grande, posa a correre. Differenza materiale e posa.", importo: 2900, costoStimato: 2050, data: giorni(-4), stato: "proposta" },
  { id: "v5", commessaId: "k4", titolo: "Piatto doccia filo pavimento", descrizione: "In luogo del piatto appoggiato previsto a contratto.", importo: 780, costoStimato: 520, data: giorni(-2), stato: "proposta" },
  { id: "v6", commessaId: "k3", titolo: "Controsoffitto fonoassorbente sala riunioni", descrizione: "Approvata e fatturata con il SAL 3.", importo: 3200, costoStimato: 2300, data: giorni(-70), stato: "approvata" },
];

/* ------------------------------------------------------------------ */
/*  SAL: gli stati di avanzamento già emessi.                          */
/* ------------------------------------------------------------------ */

export const sal = [
  { id: "q1", commessaId: "k1", numero: "SAL 1", percentuale: 30, importo: 23400, data: giorni(-40), fatturato: true },
  { id: "q2", commessaId: "k1", numero: "SAL 2", percentuale: 55, importo: 19500, data: giorni(-12), fatturato: true },

  { id: "q3", commessaId: "k2", numero: "SAL 1", percentuale: 35, importo: 50750, data: giorni(-88), fatturato: true },
  { id: "q4", commessaId: "k2", numero: "SAL 2", percentuale: 62, importo: 39150, data: giorni(-38), fatturato: true },

  { id: "q5", commessaId: "k3", numero: "SAL 1", percentuale: 40, importo: 20800, data: giorni(-110), fatturato: true },
  { id: "q6", commessaId: "k3", numero: "SAL 2", percentuale: 75, importo: 18200, data: giorni(-58), fatturato: true },
  { id: "q7", commessaId: "k3", numero: "SAL 3 e saldo", percentuale: 100, importo: 16200, data: giorni(-18), fatturato: false },

  { id: "q8", commessaId: "k6", numero: "SAL 1", percentuale: 50, importo: 20500, data: giorni(-380), fatturato: true },
  { id: "q9", commessaId: "k6", numero: "Saldo", percentuale: 100, importo: 18450, data: giorni(-325), fatturato: true },
];

/* ------------------------------------------------------------------ */
/*  Documenti già archiviati. Il grosso è ancora nella cartella        */
/*  condivisa: è quello che il caricamento assistito porta dentro.     */
/* ------------------------------------------------------------------ */

export const documenti = [
  { id: "d1", nome: "Contratto appalto Via Cavour firmato.pdf", clienteId: "c1", commessaId: "k1", tipo: "Contratto di appalto", caricatoIl: giorni(-64), dimensione: "820 KB" },
  { id: "d2", nome: "CILA protocollo 2026-114.pdf", clienteId: "c1", commessaId: "k1", tipo: "Pratica edilizia", caricatoIl: giorni(-66), dimensione: "1,4 MB" },
  { id: "d3", nome: "POS cantiere Bra.pdf", clienteId: "c5", commessaId: "k2", tipo: "Sicurezza", caricatoIl: giorni(-120), dimensione: "2,1 MB" },
  { id: "d4", nome: "Computo metrico uffici Corso Langhe.xlsx", clienteId: "c6", commessaId: "k3", tipo: "Computo metrico", caricatoIl: giorni(-165), dimensione: "310 KB" },
  { id: "d5", nome: "Certificato conformità impianto Bosca.pdf", clienteId: "c6", commessaId: "k3", tipo: "Certificazione impianto", caricatoIl: giorni(-30), dimensione: "540 KB" },
];

/** Percentuale di ricarico che l'impresa considera sana su un cantiere. */
export const MARGINE_ATTESO = 15;

/** Stato iniziale completo della demo. */
export function statoIniziale() {
  return {
    clienti: [...clienti],
    squadre: [...squadre],
    commesse: commesse.map((k) => ({ ...k, fasi: k.fasi.map((f) => ({ ...f })) })),
    ore: [...ore],
    acquisti: [...acquisti],
    varianti: [...varianti],
    sal: [...sal],
    documenti: [...documenti],
  };
}
