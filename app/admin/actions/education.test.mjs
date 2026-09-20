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

const { moveEducationAction, createEducationAction, updateEducationAction, deleteEducationAction } =
    await import("./education.js");

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

const baseFields = {
    degree: "BS Computer Science",
    school: "State University",
    start: "2020-08",
    end: "2024-05",
    description: "",
    bullets: "",
};

beforeEach(() => {
    supabaseFrom = vi.fn(() => createQueryBuilder({ data: [], error: null }));
});

describe("auth guard", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(false));

    it("blocks every exported action when unauthenticated", async () => {
        await expect(moveEducationAction("id-1", "up")).rejects.toThrow("Unauthorized.");
        await expect(createEducationAction(formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
        await expect(updateEducationAction("id-1", formDataOf(baseFields))).rejects.toThrow("Unauthorized.");
        await expect(deleteEducationAction("id-1")).rejects.toThrow("Unauthorized.");
        expect(supabaseFrom).not.toHaveBeenCalled();
    });
});

describe("createEducationAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("composes the period before inserting", async () => {
        const insert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: [], error: null });
            builder.insert = insert;
            return builder;
        });

        await createEducationAction(formDataOf(baseFields));

        expect(insert).toHaveBeenCalledWith(
            expect.objectContaining({
                degree: "BS Computer Science",
                school: "State University",
                period: "Aug 2020 — May 2024",
                sort_order: 0,
            })
        );
    });
});

describe("updateEducationAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("updates the row with the given id", async () => {
        const update = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.update = update;
            return builder;
        });

        await updateEducationAction("edu-1", formDataOf(baseFields));

        expect(update).toHaveBeenCalledWith(expect.objectContaining({ degree: "BS Computer Science" }));
    });
});
