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

const { moveProjectAction, createProjectAction, updateProjectAction, deleteProjectAction } = await import(
    "./projects.js"
);

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

const baseFields = {
    title: "My Project",
    description: "Does things",
    category: "Front-end",
    tags: "Next.js, Tailwind",
    provenance: "Personal",
    year: "2026",
    role: "",
    timeline: "",
    outcome: "",
    highlights: "",
    live_url: "",
    repo_url: "",
};

beforeEach(() => {
    mockUploadAsset.mockReset();
    mockUploadAsset.mockResolvedValue(null);
    mockDeleteAsset.mockReset();
    supabaseFrom = vi.fn(() => createQueryBuilder({ data: [], error: null }));
});

describe("auth guard", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(false));

    it("moveProjectAction rejects when unauthenticated", async () => {
        await expect(moveProjectAction("id-1", "up")).rejects.toThrow("Unauthorized.");
        expect(supabaseFrom).not.toHaveBeenCalled();
    });

    it("createProjectAction rejects when unauthenticated", async () => {
        await expect(createProjectAction(formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
    });

    it("updateProjectAction rejects when unauthenticated", async () => {
        await expect(updateProjectAction("id-1", formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
    });

    it("deleteProjectAction rejects when unauthenticated", async () => {
        await expect(deleteProjectAction("id-1")).rejects.toThrow("Unauthorized.");
    });
});

describe("URL validation", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("createProjectAction rejects a malformed live_url", async () => {
        await expect(
            createProjectAction(formDataOf({ ...baseFields, live_url: "not a url" }))
        ).rejects.toThrow("Live demo URL");
    });

    it("createProjectAction rejects a malformed repo_url", async () => {
        await expect(
            createProjectAction(formDataOf({ ...baseFields, repo_url: "javascript:alert(1)" }))
        ).rejects.toThrow("Repo URL");
    });

    it("accepts valid http(s) URLs", async () => {
        const insert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn((table) => {
            const builder = createQueryBuilder({ data: [], error: null });
            if (table === "projects") builder.insert = insert;
            return builder;
        });

        await createProjectAction(
            formDataOf({ ...baseFields, live_url: "https://example.com", repo_url: "https://github.com/x/y" })
        );
        expect(insert).toHaveBeenCalled();
    });
});

describe("moveProjectAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("swaps sort_order with the previous item when moving up", async () => {
        const updates = [];
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({
                data: [
                    { id: "a", sort_order: 0 },
                    { id: "b", sort_order: 1 },
                ],
                error: null,
            });
            builder.update = (patch) => {
                updates.push(patch);
                return builder;
            };
            return builder;
        });

        await moveProjectAction("b", "up");

        expect(updates).toEqual(expect.arrayContaining([{ sort_order: 0 }, { sort_order: 1 }]));
    });

    it("does nothing when moving the first item up", async () => {
        const update = vi.fn(() => createQueryBuilder());
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({
                data: [
                    { id: "a", sort_order: 0 },
                    { id: "b", sort_order: 1 },
                ],
                error: null,
            });
            builder.update = update;
            return builder;
        });

        await moveProjectAction("a", "up");
        expect(update).not.toHaveBeenCalled();
    });
});

describe("createProjectAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("inserts with the next sort_order and parsed tags/highlights", async () => {
        const insert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn((table) => {
            if (table === "projects") {
                const builder = createQueryBuilder({ data: [{ sort_order: 4 }], error: null });
                builder.insert = insert;
                return builder;
            }
            return createQueryBuilder({ data: [], error: null });
        });

        await createProjectAction(
            formDataOf({ ...baseFields, tags: "Next.js, Tailwind CSS", highlights: "Line one\nLine two" })
        );

        expect(insert).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "My Project",
                tags: ["Next.js", "Tailwind CSS"],
                highlights: ["Line one", "Line two"],
                sort_order: 5,
            })
        );
    });
});

describe("updateProjectAction image cleanup", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("deletes the previous images when new ones are uploaded", async () => {
        mockUploadAsset.mockResolvedValue("https://cdn.test/projects/new.png");

        supabaseFrom = vi.fn((table) => {
            const builder = createQueryBuilder({
                data: { image_urls: ["https://cdn.test/projects/old1.png", "https://cdn.test/projects/old2.png"] },
                error: null,
            });
            builder.update = vi.fn(() => createQueryBuilder({ data: null, error: null }));
            return builder;
        });

        const fd = formDataOf(baseFields);
        fd.append("images", new File(["x"], "new.png", { type: "image/png" }));

        await updateProjectAction("id-1", fd);

        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/projects/old1.png");
        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/projects/old2.png");
    });

    it("keeps existing images and deletes nothing when no new images are uploaded", async () => {
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.update = vi.fn(() => createQueryBuilder({ data: null, error: null }));
            return builder;
        });

        await updateProjectAction("id-1", formDataOf(baseFields));

        expect(mockDeleteAsset).not.toHaveBeenCalled();
    });
});

describe("deleteProjectAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("deletes the row and cleans up its stored images", async () => {
        const del = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({
                data: { image_urls: ["https://cdn.test/projects/a.png"] },
                error: null,
            });
            builder.delete = del;
            return builder;
        });

        await deleteProjectAction("id-1");

        expect(mockDeleteAsset).toHaveBeenCalledWith("https://cdn.test/projects/a.png");
    });
});
