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
import ReorderControls from "../../ui/ReorderControls";
import DeleteAction from "../../ui/DeleteAction";
import { buttonPrimary } from "../../ui/tokens";
import AdminActionForm from "../../ui/AdminActionForm";

export default async function EducationAdminPage() {
    const { data: education, error } = await supabaseAdmin.from("education").select("*").order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createEducationAction(formData);
    }

    return (
        <div>
            <PageHeader title="Education" description="Listed under About. The description and bullet points aren't shown there; the chat assistant uses them to answer questions." />

            <div className="admin-stack">
                <AddNewRow label="Add a school">
                    <AdminActionForm action={handleCreate} className="admin-form" successMessage="School added.">
                        <EduFields />
                        <div className="admin-form__actions">
                            <button type="submit" className={buttonPrimary}>
                                Add school
                            </button>
                        </div>
                    </AdminActionForm>
                </AddNewRow>

                {error && <ErrorState message={error.message} />}

                {!error && (
                    <div className="admin-list">
                        {(education || []).map((edu, index) => (
                            <EduRow
                                key={edu.id}
                                edu={edu}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === (education?.length || 0) - 1}
                            />
                        ))}
                        {(!education || education.length === 0) && (
                            <EmptyState title="No education yet" description="Add your degree or program above." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function EduRow({ edu, index, isFirst, isLast }) {
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
        <ItemRow
            index={index}
            title={edu.degree}
            meta={[edu.school, edu.period].filter(Boolean).join(" · ")}
            actions={<ReorderControls label={edu.degree} isFirst={isFirst} isLast={isLast} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />}
        >
            <AdminActionForm action={handleUpdate} className="admin-form">
                <EduFields edu={edu} />
                <div className="admin-form__actions">
                    <button type="submit" className={buttonPrimary}>
                        Save changes
                    </button>
                </div>
            </AdminActionForm>

            <div className="admin-row__footer">
                <DeleteAction
                    action={handleDelete}
                    label="Delete entry"
                    confirmMessage={`“${edu.degree}” will be removed from your site for good.`}
                    successMessage="Entry deleted."
                />
            </div>
        </ItemRow>
    );
}

function EduFields({ edu }) {
    const { start, end, isCurrent } = splitPeriod(edu?.period);

    return (
        <>
            <Field label="Degree or program" name="degree" defaultValue={edu?.degree} required />
            <Field label="School" name="school" defaultValue={edu?.school} required />
            <div className="admin-grid-2">
                <MonthField label="Start" name="start" defaultValue={start} />
                <MonthField label="End" name="end" defaultValue={end} hint="Ignored while you study here." />
            </div>
            <CurrentCheckbox label="I currently study here" defaultChecked={isCurrent} />
            <Field label="Description" name="description" defaultValue={edu?.description} textarea optional />
            <Field
                label="Bullet points"
                name="bullets"
                textarea
                rows={4}
                defaultValue={(edu?.bullets || []).join("\n")}
                placeholder={"Dean's Lister, 2023–2025\nThesis: Real-time anomaly detection for IoT sensor networks"}
                hint="Coursework, honors or thesis, one per line."
                optional
            />
        </>
    );
}
