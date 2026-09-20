import { createClient } from "@supabase/supabase-js";

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

// Best-effort cleanup for a previously-uploaded asset being replaced or
// dropped. Deliberately never throws — a failed cleanup shouldn't fail the
// save/delete that triggered it, it just leaves one orphaned file instead
// of blocking the admin's actual request.
export async function deleteAsset(url) {
    if (!url || typeof url !== "string") return;

    const marker = `/storage/v1/object/public/${ASSETS_BUCKET}/`;
    const markerIndex = url.indexOf(marker);
    if (markerIndex === -1) return;

    const path = decodeURIComponent(url.slice(markerIndex + marker.length));
    if (!path) return;

    try {
        await supabaseAdmin.storage.from(ASSETS_BUCKET).remove([path]);
    } catch {
        // Swallow — see comment above.
    }
}
