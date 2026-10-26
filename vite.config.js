import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import interpretSearch from "./api/interpret-search.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function localApiPlugin() {
  return {
    name: "local-interpret-search-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split("?")[0] !== "/api/interpret-search") {
          next();
          return;
        }

        try {
          const chunks = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 10_000) {
              response.statusCode = 413;
              response.end(JSON.stringify({ error: "Request is too large." }));
              return;
            }
            chunks.push(chunk);
          }
          request.body = chunks.length
            ? JSON.parse(Buffer.concat(chunks).toString("utf8"))
            : {};

          const apiResponse = {
            status(code) {
              response.statusCode = code;
              return this;
            },
            setHeader(name, value) {
              response.setHeader(name, value);
              return this;
            },
            json(payload) {
              response.setHeader("Content-Type", "application/json; charset=utf-8");
              response.end(JSON.stringify(payload));
              return this;
            },
          };

          await interpretSearch(request, apiResponse);
        } catch {
          response.statusCode = 400;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: "Invalid JSON request." }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  config(mode) {
    const env = loadEnv(mode, process.cwd(), "");
    for (const name of ["OPENAI_API_KEY", "OPENAI_MODEL"]) {
      if (env[name] && !process.env[name]) process.env[name] = env[name];
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
})
