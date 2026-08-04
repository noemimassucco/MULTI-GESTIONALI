import Link from "next/link";
import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import PrimaDopo from "@/components/sito/PrimaDopo";
import CategoriaCard from "@/components/sito/CategoriaCard";
import GestionaleCard from "@/components/sito/GestionaleCard";
import CtaBanner from "@/components/sito/CtaBanner";
import {
  getBasi,
  getCategorieConGestionali,
  getGestionali,
  getStatistiche,
} from "@/lib/catalogo";

/* Sei situazioni, non otto: quelle che si riconoscono davvero. */
const problemi = [
  "Hai troppi file Excel e non sai mai qual è l'ultimo.",
  "Per trovare un documento devi cercare in tre cartelle diverse.",
  "Le scadenze te le ricordi quando sono già passate.",
  "Il lavoro si organizza su WhatsApp, e lì resta.",
  "Non sai con certezza cosa è stato fatto e cosa no.",
  "Non sai cosa deve ancora essere fatturato.",
];

const passi = [
  {
    titolo: "Scegli il tuo settore",
    testo: "Trova la categoria che rappresenta la tua attività fra quelle a catalogo.",
  },
  {
    titolo: "Guarda cosa gestisce",
    testo: "Su ogni scheda trovi funzioni, moduli e personalizzazioni possibili.",
  },
  {
    titolo: "Racconta come lavori",
    testo: "Mi dici cosa ti fa perdere tempo e cosa non può mancare nella tua giornata.",
  },
  {
    titolo: "Ricevi il tuo gestionale",
    testo: "Parto dalla base più vicina e la adatto alle procedure della tua attività.",
  },
];

const vantaggi = [
  {
    icona: "Blocks",
    titolo: "Base già funzionante",
    testo:
      "Non si parte da zero e non si paga il tempo di costruire ciò che esiste già: la base lavora dal primo giorno, poi si adatta.",
  },
  {
    icona: "Settings2",
    titolo: "Si cambia anche dopo",
    testo:
      "Campi, sezioni e stati si aggiungono a lavoro avviato, quando ti accorgi di cosa serve davvero.",
  },
  {
    icona: "Upload",
    titolo: "Il passato entra dentro",
    testo:
      "Quello che hai già — Excel, cartelle, archivi di anni — non si butta e non si ricopia a mano.",
  },
  {
    icona: "Smartphone",
    titolo: "In ufficio e sul posto",
    testo:
      "Le stesse informazioni dal computer dell'ufficio, dal tablet in cantiere e dal telefono.",
  },
];

const passaggiIa = [
  {
    icona: "Upload",
    titolo: "Carichi in blocco",
    testo: "Cartelle intere o archivi ZIP, senza rinominare niente prima.",
  },
  {
    icona: "ScanLine",
    titolo: "Il sistema riconosce",
    testo: "Capisce se è un contratto, una fattura, un certificato, un rapportino.",
  },
  {
    icona: "FolderOpen",
    titolo: "Archivia da solo",
    testo: "Collega ogni documento alla scheda a cui appartiene.",
  },
  {
    icona: "Clock",
    titolo: "Tu decidi il resto",
    testo: "Quello di cui non è sicuro te lo mette da parte, e lo guardi tu.",
  },
];

