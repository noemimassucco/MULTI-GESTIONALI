import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";
import FaqAccordion from "@/components/sito/FaqAccordion";
import GestionaleCard from "@/components/sito/GestionaleCard";
import CtaBanner from "@/components/sito/CtaBanner";
import {
  getBase,
  getCategoria,
  getGestionale,
  getGestionaliCorrelati,
  getGestionali,
} from "@/lib/catalogo";

export function generateStaticParams() {
  return getGestionali().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = getGestionale(slug);
  if (!g) return { title: "Gestionale non trovato" };
  return {
    title: g.metaTitle || g.nome,
    description: g.metaDescription || g.sottotitolo,
    alternates: { canonical: `/gestionali/${g.slug}` },
  };
}

export default async function PaginaGestionale({ params }) {
  const { slug } = await params;
  const gestionale = getGestionale(slug);
  if (!gestionale) notFound();

  const categoria = getCategoria(gestionale.categoriaSlug);
  const base = getBase(gestionale.baseSlug);
  const correlati = getGestionaliCorrelati(gestionale, 3);
  const paragrafi = gestionale.descrizione.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      {/* ------------------------------------------------------- TESTATA */}
      <section className="border-b border-line bg-surface-alt">
        <Contenitore className="pb-16 pt-8 lg:pb-24 lg:pt-10">
          <nav aria-label="Percorso" className="flex flex-wrap items-center gap-1.5 text-piccolo">
            <Link href="/gestionali" className="text-ink-500 hover:text-ink-900">
              Gestionali
            </Link>
            <Icona misura="sm" nome="ChevronRight" className="text-ink-400" />
            {categoria ? (
              <Link
                href={`/categorie/${categoria.slug}`}
                className="text-ink-500 hover:text-ink-900"
              >
                {categoria.nome}
              </Link>
            ) : null}
          </nav>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-16">
            <div>
              {categoria ? (
                <p className="occhiello filetto text-accento-600">{categoria.nome}</p>
              ) : null}
              <h1 className="mt-8 text-titolo sm:text-mega">{gestionale.nome}</h1>
              <p className="mt-7 max-w-xl text-guida leading-relaxed text-ink-600">
                {gestionale.sottotitolo}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Bottone href={`/richiedi?gestionale=${gestionale.slug}`} misura="lg">
                  Richiedi informazioni
                  <Icona misura="sm" nome="ArrowRight" />
                </Bottone>
                {gestionale.demoDisponibile && base?.demoPath ? (
                  <Bottone href={base.demoPath} variante="secondario" misura="lg">
                    <Icona misura="sm" nome="PlayCircle" />
                    Prova la demo
                  </Bottone>
                ) : (
                  <Bottone href="/demo" variante="secondario" misura="lg">
                    Le demo in preparazione
                  </Bottone>
                )}
              </div>
            </div>

            {/* Riquadro base collegata */}
            {base ? (
              <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-7">
                <div className="flex items-center gap-2">
                  <Icona misura="sm" nome="Blocks" className="text-brand-600" />
                  <p className="occhiello text-brand-700">Parte dalla base</p>
                </div>
                <h2 className="mt-4 text-t3">{base.nome}</h2>
                <p className="mt-3 text-corrente leading-relaxed text-ink-600">
                  {base.descrizione}
                </p>
                {gestionale.moduliAggiuntivi?.length ? (
                  <>
                    <p className="mt-7 text-piccolo font-semibold text-ink-900">
                      Più i moduli specifici per il tuo settore:
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {gestionale.moduliAggiuntivi.map((m) => (
                        <li key={m}>
                          <Pastiglia variante="brand">{m}</Pastiglia>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </Contenitore>
      </section>

      {/* -------------------------------------------------- PRIMA / DOPO */}
      {/* Il concetto del sito applicato al settore: a sinistra com'è oggi
          (i problemi), a destra com'è con il gestionale (i vantaggi).    */}
      <Sezione sfondo="bianco">
        <TitoloSezione occhiello="Prima e dopo" titolo="La stessa settimana, con e senza" />
        <div className="mt-14 grid overflow-hidden rounded-[var(--radius-scheda)] border border-line lg:grid-cols-2">
          {/* PRIMA */}
          <div className="bg-[var(--carta-prima)] p-7 sm:p-10">
            <p className="occhiello inline-flex rounded-full bg-ink-900/85 px-3 py-1.5 text-[10px] leading-none text-white">
              Oggi, senza
            </p>
            <ul className="mt-7 space-y-4">
              {gestionale.problemi.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-critico">
                    <Icona misura="sm" nome="X" className="size-3.5" />
                  </span>
                  <span className="text-corrente leading-relaxed text-[#4a4438]">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DOPO */}
          <div className="border-t-2 border-accento-500 bg-white p-7 sm:p-10 lg:border-l-2 lg:border-t-0">
            <p className="occhiello inline-flex rounded-full bg-brand-700 px-3 py-1.5 text-[10px] leading-none text-white">
              Con il gestionale
            </p>
            <ul className="mt-7 space-y-4">
              {gestionale.vantaggi.map((v) => (
                <li key={v.titolo} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <Icona misura="sm" nome="Check" className="size-3.5" />
                  </span>
                  <span className="text-corrente leading-relaxed text-ink-700">
                    <strong className="font-semibold text-ink-900">{v.titolo}.</strong> {v.testo}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-14">
          <div className="max-w-3xl">
            {paragrafi.map((p, i) => (
              <p key={i} className={`text-testo leading-loose text-ink-600 ${i > 0 ? "mt-6" : ""}`}>
                {p}
              </p>
            ))}
            {gestionale.utenti?.length ? (
              <div className="mt-10 border-t border-line pt-7">
                <p className="occhiello text-ink-500">Chi lo usa in azienda</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {gestionale.utenti.map((u) => (
                    <li key={u}>
                      <Pastiglia variante="contorno">
                        <Icona misura="sm" nome="UserCog" />
                        {u}
                      </Pastiglia>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Sezione>

      {/* ------------------------------------------------------- FUNZIONI */}
      <Sezione sfondo="alt">
        <TitoloSezione
          occhiello="Cosa gestisce"
          titolo="Le funzioni comprese nella base"
          testo="Sono già attive dal primo giorno. Ognuna può essere rinominata o adattata al tuo modo di chiamare le cose."
        />
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gestionale.funzioni.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3.5 rounded-[var(--radius-controllo)] border border-line bg-white px-4 py-3.5"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icona misura="sm" nome="Check" className="size-3.5" />
              </span>
              <span className="text-corrente font-medium text-ink-800">{f}</span>
            </li>
          ))}
        </ul>

        {gestionale.moduli?.length ? (
          <div className="mt-16 border-t border-line pt-14">
            <h3 className="text-guida">Moduli inclusi</h3>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {gestionale.moduli.map((m) => (
                <div
                  key={m}
                  className="rounded-[var(--radius-scheda)] border border-line bg-white p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-50 text-brand-600">
                    <Icona misura="sm" nome="Layers" />
                  </span>
                  <p className="mt-4 text-corrente font-semibold text-ink-900">{m}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Sezione>

      {/* ------------------------------------------------ PERSONALIZZAZIONI */}
      <Sezione sfondo="scuro">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <TitoloSezione
              chiaro
              occhiello="Su misura"
              titolo="Cosa possiamo cambiare per te"
              testo="La base è il punto di partenza, non il traguardo. Queste sono le modifiche più richieste in questo settore: se quello che ti serve non è in elenco, chiedimelo."
            />
            <div className="mt-10">
              <Bottone href={`/richiedi?gestionale=${gestionale.slug}`} variante="accento" misura="lg">
                Raccontami come lavori
                <Icona misura="sm" nome="ArrowRight" />
              </Bottone>
            </div>
          </div>
          <ul className="border-t border-white/15">
            {gestionale.personalizzazioni.map((p) => (
              <li key={p} className="flex gap-4 border-b border-white/15 py-4">
                <Icona misura="sm" nome="Check" className="mt-0.5 shrink-0 text-accento-300" />
                <span className="text-corrente leading-relaxed text-brand-100">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </Sezione>

      {/* ------------------------------------------------------------ FAQ */}
      {gestionale.faq?.length ? (
        <Sezione sfondo="alt">
          <TitoloSezione occhiello="Dubbi ricorrenti" titolo="Domande frequenti" />
          <div className="mt-14 max-w-3xl">
            <FaqAccordion voci={gestionale.faq} />
          </div>
        </Sezione>
      ) : null}

      {/* ------------------------------------------------------ CORRELATI */}
      {correlati.length ? (
        <Sezione sfondo="bianco">
          <TitoloSezione
            titolo="Gestionali simili"
            testo="Settori vicini, oppure che partono dalla stessa base."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {correlati.map((g) => (
              <GestionaleCard
                key={g.slug}
                gestionale={g}
                categoria={getCategoria(g.categoriaSlug)}
                base={getBase(g.baseSlug)}
              />
            ))}
          </div>
        </Sezione>
      ) : null}

      <CtaBanner
        titolo={`Vuoi ${gestionale.nome.replace("Gestionale ", "il gestionale per ")} sul tuo modo di lavorare?`}
        testo="Raccontami come lavori oggi e cosa ti fa perdere più tempo. Ti rispondo con una proposta concreta, senza impegno."
        azione={{ href: `/richiedi?gestionale=${gestionale.slug}`, label: "Richiedi informazioni" }}
        secondaria={{ href: "/personalizzazioni", label: "Come funziona la personalizzazione" }}
      />
    </>
  );
}
