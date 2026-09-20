import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Projects from "./Projects";

const projects = [
    { id: "1", title: "Client App", description: "A client project", tags: ["Next.js"], provenance: "Client", year: "2025", outcome: "" },
    { id: "2", title: "School Capstone", description: "A capstone project", tags: ["React"], provenance: "Capstone", year: "2024", outcome: "" },
    { id: "3", title: "Side Project", description: "A personal project", tags: ["Node"], provenance: "Personal", year: "2023", outcome: "" },
];

describe("Projects", () => {
    it("renders every project by default under the All filter", () => {
        render(<Projects projects={projects} />);
        expect(screen.getByText("Client App")).toBeInTheDocument();
        expect(screen.getByText("School Capstone")).toBeInTheDocument();
        expect(screen.getByText("Side Project")).toBeInTheDocument();
    });

    it("marks the active filter with aria-pressed", () => {
        render(<Projects projects={projects} />);
        const allButton = screen.getByRole("button", { name: /ALL 3/i });
        expect(allButton).toHaveAttribute("aria-pressed", "true");

        const clientButton = screen.getByRole("button", { name: /Client 1/i });
        expect(clientButton).toHaveAttribute("aria-pressed", "false");
    });

    it("filters the table when a provenance filter is clicked", async () => {
        const user = userEvent.setup();
        render(<Projects projects={projects} />);

        await user.click(screen.getByRole("button", { name: /Client 1/i }));

        expect(screen.getByText("Client App")).toBeInTheDocument();
        expect(screen.queryByText("School Capstone")).not.toBeInTheDocument();
        expect(screen.queryByText("Side Project")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Client 1/i })).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: /ALL 3/i })).toHaveAttribute("aria-pressed", "false");
    });

    it("shows an empty-state row when a filter matches nothing", async () => {
        const user = userEvent.setup();
        render(<Projects projects={[projects[0]]} />);

        await user.click(screen.getByRole("button", { name: /Personal 0/i }));

        expect(screen.getByText("No projects match this filter yet.")).toBeInTheDocument();
    });

    it("does not render the GitHub callout when the profile has no github url", () => {
        render(<Projects projects={projects} profile={{}} />);
        expect(screen.queryByText(/More projects and contributions/i)).not.toBeInTheDocument();
    });

    it("renders the GitHub callout when the profile has a github url", () => {
        render(<Projects projects={projects} profile={{ github: "https://github.com/example" }} />);
        expect(screen.getByText(/More projects and contributions/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /github.com\/example/i })).toHaveAttribute(
            "href",
            "https://github.com/example"
        );
    });
});
