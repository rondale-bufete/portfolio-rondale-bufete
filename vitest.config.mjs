import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react({ include: /\.(js|jsx|mjs)$/ })],
    // Parse .js files as JSX to match the project's Next.js conventions.
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
