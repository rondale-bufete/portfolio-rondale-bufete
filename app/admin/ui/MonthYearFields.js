import { MONTHS, yearOptions } from "@/lib/monthYear";
import { inputBase, labelBase } from "./tokens";

const YEARS = yearOptions();

export function MonthYearFields({ label, monthName, yearName, monthDefault, yearDefault }) {
    return (
        <div>
            <label className={labelBase}>{label}</label>
            <div className="flex gap-2">
                <select
                    name={monthName}
                    defaultValue={monthDefault || ""}
                    className={`${inputBase} flex-1`}
                >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => (
                        <option key={m} value={i + 1}>{m}</option>
                    ))}
                </select>
                <select
                    name={yearName}
                    defaultValue={yearDefault || ""}
                    className={`${inputBase} w-28 shrink-0`}
                >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
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
