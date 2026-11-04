import { beforeAll, describe, expect, it, vi } from "vitest";
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

describe("ProjectImagesField new images", () => {
    beforeAll(() => {
        // jsdom has no object URLs; previews only need a placeholder.
        URL.createObjectURL = vi.fn(() => "blob:preview");
        URL.revokeObjectURL = vi.fn();
    });

    // Browsers fire "formdata" whenever FormData is built from a form (including
    // on submit); jsdom doesn't, so the tests fire it the same way.
    function buildFormData(form) {
        const formData = new FormData(form);
        const event = new Event("formdata");
        event.formData = formData;
        form.dispatchEvent(event);
        return formData;
    }

    function renderInForm(imageUrls = ["https://cdn.test/projects/saved.png"]) {
        const result = render(
            <form data-testid="form">
                <ProjectImagesField imageUrls={imageUrls} />
            </form>
        );
        const submittedImages = () => buildFormData(screen.getByTestId("form")).getAll("images").map((file) => file.name);
        return { ...result, submittedImages };
    }

    const png = (name, size = 10) => new File([new Uint8Array(size)], name, { type: "image/png", lastModified: 1 });

    it("keeps files from separate picks instead of replacing them", async () => {
        const user = userEvent.setup();
        const { submittedImages } = renderInForm();
        const picker = screen.getByLabelText("Add showcase images");

        await user.upload(picker, png("first.png"));
        await user.upload(picker, png("second.png"));

        expect(submittedImages()).toEqual(["first.png", "second.png"]);
        expect(screen.getByText("New: first.png")).toBeInTheDocument();
        expect(screen.getByText("New: second.png")).toBeInTheDocument();
    });

    it("still submits the saved images alongside the new ones", async () => {
        const user = userEvent.setup();
        renderInForm();

        await user.upload(screen.getByLabelText("Add showcase images"), png("first.png"));

        expect(buildFormData(screen.getByTestId("form")).getAll("existing_images")).toEqual(["https://cdn.test/projects/saved.png"]);
    });

    it("drops a removed new image from the upload and ignores a file picked twice", async () => {
        const user = userEvent.setup();
        const { submittedImages } = renderInForm();
        const picker = screen.getByLabelText("Add showcase images");

        await user.upload(picker, [png("first.png"), png("second.png")]);
        await user.upload(picker, png("first.png"));
        expect(submittedImages()).toEqual(["first.png", "second.png"]);

        await user.click(screen.getByRole("button", { name: "Remove new image first.png" }));
        expect(submittedImages()).toEqual(["second.png"]);
    });

    it("warns when the new images are too large to save at once", async () => {
        const user = userEvent.setup();
        renderInForm();

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        await user.upload(screen.getByLabelText("Add showcase images"), png("huge.png", 4.5 * 1024 * 1024));

        expect(screen.getByRole("status")).toHaveTextContent("4.5 MB");
    });
});

describe("ProjectImagesField after a save", () => {
    it("shows the newly saved list and clears the uploaded files when the saved images change", async () => {
        URL.createObjectURL = vi.fn(() => "blob:preview");
        URL.revokeObjectURL = vi.fn();
        const user = userEvent.setup();
        const before = ["https://cdn.test/projects/one.png"];
        const after = ["https://cdn.test/projects/one.png", "https://cdn.test/projects/new.png"];
        const { container, rerender } = render(<ProjectImagesField imageUrls={before} />);

        await user.upload(screen.getByLabelText("Add showcase images"), new File(["x"], "new.png", { type: "image/png" }));
        expect(screen.getByText("New: new.png")).toBeInTheDocument();

        rerender(<ProjectImagesField imageUrls={after} />);

        expect(Array.from(container.querySelectorAll('input[name="existing_images"]')).map((input) => input.value)).toEqual(after);
        expect(screen.queryByText("New: new.png")).not.toBeInTheDocument();
    });
});
