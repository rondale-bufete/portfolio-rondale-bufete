import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({ supabaseAdmin: {} }));
const { summarizeChatRows } = await import("./chatActivity");

describe("summarizeChatRows", () => {
    it("adds up questions and counts sessions per day inside the window", () => {
        const rows = [
            { day: "2026-11-01", count: 3 },
            { day: "2026-11-01", count: 2 },
            { day: "2026-11-02", count: 4 },
            { day: "2026-10-01", count: 9 },
        ];

        const summary = summarizeChatRows(rows, ["2026-11-01", "2026-11-02", "2026-11-03"]);

        expect(summary.daily).toEqual([
            { date: "2026-11-01", questions: 5, conversations: 2 },
            { date: "2026-11-02", questions: 4, conversations: 1 },
            { date: "2026-11-03", questions: 0, conversations: 0 },
        ]);
        expect(summary.questions).toBe(9);
        expect(summary.conversations).toBe(3);
    });
});
