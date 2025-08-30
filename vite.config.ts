import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Für GitHub Pages: /<repo>/ als base. Lokal bleibt "/".
const base = process.env.VITE_BASE || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: true },
});
