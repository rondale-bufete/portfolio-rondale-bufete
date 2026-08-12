import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
} from "../../actions/projects";

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
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">Projects</h1>
            <p className="text-sm text-[#5B5F66] mb-8">Shown in order on the homepage project grid.</p>

            <div className="space-y-4 mb-10">
                {(projects || []).map((project) => (
                    <ProjectRow key={project.id} project={project} />
                ))}
                {(!projects || projects.length === 0) && (
                    <p className="text-sm text-[#5B5F66]">No projects yet — add your first one below.</p>
                )}
            </div>

            <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
                <summary className="cursor-pointer font-medium text-sm">+ Add a new project</summary>
                <form action={handleCreate} className="mt-5 space-y-4 max-w-xl">
                    <ProjectFields />
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                    >
                        Add project
                    </button>
                </form>
            </details>
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
        <details className="bg-white border border-[#E4E4E7] rounded-xl p-6 group">
            <summary className="cursor-pointer flex items-center justify-between">
                <span className="font-medium text-sm">{project.title}</span>
                <span className="text-xs text-[#5B5F66] font-[family-name:var(--font-mono)]">
                    {(project.tags || []).join(", ")}
                </span>
            </summary>

            <form action={handleUpdate} className="mt-5 space-y-4 max-w-xl">
                <ProjectFields project={project} />
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                    >
                        Save changes
                    </button>
                </div>
            </form>

            <form action={handleDelete} className="mt-3">
                <button
                    type="submit"
                    className="text-sm text-[#E5484D] hover:underline"
                >
                    Delete this project
                </button>
            </form>
        </details>
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
            <div>
                <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor="highlights">
                    Highlights — key things you did (one per line, optional)
                </label>
                <textarea
                    id="highlights"
                    name="highlights"
                    defaultValue={(project?.highlights || []).join("\n")}
                    rows={4}
                    placeholder={"Cut initial load time by 60% with route-level code splitting\nAdded infinite scroll with cursor-based pagination"}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors resize-none"
                />
            </div>
            <Field label="Live demo URL" name="live_url" defaultValue={project?.live_url} />
            <Field label="Repo URL" name="repo_url" defaultValue={project?.repo_url} />
            <div>
                <label className="block text-sm text-[#5B5F66] mb-1.5">
                    Screenshot {project?.image_url && <span className="text-[#3355FF]">(current set)</span>}
                </label>
                {project?.image_url && (
                    <img
                        src={project.image_url}
                        alt=""
                        className="w-full max-w-xs aspect-video object-cover rounded-md mb-2 border border-[#E4E4E7]"
                    />
                )}
                <input type="file" name="image" accept="image/*" className="text-sm" />
            </div>
        </>
    );
}

function Field({ label, name, defaultValue, placeholder, textarea = false, required = false }) {
    return (
        <div>
            <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor={name}>
                {label}
            </label>
            {textarea ? (
                <textarea
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    rows={3}
                    required={required}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors resize-none"
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
                />
            )}
        </div>
    );
}
