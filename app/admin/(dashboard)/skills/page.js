import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createSkillCategoryAction,
    deleteSkillCategoryAction,
    createSkillItemAction,
    deleteSkillItemAction,
} from "../../actions/skills";
import PageHeader from "../../ui/PageHeader";
import EmptyState from "../../ui/EmptyState";
import { cardBase, inputBase, buttonPrimary, buttonSecondary, linkDanger } from "../../ui/tokens";
import { TrashIcon } from "../../ui/icons";

export default async function SkillsAdminPage() {
    const { data: categories } = await supabaseAdmin
        .from("skill_categories")
        .select("id, category, sort_order, skill_items(id, name, sort_order)")
        .order("sort_order");

    async function handleCreateCategory(formData) {
        "use server";
        await createSkillCategoryAction(formData);
    }

    return (
        <div>
            <PageHeader
                title="Skills"
                description="Organized into categories — each category is a column on the homepage."
            />

            <div className="space-y-4 mb-6">
                {(categories || []).map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                ))}
                {(!categories || categories.length === 0) && (
                    <EmptyState title="No categories yet" description="Add one below to get started." />
                )}
            </div>

            <form
                action={handleCreateCategory}
                className={`${cardBase} p-5 flex items-end gap-3 max-w-md`}
            >
                <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[#5B5F66] mb-1.5" htmlFor="category">
                        New category name
                    </label>
                    <input
                        id="category"
                        name="category"
                        placeholder="Databases"
                        required
                        className={inputBase}
                    />
                </div>
                <button type="submit" className={buttonPrimary}>
                    Add
                </button>
            </form>
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
        <div className={`${cardBase} p-5`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-display)] font-medium">{category.category}</h3>
                <form action={handleDeleteCategory}>
                    <button type="submit" className={linkDanger}>
                        <TrashIcon className="w-4 h-4" />
                        Delete category
                    </button>
                </form>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {items.map((item) => (
                    <SkillItemTag key={item.id} item={item} />
                ))}
                {items.length === 0 && (
                    <p className="text-sm text-[#5B5F66]">No skills in this category yet.</p>
                )}
            </div>

            <form action={handleAddItem} className="flex items-center gap-2">
                <input
                    name="name"
                    placeholder="e.g. Redis"
                    required
                    className={`${inputBase} flex-1 max-w-xs`}
                />
                <button type="submit" className={buttonSecondary}>
                    + Add skill
                </button>
            </form>
        </div>
    );
}

function SkillItemTag({ item }) {
    async function handleDelete() {
        "use server";
        await deleteSkillItemAction(item.id);
    }

    return (
        <form action={handleDelete}>
            <button
                type="submit"
                title="Click to remove"
                className="group inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs pl-2.5 pr-2 py-1.5 rounded-md bg-[#F0F0F2] border border-transparent hover:border-[#E5484D] hover:bg-[#E5484D]/5 transition-colors"
            >
                {item.name}
                <span className="text-[#9A9DA3] group-hover:text-[#E5484D] transition-colors">×</span>
            </button>
        </form>
    );
}
