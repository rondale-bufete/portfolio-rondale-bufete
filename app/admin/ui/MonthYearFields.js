import { inputBase, labelBase } from "./tokens";

// A single native month picker ("YYYY-MM"). Replaces the old paired
// Month/Year <select> — one field means no month-without-a-year state to
// fall into, and no flex-width fight between two adjacent elements.
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
        <label className="flex items-center gap-2 text-sm text-[#5B5F66]">
            <input
                type="checkbox"
                name="is_current"
                defaultChecked={defaultChecked}
                className="w-4 h-4 rounded border-[#E4E4E7] accent-[#3355FF]"
            />
            {label}
        </label>
    );
}
