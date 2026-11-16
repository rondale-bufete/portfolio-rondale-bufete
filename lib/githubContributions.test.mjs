import { describe, it, expect, vi } from "vitest";
import {
    getContributionCalendarRange,
    getContributionMonthLabels,
    getGitHubContributions,
    parseGitHubUsername,
} from "./githubContributions.js";

const githubUrl = "https://github.com/rondale-bufete";

function graphqlResponse(calendar) {
    return {
        ok: true,
        json: async () => ({ data: { user: { contributionsCollection: { contributionCalendar: calendar } } } }),
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
    it("uses UTC dates and clamps leap day to the last valid date", () => {
        expect(getContributionCalendarRange(new Date("2024-02-29T17:00:00Z"))).toEqual({
            from: "2023-02-28T00:00:00Z",
            to: "2024-02-29T23:59:59Z",
        });
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
                            { date: "2025-01-01", contributionCount: 3, contributionLevel: "SECOND_QUARTILE", weekday: 3 },
                        ],
                    },
                ],
            })
        );
        const result = await getGitHubContributions(githubUrl, {
            env: { GITHUB_TOKEN: "server-secret" },
            fetchImpl,
            now: new Date("2025-01-01T00:00:00Z"),
        });

        expect(result).toEqual({
            available: true,
            username: "rondale-bufete",
            totalContributions: 12,
            weeks: [[{ date: "2025-01-01", count: 3, level: 2, weekday: 3 }]],
        });
        const [url, options] = fetchImpl.mock.calls[0];
        expect(url).toBe("https://api.github.com/graphql");
        expect(options.headers.Authorization).toBe("Bearer server-secret");
        expect(JSON.parse(options.body).variables).toMatchObject({
            login: "rondale-bufete",
            from: "2024-01-01T00:00:00Z",
            to: "2025-01-01T23:59:59Z",
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
