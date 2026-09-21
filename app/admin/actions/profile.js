"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset, deleteAsset } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { isValidEmail, isValidUrl } from "@/lib/validation";

export async function updateProfileAction(formData) {
    await requireAdmin();

    const email = formData.get("email")?.toString() || "";
    const github = formData.get("github")?.toString() || "";
    const linkedin = formData.get("linkedin")?.toString() || "";
    const facebook = formData.get("facebook")?.toString() || "";
    const instagram = formData.get("instagram")?.toString() || "";

    if (!isValidEmail(email)) throw new Error("Please enter a valid email address.");
    if (!isValidUrl(github)) throw new Error("GitHub URL must be a valid http(s) link.");
    if (!isValidUrl(linkedin)) throw new Error("LinkedIn URL must be a valid http(s) link.");
    if (!isValidUrl(facebook)) throw new Error("Facebook URL must be a valid http(s) link.");
    if (!isValidUrl(instagram)) throw new Error("Instagram URL must be a valid http(s) link.");

    const photoFile = formData.get("photo");
    const resumeFile = formData.get("resume");
    const existingPhotoUrl = formData.get("existing_photo_url")?.toString() || "";
    const existingResumeUrl = formData.get("existing_resume_url")?.toString() || "";

    const [photoUrl, resumeUrl] = await Promise.all([
        uploadAsset(photoFile, "profile"),
        uploadAsset(resumeFile, "profile"),
    ]);

    const patch = {
        id: 1,
        name: formData.get("name")?.toString() || "",
        role: formData.get("role")?.toString() || "",
        tagline: formData.get("tagline")?.toString() || "",
        bio: formData.get("bio")?.toString() || "",
        email,
        github,
        linkedin,
        facebook,
        instagram,
        resume_url: resumeUrl || existingResumeUrl,
        photo_url: photoUrl || existingPhotoUrl,
        location: formData.get("location")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        open_to: formData.get("open_to")?.toString() || "",
        status_label: formData.get("status_label")?.toString() || "OPEN TO WORK",
        available: formData.get("available") === "on",
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("profile").upsert(patch);
    if (error) throw new Error(error.message);

    if (photoUrl && existingPhotoUrl && photoUrl !== existingPhotoUrl) {
        await deleteAsset(existingPhotoUrl);
    }
    if (resumeUrl && existingResumeUrl && resumeUrl !== existingResumeUrl) {
        await deleteAsset(existingResumeUrl);
    }

    revalidatePath("/");
    revalidatePath("/admin/profile");
}
