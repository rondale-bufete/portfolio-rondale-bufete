import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    moveProjectAction,
} from "../../actions/projects";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import ReorderControls from "../../ui/ReorderControls";
import DeleteAction from "../../ui/DeleteAction";
import { buttonPrimary } from "../../ui/tokens";
import AdminActionForm from "../../ui/AdminActionForm";
import ProjectImagesField from "./ProjectImagesField";
import { provenanceLabel } from "@/lib/projectDetail";

function savedImagesOf(project) {
    if (project?.image_urls?.length) return project.image_urls;
    return project?.image_url ? [project.image_url] : [];
}

export default async function ProjectsAdminPage() {
    const { data: projects, error } = await supabaseAdmin.from("projects").select("*").order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createProjectAction(formData);
    }

    return (
        <div>
            <PageHeader
                title="Projects"
                description="In homepage order. The first two get the large case-study layout; every project has its own page."
            />

            <div className="admin-stack">
                <AddNewRow label="Add a project">
                    <AdminActionForm action={handleCreate} className="admin-form" successMessage="Project added.">
                        <ProjectFields />
                        <div className="admin-form__actions">
                            <button type="submit" className={buttonPrimary}>
                                Add project
                            </button>
                        </div>
                    </AdminActionForm>
                </AddNewRow>

                {error && <ErrorState message={error.message} />}

                {!error && (
                    <div className="admin-list">
                        {(projects || []).map((project, index) => (
                            <ProjectRow
                                key={project.id}
                                project={project}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === (projects?.length || 0) - 1}
                            />
                        ))}
                        {(!projects || projects.length === 0) && (
                            <EmptyState title="No projects yet" description="Add your first one above." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProjectRow({ project, index, isFirst, isLast }) {
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

    const images = savedImagesOf(project);
    const cover = images[0];

    return (
        <ItemRow
            index={index}
            title={project.title}
            media={
                <span className="admin-row__media">
                    {cover && <Image src={cover} alt="" fill sizes="64px" />}
                </span>
            }
            meta={
                <>
                    <Badge tone={project.provenance === "Client" ? "accent" : "neutral"}>{provenanceLabel(project.provenance)}</Badge>
                    {project.year && <span>{project.year}</span>}
                    <span>
                        {images.length} {images.length === 1 ? "image" : "images"}
                    </span>
                    {index < 2 && <span>Featured</span>}
                </>
            }
            actions={<ReorderControls label={project.title} isFirst={isFirst} isLast={isLast} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />}
        >
            <AdminActionForm action={handleUpdate} className="admin-form">
                <ProjectFields project={project} />
                <div className="admin-form__actions">
                    <button type="submit" className={buttonPrimary}>
                        Save changes
                    </button>
                </div>
            </AdminActionForm>

            <div className="admin-row__footer">
                <DeleteAction
                    action={handleDelete}
                    label="Delete project"
                    confirmMessage={`“${project.title}”, its page and its screenshots will be removed from your site for good.`}
                    successMessage="Project deleted."
                />
            </div>
        </ItemRow>
    );
}

function ProjectFields({ project }) {
    return (
        <>
            <Field label="Title" name="title" defaultValue={project?.title} required />
            <Field
                label="Description"
                name="description"
                defaultValue={project?.description}
                textarea
                rows={6}
                hint="The first paragraph is the card summary. Separate paragraphs with a blank line."
            />
            <Field
                label="Tags"
                name="tags"
                defaultValue={(project?.tags || []).join(", ")}
                placeholder="Next.js, Tailwind CSS, Supabase"
                hint="Comma-separated. Cards show the first three or four; the project page shows all."
            />
            <div className="admin-grid-2">
                <div className="admin-field">
                    <label className="admin-label" htmlFor={`provenance-${project?.id ?? "new"}`}>
                        Type
                    </label>
                    <select id={`provenance-${project?.id ?? "new"}`} name="provenance" defaultValue={project?.provenance || "Personal"} className="admin-input">
                        <option value="Client">Client project</option>
                        <option value="Capstone">Capstone project</option>
                        <option value="Personal">Personal project</option>
                    </select>
                </div>
                <Field label="Year" name="year" defaultValue={project?.year} placeholder="2026" optional />
            </div>
            <Field
                label="Outcome"
                name="outcome"
                defaultValue={project?.outcome}
                placeholder="+60% income collected"
                hint="The result, in a few words. Shown on featured cards and the project page."
                optional
            />
            <div className="admin-grid-2">
                <Field label="Your role" name="role" defaultValue={project?.role} placeholder="Sole developer" optional />
                <Field label="Timeline" name="timeline" defaultValue={project?.timeline} placeholder="6 weeks" optional />
            </div>
            <Field
                label="Highlights"
                name="highlights"
                textarea
                rows={4}
                defaultValue={(project?.highlights || []).join("\n")}
                placeholder={"Cut initial load time by 60% with route-level code splitting\nAdded infinite scroll with cursor-based pagination"}
                hint="One per line. Start a line with “Label:” to bold the label on the project page."
                optional
            />
            <div className="admin-grid-2">
                <Field label="Live site URL" name="live_url" defaultValue={project?.live_url} type="url" optional />
                <Field label="Source code URL" name="repo_url" defaultValue={project?.repo_url} type="url" optional />
            </div>
            <ProjectImagesField imageUrls={savedImagesOf(project)} />
        </>
    );
}
