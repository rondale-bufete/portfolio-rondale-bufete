"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset, deleteAsset } from "@/lib/supabase/admin";
import { moveItem, nextSortOrder } from "@/lib/supabase/reorder";
import { parseBullets } from "@/lib/monthYear";
import { requireAdmin } from "@/lib/auth";
import { isValidUrl } from "@/lib/validation";

function refresh(id) {
    revalidatePath("/");
    revalidatePath("/admin/projects");
    if (id) revalidatePath(`/projects/${id}`);
}

function parseTags(raw) {
    return (raw || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}

function parseProjectCategory(raw) {
    return (raw || "").toString().trim() || "General";
}

function projectMetaPatch(formData) {
    return {
        provenance: formData.get("provenance")?.toString() || "Personal",
        year: formData.get("year")?.toString() || "",
        role: formData.get("role")?.toString() || "",
        timeline: formData.get("timeline")?.toString() || "",
        outcome: formData.get("outcome")?.toString() || "",
    };
}

function validateUrls({ liveUrl, repoUrl }) {
    if (!isValidUrl(liveUrl)) throw new Error("Live demo URL must be a valid http(s) link.");
    if (!isValidUrl(repoUrl)) throw new Error("Repo URL must be a valid http(s) link.");
}

export async function moveProjectAction(id, direction) {
    await requireAdmin();
    await moveItem("projects", id, direction);
    refresh();
}

export async function createProjectAction(formData) {
    await requireAdmin();

    const liveUrl = formData.get("live_url")?.toString() || "";
    const repoUrl = formData.get("repo_url")?.toString() || "";
    validateUrls({ liveUrl, repoUrl });

    const imageFiles = formData.getAll("images");
    const imageUrls = (await Promise.all(imageFiles.map((file) => uploadAsset(file, "projects")))).filter(Boolean);

    const { error } = await supabaseAdmin.from("projects").insert({
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: parseProjectCategory(formData.get("category")),
        tags: parseTags(formData.get("tags")?.toString()),
        highlights: parseBullets(formData.get("highlights")?.toString()),
        live_url: liveUrl,
        repo_url: repoUrl,
        image_url: imageUrls[0] || "",
        image_urls: imageUrls,
        sort_order: await nextSortOrder("projects"),
        ...projectMetaPatch(formData),
    });
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateProjectAction(id, formData) {
    await requireAdmin();

    const liveUrl = formData.get("live_url")?.toString() || "";
    const repoUrl = formData.get("repo_url")?.toString() || "";
    validateUrls({ liveUrl, repoUrl });

    const imageFiles = formData.getAll("images");
    const imageUrls = (await Promise.all(imageFiles.map((file) => uploadAsset(file, "projects")))).filter(Boolean);

    const patch = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: parseProjectCategory(formData.get("category")),
        tags: parseTags(formData.get("tags")?.toString()),
        highlights: parseBullets(formData.get("highlights")?.toString()),
        live_url: liveUrl,
        repo_url: repoUrl,
        ...projectMetaPatch(formData),
    };

    let previousImageUrls = [];
    if (imageUrls.length > 0) {
        const { data: existing } = await supabaseAdmin
            .from("projects")
            .select("image_urls")
            .eq("id", id)
            .maybeSingle();
        previousImageUrls = existing?.image_urls || [];
        patch.image_url = imageUrls[0];
        patch.image_urls = imageUrls;
    }

    const { error } = await supabaseAdmin.from("projects").update(patch).eq("id", id);
    if (error) throw new Error(error.message);

    await Promise.all(previousImageUrls.map((url) => deleteAsset(url)));

    refresh(id);
}

export async function deleteProjectAction(id) {
    await requireAdmin();

    const { data: existing } = await supabaseAdmin
        .from("projects")
        .select("image_urls")
        .eq("id", id)
        .maybeSingle();

    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await Promise.all((existing?.image_urls || []).map((url) => deleteAsset(url)));

    refresh(id);
}
