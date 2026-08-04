import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";
import CtaBanner from "@/components/sito/CtaBanner";

export const metadata = {
  title: "Personalizzazioni",
  description:
    "Campi, sezioni, stati, ruoli, documenti, automazioni, importazioni: tutto quello che si può adattare in un gestionale perché rispecchi il tuo modo di lavorare.",
};

const gruppi = [
  {
    titolo: "Come si chiamano le cose",
    icona: "Layers",
    colore: "blu",
    testo:
      "Se in azienda dite «commessa» e non «progetto», il gestionale dice commessa. Il vocabolario è il vostro.",
    voci: [
      "Nomi delle sezioni e delle voci di menu",
      "Nomi dei campi e delle etichette",
      "Categorie e classificazioni interne",
      "Stati di avanzamento del lavoro",
      "Numerazioni e codici come li usate già",
    ],
  },
  {
    titolo: "Quali informazioni servono",
    icona: "Database",
    colore: "viola",
    testo:
      "Ogni azienda ha due o tre dati che nessun software standard prevede, e sono proprio quelli che contano.",
    voci: [
      "Campi aggiuntivi su qualsiasi scheda",
      "Campi obbligatori dove serve un controllo",
      "Elenchi a tendina con i vostri valori",
      "Calcoli e totali secondo le vostre regole",
      "Sezioni intere in più, se il lavoro le richiede",
    ],
  },
  {
    titolo: "Chi vede e chi tocca",
    icona: "UserCog",
    colore: "verde",
    testo:
      "Il tecnico in cantiere e l'ufficio amministrativo non devono vedere le stesse cose.",
    voci: [
      "Ruoli diversi per tipo di collaboratore",
      "Permessi di lettura e modifica per sezione",
      "Dati economici visibili solo a chi decidete",
      "Accesso limitato ai propri clienti o cantieri",
      "Registro di chi ha modificato cosa",
    ],
  },
  {
    titolo: "Documenti e modelli",
    icona: "FolderOpen",
    colore: "ambra",
    testo:
      "I documenti che escono dal gestionale devono avere la vostra faccia, non quella di un software.",
    voci: [
      "Logo, colori e intestazione aziendale",
      "Modelli di preventivo, rapportino, contratto",
      "Struttura delle cartelle come la usate oggi",
      "Documenti generati automaticamente dai dati",
      "Firma del cliente raccolta dal telefono",
    ],
  },
  {
    titolo: "Cosa fa da solo",
    icona: "Zap",
    colore: "rosa",
    testo:
      "Ogni operazione che ripetete uguale ogni settimana è un'operazione che il gestionale può fare al posto vostro.",
    voci: [
      "Promemoria e avvisi prima delle scadenze",
      "Manutenzioni programmate che si ripropongono da sole",
      "Email automatiche a clienti o collaboratori",
      "Passaggi di stato che si attivano da soli",
      "Riepiloghi periodici pronti a fine mese",
    ],
  },
  {
    titolo: "Dati dentro e dati fuori",
    icona: "Upload",
    colore: "ciano",
    testo:
      "Quello che avete già non si butta, e quello che c'è dentro deve poter uscire quando serve.",
    voci: [
      "Importazione delle anagrafiche dai vostri Excel",
      "Caricamento massivo dei documenti storici",
      "Esportazioni nel formato che vi serve davvero",
      "Riepiloghi da passare al commercialista",
      "Esportazione completa dei dati in qualsiasi momento",
    ],
  },
  {
    titolo: "Cosa guardate ogni mattina",
    icona: "LayoutGrid",
    colore: "indaco",
    testo:
      "La prima schermata deve rispondere alla domanda che vi fate appena accendete il computer.",
    voci: [
      "Dashboard diversa per ruolo",
      "Indicatori scelti da voi, non standard",
      "Elenco di cosa scade e cosa è fermo",
      "Scorciatoie alle azioni che fate più spesso",
      "Report costruiti sulle vostre domande",
    ],
  },
  {
    titolo: "Moduli aggiuntivi",
    icona: "Blocks",
    colore: "teal",
    testo:
      "Quando l'attività cambia, il gestionale si allarga invece di essere sostituito.",
    voci: [
      "Nuove aree di lavoro (magazzino, personale, commesse)",
      "Portale separato per i clienti finali",
      "Comunicazione interna e calendari condivisi",
      "Gestione economica per commessa o cantiere",
      "Integrazioni con strumenti che usate già, se possibili",
    ],
  },
];

