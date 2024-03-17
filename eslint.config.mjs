// @ts-check

// https://typescript-eslint.io/

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import markdown from "eslint-plugin-markdown";

export default tseslint.config(
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/fixtures/**",
      "**/coverage/**",
      "**/public/**",
      "src/env.d.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...markdown.configs.recommended,
  {
    files: ["tailwind.config.cjs", "postcss.config.cjs"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: ["eslint.config.{js,cjs,mjs}"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    // 1. Target ```code blocks in .md files.
    files: ["**/*.{md,mdx}/*.*"],
    rules: {
      // 2. Disable other rules.
      "no-console": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-undef": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/padded-blocks": "off",
    },
  },
  // https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended,
);
