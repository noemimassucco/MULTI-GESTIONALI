import { cn } from "@/lib/cn";

/** Contenitore a larghezza massima: la stessa per ogni sezione di ogni pagina. */
export function Contenitore({ className, children }) {
  return (
    <div className={cn(
        "mx-auto w-full max-w-[var(--contenitore)] px-[var(--margine)] lg:px-[var(--margine-lg)]",
        className,
      )}>
      {children}
    </div>
  );
}

const sfondi = {
  bianco: "bg-white",
  alt: "bg-surface-alt",
  blu: "bg-surface-blue",
  scuro: "bg-brand-900",
};

/* Il respiro verticale delle fasce. Largo di proposito: è lo spazio
   vuoto a far sembrare progettata una pagina, non il numero di elementi. */
const respiri = {
  normale: "py-[var(--sezione)] lg:py-[var(--sezione-lg)]",
  stretto: "py-14 lg:py-20",
  testata: "pt-14 pb-[var(--sezione)] lg:pt-20 lg:pb-[var(--sezione-lg)]",
};

/**
 * Fascia di pagina: sfondo, respiro verticale e contenitore in un colpo solo.
 * @param {{sfondo?: keyof sfondi, respiro?: keyof respiri}} props
 */
export function Sezione({ sfondo = "bianco", respiro = "normale", className, id, children }) {
  return (
    <section id={id} className={cn(sfondi[sfondo], respiri[respiro], className)}>
      <Contenitore>{children}</Contenitore>
    </section>
  );
}

/**
 * Intestazione di sezione: occhiello, titolo, testo introduttivo.
 * Impaginata come l'apertura di un articolo: filetto sottile, titolo in
 * Playfair, un capoverso di respiro. Niente barre colorate.
 */
export function TitoloSezione({
  occhiello,
  titolo,
  testo,
  centrato = false,
  chiaro = false,
  className,
}) {
  return (
    <div className={cn(centrato ? "mx-auto max-w-[46rem] text-center" : "max-w-[42rem]", className)}>
      {occhiello ? (
        <p
          className={cn(
            "occhiello",
            chiaro ? "text-accento-300" : "text-accento-600",
          )}
        >
          {occhiello}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-t1 lg:text-titolo",
          occhiello ? "mt-5" : "",
          chiaro && "text-white",
        )}
      >
        {titolo}
      </h2>
      {testo ? (
        <p
          className={cn(
            "mt-5 text-testo leading-relaxed",
            chiaro ? "text-brand-100" : "text-ink-600",
          )}
        >
          {testo}
        </p>
      ) : null}
    </div>
  );
}
