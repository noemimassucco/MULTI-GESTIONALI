/**
 * Le regole dell'assistente.
 *
 * Ogni regola è una funzione pura: riceve i dati della demo e restituisce
 * un avviso, oppure null quando non ha niente da dire. Niente stato,
 * niente interfaccia: qui c'è solo il ragionamento, e si legge tutto.
 *
 * Forma dell'avviso:
 *   { id, gravita: "alta" | "media" | "info", titolo, testo, valore?, azione? }
 */

import { euro, giorniDaOggi } from "@/components/demo/StatoDemo";
import { totaleIntervento } from "@/components/demo/ElementiInterventi";
import { avanzamentoDi, contiCommessa } from "@/components/demo/ElementiCommesse";
import { MARGINE_ATTESO } from "@/data/demo/commesse";

/* ------------------------------------------------------------------ */
/*  Aiuti condivisi: servono a scrivere frasi che citano nomi e conti  */
/* ------------------------------------------------------------------ */

/** Quanto vale un richiamo: la manutenzione ordinaria a listino. */
const VALORE_RICHIAMO = 70;

/** 1 → "1 impianto", 3 → "3 impianti" */
const conta = (n, uno, molti) => `${n} ${n === 1 ? uno : molti}`;

/** Da quanti giorni: "ieri", "oggi", "3 giorni fa". */
function giorniFa(iso) {
  const g = -giorniDaOggi(iso);
  if (g <= 0) return "oggi";
  return g === 1 ? "ieri" : `${g} giorni fa`;
}

/** Da quanto dura una situazione: "da ieri", "da 5 giorni". */
function daQuando(iso) {
  const g = -giorniDaOggi(iso);
  if (g <= 0) return "da stamattina";
  return g === 1 ? "da ieri" : `da ${g} giorni`;
}

/** Anni compiuti da una data. */
const anniDa = (iso) => Math.floor(-giorniDaOggi(iso) / 365.25);

/** ["A","B","C"] → "A, B e C"; con più voci → "A, B e altri 2". */
function elenco(voci, altri = "altri", max = 2) {
  const v = [...new Set(voci.filter(Boolean))];
  if (!v.length) return "";
  if (v.length === 1) return v[0];
  if (v.length <= max + 1) return `${v.slice(0, -1).join(", ")} e ${v[v.length - 1]}`;
  return `${v.slice(0, max).join(", ")} e ${altri} ${v.length - max}`;
}

const nomeCliente = (dati, id) =>
  (dati.clienti || []).find((c) => c.id === id)?.nome || "cliente non indicato";

const nomeImpianto = (impianto) =>
  [impianto?.marca, impianto?.modello].filter(Boolean).join(" ") || "impianto";

/* ================================================================== */
/*  Interventi — Idrotermica Sabaudia                                  */
/* ================================================================== */

const BASE_INT = "/demo/interventi";

/** Richieste ancora vive: chiuse e annullate non contano. */
const richiestaAperta = (r) => r.stato !== "chiusa" && r.stato !== "annullata";

/**
 * a) Bollino scaduto e nessuno che ha richiamato.
 * È il buco più caro del mestiere: il cliente c'è già, il lavoro è già suo.
 */
function bolliniScoperti(dati) {
  const conRichiesta = new Set(
    (dati.richieste || []).filter((r) => richiestaAperta(r) && r.impiantoId).map((r) => r.impiantoId),
  );
  const scoperti = (dati.impianti || []).filter(
    (im) => im.bollino === "scaduto" && !conRichiesta.has(im.id),
  );
  if (!scoperti.length) return null;

  const perCliente = new Map();
  scoperti.forEach((im) => {
    const nome = nomeCliente(dati, im.clienteId);
    perCliente.set(nome, (perCliente.get(nome) || 0) + 1);
  });
  const clienti = elenco(
    [...perCliente.entries()].map(([nome, quanti]) =>
      quanti > 1 ? `${nome} (${conta(quanti, "impianto", "impianti")})` : nome,
    ),
  );

  return {
    id: "bollini-scoperti",
    gravita: "alta",
    titolo: `${conta(scoperti.length, "impianto", "impianti")} con il bollino scaduto e nessuna richiesta aperta`,
    testo: `Riguarda ${clienti}. Il controllo è dovuto, il cliente è già vostro e nessuno lo ha ancora chiamato: è lavoro acquisito che si sta perdendo, ${euro(VALORE_RICHIAMO)} di manutenzione ordinaria per impianto.`,
    valore: euro(scoperti.length * VALORE_RICHIAMO),
    azione: { testo: "Apri i richiami da fare", href: `${BASE_INT}/richiami` },
  };
}

