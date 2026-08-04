import { Contenitore } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import { sito } from "@/lib/sito";

export const metadata = {
  title: "Contatti",
  description: `Scrivi a ${sito.autore} per parlare del gestionale della tua attività. Nessun call center: risponde chi scrive il software.`,
};

export default function PaginaContatti() {
  return (
    <>
      <section className="border-b border-line bg-surface-blue py-12 sm:py-16">
        <Contenitore>
          <h1 className="max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[42px]">
            Parliamone
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-500 sm:text-base">
            Nessun call center e nessun modulo che finisce in un ufficio commerciale. Rispondo io,
            che sono la stessa persona che poi scrive il gestionale.
          </p>
        </Contenitore>
      </section>

      <div className="bg-white py-14 sm:py-20">
        <Contenitore>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-line bg-white p-8">
              <h2 className="text-[20px] font-bold">Il modo migliore per iniziare</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">
                Compila il modulo di richiesta: sono poche domande, ma sono quelle giuste per
                capire se posso esserti utile davvero. Ci metti dieci minuti e mi risparmi tre
                email di chiarimenti.
              </p>
              <div className="mt-6">
                <Bottone href="/richiedi" misura="lg">
                  Vai al modulo
                  <Icona nome="ArrowRight" className="size-4" />
                </Bottone>
              </div>

              <div className="mt-8 border-t border-line pt-8">
                <h3 className="text-[15px] font-bold">Oppure scrivimi direttamente</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href={`mailto:${sito.email}`}
                      className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Icona nome="Mail" className="size-[18px]" />
                      </span>
                      <span>
                        <span className="block text-[12px] font-medium text-ink-400">Email</span>
                        <span className="block text-[14.5px] font-semibold text-ink-900">
                          {sito.email}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-surface-alt text-ink-500">
                      <Icona nome="MapPin" className="size-[18px]" />
                    </span>
                    <span>
                      <span className="block text-[12px] font-medium text-ink-400">Dove sono</span>
                      <span className="block text-[14.5px] font-semibold text-ink-900">
                        {sito.citta} e provincia — da remoto in tutta Italia
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface-alt p-7">
                <h2 className="text-[17px] font-bold">Quando rispondo</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
                  Di solito entro due giorni lavorativi. Se la richiesta è dettagliata, la prima
                  risposta contiene già una proposta di massima invece di un generico &ldquo;ci
                  sentiamo&rdquo;.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-7">
                <h2 className="text-[17px] font-bold">Se non sono la persona giusta</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
                  Te lo dico. Se quello che ti serve è un software fiscale, un gestionale di
                  contabilità o un prodotto enorme già in commercio, ha poco senso costruirlo da
                  zero — e preferisco dirtelo subito che scoprirlo insieme fra due mesi.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-7">
                <Icona nome="MessageCircle" className="size-6 text-brand-600" />
                <h2 className="mt-3 text-[17px] font-bold">Vuoi vederlo al lavoro?</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                  Le demo online sono in preparazione. Nel frattempo te lo mostro io in
                  videochiamata, sul tuo settore, in venti minuti.
                </p>
                <div className="mt-4">
                  <Bottone href="/richiedi" variante="secondario" misura="sm">
                    Chiedi una dimostrazione
                  </Bottone>
                </div>
              </div>
            </div>
          </div>
        </Contenitore>
      </div>
    </>
  );
}
