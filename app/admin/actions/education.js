"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { moveItem, nextSortOrder } from "@/lib/supabase/reorder";
import { composePeriod, parseBullets } from "@/lib/monthYear";
import { requireAdmin } from "@/lib/auth";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/education");
}

function buildPatch(formData) {
    const period = composePeriod({
        start: formData.get("start")?.toString(),
        end: formData.get("end")?.toString(),
        isCurrent: formData.get("is_current") === "on",
    });

    return {
        degree: formData.get("degree")?.toString() || "",
        school: formData.get("school")?.toString() || "",
        period,
        description: formData.get("description")?.toString() || "",
        bullets: parseBullets(formData.get("bullets")?.toString()),
    };
}

export async function moveEducationAction(id, direction) {
    await requireAdmin();
    await moveItem("education", id, direction);
    refresh();
}

export async function createEducationAction(formData) {
    await requireAdmin();

    const { error } = await supabaseAdmin
        .from("education")
        .insert({ ...buildPatch(formData), sort_order: await nextSortOrder("education") });
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateEducationAction(id, formData) {
    await requireAdmin();

    const { error } = await supabaseAdmin
        .from("education")
        .update(buildPatch(formData))
        .eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteEducationAction(id) {
    await requireAdmin();

    const { error } = await supabaseAdmin.from("education").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}
