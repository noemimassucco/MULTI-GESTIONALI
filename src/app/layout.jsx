/* Caratteri serviti dal sito, non da Google: il build non ha rete e in
   più il sito non dipende da un dominio esterno per essere leggibile. */
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/manrope";
import "./globals.css";
import Avvisi from "@/components/ui/Avvisi";
import { sito } from "@/lib/sito";

export const metadata = {
  metadataBase: new URL(sito.url),
  title: {
    default: `${sito.nome} — Gestionali su misura per piccole aziende`,
    template: `%s | ${sito.nome}`,
  },
  description: sito.descrizione,
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: sito.nome,
    title: `${sito.nome} — Gestionali su misura per piccole aziende`,
    description: sito.descrizione,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0e2420",
};

/** Radice: solo caratteri, stili globali e corpo pagina. La cornice del
 *  sito vive in (sito)/layout, le demo hanno la loro. */
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="min-h-screen antialiased">
        {children}
        <Avvisi />
      </body>
    </html>
  );
}
