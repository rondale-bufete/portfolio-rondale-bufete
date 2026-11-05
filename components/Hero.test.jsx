import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Hero from "./Hero";

const profile = { name: "Rondale Rae Bufete", role: "Full Stack Developer", tagline: "I build systems.", bio: "Bio.", available: true, stats: [] };

describe("Hero", () => {
    it("names the page heading after the profile", () => {
        render(<Hero profile={profile} />);
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Rondale Rae Bufete");
    });
});

describe("Hero headline numbers", () => {
    it("shows the numbers set in the admin, counting up to whole numbers", () => {
        render(<Hero profile={{ ...profile, stats: [{ value: "300+", label: "subscriber accounts managed" }, { value: "+60%", label: "income collected" }] }} />);

        const list = within(screen.getByRole("list", { name: "Highlights" }));
        // Screen readers get the value as written; the animated digits are hidden from them.
        expect(list.getByText("300+")).toBeInTheDocument();
        expect(list.getByText("subscriber accounts managed")).toBeInTheDocument();
        expect(list.getByText("+60%")).toBeInTheDocument();
        const counters = screen.getByRole("list", { name: "Highlights" }).querySelectorAll(".count-up");
        expect([...counters].map((counter) => counter.style.getPropertyValue("--count-to"))).toEqual(["300", "60"]);
    });

    it("shows values that aren't a single whole number as written", () => {
        render(<Hero profile={{ ...profile, stats: [{ value: "1,200", label: "tickets closed" }] }} />);

        const list = screen.getByRole("list", { name: "Highlights" });
        expect(list.querySelector(".count-up")).toBeNull();
        expect(list).toHaveTextContent("1,200 tickets closed");
    });

    it("leaves the strip out entirely when no numbers are set", () => {
        render(<Hero profile={profile} />);
        expect(screen.queryByRole("list", { name: "Highlights" })).not.toBeInTheDocument();
        expect(screen.queryByText(/thoughtful work/i)).not.toBeInTheDocument();
    });
});
