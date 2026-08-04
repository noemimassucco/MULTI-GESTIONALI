import PaginaLegale from "../PaginaLegale";
import { sito } from "@/lib/sito";

export const metadata = {
  title: "Cookie policy",
  description: "Quali cookie utilizza questo sito.",
  robots: { index: false, follow: true },
};

export default function PaginaCookie() {
  return (
    <PaginaLegale titolo="Cookie policy" aggiornamento="agosto 2026">
      <p>
        Questo sito è volutamente essenziale anche da questo punto di vista: non utilizza cookie di
        profilazione, non usa strumenti pubblicitari e non traccia gli utenti su altri siti.
      </p>

      <h2>Cookie tecnici</h2>
      <p>
        Vengono utilizzati esclusivamente cookie tecnici necessari al funzionamento del sito, ad
        esempio per la protezione dei moduli di invio. Questi cookie non richiedono consenso
        preventivo ai sensi della normativa vigente e non permettono di identificare l&apos;utente.
      </p>

      <h2>Cookie di statistica</h2>
      <p>
        [DA COMPLETARE PRIMA DELLA PUBBLICAZIONE: se verrà attivato uno strumento di statistiche,
        indicare qui quale, se i dati sono anonimizzati e se è richiesto il consenso. Se non viene
        attivato nulla, questa sezione va rimossa.]
      </p>

      <h2>Come disattivarli</h2>
      <p>
        Tutti i browser permettono di bloccare o cancellare i cookie dalle proprie impostazioni.
        Disattivando i cookie tecnici alcune funzioni del sito, come l&apos;invio dei moduli,
        potrebbero non funzionare correttamente.
      </p>

      <h2>Domande</h2>
      <p>
        Per qualsiasi chiarimento è possibile scrivere a{" "}
        <a href={`mailto:${sito.email}`}>{sito.email}</a>. Vedi anche la{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
    </PaginaLegale>
  );
}
