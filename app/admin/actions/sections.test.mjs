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

const {
    moveSectionAction,
    toggleSectionVisibilityAction,
    updateSectionMetaAction,
    createCustomSectionAction,
    deleteSectionAction,
} = await import("./sections.js");

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

beforeEach(() => {
    supabaseFrom = vi.fn(() => createQueryBuilder({ data: [], error: null }));
});

describe("auth guard", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(false));

    it("blocks every exported action when unauthenticated", async () => {
        await expect(moveSectionAction("id-1", "up")).rejects.toThrow("Unauthorized.");
        await expect(toggleSectionVisibilityAction("id-1", true)).rejects.toThrow("Unauthorized.");
        await expect(updateSectionMetaAction("id-1", formDataOf({ label: "x", heading: "y" }))).rejects.toThrow(
            "Unauthorized."
        );
        await expect(createCustomSectionAction(formDataOf({ label: "x", heading: "y" }))).rejects.toThrow(
            "Unauthorized."
        );
        await expect(deleteSectionAction("id-1")).rejects.toThrow("Unauthorized.");
        expect(supabaseFrom).not.toHaveBeenCalled();
    });
});

describe("deleteSectionAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("refuses to delete a structural (non-custom) section", async () => {
        const del = vi.fn();
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: { kind: "about" }, error: null });
            builder.delete = del;
            return builder;
        });

        await deleteSectionAction("about-id");
        expect(del).not.toHaveBeenCalled();
    });

    it("deletes a custom section", async () => {
        const del = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: { kind: "custom" }, error: null });
            builder.delete = del;
            return builder;
        });

        await deleteSectionAction("custom-id");
        expect(del).toHaveBeenCalled();
    });

    it("no-ops silently when the section doesn't exist", async () => {
        const del = vi.fn();
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.delete = del;
            return builder;
        });

        await deleteSectionAction("missing-id");
        expect(del).not.toHaveBeenCalled();
    });
});

describe("updateSectionMetaAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("omits body from the patch when the form doesn't include it (structural sections)", async () => {
        const update = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.update = update;
            return builder;
        });

        await updateSectionMetaAction("about-id", formDataOf({ label: "About", heading: "About me" }));

        expect(update).toHaveBeenCalledWith({ label: "About", heading: "About me" });
    });

    it("includes body in the patch when the form has it (custom sections)", async () => {
        const update = vi.fn(() => createQueryBuilder({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.update = update;
            return builder;
        });

        await updateSectionMetaAction(
            "custom-id",
            formDataOf({ label: "Testimonials", heading: "What people say", body: "Great work." })
        );

        expect(update).toHaveBeenCalledWith({
            label: "Testimonials",
            heading: "What people say",
            body: "Great work.",
        });
    });
});

describe("moveSectionAction", () => {
    beforeEach(() => mockIsAuthed.mockResolvedValue(true));

    it("does nothing when moving the last item down", async () => {
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

        await moveSectionAction("b", "down");
        expect(update).not.toHaveBeenCalled();
    });
});
