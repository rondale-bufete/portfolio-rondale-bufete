"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset } from "@/lib/supabase/admin";
import { parseBullets } from "@/lib/monthYear";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/projects");
}

async function nextSortOrder() {
    const { data } = await supabaseAdmin
        .from("projects")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    return data?.[0] ? data[0].sort_order + 1 : 0;
}

function parseTags(raw) {
    return (raw || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}

export async function createProjectAction(formData) {
    const imageFile = formData.get("image");
    const imageUrl = await uploadAsset(imageFile, "projects");

    const { error } = await supabaseAdmin.from("projects").insert({
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        tags: parseTags(formData.get("tags")?.toString()),
        highlights: parseBullets(formData.get("highlights")?.toString()),
        live_url: formData.get("live_url")?.toString() || "",
        repo_url: formData.get("repo_url")?.toString() || "",
        image_url: imageUrl || "",
        sort_order: await nextSortOrder(),
    });
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateProjectAction(id, formData) {
    const imageFile = formData.get("image");
    const imageUrl = await uploadAsset(imageFile, "projects");

    const patch = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        tags: parseTags(formData.get("tags")?.toString()),
        highlights: parseBullets(formData.get("highlights")?.toString()),
        live_url: formData.get("live_url")?.toString() || "",
        repo_url: formData.get("repo_url")?.toString() || "",
    };
    if (imageUrl) patch.image_url = imageUrl;

    const { error } = await supabaseAdmin.from("projects").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteProjectAction(id) {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}
