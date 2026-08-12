"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { composePeriod, parseBullets } from "@/lib/monthYear";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/experience");
}

function buildPatch(formData) {
    const period = composePeriod({
        startMonth: formData.get("start_month"),
        startYear: formData.get("start_year"),
        endMonth: formData.get("end_month"),
        endYear: formData.get("end_year"),
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

export async function createExperienceAction(formData) {
    const { data: existing } = await supabaseAdmin
        .from("experience")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 0;

    const { error } = await supabaseAdmin
        .from("experience")
        .insert({ ...buildPatch(formData), sort_order: nextOrder });
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateExperienceAction(id, formData) {
    const { error } = await supabaseAdmin
        .from("experience")
        .update(buildPatch(formData))
        .eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteExperienceAction(id) {
    const { error } = await supabaseAdmin.from("experience").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}
