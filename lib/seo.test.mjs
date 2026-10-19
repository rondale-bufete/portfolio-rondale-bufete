import { describe, it, expect } from "vitest";
import { pageMetadata, buildPersonJsonLd, serializeJsonLd } from "./seo.js";

const SITE = "https://example.test";

describe("pageMetadata", () => {
    it("builds matching title/description/openGraph/twitter fields", () => {
        const meta = pageMetadata({
            siteName: "Rondale Rae Bufete",
            title: "Project X — Rondale Rae Bufete",
            description: "Short description.",
            path: "/projects/1",
            type: "article",
        });

        expect(meta.title).toBe("Project X — Rondale Rae Bufete");
        expect(meta.alternates.canonical).toBe("/projects/1");
        expect(meta.openGraph).toMatchObject({
            type: "article",
            siteName: "Rondale Rae Bufete",
            title: "Project X — Rondale Rae Bufete",
            description: "Short description.",
            url: "/projects/1",
        });
        expect(meta.twitter).toMatchObject({ card: "summary_large_image", description: "Short description." });
    });

    it("trims long descriptions and omits empty ones", () => {
        expect(pageMetadata({ title: "T", description: "word ".repeat(80), path: "/" }).description.length).toBeLessThanOrEqual(160);
        expect(pageMetadata({ title: "T", description: "", path: "/" }).description).toBeUndefined();
    });
});

describe("buildPersonJsonLd", () => {
    const profile = {
        name: "Rondale Rae Bufete",
        role: "Full Stack Developer",
        bio: "Builds things.",
        photo: "/photo.png",
        email: "me@example.test",
        github: "https://github.com/example",
        linkedin: "",
    };

    it("returns null without a profile name", () => {
        expect(buildPersonJsonLd({ profile: null }, SITE)).toBeNull();
        expect(buildPersonJsonLd({ profile: { name: "" } }, SITE)).toBeNull();
    });

    it("maps the profile, skills and schools and resolves a relative photo", () => {
        const data = buildPersonJsonLd(
            {
                profile,
                skills: [{ category: "Languages", items: ["JavaScript", "Kotlin"] }],
                education: [{ school: "CSPC" }, { school: "CSPC" }, { school: "" }],
            },
            SITE
        );

        expect(data).toMatchObject({
            "@type": "Person",
            name: "Rondale Rae Bufete",
            url: SITE,
            jobTitle: "Full Stack Developer",
            image: "https://example.test/photo.png",
            email: "mailto:me@example.test",
            sameAs: ["https://github.com/example"],
            knowsAbout: ["JavaScript", "Kotlin"],
            alumniOf: [{ "@type": "EducationalOrganization", name: "CSPC" }],
        });
    });

    it("leaves out fields that are empty", () => {
        const data = buildPersonJsonLd({ profile: { name: "A" } }, SITE);
        expect(Object.keys(data)).toEqual(["@context", "@type", "name", "url"]);
    });
});

describe("serializeJsonLd", () => {
    it("escapes < so CMS text can't close the script tag", () => {
        expect(serializeJsonLd({ bio: "</script><b>" })).toBe('{"bio":"\\u003c/script>\\u003cb>"}');
    });
});
