import { Contenitore } from "@/components/ui/Sezione";

/** Impaginazione comune alle pagine legali. */
export default function PaginaLegale({ titolo, aggiornamento, children }) {
  return (
    <>
      <section className="border-b border-line bg-surface-alt py-12">
        <Contenitore>
          <h1 className="text-t1 font-extrabold leading-tight sm:text-mega">{titolo}</h1>
          {aggiornamento ? (
            <p className="mt-3 text-piccolo text-ink-500">Ultimo aggiornamento: {aggiornamento}</p>
          ) : null}
        </Contenitore>
      </section>

      <div className="bg-white py-10 lg:py-14">
        <Contenitore>
          <div className="max-w-3xl space-y-6 text-testo leading-[1.8] text-ink-600 [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_h2]:mt-10 [&_h2]:text-t3 [&_h2]:font-bold [&_li]:mb-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
            {children}
          </div>
        </Contenitore>
      </div>
    </>
  );
}
