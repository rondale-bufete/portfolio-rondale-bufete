"use client";

import { useActionState, useState } from "react";
import FormStatusModal from "../../../components/FormStatusModal";

const initialState = { error: null, success: false };

export default function AdminActionForm({
    action,
    className = "",
    children,
    successMessage = "Your changes were saved successfully.",
    confirmMessage,
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);
    const [state, formAction] = useActionState(
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
        <form action={formAction} onSubmit={handleSubmit} className={className}>
            {children}
            {state.error && (
                <p role="alert" className="text-sm text-[#E5484D]">
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
                        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center"
                    >
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-[#E5484D]/10">
                            <span className="text-2xl text-[#E5484D]">!</span>
                        </div>
                        <h3 id="admin-confirm-title" className="font-[family-name:var(--font-display)] text-xl font-medium mb-2">
                            Confirm deletion
                        </h3>
                        <p className="text-[#5B5F66] text-sm leading-relaxed mb-6">{confirmMessage}</p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmOpen(false);
                                    setPendingFormData(null);
                                }}
                                className="px-5 py-2.5 rounded-md border border-[#E4E4E7] bg-white text-[#14161A] text-sm font-medium hover:border-[#14161A] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmAction}
                                className="px-5 py-2.5 rounded-md bg-[#E5484D] text-white text-sm font-medium hover:bg-[#c53339] transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}