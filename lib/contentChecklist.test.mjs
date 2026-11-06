import { describe, it, expect } from "vitest";
import { buildContentChecklist } from "./contentChecklist";

const complete = {
    profile: { photo_url: "p.png", resume_url: "cv.pdf", stats: [{ value: "300+" }, { value: "+60%" }] },
    projects: [
        { title: "Billing", image_urls: ["a.png"], outcome: "+60%" },
        { title: "Dental", image_url: "b.png", outcome: "Live in clinic" },
    ],
    certifications: [{ url: "https://verify.example" }],
    experience: [{ id: 1 }],
};

describe("buildContentChecklist", () => {
    it("marks everything done for a complete site", () => {
        expect(buildContentChecklist(complete).every((item) => item.done)).toBe(true);
    });

    it("lists what's missing first, naming the projects that need work", () => {
        const items = buildContentChecklist({
            ...complete,
            profile: { ...complete.profile, resume_url: "" },
            projects: [{ title: "Billing", image_urls: [], outcome: "" }, complete.projects[1]],
        });

        const open = items.filter((item) => !item.done);
        expect(items.slice(0, open.length)).toEqual(open);
        expect(open.map((item) => item.id)).toEqual(["resume", "screenshots", "outcomes"]);
        expect(open.find((item) => item.id === "screenshots").detail).toContain("Billing");
    });
});