/**
 * b) Rapportini chiusi e firmati, ma mai diventati fattura.
 */
function chiusiNonFatturati(dati) {
  const fermi = (dati.interventi || []).filter(
    (n) => n.stato === "chiuso" && !n.fatturato && giorniDaOggi(n.data) < -7,
  );
  if (!fermi.length) return null;

  const somma = fermi.reduce((tot, n) => tot + totaleIntervento(n).totale, 0);
  const piuVecchio = [...fermi].sort((a, b) => a.data.localeCompare(b.data))[0];
  return {
    id: "chiusi-non-fatturati",
    gravita: "alta",
    titolo: `${conta(fermi.length, "intervento chiuso", "interventi chiusi")} da più di una settimana e ancora non fatturati`,
    testo: `Il più vecchio è il ${piuVecchio.numero} di ${nomeCliente(dati, piuVecchio.clienteId)}, chiuso ${giorniFa(piuVecchio.data)} e già firmato dal cliente. Il lavoro è fatto e pagato in ore: manca solo il documento.`,
    valore: euro(somma),
    azione: { testo: "Vai a quello che c'è da fatturare", href: `${BASE_INT}/fatturare` },
  };
}

/**
 * c) Impianti che tornano sempre: tre uscite in un anno valgono
 *    più di un preventivo di sostituzione.
 */
function impiantiCheTornano(dati) {
  const recenti = (dati.interventi || []).filter((n) => giorniDaOggi(n.data) >= -365);
  const conteggi = recenti.reduce((acc, n) => {
    if (n.impiantoId) acc[n.impiantoId] = (acc[n.impiantoId] || 0) + 1;
    return acc;
  }, {});
  const ripetuti = (dati.impianti || [])
    .filter((im) => (conteggi[im.id] || 0) >= 3)
    .sort((a, b) => conteggi[b.id] - conteggi[a.id]);
  if (!ripetuti.length) return null;

  const primo = ripetuti[0];
  const quanti = conteggi[primo.id];
  return {
    id: "impianti-che-tornano",
    gravita: "media",
    titolo:
      ripetuti.length === 1
        ? "Un impianto vi ha richiamati tre volte in un anno"
        : `${conta(ripetuti.length, "impianto", "impianti")} con tre o più interventi in dodici mesi`,
    testo: `${nomeImpianto(primo)} di ${nomeCliente(dati, primo.clienteId)}: ${conta(quanti, "intervento", "interventi")} in un anno. A furia di riparazioni il cliente spende più che a cambiarla, e la sostituzione la fate voi. È il momento buono per proporre un preventivo.`,
    azione: { testo: "Guarda lo storico dell'impianto", href: `${BASE_INT}/impianti` },
  };
}

/**
 * d) Urgenze entrate e rimaste lì: sono le telefonate arrabbiate di domani.
 */
function urgenzeFerme(dati) {
  const ferme = (dati.richieste || []).filter(
    (r) => r.urgenza === "alta" && r.stato === "da_programmare" && giorniDaOggi(r.ricevutaIl) < -1,
  );
  if (!ferme.length) return null;

  const piuVecchia = [...ferme].sort((a, b) => a.ricevutaIl.localeCompare(b.ricevutaIl))[0];
  return {
    id: "urgenze-ferme",
    gravita: "alta",
    titolo: `${conta(ferme.length, "richiesta urgente", "richieste urgenti")} ancora senza una data`,
    testo: `«${piuVecchia.oggetto}» di ${nomeCliente(dati, piuVecchia.clienteId)} è arrivata ${giorniFa(piuVecchia.ricevutaIl)} ed è ancora da programmare. Un'urgenza che resta ferma diventa un cliente che chiama qualcun altro.`,
    azione: { testo: "Programma le richieste", href: `${BASE_INT}/richieste` },
  };
}

/**
 * e) Contratto di manutenzione pagato, servizio non erogato.
 */
