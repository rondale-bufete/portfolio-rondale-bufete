import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminActionForm from "./AdminActionForm";

beforeEach(() => {
    // FormStatusModal's onClose calls window.location.reload() on success,
    // which jsdom doesn't implement — stub it so success-path tests don't
    // throw.
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
        // FormStatusModal renders inside the same <form> as the real submit
        // button. Its "Okay" button must be type="button" — without that,
        // a plain <button> defaults to type="submit" inside a <form>, so
        // clicking Okay both closes the modal AND silently re-submits the
        // form with whatever stale values are still in the DOM, clobbering
        // the save that just succeeded (see the Origin-field bug this was
        // written to catch).
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
        await user.click(screen.getByRole("button", { name: "Cancel" }));

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
        // The confirm dialog's own "Delete" button, not the form's trigger.
        await user.click(screen.getAllByRole("button", { name: "Delete" })[1]);

        await waitFor(() => expect(action).toHaveBeenCalled());
    });
});
