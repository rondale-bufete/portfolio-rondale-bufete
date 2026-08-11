"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createSkillCategoryAction(formData) {
    const category = formData.get("category")?.toString().trim();
    if (!category) return;

    const { data: existing } = await supabaseAdmin
        .from("skill_categories")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 0;

    const { error } = await supabaseAdmin
        .from("skill_categories")
        .insert({ category, sort_order: nextOrder });
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/skills");
}

export async function deleteSkillCategoryAction(id) {
    // skill_items rows cascade-delete via the FK constraint.
    const { error } = await supabaseAdmin.from("skill_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/skills");
}

export async function createSkillItemAction(categoryId, formData) {
    const name = formData.get("name")?.toString().trim();
    if (!name) return;

    const { data: existing } = await supabaseAdmin
        .from("skill_items")
        .select("sort_order")
        .eq("category_id", categoryId)
        .order("sort_order", { ascending: false })
        .limit(1);
    const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 0;

    const { error } = await supabaseAdmin
        .from("skill_items")
        .insert({ category_id: categoryId, name, sort_order: nextOrder });
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/skills");
}

export async function deleteSkillItemAction(id) {
    const { error } = await supabaseAdmin.from("skill_items").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/skills");
}
