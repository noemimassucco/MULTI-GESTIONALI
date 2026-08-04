import PaginaLegale from "../PaginaLegale";
import { sito } from "@/lib/sito";

export const metadata = {
  title: "Note legali",
  description: "Informazioni sul titolare del sito e condizioni di utilizzo dei contenuti.",
  robots: { index: false, follow: true },
};

export default function PaginaNoteLegali() {
  return (
    <PaginaLegale titolo="Note legali" aggiornamento="agosto 2026">
      <h2>Titolare del sito</h2>
      <p>
        {sito.nome} è un progetto di {sito.autore}, con sede in {sito.citta}.
      </p>
      <p>
        [DA COMPLETARE PRIMA DELLA PUBBLICAZIONE: ragione sociale, indirizzo completo, partita IVA,
        codice fiscale ed eventuale numero REA.]
      </p>

      <h2>Contenuti del sito</h2>
      <p>
        Le descrizioni dei gestionali, le funzioni elencate e le personalizzazioni indicate hanno
        finalità informativa e descrivono ciò che una base può fare o può essere adattata a fare.
        Non costituiscono offerta contrattuale: il perimetro esatto di ogni lavoro, i tempi e i costi
        sono definiti nella proposta scritta trasmessa al singolo cliente.
      </p>
      <p>
        Le immagini di interfaccia presenti sul sito mostrano dati inventati a scopo illustrativo e
        non riproducono dati di clienti reali.
      </p>

      <h2>Servizi non compresi</h2>
      <p>
        I gestionali descritti organizzano il lavoro aziendale. Non sostituiscono software fiscali,
        di contabilità o di elaborazione delle paghe, non effettuano invii telematici verso enti
        pubblici e non garantiscono di per sé il rispetto di adempimenti normativi, che restano in
        capo al cliente e ai suoi consulenti.
      </p>

      <h2>Proprietà intellettuale</h2>
      <p>
        Testi, grafica e struttura di questo sito sono di proprietà del titolare. I marchi e i nomi
        eventualmente citati appartengono ai rispettivi proprietari.
      </p>

      <h2>Contatti</h2>
      <p>
        Per qualsiasi comunicazione: <a href={`mailto:${sito.email}`}>{sito.email}</a>.
      </p>
    </PaginaLegale>
  );
}