function contrattiSenzaIntervento(dati) {
  const interventi = dati.interventi || [];
  const scoperti = (dati.clienti || []).filter((c) => {
    if (!c.contratto) return false;
    return !interventi.some(
      (n) => n.clienteId === c.id && n.stato === "chiuso" && giorniDaOggi(n.data) >= -180,
    );
  });
  if (!scoperti.length) return null;

  const primo = scoperti[0];
  const suoi = interventi
    .filter((n) => n.clienteId === primo.id && n.stato === "chiuso")
    .sort((a, b) => b.data.localeCompare(a.data));
  const quando = suoi.length
    ? `l'ultimo intervento chiuso risale a ${giorniFa(suoi[0].data)}`
    : "non risulta nessun intervento chiuso";

  return {
    id: "contratti-senza-intervento",
    gravita: "media",
    titolo: `${conta(scoperti.length, "cliente a contratto", "clienti a contratto")} senza interventi chiusi negli ultimi sei mesi`,
    testo: `${primo.nome} (${primo.contratto}): ${quando}. Il canone lo pagano lo stesso, e prima o poi qualcuno fa il conto di quante uscite ha avuto davvero. Meglio arrivarci prima voi.`,
    azione: { testo: "Apri la scheda cliente", href: `${BASE_INT}/clienti` },
  };
}

/**
 * f) Un tecnico fermo e uno pieno: la giornata si può pareggiare.
 */
function caricoSbilanciato(dati) {
  const tecnici = dati.tecnici || [];
  if (tecnici.length < 2) return null;

  const programmati = (dati.interventi || []).filter((n) => n.stato === "programmato");
  const carico = (id) => programmati.filter((n) => n.tecnicoId === id).length;

  const fermi = tecnici.filter((t) => carico(t.id) === 0);
  const pieni = tecnici.filter((t) => carico(t.id) >= 2).sort((a, b) => carico(b.id) - carico(a.id));
  if (!fermi.length || !pieni.length) return null;

  const pieno = pieni[0];
  const fermo = fermi[0];
  return {
    id: "carico-sbilanciato",
    gravita: "info",
    titolo: "Il carico di oggi non è pari fra i tecnici",
    testo: `${pieno.nome} ha ${conta(carico(pieno.id), "intervento programmato", "interventi programmati")}, ${fermo.nome} nessuno. Spostarne uno accorcia la giornata di ${pieno.nome.split(" ")[0]} senza allungare quella di nessun altro.`,
    azione: { testo: "Riorganizza gli interventi", href: `${BASE_INT}/interventi` },
  };
}

/**
 * g) Impianti vecchi: non è un problema di oggi, è un preventivo di domani.
 */
function impiantiVecchi(dati) {
  const vecchi = (dati.impianti || [])
    .filter((im) => im.installato && anniDa(im.installato) >= 12)
    .sort((a, b) => a.installato.localeCompare(b.installato));
  if (!vecchi.length) return null;

  const primo = vecchi[0];
  return {
    id: "impianti-vecchi",
    gravita: "info",
    titolo: `${conta(vecchi.length, "impianto installato", "impianti installati")} da più di dodici anni`,
    testo: `Il più datato è ${nomeImpianto(primo)} di ${nomeCliente(dati, primo.clienteId)}, in funzione da ${anniDa(primo.installato)} anni. Non è un'emergenza: è la lista da tenere a portata quando si parla di incentivi o di sostituzione.`,
    azione: { testo: "Vedi il parco impianti", href: `${BASE_INT}/impianti` },
  };
}

export const regoleInterventi = [
  bolliniScoperti,
  chiusiNonFatturati,
  impiantiCheTornano,
  urgenzeFerme,
  contrattiSenzaIntervento,
  caricoSbilanciato,
  impiantiVecchi,
];

/* ================================================================== */
/*  Clienti e attività — Studio Rossi                                  */
/* ================================================================== */

const BASE_CA = "/demo/clienti-attivita";

/**
 * a) Attività oltre la scadenza e ancora aperte.
 */
function attivitaScadute(dati) {
  const scadute = (dati.attivita || []).filter(
    (a) => a.stato !== "completata" && giorniDaOggi(a.scadenza) < 0,
  );
  if (!scadute.length) return null;

  const piuVecchia = [...scadute].sort((a, b) => a.scadenza.localeCompare(b.scadenza))[0];
  return {
    id: "attivita-scadute",
    gravita: "alta",
    titolo: `${conta(scadute.length, "attività è", "attività sono")} oltre la scadenza`,
    testo: `La più indietro è «${piuVecchia.titolo}» per ${nomeCliente(dati, piuVecchia.clienteId)}, scaduta ${giorniFa(piuVecchia.scadenza)} e in carico a ${piuVecchia.responsabile}. Sono le cose che il cliente ricorda meglio di voi.`,
    azione: { testo: "Apri le attività", href: `${BASE_CA}/attivita` },
  };
}

