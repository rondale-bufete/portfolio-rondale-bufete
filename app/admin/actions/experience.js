"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { moveItem, nextSortOrder } from "@/lib/supabase/reorder";
import { composePeriod, parseBullets } from "@/lib/monthYear";
import { requireAdmin } from "@/lib/auth";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/experience");
}

function buildPatch(formData) {
    const period = composePeriod({
        start: formData.get("start")?.toString(),
        end: formData.get("end")?.toString(),
        isCurrent: formData.get("is_current") === "on",
    });

    return {
        company: formData.get("company")?.toString() || "",
        role: formData.get("role")?.toString() || "",
        location: formData.get("location")?.toString() || "",
        company_url: formData.get("company_url")?.toString() || "",
        period,
        bullets: parseBullets(formData.get("bullets")?.toString()),
    };
}

export async function moveExperienceAction(id, direction) {
    await requireAdmin();
    await moveItem("experience", id, direction);
    refresh();
}

export async function createExperienceAction(formData) {
    await requireAdmin();

    const { error } = await supabaseAdmin
        .from("experience")
        .insert({ ...buildPatch(formData), sort_order: await nextSortOrder("experience") });
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateExperienceAction(id, formData) {
    await requireAdmin();

    const { error } = await supabaseAdmin
        .from("experience")
        .update(buildPatch(formData))
        .eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteExperienceAction(id) {
    await requireAdmin();

    const { error } = await supabaseAdmin.from("experience").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}