export default function PaginaPersonalizzazioni() {
  return (
    <>
      <section className="border-b border-line bg-surface-blue py-12 sm:py-16">
        <Contenitore>
          <Pastiglia variante="brand">
            <Icona nome="Settings2" className="size-3.5" />
            La base è il punto di partenza
          </Pastiglia>
          <h1 className="mt-5 max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[42px]">
            Cosa si può cambiare
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-500 sm:text-base">
            Nessun gestionale a catalogo è un prodotto chiuso. Ognuno è una base già funzionante che
            viene cucita addosso a come lavorate voi. Qui trovi cosa si tocca, con esempi concreti.
          </p>
        </Contenitore>
      </section>

      <Sezione sfondo="bianco">
        <div className="grid gap-5 lg:grid-cols-2">
          {gruppi.map((g) => (
            <article key={g.titolo} className="rounded-2xl border border-line bg-white p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-11 items-center justify-center rounded-xl"
                  style={{ color: `var(--cat-${g.colore})`, background: `var(--cat-${g.colore}-bg)` }}
                >
                  <Icona nome={g.icona} className="size-5" />
                </span>
                <h2 className="text-[18px] font-bold leading-tight">{g.titolo}</h2>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-500">{g.testo}</p>
              <ul className="mt-5 space-y-2.5">
                {g.voci.map((v) => (
                  <li key={v} className="flex gap-2.5">
                    <Icona
                      nome="Check"
                      className="mt-0.5 size-4 shrink-0 text-brand-600"
                      strokeWidth={2.5}
                    />
                    <span className="text-[13.5px] leading-snug text-ink-600">{v}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Sezione>

      {/* Sezione IA: il differenziale vero */}
      <section className="bg-ink-900 py-16 sm:py-20">
        <Contenitore>
          <div className="mx-auto max-w-3xl text-center">
            <Pastiglia className="!bg-white/10 !text-brand-200 !ring-white/15">
              <Icona nome="Bot" className="size-3.5" />
              Compreso in ogni gestionale
            </Pastiglia>
            <h2 className="mt-5 !text-white text-[28px] font-bold leading-tight sm:text-[34px]">
              Il caricamento dei documenti assistito
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-400">
              È la personalizzazione che nessuno chiede perché nessuno sa che è possibile, ed è
              quella che cambia di più le prime settimane. Quasi tutte le aziende rinunciano a
              portare dentro il proprio archivio storico: sono centinaia o migliaia di file, e
              caricarli a mano uno per uno significa settimane di lavoro che nessuno ha.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-4">
            {[
              { n: "1", icona: "Upload", t: "Carichi tutto", d: "Cartelle intere o archivi ZIP, con i nomi che hanno adesso." },
              { n: "2", icona: "ScanLine", t: "Legge e capisce", d: "Riconosce se è un contratto, una fattura, un certificato, un rapportino." },
              { n: "3", icona: "FolderOpen", t: "Archivia da solo", d: "Collega ogni file alla scheda del cliente, dell'immobile o del cantiere." },
              { n: "4", icona: "CheckCircle2", t: "Controlli tu", d: "I dubbi finiscono in una lista a parte: decidi tu, il sistema impara." },
            ].map((c) => (
              <div key={c.n} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600/20 text-brand-300">
                  <Icona nome={c.icona} className="size-[18px]" />
                </span>
                <p className="mt-4 !text-white text-[14.5px] font-semibold">{c.t}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-400">{c.d}</p>
              </div>
            ))}
          </div>
        </Contenitore>
      </section>

      <Sezione sfondo="alt">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8">
          <h2 className="text-[22px] font-bold">Quello che invece non prometto</h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-600">
            Preferisco essere chiara prima che dopo. I miei gestionali organizzano il lavoro:
            anagrafiche, attività, documenti, scadenze, ore, costi. Non sostituiscono il software
            fiscale o le paghe, non inviano documenti agli enti pubblici e non garantiscono
            adempimenti di legge. Dove serve un&apos;integrazione con quello che usate già, la
            valutiamo insieme e vi dico onestamente se è fattibile e quanto costa.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Nessun vincolo di permanenza", "Dati esportabili sempre", "Preventivo scritto prima di iniziare"].map(
              (t) => (
                <Pastiglia key={t} variante="contorno">
                  <Icona nome="Check" className="size-3" />
                  {t}
                </Pastiglia>
              ),
            )}
          </div>
        </div>
      </Sezione>

      <CtaBanner
        titolo="Hai in mente una modifica che non è in elenco?"
        testo="Quasi sempre si può fare. Descrivimela e ti dico se è fattibile, quanto tempo serve e quanto costa."
        azione={{ href: "/richiedi", label: "Descrivi cosa ti serve" }}
        secondaria={{ href: "/gestionali", label: "Guarda i gestionali" }}
      />
    </>
  );
}
