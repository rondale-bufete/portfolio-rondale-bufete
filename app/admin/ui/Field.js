"use client";

import { useId } from "react";

// A labelled input or textarea. Ids are generated because the same field
// names repeat on one page (every project row has a "title").
export default function Field({
    label,
    name,
    defaultValue,
    placeholder,
    type = "text",
    textarea = false,
    rows = 3,
    required = false,
    optional = false,
    hint,
    autoComplete,
}) {
    const id = useId();
    const hintId = hint ? `${id}-hint` : undefined;
    const shared = {
        id,
        name,
        defaultValue: defaultValue ?? undefined,
        placeholder,
        required,
        autoComplete,
        "aria-describedby": hintId,
        className: "admin-input",
    };

    return (
        <div className="admin-field">
            <label className="admin-label" htmlFor={id}>
                {label}
                {optional && <span className="admin-label__optional">Optional</span>}
            </label>
            {textarea ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
            {hint && (
                <p id={hintId} className="admin-hint">
                    {hint}
                </p>
            )}
        </div>
    );
}
