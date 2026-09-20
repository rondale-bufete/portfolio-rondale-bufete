import { describe, it, expect } from "vitest";
import { monthValueToDisplay, displayToMonthValue, splitPeriod, composePeriod, parseBullets } from "./monthYear.js";

describe("monthValueToDisplay", () => {
    it("formats a native month input value", () => {
        expect(monthValueToDisplay("2024-02")).toBe("Feb 2024");
        expect(monthValueToDisplay("2024-12")).toBe("Dec 2024");
    });

    it("returns an empty string for missing or malformed input", () => {
        expect(monthValueToDisplay("")).toBe("");
        expect(monthValueToDisplay(undefined)).toBe("");
        expect(monthValueToDisplay("2024")).toBe("");
        expect(monthValueToDisplay("2024-13")).toBe("");
        expect(monthValueToDisplay("2024-00")).toBe("");
    });
});

describe("displayToMonthValue", () => {
    it("parses the normal 'Mon YYYY' display format", () => {
        expect(displayToMonthValue("Feb 2024")).toBe("2024-02");
        expect(displayToMonthValue("December 2019")).toBe("2019-12");
    });

    it("falls back to a bare year when the month can't be parsed", () => {
        expect(displayToMonthValue("2019")).toBe("2019-01");
        expect(displayToMonthValue("2022 — 2026")).toBe("2022-01");
    });

    it("returns an empty string for empty input", () => {
        expect(displayToMonthValue("")).toBe("");
        expect(displayToMonthValue(undefined)).toBe("");
    });
});

describe("splitPeriod", () => {
    it("splits a closed range into start/end picker values", () => {
        expect(splitPeriod("Feb 2024 — Aug 2025")).toEqual({
            start: "2024-02",
            end: "2025-08",
            isCurrent: false,
        });
    });

    it("recognizes an open-ended 'Present' range", () => {
        expect(splitPeriod("Feb 2024 — Present")).toEqual({
            start: "2024-02",
            end: "",
            isCurrent: true,
        });
    });

    it("returns empty values for a missing period", () => {
        expect(splitPeriod("")).toEqual({ start: "", end: "", isCurrent: false });
        expect(splitPeriod(undefined)).toEqual({ start: "", end: "", isCurrent: false });
    });
});

describe("composePeriod", () => {
    it("builds a closed range from two picker values", () => {
        expect(
            composePeriod({ start: "2024-02", end: "2025-08", isCurrent: false })
        ).toBe("Feb 2024 — Aug 2025");
    });

    it("builds an open-ended range when isCurrent is set", () => {
        expect(composePeriod({ start: "2024-02", end: "", isCurrent: true })).toBe(
            "Feb 2024 — Present"
        );
    });

    it("returns just the start when there is no end", () => {
        expect(composePeriod({ start: "2024-02", end: "", isCurrent: false })).toBe("Feb 2024");
    });

    it("returns just the end when there is no start", () => {
        expect(composePeriod({ start: "", end: "2025-08", isCurrent: false })).toBe("Aug 2025");
    });

    it("returns an empty string when both sides are empty", () => {
        expect(composePeriod({ start: "", end: "", isCurrent: false })).toBe("");
    });
});

describe("parseBullets", () => {
    it("splits a textarea's lines into trimmed, non-empty bullets", () => {
        expect(parseBullets("First\n  Second  \n\nThird")).toEqual(["First", "Second", "Third"]);
    });

    it("returns an empty array for empty/missing input", () => {
        expect(parseBullets("")).toEqual([]);
        expect(parseBullets(undefined)).toEqual([]);
    });
});
