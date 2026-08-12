import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
} from "../../actions/projects";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import EmptyState from "../../ui/EmptyState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { labelBase, buttonPrimary, linkDanger } from "../../ui/tokens";
import { TrashIcon } from "../../ui/icons";

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
                    <form action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <ProjectFields />
                        <button type="submit" className={buttonPrimary}>
                            Add project
                        </button>
                    </form>
                </AddNewRow>
            </div>

            <div className="space-y-3">
                {(projects || []).map((project) => (
                    <ProjectRow key={project.id} project={project} />
                ))}
                {(!projects || projects.length === 0) && (
                    <EmptyState title="No projects yet" description="Add your first one above." />
                )}
            </div>
        </div>
    );
}

function ProjectRow({ project }) {
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
            <form action={handleUpdate} className="mt-4 space-y-4 max-w-xl">
                <ProjectFields project={project} />
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </form>

            <form action={handleDelete} className="mt-4">
                <button type="submit" className={linkDanger}>
                    <TrashIcon className="w-4 h-4" />
                    Delete this project
                </button>
            </form>
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
