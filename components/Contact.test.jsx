import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockSend = vi.fn();
vi.mock("@emailjs/browser", () => ({
    default: { send: (...args) => mockSend(...args) },
}));

const { default: Contact } = await import("./Contact");

const profile = {
    email: "me@example.com",
    phone: "555-0100",
    location: "Manila, PH",
    openTo: "Full-time",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    facebook: "https://facebook.com/example",
    instagram: "https://instagram.com/example",
};

beforeEach(() => {
    mockSend.mockReset();
});

describe("Contact", () => {
    it("renders the direct info grid from profile data", () => {
        render(<Contact profile={profile} />);
        expect(screen.getByText("me@example.com")).toBeInTheDocument();
        expect(screen.getByText("linkedin.com/in/example")).toBeInTheDocument();
    });

    it("only shows Email, LinkedIn, Facebook, and Instagram — not Phone, Location, Open to, or GitHub", () => {
        render(<Contact profile={profile} />);
        expect(screen.queryByText("Phone")).not.toBeInTheDocument();
        expect(screen.queryByText("Location")).not.toBeInTheDocument();
        expect(screen.queryByText("Open to")).not.toBeInTheDocument();
        expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    });

    it("renders Facebook and Instagram cards linking out when the profile has them", () => {
        render(<Contact profile={profile} />);
        expect(screen.getByRole("link", { name: /facebook.com\/example/ })).toHaveAttribute(
            "href",
            "https://facebook.com/example"
        );
        expect(screen.getByRole("link", { name: /instagram.com\/example/ })).toHaveAttribute(
            "href",
            "https://instagram.com/example"
        );
    });

    it("omits Facebook and Instagram rows when the profile has no links for them", () => {
        const { facebook, instagram, ...rest } = profile;
        render(<Contact profile={rest} />);
        expect(screen.queryByText("Facebook")).not.toBeInTheDocument();
        expect(screen.queryByText("Instagram")).not.toBeInTheDocument();
    });

    it("submits the form and shows a success modal", async () => {
        mockSend.mockResolvedValue({ status: 200 });
        const user = userEvent.setup();
        render(<Contact profile={profile} />);

        await user.type(screen.getByLabelText("Name"), "Jane Doe");
        await user.type(screen.getByLabelText("Email"), "jane@example.com");
        await user.type(screen.getByLabelText("Message"), "Hello there");
        await user.click(screen.getByRole("button", { name: /send message/i }));

        await waitFor(() => expect(mockSend).toHaveBeenCalled());
        expect(mockSend.mock.calls[0][2]).toEqual({
            name: "Jane Doe",
            email: "jane@example.com",
            message: "Hello there",
        });

        await screen.findByText("Message sent");
    });

    it("shows an error modal when the send fails", async () => {
        mockSend.mockRejectedValue(new Error("network error"));
        const user = userEvent.setup();
        render(<Contact profile={profile} />);

        await user.type(screen.getByLabelText("Name"), "Jane Doe");
        await user.type(screen.getByLabelText("Email"), "jane@example.com");
        await user.type(screen.getByLabelText("Message"), "Hello there");
        await user.click(screen.getByRole("button", { name: /send message/i }));

        await screen.findByText("Something went wrong");
    });

    it("disables the submit button while sending", async () => {
        let resolveSend;
        mockSend.mockReturnValue(new Promise((resolve) => (resolveSend = resolve)));
        const user = userEvent.setup();
        render(<Contact profile={profile} />);

        await user.type(screen.getByLabelText("Name"), "Jane Doe");
        await user.type(screen.getByLabelText("Email"), "jane@example.com");
        await user.type(screen.getByLabelText("Message"), "Hello there");
        await user.click(screen.getByRole("button", { name: /send message/i }));

        expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
        resolveSend({ status: 200 });
    });
});
