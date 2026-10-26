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
  // ─── Vendored files (components/ui/perspective-tunnel-hero.tsx and
  //     components/perspective-tunnel-hero-demo.tsx) are copied verbatim from the
  //     original spec and must NOT be reformatted or modified.
  //     We disable only the rules they actually trip to keep lint passing without
  //     touching the source.
  {
    files: [
      "components/ui/perspective-tunnel-hero.tsx",
      "components/perspective-tunnel-hero-demo.tsx",
    ],
    rules: {
      // <img> is used directly in the 3D card layout; next/image is not used in the vendored component.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
