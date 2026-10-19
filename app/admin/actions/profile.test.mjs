import { describe, it, expect, vi, beforeEach } from "vitest";
import { createQueryBuilder } from "../../../test/mocks/supabase.js";

const mockIsAuthed = vi.fn();
vi.mock("@/lib/auth", () => ({
    requireAdmin: async () => {
        if (!(await mockIsAuthed())) throw new Error("Unauthorized.");
    },
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

let supabaseFrom;
const mockUploadAsset = vi.fn();
const mockDeleteAsset = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
    supabaseAdmin: { from: (...args) => supabaseFrom(...args) },
    uploadAsset: (...args) => mockUploadAsset(...args),
    deleteAsset: (...args) => mockDeleteAsset(...args),
}));

const { updateProfileAction, setChatWidgetVisibilityAction } = await import("./profile.js");
const { revalidatePath } = await import("next/cache");

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

const baseFields = {
    name: "Rondale",
    role: "Developer",
    tagline: "Builds things",
    bio: "Bio",
    email: "r@example.com",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    location: "",
    phone: "",
    open_to: "",
    status_label: "OPEN TO WORK",
    existing_photo_url: "",
    existing_resume_url: "",
};

describe("updateProfileAction auth guard", () => {
    beforeEach(() => {
        mockIsAuthed.mockResolvedValue(false);
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        mockUploadAsset.mockReset();
        mockDeleteAsset.mockReset();
    });

    it("rejects when not authenticated", async () => {
        await expect(updateProfileAction(formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
        expect(supabaseFrom).not.toHaveBeenCalled();
    });
});

describe("updateProfileAction validation", () => {
    beforeEach(() => {
        mockIsAuthed.mockResolvedValue(true);
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        mockUploadAsset.mockReset();
        mockUploadAsset.mockResolvedValue(null);
        mockDeleteAsset.mockReset();
    });

    it("rejects a malformed email", async () => {
        await expect(
            updateProfileAction(formDataOf({ ...baseFields, email: "not-an-email" }))
        ).rejects.toThrow("valid email");
        expect(supabaseFrom).not.toHaveBeenCalled();
    });

    it("rejects a malformed GitHub URL", async () => {
        await expect(
            updateProfileAction(formDataOf({ ...baseFields, github: "not a url" }))
        ).rejects.toThrow("GitHub URL");
    });

    it("rejects a malformed LinkedIn URL", async () => {
        await expect(
            updateProfileAction(formDataOf({ ...baseFields, linkedin: "javascript:alert(1)" }))
        ).rejects.toThrow("LinkedIn URL");
    });

    it("accepts empty optional URL fields", async () => {
        const upsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.upsert = upsert;
            return builder;
        });

        await updateProfileAction(formDataOf({ ...baseFields, github: "", linkedin: "" }));
        expect(upsert).toHaveBeenCalled();
    });
});

describe("updateProfileAction asset replacement", () => {
    beforeEach(() => {
        mockIsAuthed.mockResolvedValue(true);
        mockDeleteAsset.mockReset();
    });

    it("deletes the previous photo/resume when a new one is uploaded", async () => {
        mockUploadAsset.mockReset();
        mockUploadAsset.mockImplementation((_file, folder) =>
            Promise.resolve(`https://cdn.test/${folder}/new.png`)
        );
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: null, error: null }));

        await updateProfileAction(
            formDataOf({
                ...baseFields,
                existing_photo_url: "https://cdn.test/profile/old-photo.png",
                existing_resume_url: "https://cdn.test/profile/old-resume.pdf",
            })
        );

        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/profile/old-photo.png");
        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/profile/old-resume.pdf");
    });

    it("does not delete anything when no new file is uploaded", async () => {
        mockUploadAsset.mockReset();
        mockUploadAsset.mockResolvedValue(null);
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: null, error: null }));

        await updateProfileAction(
            formDataOf({ ...baseFields, existing_photo_url: "https://cdn.test/profile/old-photo.png" })
        );

        expect(mockDeleteAsset).not.toHaveBeenCalled();
    });
});

describe("setChatWidgetVisibilityAction", () => {
    beforeEach(() => {
        mockIsAuthed.mockResolvedValue(true);
        revalidatePath.mockClear();
    });

    it("rejects when not authenticated", async () => {
        mockIsAuthed.mockResolvedValue(false);
        supabaseFrom = vi.fn(() => createQueryBuilder());

        await expect(setChatWidgetVisibilityAction(false)).rejects.toThrow("Unauthorized.");
        expect(supabaseFrom).not.toHaveBeenCalled();
    });

    it("stores the requested state on the profile row and refreshes every public page", async () => {
        const builder = createQueryBuilder({ data: null, error: null });
        supabaseFrom = vi.fn(() => builder);

        await setChatWidgetVisibilityAction(false);

        expect(supabaseFrom).toHaveBeenCalledWith("profile");
        expect(builder.update).toHaveBeenCalledWith({ chat_visible: false });
        expect(builder.eq).toHaveBeenCalledWith("id", 1);
        expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("surfaces a database error, e.g. when the migration hasn't been run", async () => {
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: null, error: { message: "column profile.chat_visible does not exist" } }));

        await expect(setChatWidgetVisibilityAction(true)).rejects.toThrow("chat_visible does not exist");
        expect(revalidatePath).not.toHaveBeenCalled();
    });
});
