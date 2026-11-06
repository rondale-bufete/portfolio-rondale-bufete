import { describe, it, expect } from "vitest";
import { findTechIcon, inkOn, techInitials, toSlug } from "./techIcons";

describe("toSlug", () => {
    it("follows Simple Icons' slug rules", () => {
        expect(toSlug("Next.js")).toBe("nextdotjs");
        expect(toSlug("Tailwind CSS")).toBe("tailwindcss");
        expect(toSlug("C++")).toBe("cplusplus");
    });
});

describe("findTechIcon", () => {
    it("finds icons by their usual names and common spellings", () => {
        expect(findTechIcon("Next.js").slug).toBe("nextdotjs");
        expect(findTechIcon("Jetpack Compose").slug).toBe("jetpackcompose");
        expect(findTechIcon("Node").slug).toBe("nodedotjs");
        expect(findTechIcon("laravel")).toMatchObject({ slug: "laravel", color: expect.stringMatching(/^#[0-9A-F]{6}$/i) });
    });

    it("returns nothing for brands Simple Icons doesn't carry", () => {
        expect(findTechIcon("Java")).toBeNull();
        expect(findTechIcon("")).toBeNull();
    });
});

describe("inkOn", () => {
    it("picks the more readable of white and black", () => {
        expect(inkOn("F7DF1E")).toBe("#000000");
        expect(inkOn("000000")).toBe("#ffffff");
    });
});

describe("techInitials", () => {
    it("uses two letters", () => {
        expect(techInitials("Java")).toBe("Ja");
        expect(techInitials("Visual Studio Code")).toBe("VS");
    });
});
