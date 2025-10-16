import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {},
  },
  plugins: [
    tsConfigPaths(),
    mkcert(),
    tanstackStart(),
    // nitroV2Plugin({ preset: "bun" }),
    nitroV2Plugin({
      preset: "vercel",
      compatibilityDate: "2025-10-12",
    }),
    viteReact(),
  ],
});
