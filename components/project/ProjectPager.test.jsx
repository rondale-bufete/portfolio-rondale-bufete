import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectPager from "./ProjectPager";

describe("ProjectPager", () => {
    it("links to the previous and next projects", () => {
        render(<ProjectPager previous={{ id: "a", title: "Alpha" }} next={{ id: "c", title: "Gamma" }} />);
        expect(screen.getByRole("link", { name: /previous project alpha/i })).toHaveAttribute("href", "/projects/a");
        expect(screen.getByRole("link", { name: /next project gamma/i })).toHaveAttribute("href", "/projects/c");
    });

    it("shows only the link that exists", () => {
        render(<ProjectPager previous={null} next={{ id: "b", title: "Beta" }} />);
        expect(screen.queryByText(/previous project/i)).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: /next project beta/i })).toBeInTheDocument();
    });

    it("renders nothing for a lone project", () => {
        const { container } = render(<ProjectPager previous={null} next={null} />);
        expect(container).toBeEmptyDOMElement();
    });
});
