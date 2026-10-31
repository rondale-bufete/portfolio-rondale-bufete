import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ProjectHero from "./ProjectHero";

const baseProject = {
    title: "Dotillos Smart Dental",
    provenance: "Client",
    role: "",
    year: "",
    timeline: "",
    outcome: "",
    tags: [],
    liveUrl: "",
    repoUrl: "",
};

function renderHero(overrides = {}, lead = "A clinic app.") {
    return render(<ProjectHero project={{ ...baseProject, ...overrides }} lead={lead} />);
}

describe("ProjectHero", () => {
    it("shows the title as the page heading and the lead", () => {
        renderHero();
        expect(screen.getByRole("heading", { level: 1, name: "Dotillos Smart Dental" })).toBeInTheDocument();
        expect(screen.getByText("A clinic app.")).toBeInTheDocument();
    });

    it("lists only the facts that are filled in", () => {
        renderHero({ role: "Full Stack Developer", outcome: "+60% collected income", tags: ["Kotlin", "Supabase"] });
        const facts = screen.getByText("Role").closest("dl");

        expect(within(facts).getByText("Role")).toBeInTheDocument();
        expect(within(facts).getByText("Client project")).toBeInTheDocument();
        expect(within(facts).getByText("+60% collected income")).toBeInTheDocument();
        expect(within(facts).getByText("Kotlin")).toBeInTheDocument();
        expect(within(facts).queryByText("Year")).not.toBeInTheDocument();
        expect(within(facts).queryByText("Timeline")).not.toBeInTheDocument();
    });

    it("links to the live site and source code in new tabs when both exist", () => {
        renderHero({ liveUrl: "https://live.test", repoUrl: "https://github.test/repo" });

        const live = screen.getByRole("link", { name: /visit live site/i });
        expect(live).toHaveAttribute("href", "https://live.test");
        expect(live).toHaveAttribute("target", "_blank");
        expect(live).toHaveAccessibleName(/opens in a new tab/i);
        expect(screen.getByRole("link", { name: /view source code/i })).toHaveAttribute("href", "https://github.test/repo");
        expect(screen.queryByRole("link", { name: /ask me about this project/i })).not.toBeInTheDocument();
    });

    it("offers a contact link when the project has no public links", () => {
        renderHero();
        expect(screen.getByRole("link", { name: /ask me about this project/i })).toHaveAttribute("href", "/#contact");
    });

    it("uses the smaller lead style for long single-paragraph descriptions", () => {
        renderHero({}, "word ".repeat(80).trim());
        expect(screen.getByText(/^word word/)).toHaveClass("is-long");
    });
});
