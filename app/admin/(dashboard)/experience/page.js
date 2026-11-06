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
import ReorderControls from "../../ui/ReorderControls";
import DeleteAction from "../../ui/DeleteAction";
import { buttonPrimary } from "../../ui/tokens";
import AdminActionForm from "../../ui/AdminActionForm";

export default async function ExperienceAdminPage() {
    const { data: experience, error } = await supabaseAdmin.from("experience").select("*").order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createExperienceAction(formData);
    }

    return (
        <div>
            <PageHeader title="Experience" description="Your work history, shown as a timeline under About, newest first in the order below." />

            <div className="admin-stack">
                <AddNewRow label="Add a role">
                    <AdminActionForm action={handleCreate} className="admin-form" successMessage="Role added.">
                        <ExperienceFields />
                        <div className="admin-form__actions">
                            <button type="submit" className={buttonPrimary}>
                                Add role
                            </button>
                        </div>
                    </AdminActionForm>
                </AddNewRow>

                {error && <ErrorState message={error.message} />}

                {!error && (
                    <div className="admin-list">
                        {(experience || []).map((exp, index) => (
                            <ExperienceRow
                                key={exp.id}
                                exp={exp}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === (experience?.length || 0) - 1}
                            />
                        ))}
                        {(!experience || experience.length === 0) && (
                            <EmptyState title="No roles yet" description="Add your first one above: company, role, dates and a few bullet points." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ExperienceRow({ exp, index, isFirst, isLast }) {
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

    const title = [exp.role, exp.company].filter(Boolean).join(" · ");

    return (
        <ItemRow
            index={index}
            title={title}
            meta={[exp.period, exp.location].filter(Boolean).join(" · ")}
            actions={<ReorderControls label={title} isFirst={isFirst} isLast={isLast} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />}
        >
            <AdminActionForm action={handleUpdate} className="admin-form">
                <ExperienceFields exp={exp} />
                <div className="admin-form__actions">
                    <button type="submit" className={buttonPrimary}>
                        Save changes
                    </button>
                </div>
            </AdminActionForm>

            <div className="admin-row__footer">
                <DeleteAction
                    action={handleDelete}
                    label="Delete role"
                    confirmMessage={`“${title}” will be removed from your timeline for good.`}
                    successMessage="Role deleted."
                />
            </div>
        </ItemRow>
    );
}

function ExperienceFields({ exp }) {
    const { start, end, isCurrent } = splitPeriod(exp?.period);

    return (
        <>
            <div className="admin-grid-2">
                <Field label="Role" name="role" defaultValue={exp?.role} placeholder="Full Stack Developer" required />
                <Field label="Company" name="company" defaultValue={exp?.company} required />
                <Field label="Location" name="location" defaultValue={exp?.location} placeholder="Manila, PH · Remote" optional />
                <Field label="Company website" name="company_url" defaultValue={exp?.company_url} type="url" optional />
                <MonthField label="Start" name="start" defaultValue={start} />
                <MonthField label="End" name="end" defaultValue={end} hint="Ignored while you work here." />
            </div>
            <CurrentCheckbox label="I currently work here" defaultChecked={isCurrent} />
            <Field
                label="Bullet points"
                name="bullets"
                textarea
                rows={5}
                defaultValue={(exp?.bullets || []).join("\n")}
                placeholder={"Replaced spreadsheet billing with a Laravel system for 300+ accounts\nAutomated overdue reminders, raising collected income by 60%"}
                hint="One per line. Lead with the result."
            />
        </>
    );
}
