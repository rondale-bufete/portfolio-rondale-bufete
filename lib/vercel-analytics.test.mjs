import { describe, it, expect, vi } from "vitest";
import { buildVercelRequestUrl, fillDays, getWebAnalytics, toBreakdown } from "./vercel-analytics";

const NOW = new Date("2026-11-05T12:00:00Z");
const ENV = { VERCEL_TOKEN: "test-token", VERCEL_PROJECT_ID: "prj_test" };

function respond(data, ok = true) {
    return Promise.resolve({ ok, json: () => Promise.resolve({ data }) });
}

describe("buildVercelRequestUrl", () => {
    it("drops empty params", () => {
        const url = buildVercelRequestUrl("/v1/query/web-analytics/visits/count", { projectId: "p", teamId: undefined, by: "" });
        expect(url.search).toBe("?projectId=p");
    });
});

describe("fillDays", () => {
    it("adds the days Vercel left out as zeros", () => {
        const rows = [{ timestamp: "2026-11-02T00:00:00.000Z", pageviews: 5, visitors: 3 }];
        expect(fillDays(rows, ["2026-11-01", "2026-11-02"])).toEqual([
            { date: "2026-11-01", pageviews: 0, visitors: 0 },
            { date: "2026-11-02", pageviews: 5, visitors: 3 },
        ]);
    });
});

describe("toBreakdown", () => {
    it("reads the grouped dimension and sorts by page views", () => {
        const rows = [
            { country: "US", pageviews: 2, visitors: 2 },
            { country: "PH", pageviews: 9, visitors: 4 },
        ];
        expect(toBreakdown(rows, "country").map((row) => row.value)).toEqual(["PH", "US"]);
    });
});

describe("getWebAnalytics", () => {
    it("explains what's missing when the token isn't set", async () => {
        const fetchImpl = vi.fn();
        const result = await getWebAnalytics(7, { env: {}, fetchImpl, now: NOW });
        expect(result.available).toBe(false);
        expect(result.message).toMatch(/VERCEL_TOKEN/);
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it("blanks only the breakdown whose request failed", async () => {
        const fetchImpl = vi.fn((url) => {
            const by = url.searchParams.get("by");
            if (url.pathname.endsWith("/count")) return respond({ pageviews: 40, visitors: 20 });
            if (by === "day") return respond([{ timestamp: "2026-11-05T00:00:00.000Z", pageviews: 40, visitors: 20 }]);
            if (by === "country") return respond(null, false);
            return respond([{ [by]: "x", pageviews: 1, visitors: 1 }]);
        });

        const result = await getWebAnalytics(7, { env: ENV, fetchImpl, now: NOW });

        expect(result.available).toBe(true);
        expect(result.totals).toEqual({ pageviews: 40, visitors: 20 });
        expect(result.trend).toHaveLength(7);
        expect(result.trend.at(-1)).toEqual({ date: "2026-11-05", pageviews: 40, visitors: 20 });
        expect(result.countries).toBeNull();
        expect(result.pages).toEqual([{ value: "x", pageviews: 1, visitors: 1 }]);
        expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe("Bearer test-token");
    });

    it("reports Vercel as unavailable when nothing answers", async () => {
        const fetchImpl = vi.fn(() => Promise.reject(new Error("offline")));
        const result = await getWebAnalytics(7, { env: ENV, fetchImpl, now: NOW });
        expect(result.available).toBe(false);
        expect(result.message).toMatch(/didn't respond/);
    });
});
