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
                className="w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
            >
                <div className="flex items-center justify-between px-[18px] py-3 border-b border-[var(--color-border)] font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)]">
                    <span><span className="text-[var(--color-accent)]">~/</span>admin/login</span>
                    <span>🔒</span>
                </div>

                <div className="p-6 flex flex-col gap-[18px]">
                    <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--color-text)]">
                        Sign in
                    </h1>

                    <div>
                        <label className={labelBase} htmlFor="password">
                            password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoFocus
                            className={inputBase}
                        />
                    </div>

                    {state?.error && (
                        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-danger-text)]">
                            error: {state.error}
                        </p>
                    )}

                    <button type="submit" disabled={isPending} className={`${buttonPrimary} w-full mt-2`}>
                        {isPending ? "checking…" : "$ sign in ↵"}
                    </button>
                </div>

                <div className="px-[18px] py-3 border-t border-[var(--color-border)] font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-faint)]">
                    changes publish to the public site in ~1 min
                </div>
            </form>
        </div>
    );
}
