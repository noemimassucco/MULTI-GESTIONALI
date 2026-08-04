import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";
import FaqAccordion from "@/components/sito/FaqAccordion";
import CtaBanner from "@/components/sito/CtaBanner";
import { getBasi, getStatistiche } from "@/lib/catalogo";

export const metadata = {
  title: "Come funziona",
  description:
    "Dal primo contatto al gestionale al lavoro: come si sceglie la base, cosa si personalizza, quanto dura e cosa succede dopo la consegna.",
};

const passi = [
  {
    numero: "01",
    titolo: "Mi racconti come lavori",
    testo:
      "Una chiamata o un modulo compilato con calma. Mi interessa sapere cosa fai in una giornata tipo, dove si perde tempo e quali informazioni ti servono sempre e non trovi mai. Non serve che tu sappia cosa vuoi dal software: quello lo capiamo insieme.",
    colore: "viola",
    durata: "30-45 minuti",
  },
  {
    numero: "02",
    titolo: "Scegliamo la base di partenza",
    testo:
      "Confrontiamo il tuo modo di lavorare con le basi già pronte e scegliamo quella più vicina. Ti mostro cosa fa già dal primo giorno e cosa invece va aggiunto per te, in modo che tu sappia esattamente da dove si parte.",
    colore: "rosa",
    durata: "Stesso incontro",
  },
  {
    numero: "03",
    titolo: "Ti mando una proposta scritta",
    testo:
      "Cosa comprende, cosa non comprende, quanto costa e in quanto tempo è pronto. Nero su bianco, senza voci vaghe. Se qualcosa non ti convince lo cambiamo prima di iniziare, non dopo.",
    colore: "ambra",
    durata: "2-3 giorni",
  },
  {
    numero: "04",
    titolo: "Personalizzo la base",
    testo:
      "Metto mano ai campi, alle sezioni, agli stati e ai documenti perché rispecchino le tue procedure. Durante il lavoro ti mando versioni intermedie da guardare: correggere in corsa costa poco, correggere alla fine costa molto.",
    colore: "verde",
    durata: "2-6 settimane",
  },
  {
    numero: "05",
    titolo: "Portiamo dentro i tuoi dati",
    testo:
      "Anagrafiche da Excel, archivi di documenti, storico degli anni passati. Il caricamento assistito riconosce i documenti e li archivia da solo, così non devi rinunciare al passato per far partire il presente.",
    colore: "ciano",
    durata: "Compreso",
  },
  {
    numero: "06",
    titolo: "Partiamo e restiamo in contatto",
    testo:
      "Ti mostro come si usa — se il gestionale è fatto bene bastano poche ore — e poi si comincia. Nelle prime settimane escono sempre aggiustamenti: quelli piccoli li faccio senza discutere, perché è normale.",
    colore: "indaco",
    durata: "Continuo",
  },
];

const faq = [
  {
    domanda: "Devo cambiare il mio modo di lavorare?",
    risposta:
      "No, è esattamente il contrario. Se una procedura funziona da anni, il gestionale si adatta a quella. Cambiamo il metodo solo dove sei tu a dirmi che non funziona più.",
  },
  {
    domanda: "Quanto tempo serve prima di poterlo usare davvero?",
    risposta:
      "Dipende da quanto è distante il tuo lavoro dalla base di partenza. Un adattamento leggero è questione di due o tre settimane; un gestionale con moduli nuovi e importazione di anni di storico richiede qualche settimana in più. Nella proposta scritta trovi la data, non un'indicazione generica.",
  },
  {
    domanda: "E i dati che ho già in Excel e nelle cartelle?",
    risposta:
      "Entrano nel gestionale, ed è compreso nel lavoro. Le anagrafiche si importano dai fogli che usi già; i documenti si caricano in blocco, anche a cartelle intere o archivi ZIP, e vengono riconosciuti e collegati alla scheda giusta in automatico. Quello di cui il sistema non è sicuro finisce in una lista a parte che controlli tu.",
  },
  {
    domanda: "Si usa dal telefono?",
    risposta:
      "Sì. Le schermate funzionano da computer, tablet e telefono. Per chi lavora fuori — cantieri, interventi, sopralluoghi — le parti che servono sul posto sono pensate per lo schermo piccolo, non sono la versione ridotta di una pagina da scrivania.",
  },
  {
    domanda: "Posso aggiungere funzioni dopo la consegna?",
    risposta:
      "Sì, ed è previsto fin dall'inizio: è il motivo per cui parliamo di basi e non di prodotti chiusi. Aggiungere un campo o uno stato è questione di poco; un modulo nuovo si valuta e si preventiva a parte.",
  },
  {
    domanda: "Chi mi assiste se qualcosa non va?",
    risposta:
      "Io. Non c'è un call center: scrivi o chiami e rispondo alla persona che ha scritto il tuo gestionale. È un vantaggio di lavorare con qualcuno di piccolo, e voglio che resti tale finché è possibile.",
  },
  {
    domanda: "I dati dove stanno e di chi sono?",
    risposta:
      "I dati sono tuoi. Stanno su server in cloud con backup automatici, e in qualsiasi momento puoi chiederne l'esportazione completa in un formato leggibile. Non c'è nessun blocco che ti costringe a restare.",
  },
];

