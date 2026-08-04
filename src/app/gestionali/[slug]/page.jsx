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
      <section
        className="border-b border-line"
        style={{ background: categoria ? `var(--cat-${categoria.colore}-bg)` : "var(--cat-blu-bg)" }}
      >
        <Contenitore className="py-10 lg:py-14">
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

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              {categoria ? (
                <span
                  className="flex size-14 items-center justify-center rounded-[var(--radius-scheda)] bg-white shadow-[var(--shadow-soft)]"
                  style={{ color: `var(--cat-${categoria.colore})` }}
                >
                  <Icona misura="lg" nome={categoria.icona} />
                </span>
              ) : null}
              <h1 className="mt-5 text-titolo font-extrabold leading-[1.1] sm:text-mega">
                {gestionale.nome}
              </h1>
              <p className="mt-4 max-w-xl text-testo leading-relaxed text-ink-600 sm:text-guida">
                {gestionale.sottotitolo}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
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
              <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
                <div className="flex items-center gap-2">
                  <Icona misura="sm" nome="Blocks" className="text-brand-600" />
                  <p className="text-piccolo font-semibold uppercase tracking-wide text-brand-700">
                    Parte dalla base
                  </p>
                </div>
                <h2 className="mt-2 text-t3 font-bold">{base.nome}</h2>
                <p className="mt-2 text-piccolo leading-relaxed text-ink-500">{base.descrizione}</p>
                {gestionale.moduliAggiuntivi?.length ? (
                  <>
                    <p className="mt-5 text-piccolo font-semibold text-ink-900">
                      Più i moduli specifici per il tuo settore:
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
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

      {/* ------------------------------------------------------ PROBLEMI */}
      <Sezione sfondo="bianco">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h2 className="text-t2 font-bold leading-tight sm:text-t1">
              Cosa succede oggi senza un gestionale
            </h2>
            <ul className="mt-7 space-y-3">
              {gestionale.problemi.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <Icona misura="sm" nome="X" />
                  </span>
                  <span className="text-corrente leading-relaxed text-ink-600">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-scheda)] bg-surface-alt p-6">
            {paragrafi.map((p, i) => (
              <p
                key={i}
                className={`text-testo leading-[1.75] text-ink-600 ${i > 0 ? "mt-4" : ""}`}
              >
                {p}
              </p>
            ))}
            {gestionale.utenti?.length ? (
              <div className="mt-7 border-t border-line pt-5">
                <p className="text-piccolo font-semibold uppercase tracking-wide text-ink-900">
                  Chi lo usa in azienda
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
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
          centrato={false}
          occhiello="Cosa gestisce"
          titolo="Le funzioni comprese nella base"
          testo="Sono già attive dal primo giorno. Ognuna può essere rinominata o adattata al tuo modo di chiamare le cose."
        />
        <ul className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {gestionale.funzioni.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 rounded-[var(--radius-scheda)] border border-line bg-white px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icona misura="sm" nome="Check" />
              </span>
              <span className="text-corrente font-medium text-ink-800">{f}</span>
            </li>
          ))}
        </ul>

        {gestionale.moduli?.length ? (
          <div className="mt-12">
            <h3 className="text-guida font-bold">Moduli inclusi</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {gestionale.moduli.map((m) => (
                <div key={m} className="rounded-[var(--radius-scheda)] border border-line bg-white p-4">
                  <span className="flex size-9 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-50 text-brand-600">
                    <Icona misura="sm" nome="Layers" />
                  </span>
                  <p className="mt-3 text-corrente font-semibold text-ink-900">{m}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Sezione>

      {/* -------------------------------------------------------- VANTAGGI */}
      {gestionale.vantaggi?.length ? (
        <Sezione sfondo="bianco">
          <TitoloSezione
            centrato={false}
            occhiello="Cosa cambia"
            titolo="Perché conviene averlo"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gestionale.vantaggi.map((v) => (
              <div key={v.titolo} className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
                <span className="flex size-10 items-center justify-center rounded-[var(--radius-scheda)] bg-brand-50 text-brand-600">
                  <Icona misura="md" nome="Zap" />
                </span>
                <h3 className="mt-4 text-testo font-semibold">{v.titolo}</h3>
                <p className="mt-2 text-corrente leading-relaxed text-ink-500">{v.testo}</p>
              </div>
            ))}
          </div>
        </Sezione>
      ) : null}

      {/* ------------------------------------------------ PERSONALIZZAZIONI */}
      <Sezione sfondo="scuro">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <TitoloSezione
              centrato={false}
              chiaro
              occhiello="Su misura"
              titolo="Cosa possiamo cambiare per te"
              testo="La base è il punto di partenza, non il traguardo. Queste sono le modifiche più richieste in questo settore: se quello che ti serve non è in elenco, chiedimelo."
            />
            <div className="mt-8">
              <Bottone href={`/richiedi?gestionale=${gestionale.slug}`} misura="lg">
                Raccontami come lavori
                <Icona misura="sm" nome="ArrowRight" />
              </Bottone>
            </div>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {gestionale.personalizzazioni.map((p) => (
              <li
                key={p}
                className="flex gap-2.5 rounded-[var(--radius-scheda)] border border-white/10 bg-white/5 px-4 py-3"
              >
                <Icona misura="sm" nome="Check" className="mt-0.5 shrink-0 text-brand-400" />
                <span className="text-piccolo leading-snug text-ink-300">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </Sezione>

      {/* ------------------------------------------------------------ FAQ */}
      {gestionale.faq?.length ? (
        <Sezione sfondo="alt">
          <TitoloSezione titolo="Domande frequenti" />
          <div className="mx-auto mt-10 max-w-3xl">
            <FaqAccordion voci={gestionale.faq} />
          </div>
        </Sezione>
      ) : null}

      {/* ------------------------------------------------------ CORRELATI */}
      {correlati.length ? (
        <Sezione sfondo="bianco">
          <TitoloSezione
            centrato={false}
            titolo="Gestionali simili"
            testo="Settori vicini, oppure che partono dalla stessa base."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
