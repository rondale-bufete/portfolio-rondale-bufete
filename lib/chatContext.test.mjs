import { describe, it, expect } from "vitest";
import { formatPortfolioContext } from "./chatContext.js";

describe("formatPortfolioContext", () => {
    it("includes profile fields and omits empty optional ones", () => {
        const text = formatPortfolioContext({
            profile: { name: "Rondale", role: "Developer", email: "r@example.com" },
        });

        expect(text).toContain("Name: Rondale");
        expect(text).toContain("Role: Developer");
        expect(text).toContain("Contact email: r@example.com");
        expect(text).not.toContain("Tagline:");
        expect(text).not.toContain("GitHub:");
    });

    it("formats experience entries with bullets", () => {
        const text = formatPortfolioContext({
            experience: [
                {
                    role: "Engineer",
                    company: "Acme",
                    period: "Jan 2024 — Present",
                    location: "Remote",
                    bullets: ["Shipped X", "Improved Y"],
                },
            ],
        });

        expect(text).toContain("- Engineer at Acme (Jan 2024 — Present), Remote");
        expect(text).toContain("  • Shipped X");
        expect(text).toContain("  • Improved Y");
    });

    it("formats projects with tags only when present", () => {
        const text = formatPortfolioContext({
            projects: [
                { title: "App A", description: "Does things", tags: ["Next.js", "Tailwind"] },
                { title: "App B", description: "Does other things", tags: [] },
            ],
        });

        expect(text).toContain("- App A: Does things (Next.js, Tailwind)");
        expect(text).toContain("- App B: Does other things");
        expect(text).not.toContain("App B: Does other things (");
    });

    it("omits whole sections that have no data", () => {
        const text = formatPortfolioContext({});
        expect(text).toBe("");
    });

    it("formats education and certifications", () => {
        const text = formatPortfolioContext({
            education: [{ degree: "BS CS", school: "State U", period: "2020 — 2024" }],
            certifications: [{ title: "AWS SAA", issuer: "AWS", date: "Mar 2025" }],
        });

        expect(text).toContain("- BS CS, State U (2020 — 2024)");
        expect(text).toContain("- AWS SAA (AWS, Mar 2025)");
    });
});
