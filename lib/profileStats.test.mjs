import { describe, it, expect } from "vitest";
import { parseStatsForm, normalizeStats } from "./profileStats.js";

function formDataOf(fields) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) fd.set(key, value);
    return fd;
}

describe("parseStatsForm", () => {
    it("collects filled rows in order and trims them", () => {
        const stats = parseStatsForm(
            formDataOf({ stat_value_1: " 300+ ", stat_label_1: "subscriber accounts", stat_value_3: "200+", stat_label_3: "automated tests" })
        );
        expect(stats).toEqual([
            { value: "300+", label: "subscriber accounts" },
            { value: "200+", label: "automated tests" },
        ]);
    });

    it("returns an empty list when every row is empty", () => {
        expect(parseStatsForm(formDataOf({ stat_value_1: "", stat_label_1: "  " }))).toEqual([]);
    });

    it("rejects a row with only a number or only a label", () => {
        expect(() => parseStatsForm(formDataOf({ stat_value_2: "60%" }))).toThrow("Headline number 2 needs both a number and a label.");
        expect(() => parseStatsForm(formDataOf({ stat_label_1: "more income" }))).toThrow("Headline number 1");
    });

    it("rejects values and labels that are too long", () => {
        expect(() => parseStatsForm(formDataOf({ stat_value_1: "1234567890123", stat_label_1: "x" }))).toThrow("12 characters");
        expect(() => parseStatsForm(formDataOf({ stat_value_1: "1", stat_label_1: "x".repeat(41) }))).toThrow("40 characters");
    });
});

describe("normalizeStats", () => {
    it("keeps well-formed stats, at most three", () => {
        const stat = (n) => ({ value: String(n), label: `label ${n}` });
        expect(normalizeStats([stat(1), stat(2), stat(3), stat(4)])).toEqual([stat(1), stat(2), stat(3)]);
    });

    it("drops malformed entries and non-array input", () => {
        expect(normalizeStats([{ value: "1" }, { value: 2, label: "x" }, null, { value: "", label: "x" }, { value: "3", label: "ok", extra: true }])).toEqual([
            { value: "3", label: "ok" },
        ]);
        expect(normalizeStats(null)).toEqual([]);
        expect(normalizeStats("[]")).toEqual([]);
    });
});
