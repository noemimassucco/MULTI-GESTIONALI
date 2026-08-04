import Link from "next/link";
import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";
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

const problemi = [
  { icona: "FileSpreadsheet", testo: "Hai troppi file Excel e non sai mai qual è l'ultimo" },
  { icona: "Search", testo: "Per trovare un documento devi cercare in tre cartelle diverse" },
  { icona: "Clock", testo: "Le scadenze te le ricordi solo quando sono già passate" },
  { icona: "MessageSquare", testo: "Il lavoro si organizza su WhatsApp e poi si perde" },
  { icona: "CheckCircle2", testo: "Non sai con certezza cosa è stato completato e cosa no" },
  { icona: "Database", testo: "Non sai cosa deve ancora essere fatturato" },
  { icona: "Users", testo: "Più persone lavorano sugli stessi dati e si sovrascrivono" },
  { icona: "RefreshCw", testo: "Rifai a mano le stesse operazioni ogni settimana" },
];

const passi = [
  {
    numero: "1",
    titolo: "Scegli il tuo settore",
    testo: "Trova la categoria che rappresenta la tua attività fra quelle a catalogo.",
    colore: "viola",
  },
  {
    numero: "2",
    titolo: "Guarda cosa gestisce",
    testo: "Su ogni scheda trovi funzioni, moduli e personalizzazioni possibili.",
    colore: "rosa",
  },
  {
    numero: "3",
    titolo: "Racconta come lavori",
    testo: "Mi dici cosa ti fa perdere tempo e cosa non può mancare nel tuo lavoro.",
    colore: "ambra",
  },
  {
    numero: "4",
    titolo: "Ricevi il tuo gestionale",
    testo: "Parto dalla base più vicina e la adatto alle procedure della tua attività.",
    colore: "verde",
  },
];

const vantaggi = [
  { icona: "Blocks", titolo: "Base già pronta", testo: "Non si parte da zero: la base funziona già, si adatta." },
  { icona: "Settings2", titolo: "Personalizzabile dopo", testo: "Campi, sezioni e stati si aggiungono anche a lavoro avviato." },
  { icona: "Layers", titolo: "Grafica semplice", testo: "Poche schermate chiare, pensate per chi non è tecnologico." },
  { icona: "Smartphone", titolo: "Da computer e tablet", testo: "Si usa in ufficio, in cantiere e dal telefono." },
  { icona: "FolderOpen", titolo: "Dati organizzati", testo: "Ogni documento collegato alla scheda a cui appartiene." },
  { icona: "Zap", titolo: "Meno lavoro manuale", testo: "Le operazioni ripetitive si automatizzano una volta sola." },
  { icona: "Upload", titolo: "Importazione da Excel", testo: "Quello che hai già non si butta: entra nel gestionale." },
  { icona: "Shapes", titolo: "Cresce con te", testo: "Si aggiungono moduli quando l'attività cambia." },
];

