import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminActionForm from "./AdminActionForm";
import { ToastProvider } from "./Toaster";

function renderForm(props, button = "Save") {
    return render(
        <ToastProvider>
            <AdminActionForm {...props}>
                <button type="submit">{button}</button>
            </AdminActionForm>
        </ToastProvider>
    );
}

describe("AdminActionForm", () => {
    it("confirms a save with a toast instead of a pop-up to dismiss", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        renderForm({ action, successMessage: "Saved it." });

        await user.click(screen.getByRole("button", { name: "Save" }));

        expect(await within(screen.getByRole("status")).findByText("Saved it.")).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(action).toHaveBeenCalledTimes(1);
    });

    it("stays quiet when the change is visible anyway", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        renderForm({ action, successMessage: null }, "Move up");

        await user.click(screen.getByRole("button", { name: "Move up" }));

        await waitFor(() => expect(action).toHaveBeenCalled());
        expect(screen.getByRole("status")).toBeEmptyDOMElement();
    });

    it("shows the thrown error next to the form", async () => {
        const action = vi.fn().mockRejectedValue(new Error("Unauthorized."));
        const user = userEvent.setup();
        renderForm({ action });

        await user.click(screen.getByRole("button", { name: "Save" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Unauthorized.");
        expect(screen.getByRole("status")).toBeEmptyDOMElement();
    });

    it("reports errors as a toast when the form has no room for them", async () => {
        const action = vi.fn().mockRejectedValue(new Error("Couldn't move it."));
        const user = userEvent.setup();
        renderForm({ action, inlineErrors: false }, "Move up");

        await user.click(screen.getByRole("button", { name: "Move up" }));

        expect(await within(screen.getByRole("status")).findByText("Couldn't move it.")).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("disables buttons while the action is pending, and re-enables after it settles", async () => {
        let resolveAction;
        const action = vi.fn(() => new Promise((resolve) => (resolveAction = resolve)));
        const user = userEvent.setup();
        renderForm({ action });

        const button = screen.getByRole("button", { name: "Save" });
        await user.click(button);

        await waitFor(() => expect(button).toBeDisabled());

        resolveAction();
        await waitFor(() => expect(button).not.toBeDisabled());
    });

    it("preserves an already-disabled button's disabled state", () => {
        render(
            <AdminActionForm action={vi.fn()}>
                <button type="submit" disabled>
                    Move up
                </button>
            </AdminActionForm>
        );

        expect(screen.getByRole("button", { name: "Move up" })).toBeDisabled();
    });

    it("asks before a destructive action instead of submitting", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        renderForm({ action, confirmMessage: "This will delete the thing." }, "Delete project");

        await user.click(screen.getByRole("button", { name: "Delete project" }));

        const dialog = screen.getByRole("alertdialog");
        expect(dialog).toHaveTextContent("This will delete the thing.");
        expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus();
        expect(action).not.toHaveBeenCalled();
    });

    it("cancelling the confirmation does not call the action", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        renderForm({ action, confirmMessage: "This will delete the thing." }, "Delete project");

        await user.click(screen.getByRole("button", { name: "Delete project" }));
        await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Cancel" }));

        expect(action).not.toHaveBeenCalled();
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    it("confirming calls the action and reports the result", async () => {
        const action = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        renderForm({ action, confirmMessage: "This will delete the thing.", successMessage: "Project deleted." }, "Delete project");

        await user.click(screen.getByRole("button", { name: "Delete project" }));
        await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Delete" }));

        await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
        expect(await within(screen.getByRole("status")).findByText("Project deleted.")).toBeInTheDocument();
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
});
