import { Contenitore } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";

export const metadata = { title: "Pagina non trovata" };

export default function NonTrovata() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <Contenitore>
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-400">
            <Icona nome="Search" className="size-6" />
          </span>
          <h1 className="mt-6 text-[30px] font-extrabold sm:text-[36px]">Questa pagina non c&apos;è</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
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
