import { supabaseAdmin } from "@/lib/supabase/admin";
import { MONTHS, yearOptions } from "@/lib/monthYear";
import {
    createExperienceAction,
    updateExperienceAction,
    deleteExperienceAction,
} from "../../actions/experience";

const YEARS = yearOptions();

export default async function ExperienceAdminPage() {
    const { data: experience } = await supabaseAdmin
        .from("experience")
        .select("*")
        .order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createExperienceAction(formData);
    }

    return (
        <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">Experience</h1>
            <p className="text-sm text-[#5B5F66] mb-8">
                Your work history. This section is hidden by default after setup — enable it from{" "}
                <a href="/admin/sections" className="text-[#3355FF] hover:underline">Sections</a> once
                you&rsquo;ve added your roles.
            </p>

            <div className="space-y-4 mb-10">
                {(experience || []).map((exp) => (
                    <ExperienceRow key={exp.id} exp={exp} />
                ))}
                {(!experience || experience.length === 0) && (
                    <p className="text-sm text-[#5B5F66]">No experience entries yet — add your first one below.</p>
                )}
            </div>

            <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
                <summary className="cursor-pointer font-medium text-sm">+ Add a role</summary>
                <form action={handleCreate} className="mt-5 space-y-4 max-w-xl">
                    <ExperienceFields />
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                    >
                        Add role
                    </button>
                </form>
            </details>
        </div>
    );
}

function ExperienceRow({ exp }) {
    async function handleUpdate(formData) {
        "use server";
        await updateExperienceAction(exp.id, formData);
    }
    async function handleDelete() {
        "use server";
        await deleteExperienceAction(exp.id);
    }

    return (
        <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
            <summary className="cursor-pointer flex items-center justify-between gap-4">
                <span className="font-medium text-sm truncate">{exp.role} · {exp.company}</span>
                <span className="text-xs text-[#5B5F66] font-[family-name:var(--font-mono)] shrink-0">
                    {exp.period}
                </span>
            </summary>

            <form action={handleUpdate} className="mt-5 space-y-4 max-w-xl">
                <ExperienceFields exp={exp} />
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                >
                    Save changes
                </button>
            </form>

            <form action={handleDelete} className="mt-3">
                <button type="submit" className="text-sm text-[#E5484D] hover:underline">
                    Delete this role
                </button>
            </form>
        </details>
    );
}

// Parses the currently-stored "Mon YYYY — Mon YYYY"/"Mon YYYY — Present"
// string just well enough to preselect the dropdowns when editing. If it
// doesn't parse cleanly (e.g. hand-edited text), the selects just start
// blank — no harm done, saving will overwrite `period` from whatever the
// admin picks.
function parseExistingPeriod(period) {
    if (!period) return {};
    const [startRaw, endRaw] = period.split("—").map((s) => s.trim());
    const parseOne = (s) => {
        const match = s?.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
        if (!match) return {};
        const idx = MONTHS.findIndex((m) => m.toLowerCase().startsWith(match[1].toLowerCase().slice(0, 3)));
        return idx === -1 ? {} : { month: idx + 1, year: Number(match[2]) };
    };
    const start = parseOne(startRaw);
    const isCurrent = endRaw?.toLowerCase() === "present";
    const end = isCurrent ? {} : parseOne(endRaw);
    return { start, end, isCurrent };
}

function ExperienceFields({ exp }) {
    const { start = {}, end = {}, isCurrent = false } = parseExistingPeriod(exp?.period);

    return (
        <>
            <Field label="Company" name="company" defaultValue={exp?.company} required />
            <Field label="Role / Title" name="role" defaultValue={exp?.role} required />
            <Field label="Location (optional)" name="location" defaultValue={exp?.location} placeholder="Manila, PH · Remote" />
            <Field label="Company URL (optional)" name="company_url" defaultValue={exp?.company_url} />

            <div>
                <label className="block text-sm text-[#5B5F66] mb-1.5">Start date</label>
                <div className="flex gap-2">
                    <MonthSelect name="start_month" defaultValue={start.month} />
                    <YearSelect name="start_year" defaultValue={start.year} />
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#5B5F66]">
                <input type="checkbox" name="is_current" defaultChecked={isCurrent} className="accent-[#3355FF]" />
                I currently work here
            </label>

            <div>
                <label className="block text-sm text-[#5B5F66] mb-1.5">End date (ignored if currently working)</label>
                <div className="flex gap-2">
                    <MonthSelect name="end_month" defaultValue={end.month} />
                    <YearSelect name="end_year" defaultValue={end.year} />
                </div>
            </div>

            <div>
                <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor="bullets">
                    Bullet points (one per line)
                </label>
                <textarea
                    id="bullets"
                    name="bullets"
                    defaultValue={(exp?.bullets || []).join("\n")}
                    rows={5}
                    placeholder={"Led a team of 4 engineers shipping the new checkout flow\nCut API response times by 40% by adding caching\nMentored 2 junior developers"}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors resize-none"
                />
            </div>
        </>
    );
}

function MonthSelect({ name, defaultValue }) {
    return (
        <select
            name={name}
            defaultValue={defaultValue || ""}
            className="flex-1 px-3 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
        >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
            ))}
        </select>
    );
}

function YearSelect({ name, defaultValue }) {
    return (
        <select
            name={name}
            defaultValue={defaultValue || ""}
            className="w-28 px-3 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
        >
            <option value="">Year</option>
            {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
            ))}
        </select>
    );
}

function Field({ label, name, defaultValue, placeholder, required = false }) {
    return (
        <div>
            <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor={name}>
                {label}
            </label>
            <input
                id={name}
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
            />
        </div>
    );
}
