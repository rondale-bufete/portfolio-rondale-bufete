import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminActionForm from "./AdminActionForm";

beforeEach(() => {
    // Stub reload because jsdom does not implement it.
    Object.defineProperty(window, "location", {
        value: { ...window.location, reload: vi.fn() },
        writable: true,
    });
});

describe("AdminActionForm", () => {
    it("shows a success modal after the action resolves", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(
            <AdminActionForm action={action} successMessage="Saved it.">
                <button type="submit">Save</button>
            </AdminActionForm>
        );

        await user.click(screen.getByRole("button", { name: "Save" }));

        await screen.findByText("Saved it.");
        expect(action).toHaveBeenCalled();
    });

    it("regression: clicking the success modal's Okay button does not re-submit the form", async () => {
        // Keep the modal's Okay button from resubmitting the form after a save.
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(
            <AdminActionForm action={action} successMessage="Saved it.">
                <button type="submit">Save</button>
            </AdminActionForm>
        );

        await user.click(screen.getByRole("button", { name: "Save" }));
        await screen.findByText("Saved it.");
        expect(action).toHaveBeenCalledTimes(1);

        await user.click(screen.getByRole("button", { name: "Okay" }));

        expect(action).toHaveBeenCalledTimes(1);
    });

    it("shows the thrown error message instead of a success modal", async () => {
        const action = vi.fn().mockRejectedValue(new Error("Unauthorized."));
        const user = userEvent.setup();
        render(
            <AdminActionForm action={action}>
                <button type="submit">Save</button>
            </AdminActionForm>
        );

        await user.click(screen.getByRole("button", { name: "Save" }));

        await screen.findByText("Unauthorized.");
        expect(screen.queryByText(/your changes were saved/i)).not.toBeInTheDocument();
    });

    it("disables buttons while the action is pending, and re-enables after it settles", async () => {
        let resolveAction;
        const action = vi.fn(() => new Promise((resolve) => (resolveAction = resolve)));
        const user = userEvent.setup();
        render(
            <AdminActionForm action={action}>
                <button type="submit">Save</button>
            </AdminActionForm>
        );

        const button = screen.getByRole("button", { name: "Save" });
        await user.click(button);

        await waitFor(() => expect(button).toBeDisabled());

        resolveAction();
        await waitFor(() => expect(button).not.toBeDisabled());
    });

    it("preserves an already-disabled button's disabled state after pending clears", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        render(
            <AdminActionForm action={action}>
                <button type="submit" disabled>
                    Move up
                </button>
            </AdminActionForm>
        );

        expect(screen.getByRole("button", { name: "Move up" })).toBeDisabled();
    });

    it("opens a confirm dialog instead of submitting immediately when confirmMessage is set", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(
            <AdminActionForm action={action} confirmMessage="This will delete the thing.">
                <button type="submit">Delete</button>
            </AdminActionForm>
        );

        await user.click(screen.getByRole("button", { name: "Delete" }));

        expect(screen.getByText("This will delete the thing.")).toBeInTheDocument();
        expect(action).not.toHaveBeenCalled();
    });

    it("cancelling the confirm dialog does not call the action", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(
            <AdminActionForm action={action} confirmMessage="This will delete the thing.">
                <button type="submit">Delete</button>
            </AdminActionForm>
        );

        await user.click(screen.getByRole("button", { name: "Delete" }));
        await user.click(screen.getByRole("button", { name: "keep" }));

        expect(action).not.toHaveBeenCalled();
        expect(screen.queryByText("This will delete the thing.")).not.toBeInTheDocument();
    });

    it("confirming the dialog calls the action", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(
            <AdminActionForm action={action} confirmMessage="This will delete the thing.">
                <button type="submit">Delete</button>
            </AdminActionForm>
        );

        await user.click(screen.getByRole("button", { name: "Delete" }));
        // Click the confirmation dialog's delete button, not the form trigger.
        await user.click(screen.getByRole("button", { name: "delete" }));

        await waitFor(() => expect(action).toHaveBeenCalled());
    });
});
