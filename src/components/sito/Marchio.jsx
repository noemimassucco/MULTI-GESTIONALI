import Link from "next/link";

/**
 * Logo: simbolo e nome.
 * Il simbolo è un cubo modulare — le basi che si combinano — tracciato in
 * verde petrolio dentro un quadrato appena accennato. Il nome è in Playfair,
 * come i titoli: il marchio e la voce del sito sono la stessa cosa.
 */
export default function Marchio({ chiaro = false, className = "" }) {
  const tratto = chiaro ? "#ffffff" : "#234f45";

  return (
    <Link href="/" className={`flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}>
      <span
        className={`flex size-8 shrink-0 items-center sm:size-9 justify-center rounded-[var(--radius-controllo)] ring-1 ring-inset ${
          chiaro ? "bg-white/10 ring-white/20" : "bg-brand-50 ring-brand-100"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-[17px] sm:size-[19px]" fill="none" aria-hidden="true">
          <path
            d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z"
            stroke={tratto}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 11.5 20.5 7M12 11.5 3.5 7m8.5 4.5v10"
            stroke={tratto}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`truncate font-display text-testo leading-none tracking-[-0.015em] sm:text-t3 ${
          chiaro ? "text-white" : "text-ink-900"
        }`}
      >
        Gestioni
        <span className={chiaro ? "italic text-brand-200" : "italic text-brand-600"}>
          SuMisura
        </span>
      </span>
      <span className="sr-only">Torna alla home</span>
    </Link>
  );
}
