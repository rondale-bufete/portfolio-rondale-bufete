import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

    it("shows an empty-state row when there are no projects", () => {
        render(<Projects projects={[]} />);

        expect(screen.getByText("No projects match this filter yet.")).toBeInTheDocument();
    });

    it("disables a filter pill whose count is zero", () => {
        render(<Projects projects={[projects[0]]} />);
        expect(screen.getByRole("button", { name: /personal 0/i })).toBeDisabled();
    });

    it("does not render the GitHub contribution card when the profile has no github url", () => {
        render(<Projects projects={projects} profile={{}} />);
        expect(screen.queryByText(/contribution/i)).not.toBeInTheDocument();
    });

    it("gives the first two projects the large case-study layout, with the outcome", () => {
        render(<Projects projects={[{ ...projects[0], outcome: "Cut billing time in half" }, projects[1], projects[2]]} />);

        const featured = screen.getAllByRole("link", { name: /read the case study/i });
        expect(featured).toHaveLength(2);
        expect(featured[0]).toHaveAttribute("href", "/projects/1");
        expect(within(featured[0]).getByText("Cut billing time in half")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Side Project/ })).not.toHaveTextContent(/read the case study/i);
    });

    it("shows at most three tags on a card and counts the rest", () => {
        const tagged = { id: "4", title: "Tagged", description: "Lots of tools", tags: ["A", "B", "C", "D", "E"], provenance: "Personal", year: "2022", outcome: "" };
        render(<Projects projects={[...projects, tagged]} />);

        const card = screen.getByRole("link", { name: /Tagged/ });
        expect(within(card).getByText("+2")).toBeInTheDocument();
        expect(within(card).queryByText("D")).not.toBeInTheDocument();
    });

    it("renders the GitHub contribution card when profile and contribution data are available", () => {
        const githubContributions = {
            available: true,
            username: "example",
            year: 2026,
            totalContributions: 42,
            weeks: [],
        };
        render(
            <Projects
                projects={projects}
                profile={{ github: "https://github.com/example" }}
                githubContributions={githubContributions}
                githubTitle="Contribution activity"
            />
        );
        expect(screen.getByRole("heading", { name: "Contribution activity" })).toHaveClass("project-card__title");
        expect(screen.getByText("42")).toBeInTheDocument();
        expect(screen.getByRole("group", { name: /42 github contributions/i }).closest("li")).toHaveClass("project-grid__item--github");
        expect(screen.getByRole("link", { name: /@example on github/i })).toHaveAttribute(
            "href",
            "https://github.com/example"
        );
    });

    it("shows the More on GitHub card when the GitHub section is hidden", () => {
        render(
            <Projects
                projects={projects}
                profile={{ github: "https://github.com/example" }}
                githubContributions={{ available: true, username: "example", year: 2026, totalContributions: 42, weeks: [] }}
                githubVisible={false}
            />
        );

        const moreOnGithub = screen.getByRole("heading", { name: /more on github/i });
        expect(moreOnGithub).toBeInTheDocument();
        expect(moreOnGithub.closest("li")).not.toHaveClass("project-grid__item--github");
        expect(screen.getByText(/explore more projects, source code, and experiments/i)).toBeInTheDocument();
        expect(screen.queryByText("contributions in 2026")).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: /github.com\/example/i })).toHaveAttribute("href", "https://github.com/example");
    });
});