/**
 * b) Fatture oltre la data: il lavoro è fatto, i soldi no.
 */
function pagamentiInRitardo(dati) {
  const ritardo = (dati.pagamenti || []).filter((g) => g.stato === "in_ritardo");
  if (!ritardo.length) return null;

  const somma = ritardo.reduce((tot, g) => tot + g.importo, 0);
  const piuGrossa = [...ritardo].sort((a, b) => b.importo - a.importo)[0];
  return {
    id: "pagamenti-in-ritardo",
    gravita: "alta",
    titolo: `${conta(ritardo.length, "fattura", "fatture")} oltre la data di incasso`,
    testo: `La più pesante è ${euro(piuGrossa.importo)} di ${nomeCliente(dati, piuGrossa.clienteId)} (${piuGrossa.descrizione}), attesa ${daQuando(piuGrossa.data)}. Un sollecito scritto oggi costa cinque minuti e di solito basta.`,
    valore: euro(somma),
    azione: { testo: "Vedi incassi e report", href: `${BASE_CA}/report` },
  };
}

/**
 * c) Preventivi inviati e mai richiamati: si perdono per silenzio, non per prezzo.
 */
function preventiviSenzaRisposta(dati) {
  const fermi = (dati.preventivi || []).filter(
    (p) => p.stato === "inviato" && giorniDaOggi(p.data) < -7,
  );
  if (!fermi.length) return null;

  const somma = fermi.reduce((tot, p) => tot + p.importo, 0);
  const primo = [...fermi].sort((a, b) => a.data.localeCompare(b.data))[0];
  return {
    id: "preventivi-senza-risposta",
    gravita: "media",
    titolo: `${conta(fermi.length, "preventivo inviato", "preventivi inviati")} e senza risposta da più di una settimana`,
    testo: `Il ${primo.numero} a ${nomeCliente(dati, primo.clienteId)} (${primo.oggetto}) è partito ${giorniFa(primo.data)} e nessuno lo ha più richiamato. Un preventivo si perde quasi sempre per silenzio, non per il prezzo.`,
    valore: euro(somma),
    azione: { testo: "Apri i preventivi", href: `${BASE_CA}/preventivi` },
  };
}

/**
 * d) Potenziali clienti senza niente di aperto: prima o poi si dimenticano.
 */
function prospectAbbandonati(dati) {
  const aperte = (dati.attivita || []).filter((a) => a.stato !== "completata");
  const dimenticati = (dati.clienti || []).filter(
    (c) => c.stato === "prospect" && !aperte.some((a) => a.clienteId === c.id),
  );
  if (!dimenticati.length) return null;

  return {
    id: "prospect-abbandonati",
    gravita: "info",
    titolo: `${conta(dimenticati.length, "potenziale cliente", "potenziali clienti")} senza nessuna attività aperta`,
    testo: `${elenco(dimenticati.map((c) => c.nome))}: sono in elenco ma non c'è niente in programma con loro. Basta un'attività di richiamo perché non spariscano dal radar.`,
    azione: { testo: "Vai all'anagrafica", href: `${BASE_CA}/clienti` },
  };
}

/**
 * e) Attività in attesa da troppo: il blocco è quasi sempre di qualcun altro.
 */
function attesaProlungata(dati) {
  const bloccate = (dati.attivita || []).filter(
    (a) => a.stato === "in_attesa" && giorniDaOggi(a.scadenza) < -5,
  );
  if (!bloccate.length) return null;

  const prima = [...bloccate].sort((a, b) => a.scadenza.localeCompare(b.scadenza))[0];
  return {
    id: "attese-prolungate",
    gravita: "media",
    titolo: `${conta(bloccate.length, "attività ferma", "attività ferme")} in attesa da più di cinque giorni`,
    testo: `«${prima.titolo}» per ${nomeCliente(dati, prima.clienteId)} aspetta ${daQuando(prima.scadenza)}. Chi la sta aspettando non lo sa: ${prima.responsabile} può sollecitare in un minuto.`,
    azione: { testo: "Apri le attività", href: `${BASE_CA}/attivita` },
  };
}

