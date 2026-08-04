"use client";

import { useState } from "react";
import Icona from "@/components/ui/Icona";

export default function FaqAccordion({ voci = [] }) {
  const [aperta, setAperta] = useState(0);

  if (!voci.length) return null;

  return (
    <div className="divide-y divide-line border-y border-line">
      {voci.map((v, i) => {
        const isAperta = aperta === i;
        return (
          <div key={v.domanda}>
            <button
              type="button"
              onClick={() => setAperta(isAperta ? -1 : i)}
              aria-expanded={isAperta}
              className="flex w-full items-start justify-between gap-5 py-6 text-left"
            >
              <span className="text-guida font-medium text-ink-900">{v.domanda}</span>
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-alt text-ink-500 transition-transform ${
                  isAperta ? "rotate-180" : ""
                }`}
              >
                <Icona misura="sm" nome="ChevronDown" />
              </span>
            </button>
            {isAperta ? (
              <div className="pb-7 pr-14">
                <p className="text-testo leading-relaxed text-ink-600">{v.risposta}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
