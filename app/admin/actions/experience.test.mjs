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
vi.mock("@/lib/supabase/admin", () => ({
    supabaseAdmin: { from: (...args) => supabaseFrom(...args) },
}));

const { moveExperienceAction, createExperienceAction, updateExperienceAction, deleteExperienceAction } =
    await import("./experience.js");

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

const baseFields = {
    company: "Acme",
    role: "Engineer",
    location: "Remote",
    company_url: "",
    start: "2024-02",
    end: "2025-08",
    bullets: "Did a thing\nDid another thing",
};

beforeEach(() => {
    supabaseFrom = vi.fn(() => createQueryBuilder({ data: [], error: null }));
});

describe("auth guard", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(false));

    it("blocks every exported action when unauthenticated", async () => {
        await expect(moveExperienceAction("id-1", "up")).rejects.toThrow("Unauthorized.");
        await expect(createExperienceAction(formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
        await expect(updateExperienceAction("id-1", formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
        await expect(deleteExperienceAction("id-1")).rejects.toThrow("Unauthorized.");
        expect(supabaseFrom).not.toHaveBeenCalled();
    });
});

describe("createExperienceAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("composes the period and parses bullets before inserting", async () => {
        const insert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: [{ sort_order: 1 }], error: null });
            builder.insert = insert;
            return builder;
        });

        await createExperienceAction(formDataOf(baseFields));

        expect(insert).toHaveBeenCalledWith(
            expect.objectContaining({
                company: "Acme",
                role: "Engineer",
                period: "Feb 2024 — Aug 2025",
                bullets: ["Did a thing", "Did another thing"],
                sort_order: 2,
            })
        );
    });

    it("composes an open-ended period when is_current is set", async () => {
        const insert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: [], error: null });
            builder.insert = insert;
            return builder;
        });

        await createExperienceAction(formDataOf({ ...baseFields, is_current: "on", end: "" }));

        expect(insert).toHaveBeenCalledWith(expect.objectContaining({ period: "Feb 2024 — Present" }));
    });
});

describe("moveExperienceAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("swaps sort_order with the next item when moving down", async () => {
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

        await moveExperienceAction("a", "down");

        expect(updates).toEqual(expect.arrayContaining([{ sort_order: 0 }, { sort_order: 1 }]));
    });
});
