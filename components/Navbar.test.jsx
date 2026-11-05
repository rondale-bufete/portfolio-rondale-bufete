import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
}));

const { default: Navbar, buildTabs } = await import("./Navbar");

const profile = { name: "Rondale Rae", role: "Developer", github: "https://github.com/example" };
const sections = [
    { id: 1, kind: "projects", label: "Projects" },
    { id: 2, kind: "about", label: "02 — About" },
    { id: 3, kind: "contact", label: "Contact" },
];

function mainNav() {
    return within(screen.getAllByRole("navigation", { name: "Main" })[0]);
}

describe("buildTabs", () => {
    it("follows the admin order, drops numbering and skips legacy rows", () => {
        const tabs = buildTabs([
            ...sections,
            { id: 4, kind: "experience", label: "Experience" },
            { id: 5, kind: "custom", label: "" },
        ]);
        expect(tabs).toEqual([
            { anchor: "projects", label: "Projects" },
            { anchor: "about", label: "About" },
            { anchor: "contact", label: "Contact" },
            { anchor: "section-5", label: "More" },
        ]);
    });
});

describe("Navbar", () => {
    it("links each section in order, with the name (not a Work tab) going home", () => {
        render(<Navbar profile={profile} sections={sections} />);
        const links = mainNav().getAllByRole("link");
        expect(links[0]).toHaveAttribute("href", "/");
        expect(links[0]).toHaveTextContent("Rondale Rae");
        expect(links.slice(1, 4).map((link) => link.textContent)).toEqual(["Projects", "About", "Contact"]);
        expect(mainNav().getByRole("link", { name: "Projects" })).toHaveAttribute("href", "#projects");
        expect(mainNav().queryByRole("link", { name: /work/i })).not.toBeInTheDocument();
    });

    it("marks a section active when its link is selected", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={profile} sections={sections} />);

        await user.click(mainNav().getByRole("link", { name: "Projects" }));

        const projectsLink = mainNav().getByRole("link", { name: "Projects" });
        expect(projectsLink).toHaveClass("is-active");
        expect(projectsLink).toHaveAttribute("aria-current", "location");
        expect(mainNav().getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
    });

    it("does not render a Projects tab when there is no projects section", () => {
        render(<Navbar profile={profile} sections={[sections[1], sections[2]]} />);
        expect(screen.queryByRole("link", { name: "Projects" })).not.toBeInTheDocument();
    });

    it("does not render an About tab when there is no about section", () => {
        render(<Navbar profile={profile} sections={[sections[2]]} />);
        expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();
    });

    it("opens and closes the mobile menu", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={profile} sections={sections} />);

        const openButton = screen.getByRole("button", { name: /open menu/i });
        expect(openButton).toHaveAttribute("aria-expanded", "false");

        await user.click(openButton);
        expect(openButton).toHaveAttribute("aria-expanded", "true");
        expect(screen.getAllByRole("navigation", { name: "Main" })).toHaveLength(2);
        // The panel adds icon links for every profile, next to the header's text links.
        expect(screen.getAllByRole("link", { name: "GitHub" })).toHaveLength(2);

        await user.click(screen.getByRole("button", { name: /close menu/i }));
        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute("aria-expanded", "false");
    });

    it("opens the resume modal as a dialog and closes it with Escape", async () => {
        const user = userEvent.setup();
        render(<Navbar profile={{ ...profile, resumeUrl: "https://example.test/cv.pdf" }} sections={sections} />);

        await user.click(screen.getAllByRole("button", { name: /resume/i })[0]);
        expect(screen.getByRole("dialog", { name: /resume/i })).toBeInTheDocument();

        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("hides the resume button when no resume is uploaded", () => {
        render(<Navbar profile={profile} sections={sections} />);
        expect(screen.queryByRole("button", { name: /resume/i })).not.toBeInTheDocument();
    });
});
