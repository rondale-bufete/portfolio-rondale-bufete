import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWidget from "./ChatWidget";

describe("ChatWidget accessibility", () => {
    it("labels the message box and exposes the conversation as a live log", async () => {
        const user = userEvent.setup();
        render(<ChatWidget />);

        await user.click(screen.getByRole("button", { name: "Open chat" }));

        expect(screen.getByRole("textbox", { name: /ask the portfolio assistant/i })).toBeInTheDocument();
        expect(screen.getByRole("log", { name: "Conversation" })).toBeInTheDocument();
    });
});
