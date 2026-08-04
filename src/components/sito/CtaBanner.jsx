import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import { Contenitore } from "@/components/ui/Sezione";

/** Fascia di chiusura pagina. Compare in fondo a quasi tutte le pagine pubbliche. */
export default function CtaBanner({
  titolo = "Non trovi esattamente il tuo settore?",
  testo = "Partiamo dal gestionale più simile e lo adattiamo alle procedure della tua attività.",
  azione = { href: "/richiedi", label: "Descrivi la tua attività" },
  secondaria = { href: "/gestionali", label: "Guarda tutti i gestionali" },
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Contenitore>
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 sm:px-12 sm:py-16">
          {/* decorazione */}
          <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-24 size-56 rounded-full bg-white/5" />

          <div className="relative max-w-2xl">
            <h2 className="!text-white text-[26px] font-bold leading-tight sm:text-[34px]">
              {titolo}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-100 sm:text-base">{testo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Bottone
                href={azione.href}
                variante="secondario"
                misura="lg"
                className="!shadow-none"
              >
                {azione.label}
                <Icona nome="ArrowRight" className="size-4" />
              </Bottone>
              {secondaria ? (
                <Bottone
                  href={secondaria.href}
                  misura="lg"
                  className="!bg-brand-500/40 !shadow-none ring-1 ring-inset ring-white/25 hover:!bg-brand-500/60"
                >
                  {secondaria.label}
                </Bottone>
              ) : null}
            </div>
          </div>
        </div>
      </Contenitore>
    </section>
  );
}
