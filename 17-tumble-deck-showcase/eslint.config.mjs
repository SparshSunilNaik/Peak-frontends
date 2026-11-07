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
  // Vendored files (components/ui/tumble-deck-showcase.tsx and
  // components/tumble-deck-showcase-demo.tsx) are kept verbatim from the
  // spec. Disable only the rule they trip (@next/next/no-img-element)
  // because plain <img> elements are used for 3D card rendering without next/image wrapper overhead.
  {
    files: [
      "components/ui/tumble-deck-showcase.tsx",
      "components/tumble-deck-showcase-demo.tsx",
    ],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
