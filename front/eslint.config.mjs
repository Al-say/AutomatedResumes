import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 自定义规则
  {
    rules: {
      // React优化
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-vars": "error",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-is-mounted": "error",

      // TypeScript优化
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // 性能优化
      "react/jsx-no-bind": ["warn", {
        "ignoreRefs": true,
        "allowArrowFunctions": true,
        "allowFunctions": false,
        "allowBind": false
      }],

      // 代码质量
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "prefer-const": "error",
      "no-var": "error",

      // Next.js特定
      "@next/next/no-img-element": "error",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
  // 覆盖默认忽略
  globalIgnores([
    // 默认忽略
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 额外忽略
    "node_modules/**",
    ".git/**",
    "dist/**",
    "*.min.js",
    "coverage/**",
    ".cache/**",
  ]),
]);

export default eslintConfig;
