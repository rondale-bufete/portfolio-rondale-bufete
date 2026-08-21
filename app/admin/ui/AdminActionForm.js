"use client";

import { useActionState } from "react";

const initialState = { error: null };

export default function AdminActionForm({ action, className = "", children }) {
    const [state, formAction] = useActionState(
        async (_previousState, formData) => {
            try {
                await action(formData);
                return initialState;
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unable to save changes." };
            }
        },
        initialState
    );

    return (
        <form action={formAction} className={className}>
            {children}
            {state.error && (
                <p role="alert" className="text-sm text-[#E5484D]">
                    {state.error}
                </p>
            )}
        </form>
    );
}