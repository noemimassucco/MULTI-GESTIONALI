/**
 * Dati di esempio della demo "Interventi" — Idrotermica Sabaudia,
 * termoidraulici a Moncalieri (TO). Tre tecnici, un ufficio.
 *
 * Tutto inventato ma plausibile: nomi, indirizzi, marche di caldaia,
 * prezzi dei ricambi e tempi di intervento sono quelli veri del mestiere.
 * Le date sono relative a oggi, così la demo non invecchia.
 */

const OGGI = new Date();

/** @param {number} n giorni da oggi (negativi = passato) @returns {string} AAAA-MM-GG */
export function giorni(n) {
  const d = new Date(OGGI);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const studio = {
  nome: "Idrotermica Sabaudia",
  sottotitolo: "Termoidraulica · Moncalieri (TO)",
  utente: { nome: "Franca Peluso", iniziali: "FP", ruolo: "Ufficio" },
};

export const tecnici = [
  { id: "t1", nome: "Marco Rossi", iniziali: "MR", specialita: "Caldaie e condizionamento" },
  { id: "t2", nome: "Salvo Bianchi", iniziali: "SB", specialita: "Idraulica e riparazioni" },
  { id: "t3", nome: "Andrea Neri", iniziali: "AN", specialita: "Impianti nuovi" },
];

/* ------------------------------------------------------------------ */
/*  Clienti e sedi                                                     */
/* ------------------------------------------------------------------ */

export const clienti = [
  { id: "c1", nome: "Condominio Verdi", tipo: "condominio", referente: "Amm. Belloni", telefono: "011 645 2211", indirizzo: "Via Verdi 14, Moncalieri", contratto: "Manutenzione annuale · 18 caldaie" },
  { id: "c2", nome: "Sig.ra Conti", tipo: "privato", referente: "Anna Conti", telefono: "348 552 1190", indirizzo: "Corso Roma 8, Moncalieri", contratto: "" },
  { id: "c3", nome: "Panificio F.lli Greco", tipo: "azienda", referente: "Salvatore Greco", telefono: "011 887 2210", indirizzo: "Via Torino 120, Nichelino", contratto: "Manutenzione forni e acqua calda" },
  { id: "c4", nome: "Studio Dentistico Albera", tipo: "azienda", referente: "Dott. Albera", telefono: "011 776 3325", indirizzo: "Via Cavour 3, Torino", contratto: "Climatizzazione · contratto full" },
  { id: "c5", nome: "Condominio Le Betulle", tipo: "condominio", referente: "Amm. Ferrero", telefono: "011 902 4417", indirizzo: "Str. Genova 44, Moncalieri", contratto: "Manutenzione annuale · 24 caldaie" },
  { id: "c6", nome: "Sig. Bruno", tipo: "privato", referente: "Paolo Bruno", telefono: "339 210 4456", indirizzo: "Via Sestriere 2, Trofarello", contratto: "" },
  { id: "c7", nome: "Autofficina Vinci", tipo: "azienda", referente: "Rosa Vinci", telefono: "011 665 4478", indirizzo: "Via Postiglione 9, Grugliasco", contratto: "" },
  { id: "c8", nome: "Sig.ra Oddone", tipo: "privato", referente: "Marta Oddone", telefono: "347 118 9902", indirizzo: "Via Pastrengo 21, Moncalieri", contratto: "" },
];

/* ------------------------------------------------------------------ */
/*  Impianti: il cuore del mestiere. Ogni caldaia ha il suo storico.   */
/* ------------------------------------------------------------------ */

export const impianti = [
  { id: "i1", clienteId: "c1", tipo: "Caldaia murale", marca: "Vaillant ecoTEC", modello: "VMW 246", matricola: "21-VL-44821", ubicazione: "Scala A — interno 3", installato: "2019-10-12", ultimoControllo: giorni(-320), prossimoControllo: giorni(45), bollino: "in regola", note: "Pressione un po' bassa, tenere d'occhio il vaso di espansione." },
  { id: "i2", clienteId: "c1", tipo: "Caldaia murale", marca: "Vaillant ecoTEC", modello: "VMW 246", matricola: "21-VL-44822", ubicazione: "Scala A — interno 5", installato: "2019-10-12", ultimoControllo: giorni(-318), prossimoControllo: giorni(47), bollino: "in regola", note: "" },
  { id: "i3", clienteId: "c2", tipo: "Caldaia murale", marca: "Beretta Ciao", modello: "24 CSI", matricola: "17-BR-90233", ubicazione: "Bagno di servizio", installato: "2016-03-08", ultimoControllo: giorni(-400), prossimoControllo: giorni(-35), bollino: "scaduto", note: "Cliente rimanda da mesi. Insistere: il bollino è scaduto." },
  { id: "i4", clienteId: "c3", tipo: "Bollitore", marca: "Ariston", modello: "Pro1 Eco 100", matricola: "20-AR-11540", ubicazione: "Retro laboratorio", installato: "2020-05-20", ultimoControllo: giorni(-180), prossimoControllo: giorni(185), bollino: "in regola", note: "Acqua molto calcarea, prevedere anticalcare." },
  { id: "i5", clienteId: "c4", tipo: "Pompa di calore", marca: "Daikin Altherma", modello: "3 H HT", matricola: "22-DK-77310", ubicazione: "Terrazzo", installato: "2022-06-15", ultimoControllo: giorni(-150), prossimoControllo: giorni(30), bollino: "in regola", note: "Contratto full: due controlli l'anno." },
  { id: "i6", clienteId: "c5", tipo: "Caldaia murale", marca: "Immergas Victrix", modello: "Tera 24", matricola: "21-IM-33902", ubicazione: "Scala B — interno 2", installato: "2021-02-11", ultimoControllo: giorni(-290), prossimoControllo: giorni(-8), bollino: "scaduto", note: "" },
  { id: "i7", clienteId: "c5", tipo: "Caldaia murale", marca: "Immergas Victrix", modello: "Tera 24", matricola: "21-IM-33903", ubicazione: "Scala B — interno 7", installato: "2021-02-11", ultimoControllo: giorni(-288), prossimoControllo: giorni(-6), bollino: "scaduto", note: "" },
  { id: "i8", clienteId: "c6", tipo: "Caldaia a basamento", marca: "Ferroli", modello: "Atlas D 30", matricola: "12-FE-55018", ubicazione: "Locale caldaia", installato: "2012-11-30", ultimoControllo: giorni(-360), prossimoControllo: giorni(5), bollino: "in regola", note: "Impianto datato: valutare sostituzione entro due anni." },
  { id: "i9", clienteId: "c7", tipo: "Scaldacqua", marca: "Ariston", modello: "Velis Evo 80", matricola: "19-AR-66120", ubicazione: "Spogliatoio", installato: "2019-07-01", ultimoControllo: giorni(-200), prossimoControllo: giorni(165), bollino: "in regola", note: "" },
  { id: "i10", clienteId: "c8", tipo: "Caldaia murale", marca: "Baxi Duo-tec", modello: "Compact 24", matricola: "18-BX-20477", ubicazione: "Cucina", installato: "2018-09-14", ultimoControllo: giorni(-340), prossimoControllo: giorni(25), bollino: "in regola", note: "" },
];

/* ------------------------------------------------------------------ */
/*  Richieste: il lavoro che entra. Ancora da programmare.             */
/* ------------------------------------------------------------------ */

export const richieste = [
  { id: "r1", clienteId: "c2", impiantoId: "i3", canale: "telefono", ricevutaIl: giorni(0), oggetto: "Non esce acqua calda", descrizione: "Chiamata alle 7:40. Dice che da ieri sera esce solo tiepida. In casa ci sono bambini piccoli.", urgenza: "alta", stato: "da_programmare" },
  { id: "r2", clienteId: "c6", impiantoId: "i8", canale: "whatsapp", ricevutaIl: giorni(0), oggetto: "Rumore forte dalla caldaia", descrizione: "Ha mandato un vocale: rumore tipo fischio quando parte. Vuole sapere se è grave.", urgenza: "media", stato: "da_programmare" },
  { id: "r3", clienteId: "c1", impiantoId: null, canale: "email", ricevutaIl: giorni(-1), oggetto: "Preventivo sostituzione valvole termostatiche", descrizione: "L'amministratore chiede preventivo per 18 valvole termostatiche, scala A e B.", urgenza: "bassa", stato: "da_programmare" },
  { id: "r4", clienteId: "c7", impiantoId: "i9", canale: "telefono", ricevutaIl: giorni(-1), oggetto: "Perdita sotto lo scaldacqua", descrizione: "Gocciola da due giorni, hanno messo una bacinella.", urgenza: "alta", stato: "programmata" },
  { id: "r5", clienteId: "c8", impiantoId: "i10", canale: "telefono", ricevutaIl: giorni(-2), oggetto: "Termosifoni freddi in alto", descrizione: "Probabile aria nell'impianto, da sfiatare.", urgenza: "bassa", stato: "programmata" },
];

/* ------------------------------------------------------------------ */
/*  Interventi: il lavoro programmato, in corso o chiuso.              */
/*  I passaggi sono quelli veri: programmato → in viaggio → sul posto  */
/*  → chiuso col rapportino → fatturato.                               */
/* ------------------------------------------------------------------ */

export const interventi = [
  {
    id: "n1",
    numero: "2026/318",
    clienteId: "c7",
    impiantoId: "i9",
    tecnicoId: "t2",
    tipo: "riparazione",
    titolo: "Perdita sotto lo scaldacqua",
    data: giorni(0),
    ora: "08:30",
    stato: "in_corso",
    durataOre: null,
    materiali: [],
    note: "",
    foto: 0,
    firmato: false,
    fatturato: false,
  },
  {
    id: "n2",
    numero: "2026/319",
    clienteId: "c8",
    impiantoId: "i10",
    tecnicoId: "t1",
    tipo: "riparazione",
    titolo: "Sfiato termosifoni e ripristino pressione",
    data: giorni(0),
    ora: "11:00",
    stato: "programmato",
    durataOre: null,
    materiali: [],
    note: "",
    foto: 0,
    firmato: false,
    fatturato: false,
  },
  {
    id: "n3",
    numero: "2026/320",
    clienteId: "c5",
    impiantoId: "i6",
    tecnicoId: "t1",
    tipo: "manutenzione",
    titolo: "Controllo annuale e bollino — interno 2",
    data: giorni(0),
    ora: "14:30",
    stato: "programmato",
    durataOre: null,
    materiali: [],
    note: "",
    foto: 0,
    firmato: false,
    fatturato: false,
  },
  {
    id: "n4",
    numero: "2026/321",
    clienteId: "c4",
    impiantoId: "i5",
    tecnicoId: "t3",
    tipo: "manutenzione",
    titolo: "Controllo semestrale pompa di calore",
    data: giorni(1),
    ora: "09:00",
    stato: "programmato",
    durataOre: null,
    materiali: [],
    note: "",
    foto: 0,
    firmato: false,
    fatturato: false,
  },
  {
    id: "n5",
    numero: "2026/317",
    clienteId: "c3",
    impiantoId: "i4",
    tecnicoId: "t2",
    tipo: "manutenzione",
    titolo: "Pulizia bollitore e sostituzione anodo",
    data: giorni(-1),
    ora: "09:30",
    stato: "chiuso",
    durataOre: 2.5,
    materiali: [
      { nome: "Anodo di magnesio", quantita: 1, prezzo: 38 },
      { nome: "Guarnizione flangia", quantita: 1, prezzo: 9 },
    ],
    note: "Bollitore molto incrostato. Consigliato addolcitore, il cliente ci pensa.",
    foto: 3,
    firmato: true,
    fatturato: false,
  },
  {
    id: "n6",
    numero: "2026/316",
    clienteId: "c1",
    impiantoId: "i1",
    tecnicoId: "t1",
    tipo: "manutenzione",
    titolo: "Controllo annuale — interno 3",
    data: giorni(-2),
    ora: "10:00",
    stato: "chiuso",
    durataOre: 1,
    materiali: [{ nome: "Kit guarnizioni", quantita: 1, prezzo: 14 }],
    note: "Pressione bassa, ricaricato. Da ricontrollare al prossimo giro.",
    foto: 2,
    firmato: true,
    fatturato: false,
  },
  {
    id: "n7",
    numero: "2026/312",
    clienteId: "c2",
    impiantoId: "i3",
    tecnicoId: "t2",
    tipo: "riparazione",
    titolo: "Sostituzione sonda NTC",
    data: giorni(-8),
    ora: "15:00",
    stato: "chiuso",
    durataOre: 1.5,
    materiali: [{ nome: "Sonda NTC Beretta", quantita: 1, prezzo: 32 }],
    note: "",
    foto: 1,
    firmato: true,
    fatturato: true,
  },
  {
    id: "n8",
    numero: "2026/309",
    clienteId: "c5",
    impiantoId: "i7",
    tecnicoId: "t3",
    tipo: "manutenzione",
    titolo: "Controllo annuale — interno 7",
    data: giorni(-12),
    ora: "11:30",
    stato: "chiuso",
    durataOre: 1,
    materiali: [],
    note: "",
    foto: 2,
    firmato: true,
    fatturato: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Documenti gia' archiviati. Pochi: il grosso e' ancora nella        */
/*  cartella condivisa, ed e' quello che il caricamento assistito      */
/*  porta dentro.                                                      */
/* ------------------------------------------------------------------ */

export const documenti = [
  { id: "d1", nome: "Libretto impianto Vaillant int.3.pdf", clienteId: "c1", impiantoId: "i1", tipo: "Libretto di impianto", caricatoIl: giorni(-320), dimensione: "1,1 MB" },
  { id: "d2", nome: "Contratto manutenzione 2026 Verdi.pdf", clienteId: "c1", impiantoId: null, tipo: "Contratto di manutenzione", caricatoIl: giorni(-210), dimensione: "260 KB" },
  { id: "d3", nome: "Rapportino 2026-317 firmato.pdf", clienteId: "c3", impiantoId: "i4", tipo: "Rapportino firmato", caricatoIl: giorni(-1), dimensione: "480 KB" },
  { id: "d4", nome: "Scheda tecnica Daikin Altherma.pdf", clienteId: "c4", impiantoId: "i5", tipo: "Scheda tecnica", caricatoIl: giorni(-150), dimensione: "2,3 MB" },
];

/** Listino dei ricambi usati più spesso: serve nel rapportino. */
export const listinoMateriali = [
  { nome: "Anodo di magnesio", prezzo: 38 },
  { nome: "Sonda NTC", prezzo: 32 },
  { nome: "Kit guarnizioni", prezzo: 14 },
  { nome: "Valvola di sfiato", prezzo: 11 },
  { nome: "Vaso di espansione 8 l", prezzo: 46 },
  { nome: "Pressostato acqua", prezzo: 28 },
  { nome: "Valvola termostatica", prezzo: 22 },
  { nome: "Flessibile inox 1/2", prezzo: 8 },
  { nome: "Manutenzione ordinaria (forfait)", prezzo: 70 },
];

/** Costo orario della manodopera usato nei conteggi del rapportino. */
export const COSTO_ORARIO = 35;

/** Stato iniziale completo della demo. */
export function statoIniziale() {
  return {
    clienti: [...clienti],
    impianti: [...impianti],
    richieste: [...richieste],
    interventi: [...interventi],
    tecnici: [...tecnici],
    documenti: [...documenti],
  };
}
