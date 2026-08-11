"use client";

import { useActionState } from "react";
import { loginAction } from "../auth-actions";

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
        <div className="flex min-h-screen items-center justify-center px-6 py-10">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/75 p-7 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-8">
                <div className="mb-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Portfolio
                    </p>
                    <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900">
                        Admin
                    </h1>
                </div>

                <form action={formAction} className="space-y-5">
                    <div>
                        <p className="mb-4 text-sm text-slate-600">Enter your password to continue.</p>

                        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoFocus
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.75 text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-rose-600">{state.error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-xl bg-slate-950 px-6 py-2.75 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? "Checking..." : "Log in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
