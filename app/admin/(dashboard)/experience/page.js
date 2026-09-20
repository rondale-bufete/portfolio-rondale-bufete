import { supabaseAdmin } from "@/lib/supabase/admin";
import { splitPeriod } from "@/lib/monthYear";
import {
    createExperienceAction,
    updateExperienceAction,
    deleteExperienceAction,
    moveExperienceAction,
} from "../../actions/experience";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { MonthField, CurrentCheckbox } from "../../ui/MonthYearFields";
import { buttonPrimary, buttonIcon, linkDanger } from "../../ui/tokens";
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from "../../ui/icons";
import AdminActionForm from "../../ui/AdminActionForm";

export default async function ExperienceAdminPage() {
    const { data: experience, error } = await supabaseAdmin
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
                        <a href="/admin/sections" className="text-[var(--color-accent-700)] hover:underline">Sections</a> once
                        you&rsquo;ve added your roles.
                    </>
                }
            />

            <div className="space-y-3 mb-6">
                <AddNewRow label="Add a role">
                    <AdminActionForm action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <ExperienceFields />
                        <button type="submit" className={buttonPrimary}>
                            Add role
                        </button>
                    </AdminActionForm>
                </AddNewRow>
            </div>

            {error && <ErrorState message={error.message} />}

            {!error && (
                <div className="space-y-3">
                    {(experience || []).map((exp, index) => (
                        <ExperienceRow
                            key={exp.id}
                            exp={exp}
                            isFirst={index === 0}
                            isLast={index === (experience?.length || 0) - 1}
                        />
                    ))}
                    {(!experience || experience.length === 0) && (
                        <EmptyState
                            title="No experience entries yet"
                            description="Add your first role above — company, role, dates, and a few bullet points."
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function ExperienceRow({ exp, isFirst, isLast }) {
    async function handleMoveUp() {
        "use server";
        await moveExperienceAction(exp.id, "up");
    }
    async function handleMoveDown() {
        "use server";
        await moveExperienceAction(exp.id, "down");
    }
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
                <ExperienceFields exp={exp} />
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </AdminActionForm>

            <AdminActionForm
                action={handleDelete}
                className="mt-4"
                confirmMessage="This experience entry will be permanently deleted."
                successMessage="The experience entry was deleted."
            >
                <button type="submit" className={linkDanger}>
                    <TrashIcon className="w-4 h-4" />
                    Delete this role
                </button>
            </AdminActionForm>
        </ItemRow>
    );
}

function ExperienceFields({ exp }) {
    const { start, end, isCurrent } = splitPeriod(exp?.period);

    return (
        <>
            <Field label="Company" name="company" defaultValue={exp?.company} required />
            <Field label="Role / Title" name="role" defaultValue={exp?.role} required />
            <Field label="Location (optional)" name="location" defaultValue={exp?.location} placeholder="Manila, PH · Remote" />
            <Field label="Company URL (optional)" name="company_url" defaultValue={exp?.company_url} />

            <MonthField label="Start date" name="start" defaultValue={start} />
            <CurrentCheckbox label="I currently work here" defaultChecked={isCurrent} />
            <MonthField label="End date (ignored if currently working)" name="end" defaultValue={end} />

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
