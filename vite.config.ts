import { defineConfig } from "vite";
// @ts-ignore
import { resolve } from "path";
import react from "@vitejs/plugin-react";

declare var __dirname: string;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- NOVO: Configuração para o GitHub Pages ---
  // Troque 'dice-main' pelo nome EXATO do seu repositório no GitHub se for diferente
  base: '/dice-main/', 
  // ---------------------------------------------

  // MANTIDO: Necessário para carregar os dados 3D
  assetsInclude: ["**/*.glb", "**/*.hdr"],

  build: {
    // --- NOVO: Manda os arquivos para a pasta 'docs' ---
    outDir: 'docs',
    // ---------------------------------------------------

    // MANTIDO: Necessário para a extensão ter várias partes
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popover: resolve(__dirname, "popover.html"),
        background: resolve(__dirname, "background.html"),
      },
    },
  },
});