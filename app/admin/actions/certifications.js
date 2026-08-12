"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset } from "@/lib/supabase/admin";
import { formatMonthYear } from "@/lib/monthYear";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/certifications");
}

async function nextSortOrder() {
    const { data } = await supabaseAdmin
        .from("certifications")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
    return data?.[0] ? data[0].sort_order + 1 : 0;
}

function resolvedDate(formData) {
    const composed = formatMonthYear(formData.get("issued_month"), formData.get("issued_year"));
    // Falls back to a hand-typed value (or the previously-stored one) if
    // the month/year pickers are left blank.
    return composed || formData.get("date_fallback")?.toString() || "";
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
        date: resolvedDate(formData),
        credential_id: formData.get("credential_id")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        url: formData.get("url")?.toString() || "",
        image_url: imageUrl || "",
        pdf_url: pdfUrl || "",
        sort_order: await nextSortOrder(),
    });
    if (error) throw new Error(error.message);
    refresh();
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
        date: resolvedDate(formData),
        credential_id: formData.get("credential_id")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        url: formData.get("url")?.toString() || "",
    };
    if (imageUrl) patch.image_url = imageUrl;
    if (pdfUrl) patch.pdf_url = pdfUrl;

    const { error } = await supabaseAdmin.from("certifications").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}

export async function deleteCertificationAction(id) {
    const { error } = await supabaseAdmin.from("certifications").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
}
