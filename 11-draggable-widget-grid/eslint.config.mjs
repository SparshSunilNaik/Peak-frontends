import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Vendored files – relax rules that conflict with the verbatim source style.
  {
    files: [
      "components/ui/draggable-widget-grid.tsx",
      "components/draggable-widget-grid-demo.tsx",
    ],
    rules: {
      // The verbatim demo uses exhaustive deps intentionally; don't flag it.
      "react-hooks/exhaustive-deps": "off",
      // Tab indentation is intentional in these files.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
