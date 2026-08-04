import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";
import CtaBanner from "@/components/sito/CtaBanner";
import { sito } from "@/lib/sito";

export const metadata = {
  title: "Chi sono",
  description:
    "Mi chiamo Noemi. Prima di sviluppare software ho lavorato per anni in un'azienda di impianti: i gestionali che costruisco nascono da lì.",
};

/* Il testo di questa pagina è scritto da Noemi: si tocca solo con il suo consenso. */
const racconto = [
  "Mi chiamo Noemi e, prima ancora di iniziare a sviluppare software, ho lavorato per anni all'interno di un'azienda che si occupava di impianti.",
  "Lì ho vissuto in prima persona tutte le difficoltà dell'organizzazione aziendale: fogli Excel infiniti, documenti sparsi, informazioni difficili da trovare, procedure ripetitive e software che obbligavano l'azienda ad adattarsi al programma, invece del contrario.",
  "Essendo da sempre appassionata di informatica e tecnologia, ho iniziato a cercare gestionali che potessero davvero semplificare il nostro lavoro. Il problema era sempre lo stesso: ogni software faceva qualcosa di utile, ma nessuno riusciva a seguire realmente il modo in cui lavoravamo.",
  "Molte operazioni richiedevano passaggi inutili, alcune funzioni erano rigide, mancavano importazioni personalizzate, le esportazioni non erano come servivano a noi e, soprattutto, ogni volta che nasceva una nuova esigenza era l'azienda a dover cambiare metodo di lavoro.",
  "Con il tempo mi sono resa conto che il problema non erano le aziende. Il problema era che quasi tutti i gestionali erano progettati pensando a uno standard uguale per tutti.",
];

const idea = [
  "Non voglio creare l'ennesimo gestionale. Voglio creare una raccolta di gestionali intelligenti, semplici e modulari, costruiti partendo dal lavoro reale delle persone.",
  "Ogni settore ha esigenze diverse. Un'impresa di pulizie lavora in modo diverso da un geometra. Un amministratore immobiliare ha necessità completamente differenti rispetto a un'officina.",
  "Per questo ogni gestionale parte da una base già pronta, ma può essere personalizzato fino a rispecchiare il modo di lavorare del cliente, senza costringerlo a cambiare le proprie procedure.",
  "Credo che la tecnologia debba adattarsi alle aziende, non il contrario. Per questo ogni progetto nasce ascoltando chi il lavoro lo svolge davvero ogni giorno.",
];

const obiettivo = [
  "Voglio aiutare aziende, professionisti e artigiani a lavorare meglio, perdere meno tempo e avere finalmente uno strumento che organizzi davvero il loro lavoro.",
  "E oggi, grazie all'intelligenza artificiale, questo è possibile più che mai. Utilizzo l'AI non per sostituire il mio lavoro, ma per accelerare lo sviluppo, progettare soluzioni migliori e creare funzionalità innovative.",
  "L'obiettivo è costruire gestionali sempre più intelligenti, capaci di assistere l'utente durante il lavoro quotidiano. Non un semplice archivio di dati, ma un assistente digitale che aiuta a prendere decisioni, automatizzare attività ripetitive, trovare rapidamente le informazioni importanti e suggerire opportunità di miglioramento.",
  "Per me un gestionale del futuro non deve limitarsi a registrare ciò che succede. Deve diventare un collaboratore intelligente che fa risparmiare tempo ogni giorno.",
];

const principi = [
  {
    icona: "Users",
    titolo: "Ascolto prima di scrivere codice",
    testo: "Ogni progetto parte dalle procedure di chi il lavoro lo fa davvero, non da un modello standard.",
  },
  {
    icona: "Layers",
    titolo: "Semplice, perché deve essere usato",
    testo: "Un gestionale che nessuno apre è un gestionale inutile. Poche schermate chiare battono cento funzioni.",
  },
  {
    icona: "Settings2",
    titolo: "Il software si adatta, non l'azienda",
    testo: "Se una procedura funziona da vent'anni, non è il caso di cambiarla per colpa di un programma.",
  },
  {
    icona: "Bot",
    titolo: "L'AI dove toglie fatica vera",
    testo: "Non come effetto speciale: per caricare lo storico, riconoscere i documenti, evitare il lavoro ripetitivo.",
  },
];

