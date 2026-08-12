import { supabaseAdmin } from "@/lib/supabase/admin";
import { MONTHS } from "@/lib/monthYear";
import {
    createEducationAction,
    updateEducationAction,
    deleteEducationAction,
} from "../../actions/education";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import EmptyState from "../../ui/EmptyState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { MonthYearFields, CurrentCheckbox } from "../../ui/MonthYearFields";
import { buttonPrimary, linkDanger } from "../../ui/tokens";
import { TrashIcon } from "../../ui/icons";

export default async function EducationAdminPage() {
    const { data: education } = await supabaseAdmin
        .from("education")
        .select("*")
        .order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createEducationAction(formData);
    }

    return (
        <div>
            <PageHeader title="Education" description="Shown as a timeline under About." />

            <div className="mb-6">
                <AddNewRow label="Add an entry">
                    <form action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <EduFields />
                        <button type="submit" className={buttonPrimary}>
                            Add entry
                        </button>
                    </form>
                </AddNewRow>
            </div>

            <div className="space-y-3">
                {(education || []).map((edu) => (
                    <EduRow key={edu.id} edu={edu} />
                ))}
                {(!education || education.length === 0) && (
                    <EmptyState title="Nothing yet" description="Add your first entry above." />
                )}
            </div>
        </div>
    );
}

function EduRow({ edu }) {
    async function handleUpdate(formData) {
        "use server";
        await updateEducationAction(edu.id, formData);
    }
    async function handleDelete() {
        "use server";
        await deleteEducationAction(edu.id);
    }

    return (
        <ItemRow title={edu.degree} meta={edu.period}>
            <form action={handleUpdate} className="mt-4 space-y-4 max-w-xl">
                <EduFields edu={edu} />
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </form>

            <form action={handleDelete} className="mt-4">
                <button type="submit" className={linkDanger}>
                    <TrashIcon className="w-4 h-4" />
                    Delete this entry
                </button>
            </form>
        </ItemRow>
    );
}

// Best-effort parse of an existing "Mon YYYY — Mon YYYY" / "... — Present"
// string so the dropdowns preselect sensibly when editing. Entries created
// before the date pickers existed (e.g. "2022 — 2026") won't parse — that's
// fine, the selects just start blank and the raw text is kept as a
// fallback via the hidden period_fallback field until new dates are picked.
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

function EduFields({ edu }) {
    const { start = {}, end = {}, isCurrent = false } = parseExistingPeriod(edu?.period);

    return (
        <>
            <Field label="Degree / Program" name="degree" defaultValue={edu?.degree} required />
            <Field label="School" name="school" defaultValue={edu?.school} required />

            <input type="hidden" name="period_fallback" value={edu?.period || ""} />

            <MonthYearFields
                label="Start date"
                monthName="start_month"
                yearName="start_year"
                monthDefault={start.month}
                yearDefault={start.year}
            />
            <CurrentCheckbox label="Currently studying here" defaultChecked={isCurrent} />
            <MonthYearFields
                label="End date (ignored if currently studying)"
                monthName="end_month"
                yearName="end_year"
                monthDefault={end.month}
                yearDefault={end.year}
            />

            <Field label="Description (optional)" name="description" defaultValue={edu?.description} textarea />

            <Field
                label="Bullet points — coursework, honors, thesis (one per line, optional)"
                name="bullets"
                textarea
                rows={4}
                defaultValue={(edu?.bullets || []).join("\n")}
                placeholder={"Dean's Lister, 2023–2025\nThesis: Real-time anomaly detection for IoT sensor networks"}
            />
        </>
    );
}
