"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset } from "@/lib/supabase/admin";

async function nextSortOrder() {
    const { data } = await supabaseAdmin
        .from("certifications")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    return data?.[0] ? data[0].sort_order + 1 : 0;
}

export async function createCertificationAction(formData) {
    const imageFile = formData.get("image");
    const pdfFile = formData.get("pdf");

    const [imageUrl, pdfUrl] = await Promise.all([
        uploadAsset(imageFile, "certs"),
        uploadAsset(pdfFile, "certs"),
    ]);

    const { error } = await supabaseAdmin.from("certifications").insert({
        title: formData.get("title")?.toString() || "",
        issuer: formData.get("issuer")?.toString() || "",
        date: formData.get("date")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        url: formData.get("url")?.toString() || "",
        image_url: imageUrl || "",
        pdf_url: pdfUrl || "",
        sort_order: await nextSortOrder(),
    });
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/certifications");
}

export async function updateCertificationAction(id, formData) {
    const imageFile = formData.get("image");
    const pdfFile = formData.get("pdf");

    const [imageUrl, pdfUrl] = await Promise.all([
        uploadAsset(imageFile, "certs"),
        uploadAsset(pdfFile, "certs"),
    ]);

    const patch = {
        title: formData.get("title")?.toString() || "",
        issuer: formData.get("issuer")?.toString() || "",
        date: formData.get("date")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        url: formData.get("url")?.toString() || "",
    };
    if (imageUrl) patch.image_url = imageUrl;
    if (pdfUrl) patch.pdf_url = pdfUrl;

    const { error } = await supabaseAdmin.from("certifications").update(patch).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/certifications");
}

export async function deleteCertificationAction(id) {
    const { error } = await supabaseAdmin.from("certifications").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/certifications");
}
