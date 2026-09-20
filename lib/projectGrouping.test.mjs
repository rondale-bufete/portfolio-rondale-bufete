import { describe, it, expect } from "vitest";
import { normalizeProjectCategory, groupProjectsByCategory } from "./projectGrouping.js";

describe("normalizeProjectCategory", () => {
    it("keeps common category names consistent", () => {
        expect(normalizeProjectCategory("front-end")).toBe("Front-end");
        expect(normalizeProjectCategory("back end")).toBe("Back end");
        expect(normalizeProjectCategory("fullstack")).toBe("Fullstack");
        expect(normalizeProjectCategory("")).toBe("General");
    });

    it("recognizes alternate spellings of the known categories", () => {
        expect(normalizeProjectCategory("frontend")).toBe("Front-end");
        expect(normalizeProjectCategory("backend")).toBe("Back end");
        expect(normalizeProjectCategory("full-stack")).toBe("Fullstack");
    });

    it("is case-insensitive and trims whitespace", () => {
        expect(normalizeProjectCategory("  FRONT-END  ")).toBe("Front-end");
    });

    it("title-cases unrecognized categories", () => {
        expect(normalizeProjectCategory("mobile")).toBe("Mobile");
        expect(normalizeProjectCategory("dev_ops")).toBe("Dev Ops");
        expect(normalizeProjectCategory("machine-learning")).toBe("Machine Learning");
    });

    it("treats a whitespace-only value as empty", () => {
        expect(normalizeProjectCategory("   ")).toBe("General");
    });

    it("treats null/undefined as empty", () => {
        expect(normalizeProjectCategory(null)).toBe("General");
        expect(normalizeProjectCategory(undefined)).toBe("General");
    });
});

describe("groupProjectsByCategory", () => {
    it("groups items by category only", () => {
        const projects = [
            { id: 1, category: "front-end", title: "Alpha" },
            { id: 2, category: "front-end", title: "Beta" },
            { id: 3, category: "back end", title: "Gamma" },
            { id: 4, category: "fullstack", title: "Delta" },
        ];

        const grouped = groupProjectsByCategory(projects);

        expect(grouped.map((group) => group.category)).toEqual(["Front-end", "Back end", "Fullstack"]);
        expect(grouped[0].projects.map((project) => project.title)).toEqual(["Alpha", "Beta"]);
        expect(grouped[1].projects.map((project) => project.title)).toEqual(["Gamma"]);
        expect(grouped[2].projects.map((project) => project.title)).toEqual(["Delta"]);
    });

    it("orders Front-end, Back end, Fullstack first, then unknown categories by first appearance", () => {
        const projects = [
            { id: 1, category: "mobile", title: "Zed" },
            { id: 2, category: "fullstack", title: "Delta" },
            { id: 3, category: "devops", title: "Ops" },
            { id: 4, category: "front-end", title: "Alpha" },
        ];

        const grouped = groupProjectsByCategory(projects);

        expect(grouped.map((group) => group.category)).toEqual(["Front-end", "Fullstack", "Mobile", "Devops"]);
    });

    it("returns an empty array for no projects", () => {
        expect(groupProjectsByCategory([])).toEqual([]);
        expect(groupProjectsByCategory()).toEqual([]);
    });

    it("defaults an untagged project to the General category", () => {
        const grouped = groupProjectsByCategory([{ id: 1, category: "", title: "Solo" }]);
        expect(grouped).toEqual([{ category: "General", projects: [{ id: 1, category: "", title: "Solo" }] }]);
    });
});
