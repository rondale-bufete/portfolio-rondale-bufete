import { afterEach, describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import MotionProvider from "./MotionProvider";

let observed;
let notify;

class FakeIntersectionObserver {
    constructor(callback) {
        notify = (target) => callback([{ target, isIntersecting: true }]);
    }
    observe(element) {
        observed.push(element);
    }
    unobserve() {}
    disconnect() {}
}

afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

function setup() {
    observed = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    const section = document.createElement("div");
    section.setAttribute("data-reveal", "");
    document.body.append(section);
    return section;
}

describe("MotionProvider", () => {
    it("does nothing without IntersectionObserver, so content stays visible", () => {
        const { unmount } = render(<MotionProvider />);
        expect(document.documentElement).not.toHaveClass("motion-ready");
        unmount();
    });

    it("reveals marked elements as they scroll in, and stops on unmount", () => {
        const section = setup();
        const { unmount } = render(<MotionProvider />);

        expect(document.documentElement).toHaveClass("motion-ready");
        expect(observed).toContain(section);

        notify(section);
        expect(section).toHaveAttribute("data-revealed");

        unmount();
        expect(document.documentElement).not.toHaveClass("motion-ready");
    });

    it("also watches elements added later, so they are never left hidden", async () => {
        setup();
        render(<MotionProvider />);

        const grid = document.createElement("ul");
        grid.setAttribute("data-reveal", "");
        document.body.append(grid);
        await Promise.resolve();

        expect(observed).toContain(grid);
    });
});
