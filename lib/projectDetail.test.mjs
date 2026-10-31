import { describe, it, expect } from "vitest";
import { provenanceLabel, splitHighlight, adjacentProjects } from "./projectDetail.js";

describe("provenanceLabel", () => {
    it("names each origin as a kind of project", () => {
        expect(provenanceLabel("Client")).toBe("Client project");
        expect(provenanceLabel("Capstone")).toBe("Capstone project");
        expect(provenanceLabel("Personal")).toBe("Personal project");
    });

    it("falls back to a personal project for unknown or missing values", () => {
        expect(provenanceLabel(undefined)).toBe("Personal project");
        expect(provenanceLabel("Other")).toBe("Personal project");
    });
});

describe("splitHighlight", () => {
    it("separates a short lead-in label from the text", () => {
        expect(splitHighlight("Interactive Odontogram: A charting tool for FDI numbering.")).toEqual({
            label: "Interactive Odontogram",
            text: "A charting tool for FDI numbering.",
        });
    });

    it("keeps plain sentences whole", () => {
        expect(splitHighlight("Deployed the app to a Linux VPS.")).toEqual({ label: null, text: "Deployed the app to a Linux VPS." });
    });

    it("does not treat a late colon, a sentence before the colon, or a URL as a label", () => {
        const late = "Automated billing email notifications and real-time monitoring: helping staff.";
        expect(splitHighlight(late).label).toBeNull();
        expect(splitHighlight("Built it. Then: shipped it.").label).toBeNull();
        expect(splitHighlight("See https://example.test for details").label).toBeNull();
    });

    it("handles empty input", () => {
        expect(splitHighlight(undefined)).toEqual({ label: null, text: "" });
    });
});

describe("adjacentProjects", () => {
    const projects = [{ id: "a" }, { id: "b" }, { id: "c" }];

    it("returns the neighbours of a project in the list", () => {
        expect(adjacentProjects(projects, "b")).toEqual({ previous: { id: "a" }, next: { id: "c" } });
    });

    it("returns null at either end and for unknown ids", () => {
        expect(adjacentProjects(projects, "a").previous).toBeNull();
        expect(adjacentProjects(projects, "c").next).toBeNull();
        expect(adjacentProjects(projects, "zzz")).toEqual({ previous: null, next: null });
    });
});
