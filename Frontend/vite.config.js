// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Node core modules polyfills
      buffer: "buffer",
      process: "process/browser",
    },
  },
  define: {
    global: "globalThis", // Fix for "global is not defined"
  },
  optimizeDeps: {
    include: ["buffer", "process", "simple-peer"],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
