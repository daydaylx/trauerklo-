import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Für GitHub Pages:
 *  - User/Org Page (username.github.io) => base "/"
 *  - Project Page (username.github.io/<repo>) => base "/<repo>/"
 *  Wir setzen base über ENV (VITE_BASE), lokal bleibt "/".
 */
const base = process.env.VITE_BASE || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: true },
});
