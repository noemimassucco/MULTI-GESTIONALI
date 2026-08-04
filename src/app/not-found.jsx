import { Contenitore } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";

export const metadata = { title: "Pagina non trovata" };

export default function NonTrovata() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <Contenitore>
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-[var(--radius-scheda)] bg-surface-alt text-ink-400">
            <Icona misura="lg" nome="Search" />
          </span>
          <h1 className="mt-6 text-t1 font-extrabold sm:text-titolo">Questa pagina non c&apos;è</h1>
          <p className="mt-4 text-testo leading-relaxed text-ink-500">
            Forse il collegamento è vecchio, oppure il gestionale che cercavi non è ancora
            pubblicato. Dal catalogo trovi tutto quello che c&apos;è adesso.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Bottone href="/gestionali">Vai al catalogo</Bottone>
            <Bottone href="/" variante="secondario">Torna alla home</Bottone>
          </div>
        </div>
      </Contenitore>
    </div>
  );
}
