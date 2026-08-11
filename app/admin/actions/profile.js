"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, uploadAsset } from "@/lib/supabase/admin";

export async function updateProfileAction(formData) {
    const photoFile = formData.get("photo");
    const resumeFile = formData.get("resume");

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
        email: formData.get("email")?.toString() || "",
        github: formData.get("github")?.toString() || "",
        linkedin: formData.get("linkedin")?.toString() || "",
        resume_url: resumeUrl || formData.get("existing_resume_url")?.toString() || "",
        photo_url: photoUrl || formData.get("existing_photo_url")?.toString() || "",
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("profile").upsert(patch);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin/profile");
    return { success: true };
}
