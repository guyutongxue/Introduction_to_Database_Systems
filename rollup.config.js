// @ts-check
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import autoExternal from "rollup-plugin-auto-external";

/** @type {import("rollup").RollupOptions} */
export default {
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
    autoExternal(),
    terser(),
  ],
};
