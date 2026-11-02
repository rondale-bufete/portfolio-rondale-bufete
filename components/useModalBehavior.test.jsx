import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useModalBehavior } from "./useModalBehavior";

function Modal({ label }) {
    const ref = useModalBehavior(() => {});
    return (
        <div ref={ref} role="dialog" aria-label={label}>
            <button type="button">Close</button>
        </div>
    );
}

afterEach(() => {
    cleanup();
});

describe("useModalBehavior page lock", () => {
    it("marks the page as having an open modal and locks scrolling until it closes", () => {
        const { unmount } = render(<Modal label="Resume" />);
        expect(document.body).toHaveAttribute("data-modal-open");
        expect(document.body.style.overflow).toBe("hidden");

        unmount();
        expect(document.body).not.toHaveAttribute("data-modal-open");
        expect(document.body.style.overflow).toBe("");
    });

    it("stays locked until the last of two stacked modals closes", () => {
        const first = render(<Modal label="First" />);
        const second = render(<Modal label="Second" />);

        second.unmount();
        expect(document.body).toHaveAttribute("data-modal-open");
        expect(document.body.style.overflow).toBe("hidden");

        first.unmount();
        expect(document.body).not.toHaveAttribute("data-modal-open");
        expect(document.body.style.overflow).toBe("");
    });
});
