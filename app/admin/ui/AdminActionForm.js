"use client";

import { Children, cloneElement, isValidElement, useActionState, useState } from "react";
import FormStatusModal from "../../../components/FormStatusModal";

const initialState = { error: null, success: false };

// Walks the form's children and disables any <button> it finds while the
// action is in flight, so a slow save/delete can't be double-submitted by
// an impatient click. Preserves each button's own `disabled` (e.g. the
// move-up/move-down buttons at the first/last position).
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

export default function AdminActionForm({
    action,
    className = "",
    children,
    successMessage = "Your changes were saved successfully.",
    confirmMessage,
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);
    const [state, formAction, isPending] = useActionState(
        async (_previousState, formData) => {
            try {
                await action(formData);
                return { error: null, success: true };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unable to save changes.", success: false };
            }
        },
        initialState
    );

    function handleSubmit(event) {
        if (!confirmMessage) return;
        event.preventDefault();
        setPendingFormData(new FormData(event.currentTarget));
        setConfirmOpen(true);
    }

    function confirmAction() {
        setConfirmOpen(false);
        formAction(pendingFormData);
        setPendingFormData(null);
    }

    return (
        <form action={formAction} onSubmit={confirmMessage ? handleSubmit : undefined} className={className}>
            {Children.map(children, (child) => disableButtonsWhilePending(child, isPending))}
            {state.error && (
                <p role="alert" className="text-sm font-semibold text-[var(--color-danger-text)]">
                    {state.error}
                </p>
            )}
            {state.success && (
                <FormStatusModal
                    status="success"
                    title="Action completed"
                    message={successMessage}
                    buttonLabel="Okay"
                    onClose={() => window.location.reload()}
                />
            )}
            {confirmOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-confirm-title"
                        className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border-strong)] max-w-sm w-full p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,.5)]"
                    >
                        <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center mx-auto mb-5 bg-[var(--color-danger-solid)]/10">
                            <span className="text-2xl text-[var(--color-danger-text)]">!</span>
                        </div>
                        <h3 id="admin-confirm-title" className="font-[family-name:var(--font-display)] text-xl font-medium mb-2 text-[var(--color-text)]">
                            Confirm deletion
                        </h3>
                        <p className="text-[var(--color-body)] text-sm leading-relaxed mb-6">{confirmMessage}</p>
                        <div className="flex justify-center gap-3 font-[family-name:var(--font-mono)]">
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmOpen(false);
                                    setPendingFormData(null);
                                }}
                                className="px-5 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-raised)] transition-colors"
                            >
                                keep
                            </button>
                            <button
                                type="button"
                                onClick={confirmAction}
                                className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-danger-solid)] text-white text-sm font-medium hover:bg-[var(--color-danger-solid-hover)] transition-colors"
                            >
                                delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}