/**
 * f) Preventivi scritti e mai spediti: il lavoro più inutile che ci sia.
 */
function preventiviInBozza(dati) {
  const bozze = (dati.preventivi || []).filter(
    (p) => p.stato === "bozza" && giorniDaOggi(p.data) < -3,
  );
  if (!bozze.length) return null;

  const somma = bozze.reduce((tot, p) => tot + p.importo, 0);
  const primo = [...bozze].sort((a, b) => a.data.localeCompare(b.data))[0];
  return {
    id: "preventivi-in-bozza",
    gravita: "info",
    titolo: `${conta(bozze.length, "preventivo scritto", "preventivi scritti")} e mai inviato`,
    testo: `Il ${primo.numero} per ${nomeCliente(dati, primo.clienteId)} (${primo.oggetto}) è in bozza ${daQuando(primo.data)}. È già stato fatto il lavoro di scriverlo: manca solo premere invia.`,
    valore: euro(somma),
    azione: { testo: "Apri i preventivi", href: `${BASE_CA}/preventivi` },
  };
}

export const regoleClientiAttivita = [
  attivitaScadute,
  pagamentiInRitardo,
  preventiviSenzaRisposta,
  prospectAbbandonati,
  attesaProlungata,
  preventiviInBozza,
];

/* ================================================================== */
/*  Commesse — Costruzioni Ferraris                                    */
/*                                                                     */
/*  In edilizia i soldi non si perdono di colpo: se ne va un pezzo     */
/*  alla volta, e ci si accorge alla fine. Queste regole guardano i    */
/*  numeri ogni giorno al posto del titolare.                          */
/* ================================================================== */

const BASE_CO = "/demo/commesse";

/** I cantieri che stanno ancora andando: sugli altri non c'è più niente da fare. */
const cantieriAperti = (dati) => (dati.commesse || []).filter((k) => k.stato === "in_corso");

/**
 * a) Il cantiere sta consumando più di quello che ha prodotto.
 *    È la regola più importante di tutte: dice oggi quello che il
 *    consuntivo direbbe fra sei mesi.
 */
function margineEroso(dati) {
  const malati = cantieriAperti(dati)
    .map((k) => ({ k, c: contiCommessa(k, dati) }))
    .filter(({ c }) => c.proiettabile && c.marginePrevistoPct < MARGINE_ATTESO * 0.5)
    .sort((a, b) => a.c.marginePrevistoPct - b.c.marginePrevistoPct);
  if (!malati.length) return null;

  const { k, c } = malati[0];
  const differenza = c.margine - c.marginePrevisto;

  return {
    id: "margine-eroso",
    gravita: "alta",
    titolo:
      malati.length === 1
        ? `${k.numero} chiuderà al ${c.marginePrevistoPct}%, non al ${c.marginePct}% che risulta oggi`
        : `${conta(malati.length, "cantiere", "cantieri")} sotto la metà del margine atteso`,
    testo: `${k.titolo} (${nomeCliente(dati, k.clienteId)}) è al ${c.avanzamento}% e ha già speso ${euro(c.costo)}. Allo stesso ritmo il cantiere costerà ${euro(c.costoAFinire)} contro ${euro(c.ricavo)} di contratto. Sul contratto il margine sembra ancora ${euro(c.margine)}: sono ${euro(differenza)} che non ci sono. Adesso si può ancora intervenire sulle lavorazioni che restano.`,
    valore: `${c.marginePrevistoPct}%`,
    azione: { testo: "Apri i conti del cantiere", href: `${BASE_CO}/commesse/${k.id}` },
  };
}

/**
 * b) Lavori fatti in più e mai messi per iscritto.
 *    Il costo è già uscito, l'incasso non lo deve nessuno.
 */
