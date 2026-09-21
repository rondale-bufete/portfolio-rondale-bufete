import { describe, it, expect } from "vitest";
import { stripProtocol } from "./format.js";

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
