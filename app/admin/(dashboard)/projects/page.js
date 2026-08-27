import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    moveProjectAction,
} from "../../actions/projects";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import EmptyState from "../../ui/EmptyState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { labelBase, buttonPrimary, buttonIcon, linkDanger } from "../../ui/tokens";
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from "../../ui/icons";
import AdminActionForm from "../../ui/AdminActionForm";

export default async function ProjectsAdminPage() {
    const { data: projects } = await supabaseAdmin
        .from("projects")
        .select("*")
        .order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createProjectAction(formData);
    }

    return (
        <div>
            <PageHeader title="Projects" description="Shown in order on the homepage project grid." />

            <div className="mb-6">
                <AddNewRow label="Add a new project">
                    <AdminActionForm action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <ProjectFields />
                        <button type="submit" className={buttonPrimary}>
                            Add project
                        </button>
                    </AdminActionForm>
                </AddNewRow>
            </div>

            <div className="space-y-3">
                {(projects || []).map((project, index) => (
                    <ProjectRow
                        key={project.id}
                        project={project}
                        isFirst={index === 0}
                        isLast={index === (projects?.length || 0) - 1}
                    />
                ))}
                {(!projects || projects.length === 0) && (
                    <EmptyState title="No projects yet" description="Add your first one above." />
                )}
            </div>
        </div>
    );
}

function ProjectRow({ project, isFirst, isLast }) {
    async function handleMoveUp() {
        "use server";
        await moveProjectAction(project.id, "up");
    }
    async function handleMoveDown() {
        "use server";
        await moveProjectAction(project.id, "down");
    }
    async function handleUpdate(formData) {
        "use server";
        await updateProjectAction(project.id, formData);
    }
    async function handleDelete() {
        "use server";
        await deleteProjectAction(project.id);
    }

    return (
        <ItemRow title={project.title} meta={(project.tags || []).join(", ")}>
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
                <ProjectFields project={project} />
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </AdminActionForm>

            <AdminActionForm
                action={handleDelete}
                className="mt-4"
                confirmMessage="This project and its saved details will be permanently deleted."
                successMessage="The project was deleted."
            >
                <button type="submit" className={linkDanger}>
                    <TrashIcon className="w-4 h-4" />
                    Delete this project
                </button>
            </AdminActionForm>
        </ItemRow>
    );
}

function ProjectFields({ project }) {
    return (
        <>
            <Field label="Title" name="title" defaultValue={project?.title} required />
            <Field label="Description" name="description" defaultValue={project?.description} textarea />
            <Field
                label="Tags (comma-separated)"
                name="tags"
                defaultValue={(project?.tags || []).join(", ")}
                placeholder="Next.js, Tailwind CSS, REST API"
            />
            <Field
                label="Highlights — key things you did (one per line, optional)"
                name="highlights"
                textarea
                rows={4}
                defaultValue={(project?.highlights || []).join("\n")}
                placeholder={"Cut initial load time by 60% with route-level code splitting\nAdded infinite scroll with cursor-based pagination"}
            />
            <Field label="Live demo URL" name="live_url" defaultValue={project?.live_url} />
            <Field label="Repo URL" name="repo_url" defaultValue={project?.repo_url} />
            <div>
                <label className={labelBase}>Screenshot</label>
                <div className="flex items-center gap-4">
                    {project?.image_url && (
                        <img
                            src={project.image_url}
                            alt=""
                            className="w-28 aspect-video object-cover rounded-md border border-[#E4E4E7] shrink-0"
                        />
                    )}
                    <input type="file" name="image" accept="image/*" className="text-sm text-[#5B5F66]" />
                </div>
            </div>
        </>
    );
}
