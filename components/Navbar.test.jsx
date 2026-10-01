import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
}));

const { default: Navbar } = await import("./Navbar");

const profile = { name: "Rondale Rae", role: "Developer", github: "https://github.com/example" };
const sections = [
    { id: 1, kind: "about", label: "About" },
    { id: 2, kind: "projects", label: "Projects" },
    { id: 3, kind: "contact", label: "Contact" },
];

describe("Navbar", () => {
    it("renders tabs for Work, About, Projects, and Contact", () => {
        render(<Navbar profile={profile} sections={sections} />);
        expect(screen.getAllByText("work").length).toBeGreaterThan(0);
        expect(screen.getAllByText("about").length).toBeGreaterThan(0);
        expect(screen.getAllByText("projects").length).toBeGreaterThan(0);
        expect(screen.getAllByText("contact").length).toBeGreaterThan(0);
    });

    it("links the Projects tab to /projects", () => {
        render(<Navbar profile={profile} sections={sections} />);
        const projectsLinks = screen.getAllByText("projects");
        expect(projectsLinks[0].closest("a")).toHaveAttribute("href", "#projects");
    });

    it("marks a section active when its navigation link is selected", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={profile} sections={sections} />);

        await user.click(screen.getAllByText("projects")[0]);

        expect(screen.getAllByText("projects")[0].closest("a")).toHaveClass("is-active");
    });

    it("does not render a Projects tab when there is no projects section", () => {
        render(
            <Navbar
                profile={profile}
                sections={[
                    { id: 1, kind: "about", label: "About" },
                    { id: 3, kind: "contact", label: "Contact" },
                ]}
            />
        );
        expect(screen.queryByText("projects")).not.toBeInTheDocument();
    });

    it("opens and closes the mobile menu", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={profile} sections={sections} />);

        const openButton = screen.getByRole("button", { name: /open menu/i });
        expect(openButton).toHaveAttribute("aria-expanded", "false");

        await user.click(openButton);
        expect(openButton).toHaveAttribute("aria-expanded", "true");

        await user.click(screen.getByRole("button", { name: /close menu/i }));
        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute("aria-expanded", "false");
    });

    it("opens the resume modal when the résumé button is clicked", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={profile} sections={sections} />);

        await user.click(screen.getAllByRole("button", { name: /resume/i })[0]);

        expect(screen.getAllByText(/resume/i).length).toBeGreaterThan(0);
    });

    it("does not render an About tab when there is no about section", () => {
        render(<Navbar profile={profile} sections={[{ id: 2, kind: "contact", label: "Contact" }]} />);
        expect(screen.queryByText("about")).not.toBeInTheDocument();
    });
});
