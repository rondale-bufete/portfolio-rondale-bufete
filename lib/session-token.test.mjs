import { describe, it, expect, beforeEach } from "vitest";
import { expectedSessionToken, timingSafeEqualStrings } from "./session-token.js";

describe("expectedSessionToken", () => {
    beforeEach(() => {
        process.env.ADMIN_SESSION_SECRET = "test-secret";
    });

    it("is deterministic for the same secret", () => {
        expect(expectedSessionToken()).toBe(expectedSessionToken());
    });

    it("changes when the secret changes", () => {
        const first = expectedSessionToken();
        process.env.ADMIN_SESSION_SECRET = "a-different-secret";
        expect(expectedSessionToken()).not.toBe(first);
    });
});

describe("timingSafeEqualStrings", () => {
    it("returns true for identical strings", () => {
        expect(timingSafeEqualStrings("abc123", "abc123")).toBe(true);
    });

    it("returns false for different strings of the same length", () => {
        expect(timingSafeEqualStrings("abc123", "abc124")).toBe(false);
    });

    it("returns false for strings of different length", () => {
        expect(timingSafeEqualStrings("short", "a-much-longer-string")).toBe(false);
    });

    it("treats missing values as empty strings rather than throwing", () => {
        expect(timingSafeEqualStrings(undefined, "")).toBe(true);
        expect(timingSafeEqualStrings(undefined, "x")).toBe(false);
    });
});
