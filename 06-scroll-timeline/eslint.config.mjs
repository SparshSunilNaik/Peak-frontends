import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// NOTE: files under components/ui/ are vendored verbatim from external sources
// (e.g. Hyperiux Vault / 21st.dev). They are intentionally not reformatted,
// refactored, or linted. Rules that conflict with their original code (such as
// @next/next/no-img-element, react-hooks/exhaustive-deps) are downgraded here
// so `next build` and `npm run lint` succeed without touching the source files.
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
  // Vendored component files — relax rules without editing the source.
  {
    files: ["components/ui/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
