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

        const keys = {
          gemini: process.env.GEMINI_API_KEY || env.GEMINI_API_KEY,
          nvidia: process.env.NVIDIA_API_KEY || env.NVIDIA_API_KEY,
          mistral: process.env.MISTRAL_API_KEY || env.MISTRAL_API_KEY,
        };
        if (!keys.gemini && !keys.nvidia && !keys.mistral) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Aucune clé API configurée (GEMINI_API_KEY ou NVIDIA_API_KEY requise dans .env.local)" }));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const body = JSON.parse(Buffer.concat(chunks).toString("utf-8") || "{}");

          const { runIZA } = await server.ssrLoadModule("/api/_lib/iza-core.ts");
          const result = await runIZA(body, keys);
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
      host: true,
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
    build: {
      target: "es2020",
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              if (id.includes("firebase")) return "vendor-firebase";
              if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
              if (id.includes("leaflet") || id.includes("@react-google-maps")) return "vendor-maps";
              if (id.includes("framer-motion")) return "vendor-motion";
              if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("cmdk") || id.includes("sonner")) return "vendor-ui";
              if (id.includes("@tanstack/react-query")) return "vendor-query";
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) return "vendor-react";
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
