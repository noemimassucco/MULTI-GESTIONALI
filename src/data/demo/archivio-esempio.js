/**
 * Il mucchio di documenti che un'azienda si ritrova in una cartella condivisa
 * dopo anni di lavoro: nomi incoerenti, scansioni, foto del telefono, doppioni.
 *
 * Serve alla dimostrazione del caricamento assistito: sono i file che il
 * sistema deve riconoscere e archiviare da solo. Ognuno porta con sé la
 * risposta giusta (`tipo`, `clienteId`, `impiantoId`) e quanto il
 * riconoscimento è sicuro — perché la parte onesta della dimostrazione è
 * proprio che qualche file resta incerto e lo decide una persona.
 */

export const documentiArchivio = [
  {
    nome: "IMG_20240912_084512.jpg",
    peso: "2,4 MB",
    tipo: "Rapportino firmato",
    clienteId: "c1",
    impiantoId: "i1",
    sicurezza: 0.96,
    perche: "Foto di un rapportino con timbro Idrotermica e matricola 21-VL-44821 leggibile.",
  },
  {
    nome: "scansione0034.pdf",
    peso: "820 KB",
    tipo: "Libretto di impianto",
    clienteId: "c1",
    impiantoId: "i2",
    sicurezza: 0.93,
    perche: "Modello di libretto regionale, matricola 21-VL-44822 nel riquadro anagrafica.",
  },
  {
    nome: "conti anna - preventivo.pdf",
    peso: "180 KB",
    tipo: "Preventivo",
    clienteId: "c2",
    impiantoId: null,
    sicurezza: 0.91,
    perche: "Intestazione «Preventivo n. 41» e nominativo Conti Anna.",
  },
  {
    nome: "bollino verde 2024 scala A.pdf",
    peso: "310 KB",
    tipo: "Bollino / dichiarazione di conformità",
    clienteId: "c1",
    impiantoId: "i1",
    sicurezza: 0.89,
    perche: "Dichiarazione periodica con riferimento Condominio Verdi, scala A.",
  },
  {
    nome: "WhatsApp Image 2025-01-14 at 17.22.11.jpeg",
    peso: "1,1 MB",
    tipo: "Foto di intervento",
    clienteId: "c3",
    impiantoId: "i4",
    sicurezza: 0.78,
    perche: "Foto di un bollitore Ariston smontato; corrisponde all'intervento del Panificio Greco.",
  },
  {
    nome: "doc(3) copia FINALE.pdf",
    peso: "640 KB",
    tipo: "Contratto di manutenzione",
    clienteId: "c5",
    impiantoId: null,
    sicurezza: 0.86,
    perche: "Contratto annuale intestato al Condominio Le Betulle, 24 caldaie.",
  },
  {
    nome: "fattura_2026_0041.pdf",
    peso: "96 KB",
    tipo: "Fattura",
    clienteId: "c2",
    impiantoId: null,
    sicurezza: 0.95,
    perche: "Fattura elettronica in PDF, cliente Conti Anna, importo 122 €.",
  },
  {
    nome: "libretto caldaia ferroli.pdf",
    peso: "1,8 MB",
    tipo: "Libretto di impianto",
    clienteId: "c6",
    impiantoId: "i8",
    sicurezza: 0.92,
    perche: "Ferroli Atlas D 30, matricola 12-FE-55018, intestato a Bruno Paolo.",
  },
  {
    nome: "IMG-4471.HEIC",
    peso: "3,2 MB",
    tipo: null,
    clienteId: null,
    impiantoId: null,
    sicurezza: 0.31,
    perche: "Foto di un locale caldaia senza targhette leggibili né riferimenti al cliente.",
  },
  {
    nome: "documento senza nome.pdf",
    peso: "402 KB",
    tipo: "Preventivo",
    clienteId: null,
    impiantoId: null,
    sicurezza: 0.44,
    perche: "Sembra un preventivo, ma l'intestazione è tagliata: manca il nominativo.",
  },
  {
    nome: "scan_caldaia_2019_vecchio.pdf",
    peso: "1,3 MB",
    tipo: "Libretto di impianto",
    clienteId: "c8",
    impiantoId: "i10",
    sicurezza: 0.74,
    perche: "Baxi Duo-tec: la matricola è parzialmente illeggibile, corrisponde a un solo impianto.",
  },
  {
    nome: "verbale assemblea betulle.pdf",
    peso: "220 KB",
    tipo: "Documento amministrativo",
    clienteId: "c5",
    impiantoId: null,
    sicurezza: 0.88,
    perche: "Verbale di assemblea con delibera sulla manutenzione caldaie.",
  },
];

/** Quanti file mostra la simulazione in un colpo solo. */
export const TOTALE_ARCHIVIO = documentiArchivio.length;

/** Soglia sotto la quale il sistema non decide da solo e chiede conferma. */
export const SOGLIA_CERTEZZA = 0.8;
