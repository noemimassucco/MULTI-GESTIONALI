import Link from "next/link";

/** Logo testuale + simbolo. Il simbolo è un cubo modulare: le basi che si combinano. */
export default function Marchio({ chiaro = false, className = "" }) {
  return (
    <Link href="/" className={`flex shrink-0 items-center gap-2 sm:gap-2.5 ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-600 shadow-[var(--shadow-brand)] sm:size-9">
        <svg viewBox="0 0 24 24" className="size-[18px] sm:size-5" fill="none" aria-hidden="true">
          <path
            d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z"
            stroke="white"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M12 11.5 20.5 7M12 11.5 3.5 7m8.5 4.5v10" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      </span>
      <span
        className={`text-guida font-bold tracking-[-0.02em] sm:text-t3 ${chiaro ? "text-white" : "text-ink-900"}`}
      >
        Gestioni<span className="text-brand-500">SuMisura</span>
      </span>
      <span className="sr-only">Torna alla home</span>
    </Link>
  );
}
