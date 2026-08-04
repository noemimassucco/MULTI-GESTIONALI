import { cn } from "@/lib/cn";

/** Contenitore a larghezza massima: la stessa per ogni sezione di ogni pagina. */
export function Contenitore({ className, children }) {
  return (
    <div className={cn("mx-auto w-full max-w-[var(--contenitore)] px-5 lg:px-8", className)}>
      {children}
    </div>
  );
}

const sfondi = {
  bianco: "bg-white",
  alt: "bg-surface-alt",
  blu: "bg-surface-blue",
  scuro: "bg-ink-900",
};

/* Due sole misure di respiro verticale. */
const respiri = {
  normale: "py-10 lg:py-14",
  testata: "py-10 lg:py-14",
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

/** Intestazione di sezione: occhiello, titolo, testo introduttivo. */
export function TitoloSezione({
  occhiello,
  titolo,
  testo,
  centrato = true,
  chiaro = false,
  className,
}) {
  return (
    <div className={cn(centrato ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {occhiello ? (
        <p className={cn("occhiello mb-3", chiaro ? "text-brand-300" : "text-brand-700")}>
          {occhiello}
        </p>
      ) : null}
      <h2 className={cn("text-t1 font-bold lg:text-titolo", chiaro && "text-white")}>{titolo}</h2>
      {testo ? (
        <p className={cn("mt-4 text-testo", chiaro ? "text-ink-300" : "text-ink-500")}>{testo}</p>
      ) : null}
    </div>
  );
}
