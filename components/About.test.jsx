import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";

const baseCert = { title: "Responsive Web Design", issuer: "freeCodeCamp", url: "https://example.test/verify" };

describe("About certifications", () => {
    it("shows the certificate image when one is set", () => {
        render(<About certifications={[{ ...baseCert, image: "/certs/rwc9.png" }]} />);
        expect(screen.getByAltText("Certificate: Responsive Web Design")).toBeInTheDocument();
    });

    it("falls back to issuer initials when there is no image", () => {
        render(<About certifications={[{ ...baseCert, image: null }]} />);
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        expect(screen.getByText("FR")).toBeInTheDocument();
    });

    it("opens the resume in a new tab instead of forcing a download", () => {
        render(<About profile={{ resumeUrl: "https://example.test/cv.pdf" }} />);
        const link = screen.getByRole("link", { name: /view resume/i });
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).not.toHaveAttribute("download");
    });
});