function variantiScoperte(dati) {
  const scoperte = (dati.varianti || []).filter((v) => v.stato === "eseguita");
  if (!scoperte.length) return null;

  const valore = scoperte.reduce((s, v) => s + v.importo, 0);
  const costo = scoperte.reduce((s, v) => s + v.costoStimato, 0);
  const prima = [...scoperte].sort((a, b) => a.data.localeCompare(b.data))[0];
  const commessa = (dati.commesse || []).find((k) => k.id === prima.commessaId);

  return {
    id: "varianti-scoperte",
    gravita: "alta",
    titolo: `${conta(scoperte.length, "lavoro eseguito", "lavori eseguiti")} in più e mai approvato per iscritto`,
    testo: `Il più vecchio è «${prima.titolo}» sul ${commessa?.numero || "cantiere"} di ${nomeCliente(dati, commessa?.clienteId)}, fatto ${giorniFa(prima.data)}. Vi è costato ${euro(costo)} in ore e materiali e oggi non c'è una firma che lo renda esigibile. In cantiere si fa e poi ci si dimentica: è il modo più comune di regalare lavoro.`,
    valore: euro(valore),
    azione: { testo: "Manda le varianti in approvazione", href: `${BASE_CO}/varianti` },
  };
}

/**
 * c) Lavoro prodotto e mai messo in un SAL: soldi maturati, non chiesti.
 */
function avanzamentoNonFatturato(dati) {
  const scoperti = cantieriAperti(dati)
    .map((k) => ({ k, c: contiCommessa(k, dati) }))
    .filter(({ c }) => c.daFatturare >= 5000)
    .sort((a, b) => b.c.daFatturare - a.c.daFatturare);
  if (!scoperti.length) return null;

  const somma = scoperti.reduce((s, { c }) => s + c.daFatturare, 0);
  const { k, c } = scoperti[0];

  return {
    id: "avanzamento-non-fatturato",
    gravita: "alta",
    titolo: `${euro(somma)} di lavoro già eseguito e non ancora messo in un SAL`,
    testo: `Su ${k.numero} (${nomeCliente(dati, k.clienteId)}) l'avanzamento è al ${c.avanzamento}%, cioè ${euro(c.prodotto)}, ma finora è stato fatturato ${euro(c.fatturato)}. Sono ${euro(c.daFatturare)} già spesi in ore e materiali che state anticipando voi alla banca.`,
    valore: euro(somma),
    azione: { testo: "Prepara lo stato di avanzamento", href: `${BASE_CO}/avanzamento` },
  };
}

/**
 * d) SAL emessi e mai incassati.
 */
function salNonIncassati(dati) {
  const fermi = (dati.sal || []).filter((q) => !q.fatturato && giorniDaOggi(q.data) < -10);
  if (!fermi.length) return null;

  const somma = fermi.reduce((s, q) => s + q.importo, 0);
  const primo = [...fermi].sort((a, b) => a.data.localeCompare(b.data))[0];
  const commessa = (dati.commesse || []).find((k) => k.id === primo.commessaId);

  return {
    id: "sal-non-incassati",
    gravita: "media",
    titolo: `${conta(fermi.length, "SAL approvato", "SAL approvati")} e non ancora fatturato`,
    testo: `Il ${primo.numero} di ${commessa?.numero || "un cantiere"} (${nomeCliente(dati, commessa?.clienteId)}) è stato chiuso ${giorniFa(primo.data)} per ${euro(primo.importo)}. I lavori sono consegnati: manca solo il documento perché diventino soldi.`,
    valore: euro(somma),
    azione: { testo: "Vai all'avanzamento", href: `${BASE_CO}/avanzamento` },
  };
}

/**
 * e) Squadre ferme su un cantiere da troppo: le ore non registrate
 *    sono costi che compaiono tutti insieme a fine mese.
 */
function oreNonRegistrate(dati) {
  const scoperti = cantieriAperti(dati)
    .map((k) => {
      const righe = (dati.ore || []).filter((r) => r.commessaId === k.id);
      const ultima = righe.sort((a, b) => b.data.localeCompare(a.data))[0];
      return { k, giorni: ultima ? -giorniDaOggi(ultima.data) : null };
    })
    .filter(({ giorni: g }) => g === null || g > 10)
    .sort((a, b) => (b.giorni ?? 999) - (a.giorni ?? 999));
  if (!scoperti.length) return null;

  const { k, giorni: g } = scoperti[0];
  return {
    id: "ore-non-registrate",
    gravita: "media",
    titolo: `${conta(scoperti.length, "cantiere aperto", "cantieri aperti")} senza ore registrate di recente`,
    testo:
      g === null
        ? `Su ${k.numero} (${k.titolo}) non risulta ancora nessuna ora. Finché non ci sono, il costo del cantiere sembra più basso di quello che è.`
        : `Su ${k.numero} l'ultima registrazione è di ${g} giorni fa, ma la squadra ci sta lavorando. Ogni settimana che manca fa sembrare il margine più alto del vero, e poi arriva tutto insieme.`,
    azione: { testo: "Registra le ore", href: `${BASE_CO}/ore` },
  };
}

