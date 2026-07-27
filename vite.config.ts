import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Middleware de dev : reproduit la fonction serverless /api/iza en local
 * (le serveur Vite ne sert pas les fonctions Vercel). Utilise la même
 * logique que api/iza.ts via api/_lib/iza-core.ts.
 */
function izaDevApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "iza-dev-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/iza", async (req, res) => {
        res.setHeader("Content-Type", "application/json");

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Méthode non autorisée" }));
          return;
        }

        const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "GEMINI_API_KEY manquante (ajoute-la dans .env.local ou .env)" }));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const body = JSON.parse(Buffer.concat(chunks).toString("utf-8") || "{}");

          const { runIZA } = await server.ssrLoadModule("/api/_lib/iza-core.ts");
          const result = await runIZA(body, apiKey);
          res.end(JSON.stringify(result));
        } catch (error: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error?.message || "Erreur IZA" }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      izaDevApiPlugin(env),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
