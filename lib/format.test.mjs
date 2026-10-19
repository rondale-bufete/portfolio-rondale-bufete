import { describe, it, expect } from "vitest";
import { stripProtocol, splitParagraphs, truncate, initials } from "./format.js";

describe("stripProtocol", () => {
    it("strips https:// and www.", () => {
        expect(stripProtocol("https://www.linkedin.com/in/example")).toBe("linkedin.com/in/example");
    });

    it("strips http:// without www.", () => {
        expect(stripProtocol("http://github.com/example")).toBe("github.com/example");
    });

    it("strips www. even without a protocol", () => {
        expect(stripProtocol("www.instagram.com/example")).toBe("instagram.com/example");
    });

    it("leaves a bare domain untouched", () => {
        expect(stripProtocol("facebook.com/example")).toBe("facebook.com/example");
    });

    it("returns an empty string for empty/missing input", () => {
        expect(stripProtocol("")).toBe("");
        expect(stripProtocol(undefined)).toBe("");
        expect(stripProtocol(null)).toBe("");
    });
});

describe("splitParagraphs", () => {
    it("splits on blank lines and trims each paragraph", () => {
        expect(splitParagraphs("  First.\n\n  Second.\n \nThird.")).toEqual(["First.", "Second.", "Third."]);
    });

    it("keeps single line breaks inside a paragraph", () => {
        expect(splitParagraphs("Line one\nline two")).toEqual(["Line one\nline two"]);
    });

    it("returns an empty array for empty/missing input", () => {
        expect(splitParagraphs("")).toEqual([]);
        expect(splitParagraphs(null)).toEqual([]);
        expect(splitParagraphs("\n\n  \n")).toEqual([]);
    });
});

describe("truncate", () => {
    it("returns short text unchanged, with whitespace collapsed", () => {
        expect(truncate("Hello\n  world")).toBe("Hello world");
    });

    it("cuts long text on a word boundary and adds an ellipsis", () => {
        const result = truncate("one two three four five", 12);
        expect(result).toBe("one two…");
        expect(result.length).toBeLessThanOrEqual(12);
    });

    it("drops trailing punctuation before the ellipsis", () => {
        expect(truncate("alpha, beta gamma delta", 12)).toBe("alpha, beta…");
        expect(truncate("alpha beta, gamma delta", 12)).toBe("alpha beta…");
    });

    it("returns an empty string for empty/missing input", () => {
        expect(truncate(undefined)).toBe("");
    });
});

describe("initials", () => {
    it("uses the first and last name", () => {
        expect(initials("Rondale Rae Bufete")).toBe("RB");
    });

    it("handles a single name and empty input", () => {
        expect(initials("rondale")).toBe("R");
        expect(initials("")).toBe("");
        expect(initials(null)).toBe("");
    });
});
