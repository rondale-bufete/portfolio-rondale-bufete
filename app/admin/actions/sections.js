"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/sections");
}

export async function moveSectionAction(id, direction) {
    const { data: all } = await supabaseAdmin
        .from("sections")
        .select("id, sort_order")
        .order("sort_order");
    if (!all) return;

    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= all.length) return;

    const current = all[idx];
    const neighbor = all[swapIdx];

    await Promise.all([
        supabaseAdmin.from("sections").update({ sort_order: neighbor.sort_order }).eq("id", current.id),
        supabaseAdmin.from("sections").update({ sort_order: current.sort_order }).eq("id", neighbor.id),
    ]);

    refresh();
}

export async function toggleSectionVisibilityAction(id, currentlyVisible) {
    const { error } = await supabaseAdmin
        .from("sections")
        .update({ visible: !currentlyVisible })
        .eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateSectionMetaAction(id, formData) {
    const patch = {
        label: formData.get("label")?.toString() || "",
        heading: formData.get("heading")?.toString() || "",
    };
    // Only structural sections' forms omit body; custom sections include it.
    if (formData.has("body")) {
        patch.body = formData.get("body")?.toString() || "";
    }

    const { error } = await supabaseAdmin.from("sections").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function createCustomSectionAction(formData) {
    const { data: existing } = await supabaseAdmin
        .from("sections")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 0;

    const { error } = await supabaseAdmin.from("sections").insert({
        kind: "custom",
        label: formData.get("label")?.toString() || "",
        heading: formData.get("heading")?.toString() || "",
        body: formData.get("body")?.toString() || "",
        sort_order: nextOrder,
        visible: true,
    });
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteSectionAction(id) {
    // Guard against deleting structural sections — they should only ever
    // be hidden, since deleting one would leave its data (projects, etc.)
    // with no home on the page.
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
