import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react({ include: /\.(js|jsx|mjs)$/ })],
    // This project writes JSX in plain .js files (Next.js convention).
    // Vite's oxc transform picks its parser mode from the file extension
    // (.js -> no JSX allowed) unless `lang` is forced — this makes every
    // matched file parse as JSX so component .js files aren't rejected.
    oxc: {
        lang: "jsx",
        include: /\.[jt]sx?$/,
    },
    resolve: {
        alias: {
            "@": dirname,
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./test/setup.js"],
        include: ["**/*.test.{js,jsx,mjs}"],
        exclude: ["node_modules", ".next"],
    },
});
