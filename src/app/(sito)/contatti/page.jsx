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
      <section className="border-b border-line bg-surface-blue py-10 lg:py-14">
        <Contenitore>
          <h1 className="max-w-2xl text-titolo font-extrabold leading-tight sm:text-mega">
            Parliamone
          </h1>
          <p className="mt-4 max-w-2xl text-testo leading-relaxed text-ink-500">
            Nessun call center e nessun modulo che finisce in un ufficio commerciale. Rispondo io,
            che sono la stessa persona che poi scrive il gestionale.
          </p>
        </Contenitore>
      </section>

      <div className="bg-white py-14 lg:py-20">
        <Contenitore>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
              <h2 className="text-t3 font-bold">Il modo migliore per iniziare</h2>
              <p className="mt-3 text-corrente leading-relaxed text-ink-600">
                Compila il modulo di richiesta: sono poche domande, ma sono quelle giuste per
                capire se posso esserti utile davvero. Ci metti dieci minuti e mi risparmi tre
                email di chiarimenti.
              </p>
              <div className="mt-6">
                <Bottone href="/richiedi" misura="lg">
                  Vai al modulo
                  <Icona misura="sm" nome="ArrowRight" />
                </Bottone>
              </div>

              <div className="mt-8 border-t border-line pt-8">
                <h3 className="text-testo font-bold">Oppure scrivimi direttamente</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href={`mailto:${sito.email}`}
                      className="flex items-center gap-3 rounded-[var(--radius-scheda)] border border-line px-4 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      <span className="flex size-9 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-50 text-brand-600">
                        <Icona misura="sm" nome="Mail" />
                      </span>
                      <span>
                        <span className="block text-mini font-medium text-ink-400">Email</span>
                        <span className="block text-corrente font-semibold text-ink-900">
                          {sito.email}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li className="flex items-center gap-3 rounded-[var(--radius-scheda)] border border-line px-4 py-3">
                    <span className="flex size-9 items-center justify-center rounded-[var(--radius-controllo)] bg-surface-alt text-ink-500">
                      <Icona misura="sm" nome="MapPin" />
                    </span>
                    <span>
                      <span className="block text-mini font-medium text-ink-400">Dove sono</span>
                      <span className="block text-corrente font-semibold text-ink-900">
                        {sito.citta} e provincia — da remoto in tutta Italia
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[var(--radius-scheda)] border border-line bg-surface-alt p-6">
                <h2 className="text-guida font-bold">Quando rispondo</h2>
                <p className="mt-3 text-corrente leading-relaxed text-ink-600">
                  Di solito entro due giorni lavorativi. Se la richiesta è dettagliata, la prima
                  risposta contiene già una proposta di massima invece di un generico &ldquo;ci
                  sentiamo&rdquo;.
                </p>
              </div>

              <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
                <h2 className="text-guida font-bold">Se non sono la persona giusta</h2>
                <p className="mt-3 text-corrente leading-relaxed text-ink-600">
                  Te lo dico. Se quello che ti serve è un software fiscale, un gestionale di
                  contabilità o un prodotto enorme già in commercio, ha poco senso costruirlo da
                  zero — e preferisco dirtelo subito che scoprirlo insieme fra due mesi.
                </p>
              </div>

              <div className="rounded-[var(--radius-scheda)] border border-brand-200 bg-brand-50 p-6">
                <Icona misura="lg" nome="MessageCircle" className="text-brand-600" />
                <h2 className="mt-3 text-guida font-bold">Vuoi vederlo al lavoro?</h2>
                <p className="mt-2 text-corrente leading-relaxed text-ink-600">
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
