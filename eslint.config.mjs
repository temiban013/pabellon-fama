import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Ignore patterns (utility scripts use CommonJS)
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "tests/**",
      "next-env.d.ts",
      "src/scripts/**/*",
      "**/*.config.js",
      "**/*.config.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
