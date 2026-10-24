import { defineConfig, loadEnv, type Plugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// Rotas públicas do app (mantenha em sincronia com src/App.tsx)
const ROTAS = ["/", "/carteira", "/proventos", "/calculadoras"];

/**
 * Gera robots.txt e sitemap.xml no build a partir de VITE_SITE_URL, já que o
 * sitemap exige URLs absolutas. Também torna absolutas as imagens das meta tags.
 * Sem VITE_SITE_URL, o robots.txt sai sem a linha Sitemap e o sitemap.xml não é gerado.
 */
function seo(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/+$/, "");
  return {
    name: "fiinance-seo",
    transformIndexHtml(html) {
      if (!base) return html;
      return html.replace(
        /(content=")(\/og-image\.png")/g,
        (_, prefixo: string, caminho: string) => `${prefixo}${base}${caminho}`,
      );
    },
    generateBundle() {
      const robots = ["User-agent: *", "Allow: /"];
      if (base) robots.push("", `Sitemap: ${base}/sitemap.xml`);
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: robots.join("\n") + "\n",
      });

      if (!base) {
        this.warn("VITE_SITE_URL não definido: sitemap.xml não foi gerado.");
        return;
      }
      const urls = ROTAS.map(
        (rota) => `  <url>\n    <loc>${base}${rota}</loc>\n  </url>`,
      ).join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      seo(env.VITE_SITE_URL ?? ""),
    ],
  };
});
