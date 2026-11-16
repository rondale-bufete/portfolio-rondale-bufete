import { describe, it, expect } from "vitest";
import { formatPortfolioContext, getPortfolioLinks } from "./chatContext.js";

describe("formatPortfolioContext", () => {
    it("includes profile fields and omits empty optional ones", () => {
        const text = formatPortfolioContext({
            profile: {
                name: "Rondale",
                role: "Developer",
                email: "r@example.com",
                chatJobAvailability: "Open to work",
            },
        });

        expect(text).toContain("Name: Rondale");
        expect(text).toContain("Role: Developer");
        expect(text).toContain("Job availability: Open to work");
        expect(text).toContain("Contact email: r@example.com");
        expect(text).toContain("mailto:r@example.com");
        expect(text).not.toContain("Tagline:");
        expect(text).not.toContain("GitHub:");
    });

    it("includes editable hiring facts and contact destinations only when available", () => {
        const text = formatPortfolioContext({
            profile: {
                available: false,
                statusLabel: "Open to work",
                chatJobAvailability: "Not currently accepting new roles",
                chatPreferredRoles: "Full-stack developer",
                chatWorkArrangements: "Hybrid or remote",
                chatStartAvailability: "One week after notice",
                chatRelocation: "Metro Manila",
                resumeUrl: "https://example.com/resume.pdf",
                email: "r@example.com",
            },
            sections: [{ kind: "contact" }],
        });

        expect(text).toContain("Job availability: Not currently accepting new roles");
        expect(text).not.toContain("Job availability: Open to work");
        expect(text).toContain("Preferred roles: Full-stack developer");
        expect(text).toContain("Work arrangements: Hybrid or remote");
        expect(text).toContain("Start availability: One week after notice");
        expect(text).toContain("Relocation: Metro Manila");
        expect(text).toContain("Resume: https://example.com/resume.pdf");
        expect(text).toContain("Contact form: /#contact");
    });

    it("does not infer job availability from the badge visibility or label", () => {
        const text = formatPortfolioContext({
            profile: { available: true, statusLabel: "Open to work" },
        });

        expect(text).not.toContain("Job availability:");
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
                {
                    id: "app-a",
                    title: "App A",
                    description: "Does things",
                    tags: ["Next.js", "Tailwind"],
                    role: "Full-stack",
                    timeline: "3 months",
                    outcome: "Launched",
                    highlights: ["Added search"],
                    liveUrl: "https://example.com",
                    repoUrl: "https://github.com/example/app-a",
                },
                { id: "app-b", title: "App B", description: "Does other things", tags: [] },
            ],
        });

        expect(text).toContain("- App A — /projects/app-a: Does things (Next.js, Tailwind)");
        expect(text).toContain("Role: Full-stack");
        expect(text).toContain("Timeline: 3 months");
        expect(text).toContain("Outcome: Launched");
        expect(text).toContain("Highlight: Added search");
        expect(text).toContain("Live demo: https://example.com");
        expect(text).toContain("Repository: https://github.com/example/app-a");
        expect(text).toContain("- App B — /projects/app-b: Does other things");
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

describe("getPortfolioLinks", () => {
    it("returns only destinations that exist in the portfolio data", () => {
        expect(
            getPortfolioLinks({
                profile: {
                    email: "r@example.com",
                    resumeUrl: "https://example.com/resume.pdf",
                    github: "https://github.com/example",
                },
                sections: [{ kind: "contact" }],
                projects: [
                    { id: "app a", liveUrl: "https://example.com/app", repoUrl: "https://github.com/example/app" },
                    { id: "app-b" },
                ],
            })
        ).toEqual([
            "mailto:r@example.com",
            "/#contact",
            "https://example.com/resume.pdf",
            "https://github.com/example",
            "/projects/app%20a",
            "https://example.com/app",
            "https://github.com/example/app",
            "/projects/app-b",
        ]);
    });
});
