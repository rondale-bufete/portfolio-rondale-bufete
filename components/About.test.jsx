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

describe("About intro", () => {
    it("doesn't repeat the tagline and bio already shown in the hero", () => {
        render(<About profile={{ tagline: "I build systems.", bio: "Long bio text." }} experience={[{ role: "Developer", company: "Acme", period: "2025", bullets: [] }]} />);
        expect(screen.queryByText("I build systems.")).not.toBeInTheDocument();
        expect(screen.queryByText("Long bio text.")).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute("href", "#about-experience");
    });
});

describe("About skills", () => {
    it("lists each category with its skills, an icon where one exists and initials otherwise", () => {
        const { container } = render(<About skills={[{ category: "Languages", items: ["TypeScript", "Java"] }]} />);
        const group = screen.getByRole("region", { name: "Languages" });
        expect(group).toHaveTextContent("TypeScript");
        expect(group).toHaveTextContent("Java");
        expect(container.querySelectorAll(".tech-icon svg")).toHaveLength(1);
        expect(container.querySelector(".tech-icon--initials")).toHaveTextContent("Ja");
    });
});
