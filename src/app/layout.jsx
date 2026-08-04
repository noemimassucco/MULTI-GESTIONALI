import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { sito } from "@/lib/sito";
import { getCategorieConGestionali, getGestionali } from "@/lib/catalogo";
import Navbar from "@/components/sito/Navbar";
import BarraLaterale from "@/components/sito/BarraLaterale";
import PiePagina from "@/components/sito/PiePagina";

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
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  const categorie = getCategorieConGestionali();
  const gestionali = getGestionali();

  return (
    <html lang="it">
      <body className="min-h-screen antialiased">
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-controllo)] focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Vai al contenuto
        </a>
        <BarraLaterale />
        {/* Un solo incolonnamento per barra, contenuto e piè di pagina:
            se la colonna di icone c'è, sposta tutto, non solo il centro. */}
        <div className="2xl:pl-[var(--rail)]">
          <Navbar categorie={categorie} />
          <main id="contenuto">{children}</main>
          <PiePagina categorie={categorie} gestionali={gestionali} />
        </div>
      </body>
    </html>
  );
}
