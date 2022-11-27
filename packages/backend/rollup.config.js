// @ts-check
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import autoExternal from "rollup-plugin-auto-external";
import path from "node:path";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
  },
  external: [
    /^node:/,
  ],
  plugins: [
    typescript(),
    {
      // replace `import.meta.url`
      resolveImportMeta(property, { moduleId }) {
        if (property === "url") {
          const rp = path.relative("dist", moduleId);
          return `new URL("${rp}", import.meta.url).href`;
        }
      }
    },
    autoExternal(),
    terser(),
  ],
});
