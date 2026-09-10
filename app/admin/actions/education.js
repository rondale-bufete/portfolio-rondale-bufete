"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { composePeriod, parseBullets } from "@/lib/monthYear";

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

export async function createEducationAction(formData) {
    const { data: existing } = await supabaseAdmin
        .from("education")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 0;

    const { error } = await supabaseAdmin
        .from("education")
        .insert({ ...buildPatch(formData), sort_order: nextOrder });
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateEducationAction(id, formData) {
    const { error } = await supabaseAdmin
        .from("education")
        .update(buildPatch(formData))
        .eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteEducationAction(id) {
    const { error } = await supabaseAdmin.from("education").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}
