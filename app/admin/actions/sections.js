"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { moveItem, nextSortOrder } from "@/lib/supabase/reorder";
import { requireAdmin } from "@/lib/auth";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/sections");
}

export async function moveSectionAction(id, direction) {
    await requireAdmin();
    await moveItem("sections", id, direction);
    refresh();
}

export async function toggleSectionVisibilityAction(id, currentlyVisible) {
    await requireAdmin();
    const { error } = await supabaseAdmin
        .from("sections")
        .update({ visible: !currentlyVisible })
        .eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateSectionMetaAction(id, formData) {
    await requireAdmin();
    const patch = {
        label: formData.get("label")?.toString() || "",
        heading: formData.get("heading")?.toString() || "",
    };
    // Only custom section forms include a body field.
    if (formData.has("body")) {
        patch.body = formData.get("body")?.toString() || "";
    }

    const { error } = await supabaseAdmin.from("sections").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function createCustomSectionAction(formData) {
    await requireAdmin();

    const { error } = await supabaseAdmin.from("sections").insert({
        kind: "custom",
        label: formData.get("label")?.toString() || "",
        heading: formData.get("heading")?.toString() || "",
        body: formData.get("body")?.toString() || "",
        sort_order: await nextSortOrder("sections"),
        visible: true,
    });
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteSectionAction(id) {
    await requireAdmin();

    // Structural sections can be hidden but not deleted because they own page data.
    const { data: section } = await supabaseAdmin
        .from("sections")
        .select("kind")
        .eq("id", id)
        .maybeSingle();
    if (!section || section.kind !== "custom") return;

    const { error } = await supabaseAdmin.from("sections").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}
