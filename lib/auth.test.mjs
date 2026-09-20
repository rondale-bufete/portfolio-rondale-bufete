import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCookieStore = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
};

vi.mock("next/headers", () => ({
    cookies: () => Promise.resolve(mockCookieStore),
}));

import { checkPassword, isAuthed, requireAdmin, createSession, destroySession, ADMIN_COOKIE_NAME } from "./auth.js";
import { expectedSessionToken } from "./session-token.js";

describe("checkPassword", () => {
    beforeEach(() => {
        process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
    });

    it("accepts the correct password", () => {
        expect(checkPassword("correct-horse-battery-staple")).toBe(true);
    });

    it("rejects an incorrect password", () => {
        expect(checkPassword("wrong")).toBe(false);
    });

    it("rejects an empty password", () => {
        expect(checkPassword("")).toBe(false);
    });
});

describe("isAuthed / requireAdmin", () => {
    beforeEach(() => {
        process.env.ADMIN_SESSION_SECRET = "test-session-secret";
        mockCookieStore.get.mockReset();
        mockCookieStore.set.mockReset();
        mockCookieStore.delete.mockReset();
    });

    it("isAuthed is true when the cookie holds the expected token", async () => {
        mockCookieStore.get.mockReturnValue({ value: expectedSessionToken() });
        await expect(isAuthed()).resolves.toBe(true);
    });

    it("isAuthed is false when the cookie is missing", async () => {
        mockCookieStore.get.mockReturnValue(undefined);
        await expect(isAuthed()).resolves.toBe(false);
    });

    it("isAuthed is false when the cookie holds a forged token", async () => {
        mockCookieStore.get.mockReturnValue({ value: "not-the-real-token" });
        await expect(isAuthed()).resolves.toBe(false);
    });

    it("requireAdmin resolves silently when authenticated", async () => {
        mockCookieStore.get.mockReturnValue({ value: expectedSessionToken() });
        await expect(requireAdmin()).resolves.toBeUndefined();
    });

    it("requireAdmin throws when not authenticated", async () => {
        mockCookieStore.get.mockReturnValue(undefined);
        await expect(requireAdmin()).rejects.toThrow("Unauthorized.");
    });
});

describe("createSession / destroySession", () => {
    beforeEach(() => {
        process.env.ADMIN_SESSION_SECRET = "test-session-secret";
        mockCookieStore.set.mockReset();
        mockCookieStore.delete.mockReset();
    });

    it("createSession sets the signed token as an httpOnly cookie", async () => {
        await createSession();
        expect(mockCookieStore.set).toHaveBeenCalledWith(
            ADMIN_COOKIE_NAME,
            expectedSessionToken(),
            expect.objectContaining({ httpOnly: true, sameSite: "lax" })
        );
    });

    it("destroySession deletes the cookie", async () => {
        await destroySession();
        expect(mockCookieStore.delete).toHaveBeenCalledWith(ADMIN_COOKIE_NAME);
    });
});
