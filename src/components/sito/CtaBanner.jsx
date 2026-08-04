import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import { Contenitore } from "@/components/ui/Sezione";

/** Fascia di chiusura pagina: verde petrolio, un solo comando pieno. */
export default function CtaBanner({
  titolo = "Non trovi esattamente il tuo settore?",
  testo = "Partiamo dal gestionale più simile e lo adattiamo alle procedure della tua attività.",
  azione = { href: "/richiedi", label: "Descrivi la tua attività" },
  secondaria = { href: "/gestionali", label: "Guarda tutti i gestionali" },
}) {
  return (
    <section className="bg-surface-alt pb-[var(--sezione)] pt-0 lg:pb-[var(--sezione-lg)]">
      <Contenitore>
        <div className="rounded-[var(--radius-scheda)] bg-brand-900 px-7 py-14 lg:px-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-t1 text-white lg:text-titolo">{titolo}</h2>
            <p className="mt-6 text-testo leading-relaxed text-brand-100">{testo}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Bottone href={azione.href} variante="accento" misura="lg">
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
