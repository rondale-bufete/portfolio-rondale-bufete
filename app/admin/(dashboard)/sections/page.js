import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    moveSectionAction,
    toggleSectionVisibilityAction,
    updateSectionMetaAction,
    createCustomSectionAction,
    deleteSectionAction,
} from "../../actions/sections";

const KIND_LABELS = {
    about: "About (pulls from Profile / Education / Certifications)",
    experience: "Experience (pulls from Experience)",
    skills: "Skills (pulls from Skills)",
    projects: "Projects (pulls from Projects)",
    contact: "Contact form",
    custom: "Custom section",
};

export default async function SectionsAdminPage() {
    const { data: sections } = await supabaseAdmin
        .from("sections")
        .select("*")
        .order("sort_order");

    async function handleCreate(formData) {
        "use server";
        await createCustomSectionAction(formData);
    }

    return (
        <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">Sections</h1>
            <p className="text-sm text-[#5B5F66] mb-8">
                Controls the order, visibility, and titles of every section on your homepage.
                Hero always stays first.
            </p>

            <div className="space-y-4 mb-10">
                {(sections || []).map((section, i) => (
                    <SectionRow
                        key={section.id}
                        section={section}
                        isFirst={i === 0}
                        isLast={i === (sections?.length || 0) - 1}
                    />
                ))}
                {(!sections || sections.length === 0) && (
                    <p className="text-sm text-[#5B5F66]">No sections found — run the migration SQL first.</p>
                )}
            </div>

            <details className="bg-white border border-[#E4E4E7] rounded-xl p-6">
                <summary className="cursor-pointer font-medium text-sm">+ Add a custom section</summary>
                <form action={handleCreate} className="mt-5 space-y-4 max-w-xl">
                    <Field label="Label" name="label" placeholder="05 — Testimonials" required />
                    <Field label="Heading" name="heading" placeholder="What people say" required />
                    <Field label="Body" name="body" textarea placeholder="Write the section's content. Separate paragraphs with a blank line." />
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                    >
                        Add section
                    </button>
                </form>
            </details>
        </div>
    );
}

function SectionRow({ section, isFirst, isLast }) {
    async function handleMoveUp() {
        "use server";
        await moveSectionAction(section.id, "up");
    }
    async function handleMoveDown() {
        "use server";
        await moveSectionAction(section.id, "down");
    }
    async function handleToggle() {
        "use server";
        await toggleSectionVisibilityAction(section.id, section.visible);
    }
    async function handleUpdate(formData) {
        "use server";
        await updateSectionMetaAction(section.id, formData);
    }
    async function handleDelete() {
        "use server";
        await deleteSectionAction(section.id);
    }

    return (
        <details className="bg-white border border-[#E4E4E7] rounded-xl p-6" open={section.kind === "custom" && !section.heading}>
            <summary className="cursor-pointer flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-sm truncate">{section.heading || "(untitled)"}</span>
                    <span className="text-xs text-[#5B5F66] font-[family-name:var(--font-mono)] shrink-0">
                        {KIND_LABELS[section.kind]}
                    </span>
                    {!section.visible && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0F0F2] text-[#5B5F66] shrink-0">
                            hidden
                        </span>
                    )}
                </div>
            </summary>

            <div className="mt-5 flex items-center gap-2 flex-wrap">
                <form action={handleMoveUp}>
                    <button
                        type="submit"
                        disabled={isFirst}
                        className="px-3 py-1.5 rounded-md border border-[#E4E4E7] text-sm disabled:opacity-40 hover:border-[#14161A] transition-colors"
                    >
                        ↑ Move up
                    </button>
                </form>
                <form action={handleMoveDown}>
                    <button
                        type="submit"
                        disabled={isLast}
                        className="px-3 py-1.5 rounded-md border border-[#E4E4E7] text-sm disabled:opacity-40 hover:border-[#14161A] transition-colors"
                    >
                        ↓ Move down
                    </button>
                </form>
                <form action={handleToggle}>
                    <button
                        type="submit"
                        className="px-3 py-1.5 rounded-md border border-[#E4E4E7] text-sm hover:border-[#14161A] transition-colors"
                    >
                        {section.visible ? "Hide from site" : "Show on site"}
                    </button>
                </form>
            </div>

            <form action={handleUpdate} className="mt-5 space-y-4 max-w-xl">
                <Field label="Label" name="label" defaultValue={section.label} required />
                <Field label="Heading" name="heading" defaultValue={section.heading} required />
                {section.kind === "custom" && (
                    <Field label="Body" name="body" defaultValue={section.body} textarea />
                )}
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                >
                    Save changes
                </button>
            </form>

            {section.kind === "custom" && (
                <form action={handleDelete} className="mt-3">
                    <button type="submit" className="text-sm text-[#E5484D] hover:underline">
                        Delete this section
                    </button>
                </form>
            )}
        </details>
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
                    rows={5}
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
