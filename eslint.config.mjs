import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [".next/**", "node_modules/**"],
    },
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx,mjs}"],
        plugins: {
            "@next/next": nextPlugin,
            react: reactPlugin,
            "react-hooks": hooksPlugin,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
];