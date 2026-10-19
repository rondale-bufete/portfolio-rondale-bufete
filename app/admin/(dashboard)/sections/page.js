import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    moveSectionAction,
    toggleSectionVisibilityAction,
    updateSectionMetaAction,
    createCustomSectionAction,
    deleteSectionAction,
} from "../../actions/sections";
import { setChatWidgetVisibilityAction } from "../../actions/profile";
import PageHeader from "../../ui/PageHeader";
import Card from "../../ui/Card";
import Field from "../../ui/Field";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import { buttonPrimary, buttonSecondary, buttonIcon, linkDanger } from "../../ui/tokens";
import { ArrowUpIcon, ArrowDownIcon, EyeIcon, EyeOffIcon, TrashIcon } from "../../ui/icons";
import AdminActionForm from "../../ui/AdminActionForm";

const KIND_LABELS = {
    about: "About",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    custom: "Custom",
};

// About/Projects/Contact are separate routes now — their visibility toggle
// still turns the whole page on/off, but reordering them has no effect, so
// the move buttons are hidden for anything that isn't a custom section.
const REORDERABLE_KINDS = new Set(["custom"]);

// Experience/Skills render inside About whenever they have data — the
// sections table row for them is a leftover from before that migration and
// has no effect on the public site, so their toggle is hidden too.
const TOGGLEABLE_KINDS = new Set(["about", "projects", "contact", "custom"]);

export default async function SectionsAdminPage() {
    const [{ data: sections, error }, { data: profile, error: profileError }] = await Promise.all([
        supabaseAdmin.from("sections").select("*").order("sort_order"),
        // select("*") rather than the column itself, so the page still loads
        // before the chat_widget_toggle migration has been run.
        supabaseAdmin.from("profile").select("*").eq("id", 1).maybeSingle(),
    ]);

    async function handleCreate(formData) {
        "use server";
        await createCustomSectionAction(formData);
    }

    return (
        <div>
            <PageHeader
                title="Sections"
                description={
                    <>
                        About, Projects, and Contact are separate pages now — their visibility toggle here turns
                        the whole page on or off (hiding one removes its navbar tab and makes the page 404).
                        Experience and Skills are managed from their own pages and always render inside About
                        when they have content. Only Custom sections are reorderable and appear on the homepage,
                        below the hero.
                    </>
                }
            />

            <ChatWidgetCard profile={profile} error={profileError} />

            <div className="mb-6">
                <AddNewRow label="Add a custom section">
                    <AdminActionForm action={handleCreate} className="mt-4 space-y-4 max-w-xl">
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
                    </AdminActionForm>
                </AddNewRow>
            </div>

            {error && <ErrorState message={error.message} />}

            {!error && (
                <div className="space-y-3">
                    {(sections || []).map((section, i) => (
                        <SectionRow
                            key={section.id}
                            section={section}
                            index={i}
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
            )}
        </div>
    );
}

function ChatWidgetCard({ profile, error }) {
    if (error) {
        return <ErrorState title="Chat widget setting couldn't load" message={error.message} />;
    }

    const hasSetting = Boolean(profile) && "chat_visible" in profile;
    const isVisible = profile?.chat_visible ?? true;

    async function handleToggle() {
        "use server";
        await setChatWidgetVisibilityAction(!isVisible);
    }

    return (
        <Card className="mb-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="font-medium text-[var(--color-text)] font-[family-name:var(--font-display)]">Chat widget</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-body)]">
                        The &ldquo;Ask me about my work&rdquo; assistant on every public page. Hiding it only removes it
                        from the site; the assistant itself isn&apos;t changed.
                    </p>
                </div>
                <Badge tone={isVisible ? "accent" : "neutral"}>{isVisible ? "Visible" : "Hidden"}</Badge>
            </div>

            {hasSetting ? (
                <AdminActionForm
                    action={handleToggle}
                    className="mt-4"
                    successMessage={isVisible ? "The chat widget is now hidden from your site." : "The chat widget is back on your site."}
                >
                    <button type="submit" className={buttonSecondary}>
                        {isVisible ? (
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
                </AdminActionForm>
            ) : (
                <p className="mt-4 field-label">
                    Run supabase/chat_widget_toggle_migration.sql in the Supabase SQL Editor to turn on this toggle.
                </p>
            )}
        </Card>
    );
}

function SectionRow({ section, index, isFirst, isLast }) {
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

    const canReorder = REORDERABLE_KINDS.has(section.kind);
    const canToggle = TOGGLEABLE_KINDS.has(section.kind);

    const badges = (
        <div className="flex items-center gap-1.5 shrink-0">
            <Badge tone="accent">{KIND_LABELS[section.kind]}</Badge>
            {!section.visible && <Badge tone="neutral">Hidden</Badge>}
        </div>
    );

    return (
        <ItemRow index={index} title={section.heading || "(untitled)"} badges={badges}>
            {(canReorder || canToggle) && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {canReorder && (
                        <>
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
                        </>
                    )}
                    {canToggle && (
                        <AdminActionForm action={handleToggle}>
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
                        </AdminActionForm>
                    )}
                </div>
            )}

            <AdminActionForm action={handleUpdate} className="mt-5 space-y-4 max-w-xl">
                <Field label="Label" name="label" defaultValue={section.label} required />
                <Field label="Heading" name="heading" defaultValue={section.heading} required />
                {section.kind === "custom" && (
                    <Field label="Body" name="body" defaultValue={section.body} textarea rows={5} />
                )}
                <button type="submit" className={buttonPrimary}>
                    Save changes
                </button>
            </AdminActionForm>

            {section.kind === "custom" && (
                <AdminActionForm
                    action={handleDelete}
                    className="mt-4"
                    confirmMessage="This custom section will be permanently deleted."
                    successMessage="The custom section was deleted."
                >
                    <button type="submit" className={linkDanger}>
                        <TrashIcon className="w-4 h-4" />
                        Delete this section
                    </button>
                </AdminActionForm>
            )}
        </ItemRow>
    );
}
