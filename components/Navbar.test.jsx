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
        expect(screen.getAllByText("WORK").length).toBeGreaterThan(0);
        expect(screen.getAllByText("ABOUT").length).toBeGreaterThan(0);
        expect(screen.getAllByText("PROJECTS").length).toBeGreaterThan(0);
        expect(screen.getAllByText("CONTACT").length).toBeGreaterThan(0);
    });

    it("links the Projects tab to /projects", () => {
        render(<Navbar profile={profile} sections={sections} />);
        const projectsLinks = screen.getAllByText("PROJECTS");
        expect(projectsLinks[0].closest("a")).toHaveAttribute("href", "/projects");
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
        expect(screen.queryByText("PROJECTS")).not.toBeInTheDocument();
    });

    it("toggles the mobile menu open and closed via aria-expanded", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={profile} sections={sections} />);

        const toggle = screen.getByRole("button", { name: /toggle menu/i });
        expect(toggle).toHaveAttribute("aria-expanded", "false");

        await user.click(toggle);
        expect(toggle).toHaveAttribute("aria-expanded", "true");

        await user.click(toggle);
        expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    it("opens the resume modal when the résumé button is clicked", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={profile} sections={sections} />);

        await user.click(screen.getAllByRole("button", { name: /résumé/i })[0]);

        expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("does not render an About tab when there is no about section", () => {
        render(<Navbar profile={profile} sections={[{ id: 2, kind: "contact", label: "Contact" }]} />);
        expect(screen.queryByText("ABOUT")).not.toBeInTheDocument();
    });
});
