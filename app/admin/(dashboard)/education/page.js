import { supabaseAdmin } from "@/lib/supabase/admin";
import { splitPeriod } from "@/lib/monthYear";
import {
    createEducationAction,
    updateEducationAction,
    deleteEducationAction,
    moveEducationAction,
} from "../../actions/education";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { MonthField, CurrentCheckbox } from "../../ui/MonthYearFields";
import { buttonPrimary, buttonIcon, linkDanger } from "../../ui/tokens";
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from "../../ui/icons";
import AdminActionForm from "../../ui/AdminActionForm";

export default async function EducationAdminPage() {
    const { data: education, error } = await supabaseAdmin
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
                    <AdminActionForm action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <EduFields />
                        <button type="submit" className={buttonPrimary}>
                            Add entry
                        </button>
                    </AdminActionForm>
                </AddNewRow>
            </div>

            {error && <ErrorState message={error.message} />}

            {!error && (
                <div className="space-y-3">
                    {(education || []).map((edu, index) => (
                        <EduRow
                            key={edu.id}
                            edu={edu}
                            isFirst={index === 0}
                            isLast={index === (education?.length || 0) - 1}
                        />
                    ))}
                    {(!education || education.length === 0) && (
                        <EmptyState title="Nothing yet" description="Add your first entry above." />
                    )}
                </div>
            )}
        </div>
    );
}

function EduRow({ edu, isFirst, isLast }) {
    async function handleMoveUp() {
        "use server";
        await moveEducationAction(edu.id, "up");
    }
    async function handleMoveDown() {
        "use server";
        await moveEducationAction(edu.id, "down");
    }
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
            <div className="mt-4 flex items-center gap-2">
                <AdminActionForm action={handleMoveUp}>
                    <button type="submit" disabled={isFirst} className={buttonIcon} title="Move up" aria-label="Move up">
                        <ArrowUpIcon className="w-4 h-4" />
                    </button>
                </AdminActionForm>
                <AdminActionForm action={handleMoveDown}>
                    <button type="submit" disabled={isLast} className={buttonIcon} title="Move down" aria-label="Move down">
                        <ArrowDownIcon className="w-4 h-4" />
                    </button>
                </AdminActionForm>
            </div>

            <AdminActionForm action={handleUpdate} className="mt-4 space-y-4 max-w-xl">
                <EduFields edu={edu} />
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </AdminActionForm>

            <AdminActionForm
                action={handleDelete}
                className="mt-4"
                confirmMessage="This education entry will be permanently deleted."
                successMessage="The education entry was deleted."
            >
                <button type="submit" className={linkDanger}>
                    <TrashIcon className="w-4 h-4" />
                    Delete this entry
                </button>
            </AdminActionForm>
        </ItemRow>
    );
}

function EduFields({ edu }) {
    const { start, end, isCurrent } = splitPeriod(edu?.period);

    return (
        <>
            <Field label="Degree / Program" name="degree" defaultValue={edu?.degree} required />
            <Field label="School" name="school" defaultValue={edu?.school} required />

            <MonthField label="Start date" name="start" defaultValue={start} />
            <CurrentCheckbox label="Currently studying here" defaultChecked={isCurrent} />
            <MonthField label="End date (ignored if currently studying)" name="end" defaultValue={end} />

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
