"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { inviaRichiesta } from "@/app/actions/richiesta";
import Icona from "@/components/ui/Icona";
import { sito } from "@/lib/sito";

const strumenti = [
  "Excel o fogli di calcolo",
  "Fogli cartacei",
  "WhatsApp",
  "Email",
  "Cartelle condivise",
  "Un altro gestionale",
  "Niente di strutturato",
];

function Campo({ etichetta, nome, tipo = "text", obbligatorio, errore, aiuto, ...props }) {
  return (
    <div>
      <label htmlFor={nome} className="mb-1.5 block text-piccolo font-semibold text-ink-900">
        {etichetta}
        {obbligatorio ? <span className="ml-0.5 text-brand-600">*</span> : null}
      </label>
      <input
        id={nome}
        name={nome}
        type={tipo}
        required={obbligatorio}
        aria-invalid={errore ? "true" : undefined}
        aria-describedby={errore ? `${nome}-errore` : undefined}
        className={`h-12 w-full rounded-[var(--radius-controllo)] border bg-white px-3.5 text-corrente text-ink-800 placeholder:text-ink-400 focus:outline-none ${
          errore ? "border-red-400 focus:border-red-500" : "border-line focus:border-brand-400"
        }`}
        {...props}
      />
      {aiuto && !errore ? <p className="mt-1.5 text-piccolo text-ink-400">{aiuto}</p> : null}
      {errore ? (
        <p id={`${nome}-errore`} className="mt-1.5 text-piccolo font-medium text-red-600">
          {errore}
        </p>
      ) : null}
    </div>
  );
}

function AreaTesto({ etichetta, nome, aiuto, righe = 3, ...props }) {
  return (
    <div>
      <label htmlFor={nome} className="mb-1.5 block text-piccolo font-semibold text-ink-900">
        {etichetta}
      </label>
      <textarea
        id={nome}
        name={nome}
        rows={righe}
        className="w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3.5 py-2.5 text-corrente leading-relaxed text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        {...props}
      />
      {aiuto ? <p className="mt-1.5 text-piccolo text-ink-400">{aiuto}</p> : null}
    </div>
  );
}

function BottoneInvio() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-comando
      className="inline-flex h-14 items-center justify-center gap-2 rounded-[var(--radius-controllo)] bg-brand-600 px-6 text-testo font-semibold text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Invio in corso…" : "Invia la richiesta"}
      {!pending ? <Icona misura="sm" nome="Send" /> : null}
    </button>
  );
}

