
const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
