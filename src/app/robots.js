import { sito } from "@/lib/sito";

export default function robots() {
  const base = sito.url.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/privacy", "/cookie", "/note-legali"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
