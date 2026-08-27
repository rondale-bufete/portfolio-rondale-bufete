"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset } from "@/lib/supabase/admin";
import { parseBullets } from "@/lib/monthYear";

function refresh(id) {
    revalidatePath("/");
    revalidatePath("/admin/projects");
    if (id) revalidatePath(`/projects/${id}`);
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

export async function moveProjectAction(id, direction) {
    const { data: all, error: fetchError } = await supabaseAdmin
        .from("projects")
        .select("id, sort_order")
        .order("sort_order");
    if (fetchError) throw new Error(fetchError.message);
    if (!all) return;

    const index = all.findIndex((project) => project.id === id);
    if (index === -1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= all.length) return;

    const current = all[index];
    const neighbor = all[swapIndex];
    const results = await Promise.all([
        supabaseAdmin.from("projects").update({ sort_order: neighbor.sort_order }).eq("id", current.id),
        supabaseAdmin.from("projects").update({ sort_order: current.sort_order }).eq("id", neighbor.id),
    ]);
    const updateError = results.find(({ error }) => error)?.error;
    if (updateError) throw new Error(updateError.message);

    refresh();
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
    refresh(id);
}

export async function deleteProjectAction(id) {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh(id);
}
