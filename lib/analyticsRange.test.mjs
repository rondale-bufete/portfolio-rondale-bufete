import { describe, it, expect } from "vitest";
import { parseRange, percentChange, rangeWindows } from "./analyticsRange";

describe("parseRange", () => {
    it("accepts the offered ranges and falls back to 7 days", () => {
        expect(parseRange("30")).toBe(30);
        expect(parseRange("7")).toBe(7);
        expect(parseRange("365")).toBe(7);
        expect(parseRange(undefined)).toBe(7);
    });
});

describe("rangeWindows", () => {
    it("ends today and puts an equal window just before it", () => {
        const windows = rangeWindows(7, new Date("2026-11-05T21:30:00+08:00"));
        expect(windows.current).toMatchObject({ since: "2026-10-30", until: "2026-11-05" });
        expect(windows.current.dates).toHaveLength(7);
        expect(windows.current.dates.at(-1)).toBe("2026-11-05");
        expect(windows.previous).toMatchObject({ since: "2026-10-23", until: "2026-10-29" });
    });
});

describe("percentChange", () => {
    it("rounds the change and skips comparisons with nothing before", () => {
        expect(percentChange(150, 100)).toBe(50);
        expect(percentChange(75, 100)).toBe(-25);
        expect(percentChange(10, 0)).toBeNull();
    });
});
