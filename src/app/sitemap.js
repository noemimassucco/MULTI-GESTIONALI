import { sito } from "@/lib/sito";
import { getCategorie, getGestionali } from "@/lib/catalogo";

export default function sitemap() {
  const base = sito.url.replace(/\/$/, "");
  const oggi = new Date();

  const statiche = [
    "",
    "/gestionali",
    "/categorie",
    "/demo",
    "/come-funziona",
    "/personalizzazioni",
    "/chi-sono",
    "/contatti",
    "/richiedi",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: oggi,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.8,
  }));

  const categorie = getCategorie().map((c) => ({
    url: `${base}/categorie/${c.slug}`,
    lastModified: oggi,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const gestionali = getGestionali().map((g) => ({
    url: `${base}/gestionali/${g.slug}`,
    lastModified: oggi,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...statiche, ...categorie, ...gestionali];
}
