import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWidget from "./ChatWidget";

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("ChatWidget accessibility", () => {
    it("labels the message box and exposes the conversation as a live log", async () => {
        const user = userEvent.setup();
        render(<ChatWidget />);

        await user.click(screen.getByRole("button", { name: "Open chat" }));

        expect(screen.getByRole("textbox", { name: /ask the portfolio assistant/i })).toBeInTheDocument();
        expect(screen.getByRole("log", { name: "Conversation" })).toBeInTheDocument();
    });
});

describe("ChatWidget assistant links", () => {
    it("renders safe portfolio links and does not activate unsafe schemes", async () => {
        const user = userEvent.setup();
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    reply: "[Project](/projects/app-a) [Demo](https://example.com) [Unsafe](javascript:alert(1)) [Unlisted](https://evil.example)",
                    allowedLinks: ["/projects/app-a", "https://example.com"],
                }),
            })
        );
        render(<ChatWidget />);

        await user.click(screen.getByRole("button", { name: "Open chat" }));
        await user.type(screen.getByRole("textbox", { name: /ask the portfolio assistant/i }), "Show a project");
        await user.keyboard("{Enter}");

        const projectLink = await screen.findByRole("link", { name: "Project" });
        const demoLink = screen.getByRole("link", { name: "Demo" });
        expect(projectLink).toHaveAttribute("href", "/projects/app-a");
        expect(demoLink).toHaveAttribute("href", "https://example.com");
        expect(demoLink).toHaveAttribute("rel", "noopener noreferrer");
        expect(screen.queryByRole("link", { name: "Unsafe" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Unlisted" })).not.toBeInTheDocument();
        expect(screen.getByText("Unsafe")).toBeInTheDocument();
    });
});

describe("ChatWidget with a modal open", () => {
    it("closes on Escape normally but ignores Escape meant for an open modal", async () => {
        const user = userEvent.setup();
        render(<ChatWidget />);
        await user.click(screen.getByRole("button", { name: "Open chat" }));

        document.body.dataset.modalOpen = "true";
        await user.keyboard("{Escape}");
        expect(screen.getByRole("dialog", { name: "Portfolio assistant chat" })).toBeInTheDocument();

        delete document.body.dataset.modalOpen;
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog", { name: "Portfolio assistant chat" })).not.toBeInTheDocument();
    });
});