export default function Home() {
  const categorie = getCategorieConGestionali();
  const gestionali = getGestionali();
  const basi = getBasi();
  const stat = getStatistiche();

  const mappaCategorie = Object.fromEntries(categorie.map((c) => [c.slug, c]));
  const mappaBasi = Object.fromEntries(basi.map((b) => [b.slug, b]));
  const inEvidenza = gestionali.slice(0, 6);

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      {/* Un solo concetto, ripetuto in tutto il sito: PRIMA e DOPO.      */}
      <section className="relative overflow-hidden border-b border-line bg-surface-blue">
        <Contenitore className="py-10 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <Pastiglia variante="brand" className="px-3">
              <Icona misura="sm" nome="Blocks" />
              Gestionali su misura per ogni attività
            </Pastiglia>

            <h1 className="mt-5 text-mega font-extrabold leading-[1.05] sm:text-eroe">
              Il gestionale che <span className="text-brand-600">si adatta a te,</span>
              <br className="hidden sm:block" /> non il contrario.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-testo leading-relaxed text-ink-500 sm:text-guida">
              Trascina la linea gialla: a sinistra il lavoro com&apos;è oggi,
              a destra lo stesso martedì con un gestionale costruito sul tuo modo di lavorare.
            </p>
          </div>

          <div className="mt-9">
            <PrimaDopo />
            <p className="mt-3 text-center text-mini text-ink-500">
              Interfaccia di esempio con dati inventati — la tua verrà costruita sulle tue procedure
            </p>
          </div>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Bottone href="/gestionali" misura="lg">
              Scopri i gestionali
              <Icona misura="sm" nome="ArrowRight" />
            </Bottone>
            <Bottone href="/demo" variante="secondario" misura="lg">
              <Icona misura="sm" nome="PlayCircle" />
              Prova una demo
            </Bottone>
          </div>

          {/* Prova sociale onesta: nessun numero di clienti inventato */}
          <div className="mx-auto mt-9 flex max-w-xl items-start gap-3.5 border-t border-line pt-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-sole-100 text-ink-800">
              <Icona misura="md" nome="HardHat" />
            </span>
            <p className="text-piccolo leading-relaxed text-ink-500">
              Progetto nato dentro l&apos;ufficio tecnico di un&apos;azienda di impianti, dove ho
              visto per anni cosa succede quando il lavoro vive su Excel e cartelle condivise.{" "}
              <Link href="/chi-sono" className="font-semibold text-brand-700 hover:underline">
                La mia storia
              </Link>
            </p>
          </div>
        </Contenitore>
      </section>

      {/* ------------------------------------------------------ PROBLEMI */}
      {/* Il "prima" continua qui: i problemi sono foglietti sulla scrivania. */}
      <Sezione sfondo="bianco">
        <TitoloSezione
          occhiello="Riconosci qualcosa?"
          titolo="Il tuo lavoro è organizzato o semplicemente sparso?"
          testo="Sono le situazioni che si ripetono in quasi tutte le piccole aziende. Se ne riconosci almeno tre, un gestionale su misura ti cambia la giornata."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problemi.map((p, i) => (
            <div
              key={p.testo}
              style={{ rotate: `${[-1.2, 0.9, -0.7, 1.3][i % 4]}deg` }}
              className={`flex gap-3 rounded-[3px] border p-4 shadow-[0_4px_12px_rgba(70,60,40,0.08)] transition-transform hover:rotate-0 ${
                i % 3 === 1
                  ? "border-[#e8d98f] bg-[var(--foglietto-giallo)]"
                  : "border-[#ddd5c4] bg-white"
              }`}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-ink-900/5 text-ink-600">
                <Icona misura="sm" nome={p.icona} />
              </span>
              <p className="text-piccolo leading-snug text-ink-700">{p.testo}</p>
            </div>
          ))}
        </div>
      </Sezione>

      {/* ----------------------------------------------------- CATEGORIE */}
      <Sezione sfondo="alt">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TitoloSezione
            centrato={false}
            titolo="Scegli il tuo settore"
            testo="Trova il gestionale più adatto alla tua attività fra le categorie a catalogo."
          />
          <Bottone href="/categorie" variante="secondario" misura="sm">
            <Icona misura="sm" nome="LayoutGrid" />
            Vedi tutti i settori
          </Bottone>
        </div>

        <div className="scroll-orizzontale mt-10 -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          {categorie.map((c) => (
            <CategoriaCard key={c.slug} categoria={c} compatta />
          ))}
        </div>
      </Sezione>

      {/* -------------------------------------- PERCHÉ + COME FUNZIONA */}
      <Sezione sfondo="bianco">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="rounded-[var(--radius-scheda)] border border-line bg-surface-blue p-6">
            <h2 className="text-t2 font-bold leading-tight">
              Perché scegliere un gestionale su misura?
            </h2>
            <ul className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
              {vantaggi.slice(0, 6).map((v) => (
                <li key={v.titolo} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-white text-brand-600 shadow-[var(--shadow-soft)]">
                    <Icona misura="sm" nome={v.icona} />
                  </span>
                  <span>
                    <span className="block text-corrente font-semibold text-ink-900">{v.titolo}</span>
                    <span className="mt-0.5 block text-piccolo leading-snug text-ink-500">
                      {v.testo}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-t2 font-bold leading-tight">Come funziona?</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {passi.map((p) => (
                <div
                  key={p.numero}
                  className="rounded-[var(--radius-scheda)] border border-line bg-white p-5 transition-shadow hover:shadow-[var(--shadow-soft)]"
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-full text-corrente font-bold"
                    style={{
                      color: `var(--cat-${p.colore})`,
                      background: `var(--cat-${p.colore}-bg)`,
                    }}
                  >
                    {p.numero}
                  </span>
                  <h3 className="mt-4 text-testo font-semibold">{p.titolo}</h3>
                  <p className="mt-1.5 text-piccolo leading-relaxed text-ink-500">{p.testo}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[var(--radius-scheda)] border border-line bg-surface-alt p-5">
              <p className="flex-1 text-corrente text-ink-600">
                Hai dubbi su quale sia il gestionale giusto per te?
              </p>
              <Bottone href="/contatti" variante="secondario" misura="sm">
                <Icona misura="sm" nome="MessageCircle" />
                Parliamone
              </Bottone>
            </div>
          </div>
        </div>
      </Sezione>

      {/* ------------------------------------------------------------ IA */}
      <section className="bg-ink-900 py-14 lg:py-20">
        <Contenitore>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Pastiglia variante="chiara">
                <Icona misura="sm" nome="Bot" />
                Dentro ogni gestionale
              </Pastiglia>
              <h2 className="mt-5 text-t1 font-bold leading-tight text-white sm:text-titolo">
                Lo storico non lo carichi a mano.
                <br />
                Lo carichi tutto insieme.
              </h2>
              <p className="mt-5 max-w-lg text-testo leading-relaxed text-ink-300">
                È il motivo per cui quasi tutte le aziende rinunciano a portarsi dentro il passato:
                sono centinaia di file da caricare e rinominare uno alla volta. Qui carichi la
                cartella intera, anche uno ZIP: il sistema legge i documenti, capisce di cosa si
                tratta e li collega da solo alla scheda giusta.
              </p>
              <div className="mt-8">
                <Bottone href="/personalizzazioni" variante="chiaro" misura="lg">
                  Come funziona la personalizzazione
                  <Icona misura="sm" nome="ArrowRight" />
                </Bottone>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
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
                  titolo: "Tu controlli",
                  testo: "Quello di cui non è sicuro te lo mette da parte, decidi tu.",
                },
              ].map((c) => (
                <div key={c.titolo} className="rounded-[var(--radius-scheda)] border border-white/10 bg-white/5 p-5">
                  <span className="flex size-10 items-center justify-center rounded-[var(--radius-scheda)] bg-white/10 text-sole-300">
                    <Icona misura="md" nome={c.icona} />
                  </span>
                  <h3 className="mt-4 text-testo font-semibold text-white">{c.titolo}</h3>
                  <p className="mt-1.5 text-piccolo leading-relaxed text-ink-300">{c.testo}</p>
                </div>
              ))}
            </div>
          </div>
        </Contenitore>
      </section>

      {/* -------------------------------------------- GESTIONALI IN VISTA */}
      <Sezione sfondo="alt">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TitoloSezione
            centrato={false}
            occhiello={`${stat.gestionali} gestionali a catalogo`}
            titolo="I gestionali già pronti come base"
            testo="Ognuno parte da una base funzionante e viene adattato al modo di lavorare del cliente."
          />
          <Bottone href="/gestionali" variante="secondario" misura="sm">
            Vedi tutti
            <Icona misura="sm" nome="ArrowRight" />
          </Bottone>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ---------------------------------------------------- VANTAGGI 2 */}
      <Sezione sfondo="bianco">
        <TitoloSezione
          occhiello="In pratica"
          titolo="Cosa cambia nella tua settimana"
          testo="Non è il software che conta, è quello che smetti di fare a mano."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vantaggi.map((v) => (
            <div key={v.titolo} className="rounded-[var(--radius-scheda)] border border-line bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-[var(--radius-scheda)] bg-brand-50 text-brand-600">
                <Icona misura="md" nome={v.icona} />
              </span>
              <h3 className="mt-4 text-testo font-semibold">{v.titolo}</h3>
              <p className="mt-1.5 text-piccolo leading-relaxed text-ink-500">{v.testo}</p>
            </div>
          ))}
        </div>
      </Sezione>

      <CtaBanner />
    </>
  );
}
