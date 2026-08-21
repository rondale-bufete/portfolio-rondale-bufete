import { createClient } from "@supabase/supabase-js";

// Service-role client. This BYPASSES row level security, so it must
// only ever be imported from server-only code (Server Actions, route
// handlers). Never import this from a "use client" file or expose
// SUPABASE_SERVICE_ROLE_KEY to the browser.
if (typeof window !== "undefined") {
    throw new Error("lib/supabase/admin.js must never be imported on the client.");
}

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: { persistSession: false },
    }
);

export const ASSETS_BUCKET = "portfolio-assets";
const MAX_ASSET_SIZE = 10 * 1024 * 1024;

/**
 * Uploads a File (from a <input type="file"> inside a Server Action's
 * FormData) to the portfolio-assets bucket and returns its public URL.
 * Returns null if no file was provided (so callers can keep the existing
 * image_url unchanged).
 */
export async function uploadAsset(file, folder) {
    if (!file || typeof file === "string" || file.size === 0) return null;

    if (file.size > MAX_ASSET_SIZE) {
        throw new Error(`Upload failed: ${file.name || "File"} is larger than 10 MB.`);
    }

    const contentType = file.type || "application/octet-stream";
    if (!contentType.startsWith("image/") && contentType !== "application/pdf") {
        throw new Error("Upload failed: only image files and PDF documents are supported.");
    }

    const ext = file.name?.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabaseAdmin.storage
        .from(ASSETS_BUCKET)
        .upload(path, file, {
            contentType,
            upsert: false,
        });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabaseAdmin.storage.from(ASSETS_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}
