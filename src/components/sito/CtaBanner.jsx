import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import { Contenitore } from "@/components/ui/Sezione";

/** Fascia di chiusura pagina: verde profondo con l'azione in giallo cantiere. */
export default function CtaBanner({
  titolo = "Non trovi esattamente il tuo settore?",
  testo = "Partiamo dal gestionale più simile e lo adattiamo alle procedure della tua attività.",
  azione = { href: "/richiedi", label: "Descrivi la tua attività" },
  secondaria = { href: "/gestionali", label: "Guarda tutti i gestionali" },
}) {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Contenitore>
        <div className="relative overflow-hidden rounded-[var(--radius-scheda)] bg-brand-700 px-6 py-12 lg:px-12 lg:py-16">
          {/* decorazione */}
          <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-24 size-56 rounded-full bg-white/5" />

          <div className="relative max-w-2xl">
            <h2 className="text-t1 font-bold leading-tight text-white sm:text-titolo">{titolo}</h2>
            <p className="mt-4 text-testo leading-relaxed text-white/85">{testo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Bottone href={azione.href} misura="lg">
                {azione.label}
                <Icona misura="sm" nome="ArrowRight" />
              </Bottone>
              {secondaria ? (
                <Bottone href={secondaria.href} variante="chiaro" misura="lg">
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
