import { describe, it, expect, vi, beforeEach } from "vitest";
import { createQueryBuilder } from "../test/mocks/supabase.js";

let supabaseFrom;
vi.mock("@/lib/supabase/admin", () => ({
    supabaseAdmin: { from: (...args) => supabaseFrom(...args) },
}));

const { checkAndIncrementRateLimit } = await import("./chatRateLimit.js");

describe("checkAndIncrementRateLimit", () => {
    beforeEach(() => {
        process.env.CHAT_DAILY_LIMIT = "15";
    });

    it("allows a first-time session and increments the count", async () => {
        const upsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: null, error: null });
            builder.upsert = upsert;
            return builder;
        });

        const result = await checkAndIncrementRateLimit("session-1");

        expect(result).toEqual({ allowed: true, remaining: 14 });
        expect(upsert).toHaveBeenCalledWith(
            expect.objectContaining({ session_id: "session-1", count: 1 }),
            { onConflict: "session_id,day" }
        );
    });

    it("allows a session under the limit and reports remaining count", async () => {
        supabaseFrom = vi.fn(() => createQueryBuilder({ data: { count: 10 }, error: null }));

        const result = await checkAndIncrementRateLimit("session-2");

        expect(result).toEqual({ allowed: true, remaining: 4 });
    });

    it("blocks a session that has hit the daily limit without writing", async () => {
        const upsert = vi.fn();
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: { count: 15 }, error: null });
            builder.upsert = upsert;
            return builder;
        });

        const result = await checkAndIncrementRateLimit("session-3");

        expect(result).toEqual({ allowed: false, remaining: 0 });
        expect(upsert).not.toHaveBeenCalled();
    });

    it("throws when the read fails", async () => {
        supabaseFrom = vi.fn(() =>
            createQueryBuilder({ data: null, error: { message: "db down" } })
        );

        await expect(checkAndIncrementRateLimit("session-4")).rejects.toThrow("db down");
    });

    it("throws when the write fails", async () => {
        supabaseFrom = vi.fn(() => {
            const builder = createQueryBuilder({ data: { count: 0 }, error: null });
            builder.upsert = vi.fn(() => Promise.resolve({ data: null, error: { message: "write failed" } }));
            return builder;
        });

        await expect(checkAndIncrementRateLimit("session-5")).rejects.toThrow("write failed");
    });
});