export default function Home() {
  const categorie = getCategorieConGestionali();
  const gestionali = getGestionali();
  const basi = getBasi();
  const stat = getStatistiche();

  const mappaCategorie = Object.fromEntries(categorie.map((c) => [c.slug, c]));
  const mappaBasi = Object.fromEntries(basi.map((b) => [b.slug, b]));
  const inEvidenza = gestionali.slice(0, 3);

  return (
    <>
      {/* ============================================================ HERO */}
      {/* Impaginato come l'apertura di una rivista: testo a sinistra,      */}
      {/* la dimostrazione a destra. Un solo concetto: prima e dopo.        */}
      <section className="border-b border-line bg-surface-alt">
        <Contenitore className="pb-16 pt-14 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
            <div className="max-w-xl">
              <p className="occhiello filetto text-accento-600">
                Gestionali su misura per piccole aziende
              </p>

              <h1 className="mt-8 text-titolo sm:text-mega lg:text-eroe">
                La tecnologia si adatta
                <br className="hidden sm:block" /> alla tua azienda.
                <br className="hidden sm:block" />{" "}
                <span className="italic text-brand-600">Non il contrario.</span>
              </h1>

              <p className="mt-8 max-w-lg text-guida leading-relaxed text-ink-600">
                {stat.gestionali} gestionali già funzionanti, ognuno pensato per un mestiere
                preciso. Si parte da quello più vicino al tuo e lo si adatta al modo in cui lavori
                davvero.
              </p>

              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Bottone href="/gestionali" misura="lg">
                  Scopri i gestionali
                  <Icona misura="sm" nome="ArrowRight" />
                </Bottone>
                <Bottone href="/demo" variante="secondario" misura="lg">
                  <Icona misura="sm" nome="PlayCircle" />
                  Prova una demo
                </Bottone>
              </div>

              <p className="mt-10 max-w-md border-t border-line pt-7 text-piccolo leading-relaxed text-ink-500">
                Progetto nato dentro l&apos;ufficio tecnico di un&apos;azienda di impianti, dove ho
                visto per anni cosa succede quando il lavoro vive su Excel e cartelle condivise.{" "}
                <Link
                  href="/chi-sono"
                  className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-600"
                >
                  La mia storia
                </Link>
              </p>
            </div>

            <div>
              <PrimaDopo />
              <p className="mt-5 text-piccolo text-ink-500">
                Trascina la linea. A sinistra il lavoro com&apos;è oggi, a destra lo stesso martedì
                con un gestionale costruito sulle tue procedure — dati inventati.
              </p>
            </div>
          </div>
        </Contenitore>
      </section>

      {/* ========================================================== NUMERI */}
      <section className="border-b border-line bg-surface-alt">
        <Contenitore>
          <dl className="grid grid-cols-3 divide-x divide-line">
            {[
              { n: stat.gestionali, t: "gestionali a catalogo" },
              { n: stat.categorie, t: "settori coperti" },
              { n: stat.basi, t: "basi di partenza" },
            ].map((v, i) => (
              <div key={v.t} className={i === 0 ? "py-10 pr-6" : "py-10 pl-6 pr-6"}>
                <dt className="cifre text-t1 font-extrabold text-brand-700 lg:text-titolo">
                  {v.n}
                </dt>
                <dd className="mt-1.5 text-piccolo text-ink-500 sm:text-corrente">{v.t}</dd>
              </div>
            ))}
          </dl>
        </Contenitore>
      </section>

      {/* ======================================================== PROBLEMI */}
      <Sezione sfondo="bianco">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <TitoloSezione
            occhiello="Riconosci qualcosa?"
            titolo="Il tuo lavoro è organizzato, o semplicemente sparso?"
            testo="Sono le situazioni che si ripetono in quasi tutte le piccole aziende. Se ne riconosci almeno tre, un gestionale su misura ti cambia la settimana."
          />

          <ul className="border-t border-line">
            {problemi.map((p) => (
              <li
                key={p}
                className="flex items-baseline gap-5 border-b border-line py-5 lg:gap-7"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accento-400"
                />
                <p className="text-testo leading-relaxed text-ink-700">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </Sezione>

      {/* ======================================================= CATEGORIE */}
      <Sezione sfondo="alt">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TitoloSezione
            titolo="Scegli il tuo settore"
            testo="Ogni categoria raccoglie i gestionali pensati per quel modo di lavorare."
          />
          <Bottone href="/categorie" variante="secondario">
            <Icona misura="sm" nome="LayoutGrid" />
            Tutti i settori
          </Bottone>
        </div>

        <div className="scroll-orizzontale -mx-[var(--margine)] mt-14 flex snap-x gap-4 overflow-x-auto px-[var(--margine)] pb-3 lg:mx-0 lg:px-0">
          {categorie.map((c) => (
            <CategoriaCard key={c.slug} categoria={c} compatta />
          ))}
        </div>
      </Sezione>

      {/* ================================================== COME FUNZIONA */}
      <Sezione sfondo="bianco">
        <TitoloSezione
          occhiello="Come funziona"
          titolo="Quattro passaggi, nessuna sorpresa"
          testo="Dal catalogo al gestionale che usi tutti i giorni."
        />

        <ol className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {passi.map((p, i) => (
            <li key={p.titolo} className="border-t-2 border-brand-800 pt-6">
              <span className="cifre block text-t1 font-extrabold text-brand-400 lg:text-titolo">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-guida">{p.titolo}</h3>
              <p className="mt-3 text-corrente leading-relaxed text-ink-600">{p.testo}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
          <p className="max-w-md text-testo text-ink-600">
            Hai dubbi su quale sia il gestionale giusto per la tua attività?
          </p>
          <Bottone href="/contatti" variante="secondario">
            <Icona misura="sm" nome="MessageCircle" />
            Parliamone
          </Bottone>
        </div>
      </Sezione>

      {/* ============================================ CARICAMENTO ASSISTITO */}
      <section className="bg-brand-900 py-[var(--sezione)] lg:py-[var(--sezione-lg)]">
        <Contenitore>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className="occhiello filetto text-accento-300">Dentro ogni gestionale</p>
              <h2 className="mt-8 text-t1 text-white lg:text-titolo">
                Lo storico non lo carichi a mano.
                <br />
                <span className="italic text-brand-200">Lo carichi tutto insieme.</span>
              </h2>
              <p className="mt-7 max-w-lg text-testo leading-relaxed text-brand-100">
                È il motivo per cui quasi tutte le aziende rinunciano a portarsi dentro il passato:
                sono centinaia di file da aprire e rinominare uno alla volta, e alla fine si lascia
                perdere. Qui si carica la cartella intera, anche uno ZIP: il sistema legge i
                documenti, capisce di cosa si tratta e li collega da solo alla scheda giusta.
              </p>
              <div className="mt-10">
                <Bottone href="/personalizzazioni" variante="chiaro" misura="lg">
                  Cosa si può personalizzare
                  <Icona misura="sm" nome="ArrowRight" />
                </Bottone>
              </div>
            </div>

            <ol className="border-t border-white/15">
              {passaggiIa.map((c, i) => (
                <li key={c.titolo} className="flex gap-6 border-b border-white/15 py-7">
                  <span className="cifre shrink-0 text-corrente font-semibold text-accento-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-testo text-white">{c.titolo}</h3>
                    <p className="mt-1.5 text-corrente leading-relaxed text-brand-200">{c.testo}</p>
                  </div>
                  <Icona misura="md" nome={c.icona} className="ml-auto shrink-0 text-white/25" />
                </li>
              ))}
            </ol>
          </div>
        </Contenitore>
      </section>

      {/* ======================================================== VANTAGGI */}
      <Sezione sfondo="bianco">
        <TitoloSezione
          occhiello="Perché su misura"
          titolo="Quattro cose che un gestionale generico non fa"
          testo="Non è il software che conta: è quello che smetti di fare a mano."
        />

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {vantaggi.map((v) => (
            <div key={v.titolo} className="flex gap-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-scheda)] bg-brand-50 text-brand-600">
                <Icona misura="md" nome={v.icona} />
              </span>
              <div className="min-w-0">
                <h3 className="text-guida">{v.titolo}</h3>
                <p className="mt-2.5 text-corrente leading-relaxed text-ink-600">{v.testo}</p>
              </div>
            </div>
          ))}
        </div>
      </Sezione>

      {/* ============================================== GESTIONALI IN VISTA */}
      <Sezione sfondo="alt">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TitoloSezione
            occhiello={`${stat.gestionali} a catalogo`}
            titolo="Le basi già pronte"
            testo="Ognuna funziona dal primo giorno e viene adattata al modo di lavorare del cliente."
          />
          <Bottone href="/gestionali" variante="secondario">
            Vedi tutti
            <Icona misura="sm" nome="ArrowRight" />
          </Bottone>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inEvidenza.map((g) => (
            <GestionaleCard
              key={g.slug}
              gestionale={g}
              categoria={mappaCategorie[g.categoriaSlug]}
              base={mappaBasi[g.baseSlug]}
            />
          ))}
        </div>
      </Sezione>

      <CtaBanner />
    </>
  );
}
