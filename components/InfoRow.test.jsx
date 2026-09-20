import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InfoRow from "./InfoRow";

describe("InfoRow", () => {
    it("renders nothing when there is no value and no placeholder", () => {
        const { container } = render(<InfoRow label="GitHub" value="" />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders the label and value when a value is present", () => {
        render(<InfoRow label="Based" value="Manila, PH" />);
        expect(screen.getByText("Based")).toBeInTheDocument();
        expect(screen.getByText("Manila, PH")).toBeInTheDocument();
    });

    it("falls back to a dimmed placeholder when no value but a placeholder is given", () => {
        render(<InfoRow label="Based" value="" placeholder="Add your location" />);
        const placeholder = screen.getByText("Add your location");
        expect(placeholder).toBeInTheDocument();
        expect(placeholder.className).toContain("text-[var(--color-neutral-400)]");
    });

    it("wraps the value in a link when href is provided and a value exists", () => {
        render(<InfoRow label="Email" value="me@example.com" href="mailto:me@example.com" />);
        const link = screen.getByRole("link", { name: "me@example.com" });
        expect(link).toHaveAttribute("href", "mailto:me@example.com");
    });

    it("does not render a link when there is no value, even if href is provided", () => {
        render(<InfoRow label="Email" value="" placeholder="No email set" href="mailto:test@example.com" />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("opens external http(s) links in a new tab", () => {
        render(<InfoRow label="GitHub" value="github.com/example" href="https://github.com/example" />);
        const link = screen.getByRole("link", { name: "github.com/example" });
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
});
