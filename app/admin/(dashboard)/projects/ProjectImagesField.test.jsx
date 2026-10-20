import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectImagesField from "./ProjectImagesField";

describe("ProjectImagesField", () => {
    it("removes only the selected saved image from the form", async () => {
        const user = userEvent.setup();
        const imageUrls = [
            "https://cdn.test/projects/one.png",
            "https://cdn.test/projects/two.png",
        ];
        const { container } = render(<ProjectImagesField imageUrls={imageUrls} />);

        await user.click(screen.getByRole("button", { name: "Remove showcase image 1" }));

        expect(Array.from(container.querySelectorAll('input[name="existing_images"]')).map((input) => input.value))
            .toEqual([imageUrls[1]]);
    });

    it("reorders images by dragging and marks the first image as the thumbnail", () => {
        const imageUrls = [
            "https://cdn.test/projects/one.png",
            "https://cdn.test/projects/two.png",
        ];
        const { container } = render(<ProjectImagesField imageUrls={imageUrls} />);
        const images = screen.getAllByRole("listitem");
        const dataTransfer = { effectAllowed: "", setData: () => {} };

        fireEvent.dragStart(images[1].querySelector("img"), { dataTransfer });
        fireEvent.dragOver(images[0]);
        fireEvent.drop(images[0]);

        expect(Array.from(container.querySelectorAll('input[name="existing_images"]')).map((input) => input.value))
            .toEqual([imageUrls[1], imageUrls[0]]);
        expect(screen.getByText("Thumbnail").parentElement.querySelector("input").value).toBe(imageUrls[1]);
    });

    it("allows reordering with buttons", async () => {
        const user = userEvent.setup();
        const imageUrls = [
            "https://cdn.test/projects/one.png",
            "https://cdn.test/projects/two.png",
        ];
        const { container } = render(<ProjectImagesField imageUrls={imageUrls} />);

        await user.click(screen.getByRole("button", { name: "Move showcase image 2 earlier" }));

        expect(Array.from(container.querySelectorAll('input[name="existing_images"]')).map((input) => input.value))
            .toEqual([imageUrls[1], imageUrls[0]]);
    });
});
