import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],

  // Ignores
  {
    ignores: [
      "node_modules",
      "build/compiled",
      "release",
      "**/vite.config.ts",
      "**/pnpm-lock.yaml",
      "src/components/ui/**"
    ]
  },

  // Global language options
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // TypeScript and Vue files - configure parser for type-aware linting
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        extraFileExtensions: [".vue"],
        sourceType: "module"
      }
    }
  },

  // Vue-specific configuration
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        sourceType: "module"
      }
    }
  },

  // Rule overrides
  {
    rules: {
      // Disable rules that conflict with TypeScript
      "no-undef": "off",
      "no-unused-vars": "off",
      // Allow unused vars that start with underscore
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      // Disable overly strict Vue formatting rules
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/html-indent": "off"
    }
  }
];