export default function FormRichiesta({ gestionali = [], gestionalePreselezionato = "" }) {
  const [stato, azione] = useActionState(inviaRichiesta, { ok: false });
  const errori = stato?.errori || {};

  if (stato?.ok) {
    return (
      <div className="rounded-[var(--radius-scheda)] border border-emerald-200 bg-emerald-50 p-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-[var(--radius-scheda)] bg-white text-emerald-600">
          <Icona misura="lg" nome="CheckCircle2" />
        </span>
        <h2 className="mt-5 text-t2 font-bold">Richiesta inviata</h2>
        <p className="mx-auto mt-3 max-w-md text-corrente leading-relaxed text-ink-600">
          Grazie. Leggo con calma quello che mi hai scritto e ti rispondo con una proposta concreta,
          di solito entro due giorni lavorativi. Se nel frattempo vuoi aggiungere qualcosa, scrivi
          pure a{" "}
          <a href={`mailto:${sito.email}`} className="font-semibold text-brand-700">
            {sito.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={azione} className="space-y-8" noValidate>
      {/* campo trappola anti-bot, invisibile agli utenti */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="indirizzo">Non compilare questo campo</label>
        <input id="indirizzo" name="indirizzo" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-1 text-testo font-bold text-ink-900">1. Chi sei</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo
            etichetta="Nome e cognome"
            nome="nome"
            obbligatorio
            errore={errori.nome}
            autoComplete="name"
            placeholder="Mario Rossi"
          />
          <Campo
            etichetta="Azienda"
            nome="azienda"
            autoComplete="organization"
            placeholder="Rossi Impianti Srl"
          />
          <Campo
            etichetta="Email"
            nome="email"
            tipo="email"
            obbligatorio
            errore={errori.email}
            autoComplete="email"
            placeholder="mario@rossimpianti.it"
          />
          <Campo
            etichetta="Telefono"
            nome="telefono"
            tipo="tel"
            autoComplete="tel"
            placeholder="Facoltativo"
          />
          <Campo
            etichetta="Settore di attività"
            nome="settore"
            placeholder="Es. impianti elettrici"
          />
          <Campo
            etichetta="Quante persone lo useranno"
            nome="numeroUtenti"
            placeholder="Es. 4"
            aiuto="Serve a capire la dimensione, non è vincolante."
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-8">
        <legend className="mb-1 text-testo font-bold text-ink-900">2. Come lavori oggi</legend>

        <div>
          <p className="mb-2.5 text-piccolo font-semibold text-ink-900">
            Con cosa gestisci il lavoro adesso?
          </p>
          <div className="flex flex-wrap gap-2">
            {strumenti.map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-controllo)] border border-line bg-white px-3 py-2 text-piccolo text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50 has-[:checked]:font-medium has-[:checked]:text-brand-700"
              >
                <input
                  type="checkbox"
                  name="strumentiAttuali"
                  value={s}
                  className="size-5 rounded-[4px] border-line text-brand-600 focus:ring-brand-500"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="gestionaleInteresse"
            className="mb-1.5 block text-piccolo font-semibold text-ink-900"
          >
            Gestionale che ti interessa
          </label>
          <select
            id="gestionaleInteresse"
            name="gestionaleInteresse"
            defaultValue={gestionalePreselezionato}
            className="h-12 w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3 text-corrente text-ink-800 focus:border-brand-400 focus:outline-none"
          >
            <option value="">Non lo so ancora / non è in elenco</option>
            {gestionali.map((g) => (
              <option key={g.slug} value={g.nome}>
                {g.nome}
              </option>
            ))}
          </select>
        </div>

        <AreaTesto
          etichetta="Cosa ti fa perdere più tempo"
          nome="difficolta"
          placeholder="Es. ogni fine mese devo ricostruire le ore dei ragazzi dai messaggi WhatsApp."
          aiuto="È la domanda più importante: rispondi come parleresti a voce."
          righe={3}
        />
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-8">
        <legend className="mb-1 text-testo font-bold text-ink-900">3. Cosa ti serve</legend>
        <AreaTesto
          etichetta="Funzioni che non possono mancare"
          nome="funzioniNecessarie"
          placeholder="Es. rapportini dal telefono con firma del cliente, scadenzario manutenzioni."
          righe={3}
        />
        <AreaTesto
          etichetta="Dati che vorresti portare dentro"
          nome="datiDaImportare"
          placeholder="Es. anagrafica clienti in Excel, cartella con 8 anni di documenti."
          aiuto="Anche se sono tanti file: il caricamento assistito riconosce i documenti e li archivia da solo."
          righe={2}
        />
        <AreaTesto
          etichetta="Personalizzazioni che hai già in mente"
          nome="personalizzazioni"
          placeholder="Es. campi nostri sulla scheda cliente, stati di lavorazione diversi."
          righe={2}
        />
        <AreaTesto etichetta="Altro che vuoi dirmi" nome="messaggio" righe={3} />
      </fieldset>

      <div className="border-t border-line pt-8">
        <label className="flex cursor-pointer items-start gap-3 text-piccolo leading-relaxed text-ink-600">
          <input
            type="checkbox"
            name="consensoPrivacy"
            required
            className="mt-0.5 size-5 shrink-0 rounded-[4px] border-line text-brand-600 focus:ring-brand-500"
          />
          <span>
            Acconsento al trattamento dei dati inseriti per essere ricontattato in merito a questa
            richiesta, come descritto nella{" "}
            <a href="/privacy" className="font-medium text-brand-700 underline">
              privacy policy
            </a>
            .
          </span>
        </label>
        {errori.consensoPrivacy ? (
          <p className="mt-2 text-piccolo font-medium text-red-600">{errori.consensoPrivacy}</p>
        ) : null}

        {stato?.messaggio && !stato.ok ? (
          <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-controllo)] bg-red-50 p-3 text-piccolo text-red-700">
            <Icona misura="sm" nome="AlertTriangle" className="mt-0.5 shrink-0" />
            {stato.messaggio}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <BottoneInvio />
          <p className="text-piccolo text-ink-400">Nessun impegno, nessun costo per la valutazione.</p>
        </div>
      </div>
    </form>
  );
}