export default function PaginaComeFunziona() {
  const stat = getStatistiche();
  const basi = getBasi();

  return (
    <>
      <section className="border-b border-line bg-surface-blue py-12 sm:py-16">
        <Contenitore>
          <Pastiglia variante="brand">
            <Icona nome="Compass" className="size-3.5" />
            Dal primo contatto al lavoro quotidiano
          </Pastiglia>
          <h1 className="mt-5 max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[42px]">
            Come funziona, passo per passo
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-500 sm:text-base">
            Nessuna sorpresa e nessun linguaggio da informatici. Qui trovi esattamente cosa succede
            dal momento in cui mi scrivi a quando il gestionale è al lavoro nella tua azienda.
          </p>
        </Contenitore>
      </section>

      <Sezione sfondo="bianco">
        <div className="mx-auto max-w-4xl">
          <ol className="relative space-y-4">
            {passi.map((p) => (
              <li
                key={p.numero}
                className="relative rounded-2xl border border-line bg-white p-6 sm:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="shrink-0">
                    <span
                      className="flex size-12 items-center justify-center rounded-xl text-[15px] font-bold"
                      style={{
                        color: `var(--cat-${p.colore})`,
                        background: `var(--cat-${p.colore}-bg)`,
                      }}
                    >
                      {p.numero}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-[19px] font-bold">{p.titolo}</h2>
                      <Pastiglia variante="neutra">
                        <Icona nome="Clock" className="size-3" />
                        {p.durata}
                      </Pastiglia>
                    </div>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{p.testo}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Sezione>

      <Sezione sfondo="alt">
        <TitoloSezione
          occhiello={`${basi.length} basi, ${stat.gestionali} gestionali`}
          titolo="Perché non parto mai da zero"
          testo="È la ragione per cui i tempi restano brevi e il prezzo resta accessibile a una piccola azienda."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            {
              icona: "Blocks",
              titolo: "La base funziona già",
              testo: "Dashboard, anagrafiche, scadenze e documenti sono collaudati: non si riscrivono ogni volta.",
            },
            {
              icona: "Settings2",
              titolo: "Si adatta il vestito",
              testo: "Il lavoro sta nel cucire la base sulle tue procedure, non nel costruire tutto da capo.",
            },
            {
              icona: "Shapes",
              titolo: "Migliora per tutti",
              testo: "Ogni miglioria fatta per un cliente rende più solida la base di quelli successivi.",
            },
          ].map((c) => (
            <div key={c.titolo} className="rounded-2xl border border-line bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icona nome={c.icona} className="size-5" />
              </span>
              <h3 className="mt-4 text-[15.5px] font-semibold">{c.titolo}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{c.testo}</p>
            </div>
          ))}
        </div>
      </Sezione>

      <Sezione sfondo="bianco">
        <TitoloSezione titolo="Le domande che mi fanno tutti" />
        <div className="mx-auto mt-10 max-w-3xl">
          <FaqAccordion voci={faq} />
        </div>
      </Sezione>

      <CtaBanner
        titolo="Il primo passo è solo una chiacchierata"
        testo="Mi racconti come lavori, ti dico se posso esserti utile davvero. Se non lo sono, te lo dico."
        azione={{ href: "/richiedi", label: "Descrivi la tua attività" }}
        secondaria={{ href: "/personalizzazioni", label: "Cosa si può personalizzare" }}
      />
    </>
  );
}
