import { supabaseAdmin } from "@/lib/supabase/admin";
import {
    createSkillCategoryAction,
    deleteSkillCategoryAction,
    createSkillItemAction,
    deleteSkillItemAction,
} from "../../actions/skills";

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
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">Skills</h1>
            <p className="text-sm text-[#5B5F66] mb-8">
                Organized into categories — each category is a column on the homepage.
            </p>

            <div className="space-y-6 mb-10">
                {(categories || []).map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                ))}
                {(!categories || categories.length === 0) && (
                    <p className="text-sm text-[#5B5F66]">No categories yet — add one below.</p>
                )}
            </div>

            <form
                action={handleCreateCategory}
                className="bg-white border border-[#E4E4E7] rounded-xl p-6 flex items-end gap-3 max-w-md"
            >
                <div className="flex-1">
                    <label className="block text-sm text-[#5B5F66] mb-1.5" htmlFor="category">
                        New category name
                    </label>
                    <input
                        id="category"
                        name="category"
                        placeholder="Databases"
                        required
                        className="w-full px-4 py-2.5 rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md bg-[#14161A] text-white text-sm font-medium hover:bg-[#3355FF] transition-colors"
                >
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
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-display)] font-medium">{category.category}</h3>
                <form action={handleDeleteCategory}>
                    <button type="submit" className="text-sm text-[#E5484D] hover:underline">
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
                    className="flex-1 max-w-xs px-3 py-2 text-sm rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#3355FF] transition-colors"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[#F0F0F2] text-sm font-medium hover:bg-[#E4E4E7] transition-colors"
                >
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
                className="group inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs pl-2.5 pr-2 py-1.5 rounded-md bg-[#F0F0F2] border border-[#E4E4E7] hover:border-[#E5484D] hover:bg-[#E5484D]/5 transition-colors"
            >
                {item.name}
                <span className="text-[#5B5F66] group-hover:text-[#E5484D]">×</span>
            </button>
        </form>
    );
}
