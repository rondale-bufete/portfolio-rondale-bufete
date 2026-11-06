"use client";

import { useId } from "react";

// One native month picker, so a date is never half filled in.
export function MonthField({ label, name, defaultValue, hint }) {
    const id = useId();
    return (
        <div className="admin-field">
            <label className="admin-label" htmlFor={id}>
                {label}
            </label>
            <input id={id} type="month" name={name} defaultValue={defaultValue || ""} className="admin-input" />
            {hint && <p className="admin-hint">{hint}</p>}
        </div>
    );
}

export function CurrentCheckbox({ label, defaultChecked }) {
    return (
        <label className="admin-check">
            <input type="checkbox" name="is_current" defaultChecked={defaultChecked} />
            {label}
        </label>
    );
}
