import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * Dual-purpose config:
 *  - `vite` (dev) serves dev/index.html which mounts the widget like a Duda host page.
 *  - `vite build` produces a single self-contained IIFE + CSS pair under dist/,
 *    suitable for pasting into a Duda HTML/Embed block.
 */
export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      root: resolve(__dirname, "dev"),
      server: { port: 5173, open: true },
    };
  }

  return {
    build: {
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: true,
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, "src/main.ts"),
        name: "DogFoodCalc",
        formats: ["iife"],
        fileName: () => "dogfoodcalc.iife.js",
      },
      rollupOptions: {
        output: {
          assetFileNames: (asset) =>
            asset.name && asset.name.endsWith(".css")
              ? "dogfoodcalc.css"
              : "[name][extname]",
        },
      },
    },
  };
});
