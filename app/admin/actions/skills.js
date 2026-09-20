"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { nextSortOrder } from "@/lib/supabase/reorder";
import { requireAdmin } from "@/lib/auth";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/skills");
}

export async function createSkillCategoryAction(formData) {
    await requireAdmin();

    const category = formData.get("category")?.toString().trim();
    if (!category) throw new Error("Category name can't be empty.");

    const { error } = await supabaseAdmin
        .from("skill_categories")
        .insert({ category, sort_order: await nextSortOrder("skill_categories") });
    if (error) throw new Error(error.message);

    refresh();
}

export async function deleteSkillCategoryAction(id) {
    await requireAdmin();

    // skill_items rows cascade-delete via the FK constraint.
    const { error } = await supabaseAdmin.from("skill_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);

    refresh();
}

export async function createSkillItemAction(categoryId, formData) {
    await requireAdmin();

    const name = formData.get("name")?.toString().trim();
    if (!name) throw new Error("Skill name can't be empty.");

    const { error } = await supabaseAdmin
        .from("skill_items")
        .insert({
            category_id: categoryId,
            name,
            sort_order: await nextSortOrder("skill_items", { category_id: categoryId }),
        });
    if (error) throw new Error(error.message);

    refresh();
}

export async function deleteSkillItemAction(id) {
    await requireAdmin();

    const { error } = await supabaseAdmin.from("skill_items").delete().eq("id", id);
    if (error) throw new Error(error.message);

    refresh();
}
