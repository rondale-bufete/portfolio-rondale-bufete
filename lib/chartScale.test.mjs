import { describe, it, expect } from "vitest";
import { formatCount, niceTicks, shortDate } from "./chartScale";

describe("niceTicks", () => {
    it("rounds the axis to clean steps", () => {
        expect(niceTicks(14)).toEqual([0, 5, 10, 15]);
        expect(niceTicks(380)).toEqual([0, 100, 200, 300, 400]);
        expect(niceTicks(3)).toEqual([0, 1, 2, 3]);
    });

    it("still draws an axis with no data", () => {
        expect(niceTicks(0)).toEqual([0, 1]);
    });
});

describe("formatCount", () => {
    it("writes small numbers in full and big ones compact", () => {
        expect(formatCount(1284)).toBe("1,284");
        expect(formatCount(12900)).toBe("12.9K");
    });
});

describe("shortDate", () => {
    it("labels a day without shifting it across time zones", () => {
        expect(shortDate("2026-11-05")).toBe("Nov 5");
    });
});
