"use client";

import { useActionState } from "react";
import { loginAction } from "../auth-actions";
import { inputBase, labelBase, buttonPrimary } from "../ui/tokens";

const initialState = { error: null };

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(
        async (_prevState, formData) => {
            const result = await loginAction(formData);
            // On success loginAction redirects and never returns; we only
            // get here on failure.
            return result ?? initialState;
        },
        initialState
    );

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
            <form
                action={formAction}
                className="w-full max-w-sm bg-[var(--color-surface)] border-2 border-[var(--color-divider)] p-8"
            >
                <div className="flex items-center gap-2.5 mb-6">
                    <span className="w-2.5 h-2.5 bg-[var(--color-accent)]" />
                    <p className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-[var(--color-text)]">
                        Admin
                    </p>
                </div>

                <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold mb-1 text-[var(--color-text)]">
                    Welcome back
                </h1>
                <p className="text-sm text-[var(--color-neutral-700)] mb-6">Enter your password to continue.</p>

                <label className={labelBase} htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoFocus
                    className={`${inputBase} mb-2`}
                />

                {state?.error && (
                    <p className="text-sm font-semibold text-[#E5484D] mb-4">{state.error}</p>
                )}

                <button type="submit" disabled={isPending} className={`${buttonPrimary} w-full mt-4`}>
                    {isPending ? "Checking..." : "Log in"}
                </button>
            </form>
        </div>
    );
}
