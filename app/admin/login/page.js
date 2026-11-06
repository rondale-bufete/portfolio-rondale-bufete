"use client";

import { useActionState } from "react";
import { loginAction } from "../auth-actions";
import { AlertIcon } from "@/components/icons";

const initialState = { error: null };

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(
        async (_prevState, formData) => {
            const result = await loginAction(formData);
            // Successful login redirects; returning here means it failed.
            return result ?? initialState;
        },
        initialState
    );

    return (
        <main className="admin-login">
            <form action={formAction} className="admin-login__card">
                <div className="admin-login__brand">
                    <span className="admin-monogram" aria-hidden="true">
                        RB
                    </span>
                    <span className="admin-sidebar__name">
                        <strong>Portfolio admin</strong>
                        <span>Rondale Rae Bufete</span>
                    </span>
                </div>

                <div className="admin-login__body">
                    <div>
                        <h1 className="admin-login__title">Sign in</h1>
                        <p className="admin-login__lead">Edit what appears on your portfolio.</p>
                    </div>

                    <div className="admin-field">
                        <label className="admin-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            autoFocus
                            aria-invalid={state?.error ? true : undefined}
                            aria-describedby={state?.error ? "login-error" : undefined}
                            className="admin-input"
                        />
                    </div>

                    {state?.error && (
                        <p id="login-error" role="alert" className="admin-form__error">
                            <AlertIcon size={16} />
                            {state.error}
                        </p>
                    )}

                    <button type="submit" disabled={isPending} className="button button--primary button--compact button--block">
                        {isPending ? "Signing in…" : "Sign in"}
                    </button>
                </div>

                <p className="admin-login__footer">Changes appear on the public site within about a minute.</p>
            </form>
        </main>
    );
}
