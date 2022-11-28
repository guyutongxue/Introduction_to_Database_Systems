// @ts-check
/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["only-warn"],
  rules: {
    semi: "warn",
    eqeqeq: "warn",
  },
  globals: {
    $$: "readonly",
    $ref: "readonly",
    $computed: "readonly",
    $customRef: "readonly",
    $shallowRef: "readonly",
    $toRef: "readonly",
  },
};
