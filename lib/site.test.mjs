import { describe, it, expect, afterEach, vi } from "vitest";
import { getSiteUrl } from "./site.js";

afterEach(() => {
    vi.unstubAllEnvs();
});

describe("getSiteUrl", () => {
    it("prefers NEXT_PUBLIC_SITE_URL and drops a trailing slash", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://rondale.dev/");
        vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio.vercel.app");
        expect(getSiteUrl()).toBe("https://rondale.dev");
    });

    it("falls back to the Vercel production host", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
        vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio.vercel.app");
        expect(getSiteUrl()).toBe("https://portfolio.vercel.app");
    });

    it("uses localhost when neither is set", () => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
        vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
        expect(getSiteUrl()).toBe("http://localhost:3000");
    });
});
