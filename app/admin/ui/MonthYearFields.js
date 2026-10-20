import { inputBase, labelBase } from "./tokens";

// Use one native month picker to avoid incomplete month/year values.
export function MonthField({ label, name, defaultValue }) {
    return (
        <div>
            <label className={labelBase}>{label}</label>
            <input
                type="month"
                name={name}
                defaultValue={defaultValue || ""}
                className={inputBase}
            />
        </div>
    );
}

export function CurrentCheckbox({ label, defaultChecked }) {
    return (
        <label className="flex items-center gap-2 text-sm text-[var(--color-body)]">
            <input
                type="checkbox"
                name="is_current"
                defaultChecked={defaultChecked}
                className="w-4 h-4 rounded-[var(--radius-sm)] border-[var(--color-border-strong)] accent-[var(--color-accent)]"
            />
            {label}
        </label>
    );
}
