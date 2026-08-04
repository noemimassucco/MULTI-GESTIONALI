import { Suspense } from "react";
import { Contenitore } from "@/components/ui/Sezione";
import Icona from "@/components/ui/Icona";
import FormRichiesta from "@/components/sito/FormRichiesta";
import { getGestionale, getGestionali } from "@/lib/catalogo";

export const metadata = {
  title: "Richiedi il tuo gestionale",
  description:
    "Raccontami come lavori oggi e cosa ti fa perdere tempo. Ti rispondo con una proposta concreta, senza impegno.",
};

const rassicurazioni = [
  { icona: "MessageCircle", testo: "Ti rispondo io, di solito entro due giorni lavorativi" },
  { icona: "FileStack", testo: "Ricevi una proposta scritta con costi e tempi" },
  { icona: "Check", testo: "Nessun impegno e nessun costo per la valutazione" },
];

async function Contenuto({ searchParams }) {
  const parametri = await searchParams;
  const slug = parametri?.gestionale;
  const scelto = slug ? getGestionale(String(slug)) : undefined;
  const gestionali = getGestionali();

  return (
    <>
      <section className="border-b border-line bg-surface-blue py-12 sm:py-14">
        <Contenitore>
          <h1 className="max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[40px]">
            Richiedi il tuo gestionale
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-500 sm:text-base">
            Non serve che tu sappia già cosa vuoi dal software. Mi basta capire come lavori adesso e
            cosa ti fa perdere più tempo: al resto pensiamo insieme.
          </p>
          {scelto ? (
            <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-3.5 py-2 text-[13.5px] text-ink-700">
              <Icona nome="Check" className="size-4 text-brand-600" />
              Stai scrivendo a proposito di{" "}
              <strong className="font-semibold text-ink-900">{scelto.nome}</strong>
            </p>
          ) : null}
        </Contenitore>
      </section>

      <div className="bg-white py-12 sm:py-16">
        <Contenitore>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="max-w-2xl">
              <FormRichiesta
                gestionali={gestionali}
                gestionalePreselezionato={scelto?.nome || ""}
              />
            </div>

            <aside className="lg:pt-2">
              <div className="sticky top-[88px] space-y-4">
                <div className="rounded-2xl border border-line bg-surface-alt p-6">
                  <h2 className="text-[16px] font-bold">Cosa succede dopo</h2>
                  <ul className="mt-4 space-y-3.5">
                    {rassicurazioni.map((r) => (
                      <li key={r.testo} className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600">
                          <Icona nome={r.icona} className="size-4" />
                        </span>
                        <span className="text-[13.5px] leading-snug text-ink-600">{r.testo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-line bg-white p-6">
                  <h2 className="text-[15px] font-bold">Non sai cosa scrivere?</h2>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">
                    Rispondi solo a questa: <em>qual è la cosa che ogni mese ti tocca rifare a mano
                    e ti fa arrabbiare?</em> Da lì partiamo bene.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Contenitore>
      </div>
    </>
  );
}

export default function PaginaRichiedi({ searchParams }) {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <Contenuto searchParams={searchParams} />
    </Suspense>
  );
}
