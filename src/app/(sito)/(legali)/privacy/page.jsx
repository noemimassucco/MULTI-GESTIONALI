import PaginaLegale from "../PaginaLegale";
import { sito } from "@/lib/sito";

export const metadata = {
  title: "Privacy policy",
  description: "Come vengono trattati i dati inviati tramite i moduli di questo sito.",
  robots: { index: false, follow: true },
};

export default function PaginaPrivacy() {
  return (
    <PaginaLegale titolo="Privacy policy" aggiornamento="agosto 2026">
      <p>
        Questa pagina descrive come vengono trattati i dati personali raccolti tramite il sito{" "}
        {sito.nome}, in conformità al Regolamento UE 2016/679 (GDPR).
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento è {sito.autore}. Per qualsiasi richiesta relativa ai propri dati
        è possibile scrivere a <a href={`mailto:${sito.email}`}>{sito.email}</a>.
      </p>
      <p>
        [DA COMPLETARE PRIMA DELLA PUBBLICAZIONE: ragione sociale completa, indirizzo della sede,
        partita IVA e codice fiscale del titolare.]
      </p>

      <h2>Quali dati vengono raccolti</h2>
      <p>
        Vengono trattati esclusivamente i dati che l&apos;utente inserisce volontariamente nei moduli
        di contatto e di richiesta: nome e cognome, indirizzo email, ed eventualmente azienda,
        telefono, settore di attività e le informazioni descrittive sul proprio modo di lavorare che
        l&apos;utente sceglie di condividere.
      </p>
      <p>
        Non vengono richiesti né devono essere inseriti dati appartenenti a categorie particolari
        (dati sanitari, convinzioni personali, dati giudiziari). Si invita a non inserire nei campi
        liberi informazioni di questo tipo o dati personali di terzi non necessari.
      </p>

      <h2>Perché vengono raccolti</h2>
      <ul>
        <li>
          Rispondere alla richiesta ricevuta e formulare, se pertinente, una proposta commerciale.
          Base giuridica: esecuzione di misure precontrattuali su richiesta dell&apos;interessato.
        </li>
        <li>
          Conservare traccia della corrispondenza per il tempo necessario alla valutazione. Base
          giuridica: legittimo interesse del titolare alla gestione dei contatti commerciali.
        </li>
      </ul>
      <p>
        I dati non vengono utilizzati per invii pubblicitari, non vengono ceduti a terzi per finalità
        di marketing e non vengono impiegati per profilazione automatizzata.
      </p>

      <h2>Per quanto tempo</h2>
      <p>
        Le richieste che non danno seguito a un rapporto di lavoro vengono conservate per un massimo
        di 24 mesi dall&apos;ultimo contatto, poi cancellate. Le richieste che diventano un incarico
        seguono i termini di conservazione previsti dagli obblighi contrattuali e fiscali.
      </p>

      <h2>Dove vengono conservati</h2>
      <p>
        I dati sono conservati su infrastrutture cloud con server situati nell&apos;Unione Europea.
        Il sito è ospitato su un fornitore di hosting che agisce come responsabile del trattamento.
      </p>
      <p>
        [DA COMPLETARE PRIMA DELLA PUBBLICAZIONE: nomi dei fornitori effettivamente utilizzati per
        hosting e database, con riferimento ai rispettivi accordi sul trattamento dei dati.]
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        In qualsiasi momento è possibile chiedere l&apos;accesso ai propri dati, la loro rettifica o
        cancellazione, la limitazione del trattamento, la portabilità, e opporsi al trattamento
        fondato sul legittimo interesse. È inoltre possibile proporre reclamo al Garante per la
        protezione dei dati personali.
      </p>
      <p>
        Per esercitare questi diritti è sufficiente scrivere a{" "}
        <a href={`mailto:${sito.email}`}>{sito.email}</a>: la risposta arriva entro 30 giorni.
      </p>
    </PaginaLegale>
  );
}
