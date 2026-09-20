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

const {
    moveCertificationAction,
    createCertificationAction,
    updateCertificationAction,
    deleteCertificationAction,
} = await import("./certifications.js");

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

const baseFields = {
    title: "AWS SAA",
    issuer: "AWS",
    issued: "2025-03",
    credential_id: "",
    description: "",
    url: "",
};

beforeEach(() => {
    mockUploadAsset.mockReset();
    mockUploadAsset.mockResolvedValue(null);
    mockDeleteAsset.mockReset();
    supabaseFrom = vi.fn(() => createQueryBuilder({ data: [], error: null }));
});

describe("auth guard", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(false));

    it("blocks every exported action when unauthenticated", async () => {
        await expect(moveCertificationAction("id-1", "up")).rejects.toThrow("Unauthorized.");
        await expect(createCertificationAction(formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
        await expect(updateCertificationAction("id-1", formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
        await expect(deleteCertificationAction("id-1")).rejects.toThrow("Unauthorized.");
    });
});

describe("URL validation", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("rejects a malformed verification URL", async () => {
        await expect(
            createCertificationAction(formDataOf({ ...baseFields, url: "not a url" }))
        ).rejects.toThrow("Verification URL");
    });
});

describe("updateCertificationAction asset replacement", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("deletes the previous image/pdf only for the file(s) actually replaced", async () => {
        mockUploadAsset.mockImplementation((file, folder) =>
            file?.name === "badge.png" ? Promise.resolve(`https://cdn.test/${folder}/badge.png`) : Promise.resolve(null)
        );

        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({
                data: { image_url: "https://cdn.test/certs/old-badge.png", pdf_url: "https://cdn.test/certs/old.pdf" },
                error: null,
            });
            builder.update = vi.fn(() => createQueryBuilder({ data: null, error: null }));
            return builder;
        });

        const fd = formDataOf(baseFields);
        fd.set("image", new File(["x"], "badge.png", { type: "image/png" }));

        await updateCertificationAction("id-1", fd);

        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/certs/old-badge.png");
        expect(mockDeleteAsset).not.toHaveBeenCalledWith("https://cdn.test/certs/old.pdf");
    });

    it("deletes nothing when no new files are uploaded", async () => {
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.update = vi.fn(() => createQueryBuilder({ data: null, error: null }));
            return builder;
        });

        await updateCertificationAction("id-1", formDataOf(baseFields));
        expect(mockDeleteAsset).not.toHaveBeenCalled();
    });
});

describe("deleteCertificationAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("deletes the row and cleans up its image and pdf", async () => {
        const del = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({
                data: { image_url: "https://cdn.test/certs/a.png", pdf_url: "https://cdn.test/certs/a.pdf" },
                error: null,
            });
            builder.delete = del;
            return builder;
        });

        await deleteCertificationAction("id-1");

        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/certs/a.png");
        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/certs/a.pdf");
    });
});
