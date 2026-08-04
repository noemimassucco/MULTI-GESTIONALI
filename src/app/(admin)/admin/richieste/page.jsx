import { richiesteRicevute } from "@/lib/contenuti-store";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";

/** Data e ora della richiesta, nel formato di tutti i giorni. */
function dataOra(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Riga di dati brevi: etichetta sopra, valore sotto. */
function Dato({ etichetta, children }) {
  return (
    <div>
      <p className="text-mini font-semibold uppercase tracking-wide text-ink-500">{etichetta}</p>
      <p className="text-corrente text-ink-800">{children}</p>
    </div>
  );
}

/** Blocco di testo lungo: compare solo se la persona l'ha scritto. */
function Testo({ etichetta, valore }) {
  if (!valore) return null;
  return (
    <div>
      <p className="text-mini font-semibold uppercase tracking-wide text-ink-500">{etichetta}</p>
      <p className="mt-1 whitespace-pre-line text-corrente leading-relaxed text-ink-700">
        {valore}
      </p>
    </div>
  );
}

/** Le richieste arrivate dal modulo "Richiedi il tuo gestionale". */
export default async function PaginaRichieste() {
  const richieste = await richiesteRicevute();

  return (
    <>
      <header className="mb-6">
        <h1 className="text-t1 font-bold text-ink-900">Richieste</h1>
        <p className="mt-1 text-corrente text-ink-500">
          {richieste.length
            ? `${richieste.length} richieste ricevute, dalla più recente.`
            : "Quello che arriva dal modulo del sito si legge qui."}
        </p>
      </header>

      {richieste.length ? (
        <div className="space-y-4">
          {richieste.map((r) => (
            <article
              key={r.id}
              className="rounded-[var(--radius-scheda)] border border-line bg-white p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-t3 font-bold text-ink-900">{r.nome}</h2>
                  {r.azienda ? <p className="text-corrente text-ink-600">{r.azienda}</p> : null}
                </div>
                <span className="shrink-0 text-piccolo text-ink-500">{dataOra(r.ricevutaIl)}</span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Dato etichetta="Email">
                  <a
                    href={`mailto:${r.email}`}
                    className="font-medium text-brand-700 hover:text-brand-800"
                  >
                    {r.email}
                  </a>
                </Dato>
                <Dato etichetta="Telefono">{r.telefono || "—"}</Dato>
                <Dato etichetta="Settore">{r.settore || "—"}</Dato>
                <Dato etichetta="Gestionale di interesse">{r.gestionaleInteresse || "—"}</Dato>
                <Dato etichetta="Persone che lo userebbero">{r.numeroUtenti || "—"}</Dato>
              </div>

              {r.strumentiAttuali?.length ? (
                <div className="mt-5">
                  <p className="text-mini font-semibold uppercase tracking-wide text-ink-500">
                    Strumenti attuali
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {r.strumentiAttuali.map((s) => (
                      <Pastiglia key={s}>{s}</Pastiglia>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 space-y-4 border-t border-line-soft pt-4">
                <Testo etichetta="Difficoltà di oggi" valore={r.difficolta} />
                <Testo etichetta="Funzioni necessarie" valore={r.funzioniNecessarie} />
                <Testo etichetta="Dati da importare" valore={r.datiDaImportare} />
                <Testo etichetta="Personalizzazioni" valore={r.personalizzazioni} />
                <Testo etichetta="Messaggio" valore={r.messaggio} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-scheda)] border border-line bg-white px-5 py-12 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-[var(--radius-scheda)] bg-surface-alt text-ink-400">
            <Icona misura="lg" nome="Mail" />
          </span>
          <h2 className="mt-4 text-t3 font-bold text-ink-900">Nessuna richiesta, per ora</h2>
          <p className="mx-auto mt-2 max-w-lg text-corrente leading-relaxed text-ink-600">
            Le richieste inviate dal modulo del sito compaiono qui, dalla più recente. Finché il
            sito gira sul tuo computer vengono scritte in un file locale; quando sarà online servirà
            Supabase, perché il disco del server è di sola lettura e senza un archivio esterno le
            richieste andrebbero perse.
          </p>
        </div>
      )}
    </>
  );
}
