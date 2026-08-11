"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createEducationAction(formData) {
    const { data: existing } = await supabaseAdmin
        .from("education")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 0;

    const { error } = await supabaseAdmin.from("education").insert({
        degree: formData.get("degree")?.toString() || "",
        school: formData.get("school")?.toString() || "",
        period: formData.get("period")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        sort_order: nextOrder,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/education");
}

export async function updateEducationAction(id, formData) {
    const { error } = await supabaseAdmin
        .from("education")
        .update({
            degree: formData.get("degree")?.toString() || "",
            school: formData.get("school")?.toString() || "",
            period: formData.get("period")?.toString() || "",
            description: formData.get("description")?.toString() || "",
        })
        .eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/education");
}

export async function deleteEducationAction(id) {
    const { error } = await supabaseAdmin.from("education").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/education");
}
