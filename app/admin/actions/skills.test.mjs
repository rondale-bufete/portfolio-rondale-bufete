import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock, createQueryBuilder } from "../../../test/mocks/supabase.js";

const mockIsAuthed = vi.fn();
vi.mock("@/lib/auth", () => ({
    requireAdmin: async () => {
        if (!(await mockIsAuthed())) throw new Error("Unauthorized.");
    },
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

let supabaseFrom;
vi.mock("@/lib/supabase/admin", () => ({
    supabaseAdmin: { from: (...args) => supabaseFrom(...args) },
}));

const { createSkillCategoryAction, createSkillItemAction } = await import("./skills.js");

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

describe("skills actions auth guard", () => {
    beforeEach(() => {
        mockIsAuthed.mockReset();
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: [], error: null }));
    });

    it("createSkillCategoryAction rejects when not authenticated", async () => {
        mockIsAuthed.mockResolvedValue(false);
        await expect(createSkillCategoryAction(formDataOf({ category: "Databases" }))).rejects.toThrow(
            "Unauthorized."
        );
        expect(supabaseFrom).not.toHaveBeenCalled();
    });

    it("createSkillItemAction rejects when not authenticated", async () => {
        mockIsAuthed.mockResolvedValue(false);
        await expect(createSkillItemAction("cat-1", formDataOf({ name: "Redis" }))).rejects.toThrow(
            "Unauthorized."
        );
        expect(supabaseFrom).not.toHaveBeenCalled();
    });
});

describe("skills actions validation", () => {
    beforeEach(() => {
        mockIsAuthed.mockResolvedValue(true);
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: [], error: null }));
    });

    it("createSkillCategoryAction rejects an empty/whitespace-only name instead of silently no-opping", async () => {
        await expect(createSkillCategoryAction(formDataOf({ category: "   " }))).rejects.toThrow(
            "Category name can't be empty."
        );
        expect(supabaseFrom).not.toHaveBeenCalled();
    });

    it("createSkillItemAction rejects an empty/whitespace-only name instead of silently no-opping", async () => {
        await expect(createSkillItemAction("cat-1", formDataOf({ name: "  " }))).rejects.toThrow(
            "Skill name can't be empty."
        );
        expect(supabaseFrom).not.toHaveBeenCalled();
    });

    it("createSkillCategoryAction inserts a trimmed category with the next sort order", async () => {
        const insert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn((table) => {
            if (table === "skill_categories") {
                const builder = createQueryBuilder({ data: [{ sort_order: 2 }], error: null });
                builder.insert = insert;
                return builder;
            }
            return createQueryBuilder({ data: [], error: null });
        });

        await createSkillCategoryAction(formDataOf({ category: "  Databases  " }));

        expect(insert).toHaveBeenCalledWith({ category: "Databases", sort_order: 3 });
    });
});
