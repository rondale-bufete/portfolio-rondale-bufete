"use client";

import { Children, cloneElement, isValidElement, startTransition, useActionState, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./Toaster";
import { AlertIcon } from "@/components/icons";

const initialState = { error: null };

// Disable form buttons while saving, while preserving buttons already disabled.
function disableButtonsWhilePending(node, pending) {
    if (!isValidElement(node)) return node;

    if (node.type === "button") {
        return cloneElement(node, { disabled: pending || node.props.disabled });
    }

    if (node.props?.children) {
        return cloneElement(node, {
            children: Children.map(node.props.children, (child) => disableButtonsWhilePending(child, pending)),
        });
    }

    return node;
}

// Runs a server action from a form. Success shows a toast (or nothing, with
// successMessage={null}, when the change is visible anyway); only destructive
// actions, given a confirmMessage, ask first. The server action revalidates
// the page, so there's nothing to reload.
export default function AdminActionForm({
    action,
    className = "",
    children,
    successMessage = "Changes saved.",
    confirmMessage,
    confirmTitle,
    confirmLabel = "Delete",
    inlineErrors = true,
}) {
    const toast = useToast();
    const [pendingFormData, setPendingFormData] = useState(null);
    const [state, formAction, isPending] = useActionState(async (_previousState, formData) => {
        try {
            await action(formData);
            if (successMessage) toast?.show(successMessage);
            return { error: null };
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to save changes.";
            if (!inlineErrors) toast?.show(message, "error");
            return { error: message };
        }
    }, initialState);

    function handleSubmit(event) {
        if (!confirmMessage) return;
        event.preventDefault();
        setPendingFormData(new FormData(event.currentTarget));
    }

    function confirmAction() {
        startTransition(() => formAction(pendingFormData));
        setPendingFormData(null);
    }

    return (
        <form
            action={formAction}
            onSubmit={confirmMessage ? handleSubmit : undefined}
            className={className}
            aria-busy={isPending || undefined}
        >
            {Children.map(children, (child) => disableButtonsWhilePending(child, isPending))}
            {inlineErrors && state.error && (
                <p role="alert" className="admin-form__error">
                    <AlertIcon size={16} />
                    {state.error}
                </p>
            )}
            {pendingFormData && (
                <ConfirmDialog
                    title={confirmTitle}
                    message={confirmMessage}
                    confirmLabel={confirmLabel}
                    onCancel={() => setPendingFormData(null)}
                    onConfirm={confirmAction}
                />
            )}
        </form>
    );
}