export default function PaginaChiSono() {
  return (
    <>
      <section className="border-b border-line bg-surface-blue py-10 lg:py-14">
        <Contenitore>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div>
              <Pastiglia variante="brand">
                <Icona misura="sm" nome="HardHat" />
                Dall&apos;ufficio tecnico allo sviluppo
              </Pastiglia>
              <h1 className="mt-5 text-titolo font-extrabold leading-[1.1] sm:text-mega">
                Ho vissuto il problema
                <br />
                prima di provare a risolverlo.
              </h1>
              <p className="mt-5 max-w-xl text-testo leading-relaxed text-ink-600 sm:text-guida">
                Per anni ho lavorato in un&apos;azienda di impianti, dentro l&apos;ufficio dove i
                fogli Excel si moltiplicano e i documenti spariscono. I gestionali che costruisco
                oggi nascono da quelle giornate.
              </p>
            </div>

            <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
              <p className="text-piccolo font-semibold uppercase tracking-wide text-brand-700">
                In breve
              </p>
              <ul className="mt-5 space-y-4">
                {[
                  { etichetta: "Chi", valore: sito.autore },
                  { etichetta: "Dove", valore: `${sito.citta} e provincia, da remoto ovunque` },
                  { etichetta: "Da dove vengo", valore: "Ufficio tecnico-amministrativo, aziende di impiantistica" },
                  { etichetta: "Cosa faccio", valore: "Gestionali su misura per piccole aziende, professionisti e artigiani" },
                ].map((r) => (
                  <li key={r.etichetta} className="flex gap-4 border-b border-line-soft pb-4 last:border-0 last:pb-0">
                    <span className="w-28 shrink-0 text-piccolo font-medium text-ink-400">
                      {r.etichetta}
                    </span>
                    <span className="text-corrente font-medium text-ink-800">{r.valore}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Contenitore>
      </section>

      {/* ------------------------------------------------------- RACCONTO */}
      <Sezione sfondo="bianco">
        <div className="mx-auto max-w-3xl">
          {racconto.map((p, i) => (
            <p
              key={i}
              className={`text-testo leading-[1.8] text-ink-600 ${i > 0 ? "mt-5" : ""} ${
                i === 0 ? "text-guida text-ink-800" : ""
              }`}
            >
              {p}
            </p>
          ))}

          <div className="my-12 border-l-[3px] border-brand-500 pl-6">
            <p className="text-t3 font-semibold leading-relaxed text-ink-900 sm:text-t2">
              Il problema non erano le aziende. Il problema era che quasi tutti i gestionali erano
              progettati pensando a uno standard uguale per tutti.
            </p>
          </div>

          <h2 className="text-t2 font-bold sm:text-t1">Da qui è nata la mia idea</h2>
          {idea.map((p, i) => (
            <p key={i} className="mt-5 text-testo leading-[1.8] text-ink-600">
              {p}
            </p>
          ))}
        </div>
      </Sezione>

      {/* -------------------------------------------------------- PRINCIPI */}
      <Sezione sfondo="alt">
        <TitoloSezione titolo="Come lavoro" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {principi.map((p) => (
            <div key={p.titolo} className="flex gap-4 rounded-[var(--radius-scheda)] border border-line bg-white p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-scheda)] bg-brand-50 text-brand-600">
                <Icona misura="md" nome={p.icona} />
              </span>
              <div>
                <h3 className="text-testo font-semibold">{p.titolo}</h3>
                <p className="mt-2 text-corrente leading-relaxed text-ink-500">{p.testo}</p>
              </div>
            </div>
          ))}
        </div>
      </Sezione>

      {/* ------------------------------------------------------- OBIETTIVO */}
      <section className="bg-ink-900 py-14 lg:py-20">
        <Contenitore>
          <div className="mx-auto max-w-3xl">
            <Pastiglia variante="chiara">
              <Icona misura="sm" nome="Bot" />
              Il mio obiettivo
            </Pastiglia>
            <h2 className="mt-5 text-t1 font-bold leading-tight text-white sm:text-titolo">
              Non un archivio di dati.
              <br />
              Un collaboratore intelligente.
            </h2>
            {obiettivo.map((p, i) => (
              <p key={i} className="mt-5 text-testo leading-[1.8] text-ink-300">
                {p}
              </p>
            ))}

            <div className="mt-10 rounded-[var(--radius-scheda)] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2">
                <Icona misura="sm" nome="ScanLine" className="text-brand-300" />
                <p className="text-piccolo font-semibold uppercase tracking-wide text-brand-300">
                  Un esempio concreto
                </p>
              </div>
              <p className="mt-3 text-testo leading-relaxed text-ink-300">
                Quasi tutte le aziende rinunciano a portare il loro storico dentro un gestionale
                nuovo: sono centinaia di file da caricare e rinominare a mano, e nessuno ha quel
                tempo. Nei miei gestionali carichi la cartella intera, anche uno ZIP: il sistema
                legge i documenti, riconosce di cosa si tratta e li collega da solo alla scheda
                giusta. Quello di cui non è sicuro te lo mette da parte e decidi tu.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Bottone href="/richiedi" misura="lg">
                Raccontami come lavori
                <Icona misura="sm" nome="ArrowRight" />
              </Bottone>
              <Bottone
                href="/gestionali"
                misura="lg"
                className=""
              >
                Guarda i gestionali
              </Bottone>
            </div>
          </div>
        </Contenitore>
      </section>

      <CtaBanner
        titolo="Lavoriamo insieme?"
        testo="Se ti sei riconosciuto in qualcosa di quello che hai letto, scrivimi: il primo passo è solo raccontarmi come lavori oggi."
        azione={{ href: "/contatti", label: "Mettiti in contatto" }}
        secondaria={{ href: "/come-funziona", label: "Come funziona" }}
      />
    </>
  );
}
