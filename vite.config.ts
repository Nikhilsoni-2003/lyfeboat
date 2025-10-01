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
    tanstackStart({
      target: "vercel",
      customViteReactPlugin: true,
      //   tsr: {
      //     srcDirectory: "./src/app",
      //   },
    }),
    viteReact(),
  ],
});
