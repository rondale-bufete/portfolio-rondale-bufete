import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
}));

const { default: PublicSite } = await import("./PublicSite");

describe("PublicSite chat widget", () => {
    it("shows the chat widget by default", () => {
        render(<PublicSite profile={{ name: "Rondale" }} />);
        expect(screen.getByRole("button", { name: "Open chat" })).toBeInTheDocument();
    });

    it("hides the chat widget when the admin turned it off", () => {
        render(<PublicSite profile={{ name: "Rondale", chatVisible: false }} />);
        expect(screen.queryByRole("button", { name: "Open chat" })).not.toBeInTheDocument();
    });
});
