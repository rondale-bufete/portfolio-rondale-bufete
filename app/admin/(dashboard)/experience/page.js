import { supabaseAdmin } from "@/lib/supabase/admin";
import { MONTHS } from "@/lib/monthYear";
import {
    createExperienceAction,
    updateExperienceAction,
    deleteExperienceAction,
} from "../../actions/experience";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import EmptyState from "../../ui/EmptyState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { MonthYearFields, CurrentCheckbox } from "../../ui/MonthYearFields";
import { buttonPrimary, linkDanger } from "../../ui/tokens";
import { TrashIcon } from "../../ui/icons";

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
            <PageHeader
                title="Experience"
                description={
                    <>
                        Your work history. This section is hidden by default after setup — enable it from{" "}
                        <a href="/admin/sections" className="text-[#3355FF] hover:underline">Sections</a> once
                        you&rsquo;ve added your roles.
                    </>
                }
            />

            <div className="space-y-3 mb-6">
                <AddNewRow label="Add a role">
                    <form action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <ExperienceFields />
                        <button type="submit" className={buttonPrimary}>
                            Add role
                        </button>
                    </form>
                </AddNewRow>
            </div>

            <div className="space-y-3">
                {(experience || []).map((exp) => (
                    <ExperienceRow key={exp.id} exp={exp} />
                ))}
                {(!experience || experience.length === 0) && (
                    <EmptyState
                        title="No experience entries yet"
                        description="Add your first role above — company, role, dates, and a few bullet points."
                    />
                )}
            </div>
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
        <ItemRow title={`${exp.role} · ${exp.company}`} meta={exp.period}>
            <form action={handleUpdate} className="mt-4 space-y-4 max-w-xl">
                <ExperienceFields exp={exp} />
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </form>

            <form action={handleDelete} className="mt-4">
                <button type="submit" className={linkDanger}>
                    <TrashIcon className="w-4 h-4" />
                    Delete this role
                </button>
            </form>
        </ItemRow>
    );
}

// Best-effort parse of an existing "Mon YYYY — Mon YYYY"/"Mon YYYY — Present"
// string so the dropdowns preselect sensibly when editing. If it doesn't
// parse cleanly (e.g. hand-edited text), the selects just start blank —
// saving will overwrite `period` from whatever the admin picks.
function parseExistingPeriod(period) {
    if (!period) return {};
    const [startRaw, endRaw] = period.split("—").map((s) => s?.trim());
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

            <MonthYearFields
                label="Start date"
                monthName="start_month"
                yearName="start_year"
                monthDefault={start.month}
                yearDefault={start.year}
            />
            <CurrentCheckbox label="I currently work here" defaultChecked={isCurrent} />
            <MonthYearFields
                label="End date (ignored if currently working)"
                monthName="end_month"
                yearName="end_year"
                monthDefault={end.month}
                yearDefault={end.year}
            />

            <Field
                label="Bullet points (one per line)"
                name="bullets"
                textarea
                rows={5}
                defaultValue={(exp?.bullets || []).join("\n")}
                placeholder={"Led a team of 4 engineers shipping the new checkout flow\nCut API response times by 40% by adding caching\nMentored 2 junior developers"}
            />
        </>
    );
}
