import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectGallery from "./ProjectGallery";

const images = ["/shots/one.png", "/shots/two.png", "/shots/three.png"];

describe("ProjectGallery", () => {
    it("renders nothing when the project has no screenshots", () => {
        const { container } = render(<ProjectGallery images={[]} title="App" />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders one enlarge button per screenshot and a count", () => {
        render(<ProjectGallery images={images} title="App" />);
        expect(screen.getAllByRole("button", { name: /enlarge screenshot/i })).toHaveLength(3);
        expect(screen.getByText("3 screenshots")).toBeInTheDocument();
    });

    it("leaves out the count for a single screenshot", () => {
        render(<ProjectGallery images={["/shots/one.png"]} title="App" />);
        expect(screen.queryByText(/screenshots?$/)).not.toBeInTheDocument();
    });

    it("opens the chosen screenshot in a viewer, steps through with arrow keys, and closes with Escape", async () => {
        const user = userEvent.setup();
        render(<ProjectGallery images={images} title="App" />);

        await user.click(screen.getByRole("button", { name: "Enlarge screenshot 2 of 3" }));
        expect(screen.getByRole("dialog", { name: "App screenshot 2 of 3" })).toBeInTheDocument();

        await user.keyboard("{ArrowRight}");
        expect(screen.getByRole("dialog", { name: "App screenshot 3 of 3" })).toBeInTheDocument();

        await user.keyboard("{ArrowRight}");
        expect(screen.getByRole("dialog", { name: "App screenshot 1 of 3" })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Previous screenshot" }));
        expect(screen.getByRole("dialog", { name: "App screenshot 3 of 3" })).toBeInTheDocument();

        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
