/** Contenitore a larghezza massima, usato da tutte le sezioni. */
export function Contenitore({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

/**
 * Fascia di pagina con sfondo opzionale e spaziatura verticale coerente.
 * @param {{sfondo?: "bianco"|"alt"|"blu"|"scuro"}} props
 */
export function Sezione({ sfondo = "bianco", className = "", id, children }) {
  const sfondi = {
    bianco: "bg-white",
    alt: "bg-surface-alt",
    blu: "bg-surface-blue",
    scuro: "bg-ink-900",
  };
  return (
    <section id={id} className={`${sfondi[sfondo]} py-16 sm:py-20 lg:py-24 ${className}`}>
      <Contenitore>{children}</Contenitore>
    </section>
  );
}

/** Intestazione di sezione: occhiello, titolo, testo introduttivo. */
export function TitoloSezione({
  occhiello,
  titolo,
  testo,
  centrato = true,
  chiaro = false,
  className = "",
}) {
  return (
    <div
      className={`${centrato ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {occhiello ? (
        <p
          className={`mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] ${
            chiaro ? "text-brand-300" : "text-brand-600"
          }`}
        >
          {occhiello}
        </p>
      ) : null}
      <h2
        className={`text-[26px] font-bold leading-[1.2] sm:text-[32px] lg:text-[38px] ${
          chiaro ? "!text-white" : ""
        }`}
      >
        {titolo}
      </h2>
      {testo ? (
        <p
          className={`mt-4 text-[15px] leading-relaxed sm:text-base ${
            chiaro ? "text-ink-400" : "text-ink-500"
          }`}
        >
          {testo}
        </p>
      ) : null}
    </div>
  );
}