/**
 * f) DDT arrivati senza fattura: costo reale che non è ancora nei conti.
 */
function fornituraSenzaFattura(dati) {
  const senza = (dati.acquisti || []).filter((a) => !a.fattura && giorniDaOggi(a.data) < -20);
  if (!senza.length) return null;

  const somma = senza.reduce((s, a) => s + a.importo, 0);
  const fornitori = elenco(senza.map((a) => a.fornitore));
  const primo = [...senza].sort((a, b) => a.data.localeCompare(b.data))[0];

  return {
    id: "fornitura-senza-fattura",
    gravita: "info",
    titolo: `${conta(senza.length, "fornitura consegnata", "forniture consegnate")} e ancora senza fattura`,
    testo: `${fornitori}. La più vecchia è «${primo.descrizione}» di ${euro(primo.importo)}, consegnata ${giorniFa(primo.data)}. Il materiale è in cantiere e il costo c'è già: quando arriveranno tutte insieme, il mese sembrerà peggiore di com'è andato.`,
    valore: euro(somma),
    azione: { testo: "Controlla gli acquisti", href: `${BASE_CO}/acquisti` },
  };
}

/**
 * g) Ritenute a garanzia dimenticate sui cantieri già chiusi.
 */
function ritenuteDaSvincolare(dati) {
  const chiuse = (dati.commesse || []).filter(
    (k) => (k.stato === "chiusa" || k.stato === "consegnata") && k.ritenutaGaranzia > 0,
  );
  const conRitenuta = chiuse
    .map((k) => ({ k, c: contiCommessa(k, dati) }))
    .filter(({ c }) => c.ritenuta > 0);
  if (!conRitenuta.length) return null;

  const somma = conRitenuta.reduce((s, { c }) => s + c.ritenuta, 0);
  const { k, c } = conRitenuta[0];

  return {
    id: "ritenute-da-svincolare",
    gravita: "info",
    titolo: `${euro(somma)} di ritenute a garanzia mai richiesti indietro`,
    testo: `Su ${k.numero} (${nomeCliente(dati, k.clienteId)}) è trattenuto il ${k.ritenutaGaranzia}%, cioè ${euro(c.ritenuta)}. Passato il periodo di garanzia si possono chiedere, ma se nessuno se ne ricorda restano lì: è denaro già guadagnato.`,
    valore: euro(somma),
    azione: { testo: "Vedi i cantieri chiusi", href: `${BASE_CO}/commesse` },
  };
}

/**
 * h) Cantieri che stanno per sforare la data di consegna.
 */
function consegneInRitardo(dati) {
  const arretrati = cantieriAperti(dati)
    .filter((k) => k.finePrevista)
    .map((k) => ({ k, giorni: giorniDaOggi(k.finePrevista), avanzamento: avanzamentoDi(k) }))
    .filter(({ giorni: g, avanzamento }) => g <= 30 && avanzamento < 90)
    .sort((a, b) => a.giorni - b.giorni);
  if (!arretrati.length) return null;

  const { k, giorni: g, avanzamento } = arretrati[0];
  const quando = g < 0 ? `scaduta da ${-g} giorni` : g === 0 ? "è oggi" : `fra ${g} giorni`;

  return {
    id: "consegne-in-ritardo",
    gravita: "media",
    titolo: `${k.numero} è al ${avanzamento}% e la consegna ${quando}`,
    testo: `${k.titolo} per ${nomeCliente(dati, k.clienteId)}. Le fasi ancora indietro sono ${elenco(k.fasi.filter((f) => f.avanzamento < 100).map((f) => f.nome.toLowerCase()))}. Avvisare il cliente adesso costa una telefonata; avvisarlo il giorno della consegna costa il cliente.`,
    azione: { testo: "Guarda le fasi", href: `${BASE_CO}/commesse/${k.id}` },
  };
}

export const regoleCommesse = [
  margineEroso,
  variantiScoperte,
  avanzamentoNonFatturato,
  salNonIncassati,
  oreNonRegistrate,
  fornituraSenzaFattura,
  ritenuteDaSvincolare,
  consegneInRitardo,
];
