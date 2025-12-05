import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import vitest from "eslint-plugin-vitest";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  // --- React 源代码 ---
  {
    files: ["src/**/*.{js,jsx}"],
    ignores: ["src/test/**"],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // ⭐ fix
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },

  // --- 测试文件（Vitest + JSX 支持） ---
  {
    files: ["src/test/**/*.{js,jsx}"],
    plugins: { vitest },
    extends: [js.configs.recommended, react.configs.flat.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        test: true,
        expect: true,
        describe: true,
        vi: true,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // ⭐ fix
      "no-unused-vars": "off",
    },
  },
]);
