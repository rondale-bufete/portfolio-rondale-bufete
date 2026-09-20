"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset, deleteAsset } from "@/lib/supabase/admin";
import { moveItem, nextSortOrder } from "@/lib/supabase/reorder";
import { monthValueToDisplay } from "@/lib/monthYear";
import { requireAdmin } from "@/lib/auth";
import { isValidUrl } from "@/lib/validation";

function refresh() {
    revalidatePath("/");
    revalidatePath("/admin/certifications");
}

export async function moveCertificationAction(id, direction) {
    await requireAdmin();
    await moveItem("certifications", id, direction);
    refresh();
}

export async function createCertificationAction(formData) {
    await requireAdmin();

    const url = formData.get("url")?.toString() || "";
    if (!isValidUrl(url)) throw new Error("Verification URL must be a valid http(s) link.");

    const imageFile = formData.get("image");
    const pdfFile = formData.get("pdf");

    const [imageUrl, pdfUrl] = await Promise.all([
        uploadAsset(imageFile, "certs"),
        uploadAsset(pdfFile, "certs"),
    ]);

    const { error } = await supabaseAdmin.from("certifications").insert({
        title: formData.get("title")?.toString() || "",
        issuer: formData.get("issuer")?.toString() || "",
        date: monthValueToDisplay(formData.get("issued")?.toString()),
        credential_id: formData.get("credential_id")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        url,
        image_url: imageUrl || "",
        pdf_url: pdfUrl || "",
        sort_order: await nextSortOrder("certifications"),
    });
    if (error) throw new Error(error.message);
    refresh();
}

export async function updateCertificationAction(id, formData) {
    await requireAdmin();

    const url = formData.get("url")?.toString() || "";
    if (!isValidUrl(url)) throw new Error("Verification URL must be a valid http(s) link.");

    const imageFile = formData.get("image");
    const pdfFile = formData.get("pdf");

    const [imageUrl, pdfUrl] = await Promise.all([
        uploadAsset(imageFile, "certs"),
        uploadAsset(pdfFile, "certs"),
    ]);

    const patch = {
        title: formData.get("title")?.toString() || "",
        issuer: formData.get("issuer")?.toString() || "",
        date: monthValueToDisplay(formData.get("issued")?.toString()),
        credential_id: formData.get("credential_id")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        url,
    };

    let previousImageUrl = null;
    let previousPdfUrl = null;
    if (imageUrl || pdfUrl) {
        const { data: existing } = await supabaseAdmin
            .from("certifications")
            .select("image_url, pdf_url")
            .eq("id", id)
            .maybeSingle();
        if (imageUrl) {
            previousImageUrl = existing?.image_url;
            patch.image_url = imageUrl;
        }
        if (pdfUrl) {
            previousPdfUrl = existing?.pdf_url;
            patch.pdf_url = pdfUrl;
        }
    }

    const { error } = await supabaseAdmin.from("certifications").update(patch).eq("id", id);
    if (error) throw new Error(error.message);

    await Promise.all([previousImageUrl, previousPdfUrl].filter(Boolean).map((url) => deleteAsset(url)));

    refresh();
}

export async function deleteCertificationAction(id) {
    await requireAdmin();

    const { data: existing } = await supabaseAdmin
        .from("certifications")
        .select("image_url, pdf_url")
        .eq("id", id)
        .maybeSingle();

    const { error } = await supabaseAdmin.from("certifications").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await Promise.all([deleteAsset(existing?.image_url), deleteAsset(existing?.pdf_url)]);

    refresh();
}
