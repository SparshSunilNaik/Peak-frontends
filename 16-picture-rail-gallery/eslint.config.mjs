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
  // ─── Vendored files (components/ui/picture-rail-gallery.tsx and
  //     components/picture-rail-gallery-demo.tsx) are copied verbatim from the
  //     original spec and must NOT be reformatted or modified.
  //     We disable only the rules they actually trip to keep lint passing without
  //     touching the source.
  {
    files: [
      "components/ui/picture-rail-gallery.tsx",
      "components/picture-rail-gallery-demo.tsx",
    ],
    rules: {
      // <img> is used directly for custom aspect ratios, onLoad handlers and 3D transforms.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
