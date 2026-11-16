import { describe, it, expect, vi } from "vitest";
import {
    getContributionCalendarRange,
    getContributionMonthLabels,
    getGitHubContributions,
    parseContributionYear,
    parseGitHubUsername,
} from "./githubContributions.js";

const githubUrl = "https://github.com/rondale-bufete";

function graphqlResponse(calendar, createdAt = "2015-01-01T00:00:00Z") {
    return {
        ok: true,
        json: async () => ({ data: { user: { createdAt, contributionsCollection: { contributionCalendar: calendar } } } }),
    };
}

describe("parseGitHubUsername", () => {
    it("accepts a GitHub profile URL and rejects other hosts or repository URLs", () => {
        expect(parseGitHubUsername("https://www.github.com/rondale-bufete/")).toBe("rondale-bufete");
        expect(parseGitHubUsername("https://github.com/rondale-bufete/portfolio")).toBeNull();
        expect(parseGitHubUsername("https://github.com.evil.example/rondale-bufete")).toBeNull();
    });
});

describe("getContributionCalendarRange", () => {
    it("returns a full calendar year or the current year through today", () => {
        expect(getContributionCalendarRange(new Date("2025-06-15T17:00:00Z"), 2024)).toEqual({
            from: "2024-01-01T00:00:00Z",
            to: "2024-12-31T23:59:59Z",
        });
        expect(getContributionCalendarRange(new Date("2025-06-15T17:00:00Z"), 2025)).toEqual({
            from: "2025-01-01T00:00:00Z",
            to: "2025-06-15T23:59:59Z",
        });
    });
});

describe("parseContributionYear", () => {
    it("falls back to the current year for malformed or future selections", () => {
        const now = new Date("2025-06-15T00:00:00Z");
        expect(parseContributionYear("2024", now)).toBe(2024);
        expect(parseContributionYear("20xx", now)).toBe(2025);
        expect(parseContributionYear("2026", now)).toBe(2025);
    });
});

describe("getGitHubContributions", () => {
    it("does not make a request when the server token is missing", async () => {
        const fetchImpl = vi.fn();
        const result = await getGitHubContributions(githubUrl, { env: {}, fetchImpl });

        expect(result).toMatchObject({ available: false, username: "rondale-bufete" });
        expect(result.message).toContain("GITHUB_TOKEN");
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it("requests and normalizes contribution calendar data without exposing the token", async () => {
        const fetchImpl = vi.fn().mockResolvedValue(
            graphqlResponse({
                totalContributions: 12,
                weeks: [
                    {
                        contributionDays: [
                            { date: "2024-01-03", contributionCount: 3, contributionLevel: "SECOND_QUARTILE", weekday: 3 },
                        ],
                    },
                ],
            })
        );
        const result = await getGitHubContributions(githubUrl, {
            env: { GITHUB_TOKEN: "server-secret" },
            fetchImpl,
            now: new Date("2025-06-15T00:00:00Z"),
            year: "2024",
        });

        expect(result).toEqual({
            available: true,
            username: "rondale-bufete",
            year: 2024,
            availableYears: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
            totalContributions: 12,
            weeks: [[{ date: "2024-01-03", count: 3, level: 2, weekday: 3 }]],
        });
        const [url, options] = fetchImpl.mock.calls[0];
        expect(url).toBe("https://api.github.com/graphql");
        expect(options.headers.Authorization).toBe("Bearer server-secret");
        expect(JSON.parse(options.body).variables).toMatchObject({
            login: "rondale-bufete",
            from: "2024-01-01T00:00:00Z",
            to: "2024-12-31T23:59:59Z",
        });
        expect(JSON.parse(options.body).query).toContain("contributionsCollection(from: $from, to: $to)");
        expect(JSON.parse(options.body).query).not.toContain("includePrivateContributions");
    });

    it("reports invalid calendar data instead of rendering a partial graph", async () => {
        const result = await getGitHubContributions(githubUrl, {
            env: { GITHUB_TOKEN: "token" },
            fetchImpl: vi.fn().mockResolvedValue(
                graphqlResponse({
                    totalContributions: 1,
                    weeks: [{ contributionDays: [{ date: "not-a-date" }] }],
                })
            ),
        });

        expect(result.available).toBe(false);
        expect(result.message).toMatch(/unexpected format/i);
    });

    it("shows a sanitized GraphQL error to help diagnose permission failures", async () => {
        const result = await getGitHubContributions(githubUrl, {
            env: { GITHUB_TOKEN: "secret-token" },
            fetchImpl: vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ errors: [{ message: "Requires read:user; secret-token was rejected" }] }),
            }),
        });

        expect(result.message).toContain("Requires read:user");
        expect(result.message).not.toContain("secret-token");
    });
});

describe("getContributionMonthLabels", () => {
    it("labels each month at its first week", () => {
        const labels = getContributionMonthLabels([
            [{ date: "2025-01-30" }, { date: "2025-01-31" }],
            [{ date: "2025-02-01" }, { date: "2025-02-02" }],
            [{ date: "2025-02-08" }],
        ]);
        expect(labels).toEqual(["Jan", "Feb", ""]);
    });
});
