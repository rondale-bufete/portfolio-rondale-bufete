import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    moveSectionAction,
    toggleSectionVisibilityAction,
    updateSectionMetaAction,
    createCustomSectionAction,
    deleteSectionAction,
} from "../../actions/sections";
import PageHeader from "../../ui/PageHeader";
import Field from "../../ui/Field";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { buttonPrimary, buttonSecondary, buttonIcon, linkDanger } from "../../ui/tokens";
import { ArrowUpIcon, ArrowDownIcon, EyeIcon, EyeOffIcon, TrashIcon } from "../../ui/icons";

const KIND_LABELS = {
    about: "About",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    custom: "Custom",
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
            <PageHeader
                title="Sections"
                description="Controls the order, visibility, and titles of every section on your homepage. Hero always stays first."
            />

            <div className="mb-6">
                <AddNewRow label="Add a custom section">
                    <form action={handleCreate} className="mt-4 space-y-4 max-w-xl">
                        <Field label="Label" name="label" placeholder="05 — Testimonials" required />
                        <Field label="Heading" name="heading" placeholder="What people say" required />
                        <Field
                            label="Body"
                            name="body"
                            textarea
                            rows={5}
                            placeholder="Write the section's content. Separate paragraphs with a blank line."
                        />
                        <button type="submit" className={buttonPrimary}>
                            Add section
                        </button>
                    </form>
                </AddNewRow>
            </div>

            <div className="space-y-3">
                {(sections || []).map((section, i) => (
                    <SectionRow
                        key={section.id}
                        section={section}
                        isFirst={i === 0}
                        isLast={i === (sections?.length || 0) - 1}
                    />
                ))}
                {(!sections || sections.length === 0) && (
                    <EmptyState
                        title="No sections found"
                        description="Run the sections migration SQL first."
                    />
                )}
            </div>
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

    const badges = (
        <div className="flex items-center gap-1.5 shrink-0">
            <Badge tone="accent">{KIND_LABELS[section.kind]}</Badge>
            {!section.visible && <Badge tone="neutral">Hidden</Badge>}
        </div>
    );

    return (
        <ItemRow title={section.heading || "(untitled)"} badges={badges}>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
                <form action={handleMoveUp}>
                    <button type="submit" disabled={isFirst} className={buttonIcon} title="Move up" aria-label="Move up">
                        <ArrowUpIcon className="w-4 h-4" />
                    </button>
                </form>
                <form action={handleMoveDown}>
                    <button type="submit" disabled={isLast} className={buttonIcon} title="Move down" aria-label="Move down">
                        <ArrowDownIcon className="w-4 h-4" />
                    </button>
                </form>
                <form action={handleToggle}>
                    <button type="submit" className={buttonSecondary}>
                        {section.visible ? (
                            <>
                                <EyeOffIcon className="w-4 h-4" />
                                Hide from site
                            </>
                        ) : (
                            <>
                                <EyeIcon className="w-4 h-4" />
                                Show on site
                            </>
                        )}
                    </button>
                </form>
            </div>

            <form action={handleUpdate} className="mt-5 space-y-4 max-w-xl">
                <Field label="Label" name="label" defaultValue={section.label} required />
                <Field label="Heading" name="heading" defaultValue={section.heading} required />
                {section.kind === "custom" && (
                    <Field label="Body" name="body" defaultValue={section.body} textarea rows={5} />
                )}
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </form>

            {section.kind === "custom" && (
                <form action={handleDelete} className="mt-4">
                    <button type="submit" className={linkDanger}>
                        <TrashIcon className="w-4 h-4" />
                        Delete this section
                    </button>
                </form>
            )}
        </ItemRow>
    );
}
