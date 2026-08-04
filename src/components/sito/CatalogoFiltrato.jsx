"use client";

import { useMemo, useState } from "react";
import GestionaleCard from "@/components/sito/GestionaleCard";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";

/** Minuscolo, senza accenti: "Impianti Elettrici" e "elettrici" devono coincidere. */
function normalizza(testo) {
  return (testo || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Forme accorciate di una parola, per assorbire singolare/plurale e maschile/femminile
 * senza tirare dentro una libreria di stemming.
 */
function varianti(parola) {
  const forme = [parola];
  if (parola.length >= 6) forme.push(parola.slice(0, -1));
  if (parola.length >= 7) forme.push(parola.slice(0, -2));
  return forme;
}

/**
 * Catalogo con ricerca e filtri.
 * Riceve dati già pronti dal server: qui si filtra soltanto.
 */
export default function CatalogoFiltrato({ gestionali, categorie, basi, funzionalita }) {
  const [ricerca, setRicerca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [funzioniScelte, setFunzioniScelte] = useState([]);
  const [soloDemo, setSoloDemo] = useState(false);
  const [filtriAperti, setFiltriAperti] = useState(false);

  const mappaCategorie = useMemo(
    () => Object.fromEntries(categorie.map((c) => [c.slug, c])),
    [categorie],
  );
  const mappaBasi = useMemo(() => Object.fromEntries(basi.map((b) => [b.slug, b])), [basi]);

  const risultati = useMemo(() => {
    const testo = normalizza(ricerca);
    const termini = testo ? testo.split(/\s+/).filter(Boolean) : [];

    return gestionali.filter((g) => {
      if (categoria && g.categoriaSlug !== categoria) return false;
      if (soloDemo && !g.demoDisponibile) return false;
      if (funzioniScelte.length && !funzioniScelte.every((f) => g.funzionalita.includes(f)))
        return false;
      if (!termini.length) return true;

      const cercabile = normalizza(
        [
          g.nome,
          g.sottotitolo,
          ...g.funzioni,
          ...g.moduli,
          mappaCategorie[g.categoriaSlug]?.nome,
        ].join(" "),
      );

      // ogni termine deve essere presente, anche in forma accorciata:
      // così "idraulico" trova "idraulici" e "cantiere" trova "cantieri"
      return termini.every((t) => varianti(t).some((v) => cercabile.includes(v)));
    });
  }, [gestionali, ricerca, categoria, funzioniScelte, soloDemo, mappaCategorie]);

  const attivi = (categoria ? 1 : 0) + funzioniScelte.length + (soloDemo ? 1 : 0);

  const alternaFunzione = (slug) =>
    setFunzioniScelte((prec) =>
      prec.includes(slug) ? prec.filter((f) => f !== slug) : [...prec, slug],
    );

  const azzera = () => {
    setRicerca("");
    setCategoria("");
    setFunzioniScelte([]);
    setSoloDemo(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[268px_1fr]">
      {/* ------- Filtri ------- */}
      <div>
        <button
          type="button"
          onClick={() => setFiltriAperti((v) => !v)}
          className="mb-4 flex w-full items-center justify-between rounded-[var(--radius-scheda)] border border-line bg-white px-4 py-3 text-corrente font-semibold text-ink-800 lg:hidden"
          aria-expanded={filtriAperti}
        >
          <span className="flex items-center gap-2">
            <Icona misura="sm" nome="SlidersHorizontal" />
            Filtri
            {attivi ? (
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-micro text-white">
                {attivi}
              </span>
            ) : null}
          </span>
          <Icona nome="ChevronDown" className={`size-4 ${filtriAperti ? "rotate-180" : ""}`} />
        </button>

        <div className={`${filtriAperti ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-[88px] space-y-6 rounded-[var(--radius-scheda)] border border-line bg-white p-6">
            <div>
              <label
                htmlFor="ricerca"
                className="mb-2 block text-piccolo font-semibold text-ink-900"
              >
                Cerca
              </label>
              <div className="relative">
                <Icona misura="sm"
                  nome="Search"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  id="ricerca"
                  type="search"
                  value={ricerca}
                  onChange={(e) => setRicerca(e.target.value)}
                  placeholder="Es. idraulico, cantieri…"
                  className="h-12 w-full rounded-[var(--radius-controllo)] border border-line bg-white pl-11 pr-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-piccolo font-semibold text-ink-900">Categoria</p>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setCategoria("")}
                  className={`w-full rounded-[var(--radius-controllo)] px-2.5 py-1.5 text-left text-piccolo transition-colors ${
                    !categoria ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-600 hover:bg-surface-alt"
                  }`}
                >
                  Tutte le categorie
                </button>
                {categorie.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCategoria(c.slug === categoria ? "" : c.slug)}
                    className={`flex w-full items-center justify-between gap-2 rounded-[var(--radius-controllo)] px-2.5 py-1.5 text-left text-piccolo transition-colors ${
                      categoria === c.slug
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-ink-600 hover:bg-surface-alt"
                    }`}
                  >
                    <span className="truncate">{c.nome}</span>
                    <span className="shrink-0 text-mini text-ink-400">{c.totale}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-piccolo font-semibold text-ink-900">Funzioni</p>
              <div className="flex flex-wrap gap-1.5">
                {funzionalita.map((f) => {
                  const scelta = funzioniScelte.includes(f.slug);
                  return (
                    <button
                      key={f.slug}
                      type="button"
                      onClick={() => alternaFunzione(f.slug)}
                      aria-pressed={scelta}
                      className={`rounded-full px-2.5 py-1 text-mini font-medium transition-colors ${
                        scelta
                          ? "bg-brand-600 text-white"
                          : "bg-surface-alt text-ink-600 hover:bg-brand-50 hover:text-brand-700"
                      }`}
                    >
                      {f.nome}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-line-soft pt-4">
              <label className="flex cursor-pointer items-center gap-2.5 text-piccolo text-ink-700">
                <input
                  type="checkbox"
                  checked={soloDemo}
                  onChange={(e) => setSoloDemo(e.target.checked)}
                  className="size-5 rounded-[4px] border-line text-brand-600 focus:ring-brand-500"
                />
                Solo con demo disponibile
              </label>
            </div>

            {attivi ? (
              <button
                type="button"
                onClick={azzera}
                className="w-full rounded-[var(--radius-controllo)] bg-surface-alt py-2 text-piccolo font-medium text-ink-600 hover:bg-line-soft"
              >
                Azzera i filtri
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ------- Risultati ------- */}
      <div>
        <p className="mb-5 text-corrente text-ink-500">
          <strong className="font-semibold text-ink-900">{risultati.length}</strong>{" "}
          {risultati.length === 1 ? "gestionale trovato" : "gestionali trovati"}
        </p>

        {risultati.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {risultati.map((g) => (
              <GestionaleCard
                key={g.slug}
                gestionale={g}
                categoria={mappaCategorie[g.categoriaSlug]}
                base={mappaBasi[g.baseSlug]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-scheda)] border border-dashed border-line bg-surface-alt p-10 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-[var(--radius-scheda)] bg-white text-ink-400">
              <Icona misura="md" nome="Search" />
            </span>
            <h3 className="mt-4 text-guida font-semibold">Nessun gestionale con questi filtri</h3>
            <p className="mx-auto mt-2 max-w-md text-corrente leading-relaxed text-ink-500">
              Il catalogo cresce nel tempo. Se il tuo settore non c&apos;è ancora, partiamo dal
              gestionale più simile e lo adattiamo al tuo modo di lavorare.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Bottone onClick={azzera} variante="secondario" misura="sm">
                Azzera i filtri
              </Bottone>
              <Bottone href="/richiedi" misura="sm">
                Descrivi la tua attività
              </Bottone>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
