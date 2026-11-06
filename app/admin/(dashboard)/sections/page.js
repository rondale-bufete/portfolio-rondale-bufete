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
import Field from "../../ui/Field";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import { ItemRow, AddNewRow } from "../../ui/CollapsibleRow";
import ReorderControls from "../../ui/ReorderControls";
import DeleteAction from "../../ui/DeleteAction";
import { buttonPrimary, buttonSecondary } from "../../ui/tokens";
import AdminActionForm from "../../ui/AdminActionForm";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { HOMEPAGE_SECTION_KINDS } from "@/lib/sectionKinds";
import { stripOrdinal } from "@/lib/format";

const KIND_LABELS = { about: "About", projects: "Projects", contact: "Contact", custom: "Custom" };

export default async function SectionsAdminPage() {
    const [{ data: sections, error }, { data: profile, error: profileError }] = await Promise.all([
        supabaseAdmin.from("sections").select("*").order("sort_order"),
        // Select all columns so this page loads before the chat toggle migration.
        supabaseAdmin.from("profile").select("*").eq("id", 1).maybeSingle(),
    ]);

    // Legacy Experience and Skills rows render inside About and have nothing to edit here.
    const homepage = (sections || []).filter((section) => HOMEPAGE_SECTION_KINDS.has(section.kind));

    async function handleCreate(formData) {
        "use server";
        await createCustomSectionAction(formData);
    }

    return (
        <div>
            <PageHeader
                title="Sections"
                description="Everything below the hero, top to bottom. The navbar tabs follow the same order and use each section's label."
            />

            <div className="admin-stack">
                <ChatWidgetCard profile={profile} error={profileError} />

                <AddNewRow label="Add a custom section">
                    <AdminActionForm action={handleCreate} className="admin-form" successMessage="Section added.">
                        <div className="admin-grid-2">
                            <Field label="Navbar label" name="label" placeholder="Testimonials" required />
                            <Field label="Heading" name="heading" placeholder="What people say" required />
                        </div>
                        <Field label="Body" name="body" textarea rows={5} hint="Separate paragraphs with a blank line." />
                        <div className="admin-form__actions">
                            <button type="submit" className={buttonPrimary}>
                                Add section
                            </button>
                        </div>
                    </AdminActionForm>
                </AddNewRow>

                {error && <ErrorState message={error.message} />}

                {!error && (
                    <div className="admin-list">
                        {homepage.map((section, index) => (
                            <SectionRow
                                key={section.id}
                                section={section}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === homepage.length - 1}
                            />
                        ))}
                        {homepage.length === 0 && <EmptyState title="No sections found" description="Run the sections migration SQL first." />}
                    </div>
                )}
            </div>
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
        <section className="admin-card admin-card--padded" aria-labelledby="chat-widget-title">
            <div className="admin-card__header">
                <div>
                    <h2 id="chat-widget-title" className="admin-card__title">
                        Chat assistant
                    </h2>
                    <p className="admin-card__description">
                        The &ldquo;Ask me about my work&rdquo; button on every public page. Hiding it removes the button only; the assistant itself is unchanged.
                    </p>
                </div>
                <Badge tone={isVisible ? "success" : "neutral"}>{isVisible ? "On the site" : "Hidden"}</Badge>
            </div>

            {hasSetting ? (
                <AdminActionForm
                    action={handleToggle}
                    successMessage={isVisible ? "Chat assistant hidden from the site." : "Chat assistant is back on the site."}
                >
                    <button type="submit" className={buttonSecondary}>
                        {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                        {isVisible ? "Hide from site" : "Show on site"}
                    </button>
                </AdminActionForm>
            ) : (
                <p className="admin-note">Run supabase/chat_widget_toggle_migration.sql in the Supabase SQL Editor to turn on this toggle.</p>
            )}
        </section>
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

    const kindLabel = KIND_LABELS[section.kind];
    const name = section.kind === "custom" ? section.heading || "Untitled section" : kindLabel;
    // About renders its own sub-headings, so only its navbar label is used.
    const usesHeading = section.kind !== "about";

    return (
        <ItemRow
            index={index}
            title={name}
            meta={
                <>
                    {section.kind === "custom" && <Badge tone="accent">Custom</Badge>}
                    {!section.visible && <Badge>Hidden</Badge>}
                    <span>Navbar: {stripOrdinal(section.label) || kindLabel}</span>
                </>
            }
            actions={<ReorderControls label={name} isFirst={isFirst} isLast={isLast} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />}
        >
            <div className="admin-stack">
                <AdminActionForm action={handleToggle} successMessage={section.visible ? `${name} hidden from the site.` : `${name} is back on the site.`}>
                    <button type="submit" className={buttonSecondary}>
                        {section.visible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                        {section.visible ? "Hide from site" : "Show on site"}
                    </button>
                </AdminActionForm>

                <AdminActionForm action={handleUpdate} className="admin-form">
                    <div className="admin-grid-2">
                        <Field label="Navbar label" name="label" defaultValue={stripOrdinal(section.label)} required />
                        {usesHeading && <Field label="Heading" name="heading" defaultValue={section.heading} required />}
                    </div>
                    {!usesHeading && <input type="hidden" name="heading" value={section.heading || ""} />}
                    {section.kind === "custom" && (
                        <Field label="Body" name="body" defaultValue={section.body} textarea rows={5} hint="Separate paragraphs with a blank line." />
                    )}
                    <div className="admin-form__actions">
                        <button type="submit" className={buttonPrimary}>
                            Save changes
                        </button>
                    </div>
                </AdminActionForm>
            </div>

            {section.kind === "custom" && (
                <div className="admin-row__footer">
                    <DeleteAction
                        action={handleDelete}
                        label="Delete section"
                        confirmMessage={`“${name}” will be removed from your homepage for good.`}
                        successMessage="Section deleted."
                    />
                </div>
            )}
        </ItemRow>
    );
}
