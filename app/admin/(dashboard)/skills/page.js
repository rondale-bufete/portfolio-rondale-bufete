import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createSkillCategoryAction,
    deleteSkillCategoryAction,
    createSkillItemAction,
    deleteSkillItemAction,
} from "../../actions/skills";
import PageHeader from "../../ui/PageHeader";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import DeleteAction from "../../ui/DeleteAction";
import AdminActionForm from "../../ui/AdminActionForm";
import Field from "../../ui/Field";
import { buttonPrimary, buttonSecondary } from "../../ui/tokens";
import { CloseIcon, PlusIcon } from "@/components/icons";

export default async function SkillsAdminPage() {
    const { data: categories, error } = await supabaseAdmin
        .from("skill_categories")
        .select("id, category, sort_order, skill_items(id, name, sort_order)")
        .order("sort_order");

    async function handleCreateCategory(formData) {
        "use server";
        await createSkillCategoryAction(formData);
    }

    return (
        <div>
            <PageHeader title="Skills" description="Grouped into categories; each category is a row under About, and the first six skills also appear in the hero." />

            <div className="admin-stack">
                {error && <ErrorState message={error.message} />}

                {(categories || []).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
                {!error && (!categories || categories.length === 0) && (
                    <EmptyState title="No categories yet" description="Add one below to get started." />
                )}

                <div className="admin-card admin-card--padded">
                    <AdminActionForm action={handleCreateCategory} className="admin-form admin-form--inline" successMessage="Category added.">
                        <Field label="New category" name="category" placeholder="Databases" required />
                        <button type="submit" className={buttonPrimary}>
                            Add category
                        </button>
                    </AdminActionForm>
                </div>
            </div>
        </div>
    );
}

function CategoryCard({ category }) {
    const items = (category.skill_items || []).sort((a, b) => a.sort_order - b.sort_order);

    async function handleAddItem(formData) {
        "use server";
        await createSkillItemAction(category.id, formData);
    }
    async function handleDeleteCategory() {
        "use server";
        await deleteSkillCategoryAction(category.id);
    }

    return (
        <section className="admin-card admin-card--padded" aria-labelledby={`skills-${category.id}`}>
            <div className="admin-card__header">
                <h2 id={`skills-${category.id}`} className="admin-card__title">
                    {category.category}
                </h2>
                <DeleteAction
                    action={handleDeleteCategory}
                    label="Delete category"
                    confirmMessage={`“${category.category}” and its ${items.length} ${items.length === 1 ? "skill" : "skills"} will be removed for good.`}
                    successMessage="Category deleted."
                />
            </div>

            {items.length > 0 ? (
                <ul className="admin-chips" aria-label={`${category.category} skills`}>
                    {items.map((item) => (
                        <SkillChip key={item.id} item={item} />
                    ))}
                </ul>
            ) : (
                <p className="admin-card__description">No skills in this category yet.</p>
            )}

            <AdminActionForm action={handleAddItem} className="admin-form admin-form--inline admin-chips__add" successMessage={null}>
                <Field label={`Add to ${category.category}`} name="name" placeholder="e.g. Redis" required />
                <button type="submit" className={buttonSecondary}>
                    <PlusIcon size={16} />
                    Add skill
                </button>
            </AdminActionForm>
        </section>
    );
}

// Removing one tag is quick to undo (type it again), so it doesn't ask first.
function SkillChip({ item }) {
    async function handleDelete() {
        "use server";
        await deleteSkillItemAction(item.id);
    }

    return (
        <li className="tech-tag admin-chip">
            {item.name}
            <AdminActionForm action={handleDelete} successMessage={`Removed ${item.name}.`} inlineErrors={false}>
                <button type="submit" className="admin-chip__remove" aria-label={`Remove ${item.name}`} title="Remove">
                    <CloseIcon size={14} />
                </button>
            </AdminActionForm>
        </li>
    );
}
