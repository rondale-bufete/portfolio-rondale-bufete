import { rangeWindows } from "./analyticsRange";

const VERCEL_API_BASE = "https://api.vercel.com";

export function buildVercelRequestUrl(path, params) {
    const url = new URL(path, VERCEL_API_BASE);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });
    return url;
}

function toCount(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

// Aggregate-by-day rows can skip days with no visits; the chart needs every day.
export function fillDays(rows, dates) {
    const byDate = new Map(
        rows.map((row) => [(row.timestamp ?? row.day ?? "").slice(0, 10), { pageviews: toCount(row.pageviews), visitors: toCount(row.visitors) }])
    );
    return dates.map((date) => ({ date, ...(byDate.get(date) ?? { pageviews: 0, visitors: 0 }) }));
}

// Rows grouped by a dimension ("requestPath", "country", ...) as { value, pageviews, visitors }.
export function toBreakdown(rows, dimension) {
    return rows
        .map((row) => ({ value: row[dimension] ?? "", pageviews: toCount(row.pageviews), visitors: toCount(row.visitors) }))
        .sort((first, second) => second.pageviews - first.pageviews);
}

const UNAVAILABLE = { totals: null, previous: null, trend: [], pages: null, referrers: null, countries: null, devices: null };

// Traffic for the admin dashboard from the Vercel Web Analytics API
// (https://vercel.com/docs/analytics/web-analytics-api). Each breakdown fails
// on its own, so one bad request blanks one card, not the dashboard.
export async function getWebAnalytics(days, { env = process.env, fetchImpl = fetch, now = new Date() } = {}) {
    const token = env.VERCEL_TOKEN;
    const projectId = env.VERCEL_PROJECT_ID;
    const windows = rangeWindows(days, now);

    if (!token || !projectId) {
        return {
            ...UNAVAILABLE,
            available: false,
            windows,
            message: "Add VERCEL_TOKEN and VERCEL_PROJECT_ID to the environment to see traffic here.",
        };
    }

    const scope = { projectId, teamId: env.VERCEL_TEAM_ID, slug: env.VERCEL_TEAM_SLUG };
    const headers = { Authorization: `Bearer ${token}` };

    async function query(path, params) {
        try {
            const response = await fetchImpl(buildVercelRequestUrl(path, { ...scope, ...params }), { headers, cache: "no-store" });
            if (!response.ok) return null;
            const json = await response.json();
            return json?.data ?? null;
        } catch {
            return null;
        }
    }

    const current = { since: windows.current.since, until: windows.current.until };
    const previous = { since: windows.previous.since, until: windows.previous.until };
    const aggregate = "/v1/query/web-analytics/visits/aggregate";
    const count = "/v1/query/web-analytics/visits/count";

    const [totals, previousTotals, trend, pages, referrers, countries, devices] = await Promise.all([
        query(count, current),
        query(count, previous),
        query(aggregate, { ...current, by: "day" }),
        query(aggregate, { ...current, by: "requestPath", limit: 25 }),
        query(aggregate, { ...current, by: "referrerHostname", limit: 6 }),
        query(aggregate, { ...current, by: "country", limit: 6 }),
        query(aggregate, { ...current, by: "deviceType", limit: 4 }),
    ]);

    if (!totals && !Array.isArray(trend)) {
        return { ...UNAVAILABLE, available: false, windows, message: "Vercel Web Analytics didn't respond. Try again in a minute." };
    }

    const filledTrend = fillDays(Array.isArray(trend) ? trend : [], windows.current.dates);
    const sum = (key) => filledTrend.reduce((total, day) => total + day[key], 0);
    const list = (rows, dimension) => (Array.isArray(rows) ? toBreakdown(rows, dimension) : null);

    return {
        available: true,
        message: null,
        windows,
        totals: { pageviews: toCount(totals?.pageviews ?? sum("pageviews")), visitors: toCount(totals?.visitors ?? sum("visitors")) },
        previous: previousTotals ? { pageviews: toCount(previousTotals.pageviews), visitors: toCount(previousTotals.visitors) } : null,
        trend: filledTrend,
        pages: list(pages, "requestPath"),
        referrers: list(referrers, "referrerHostname"),
        countries: list(countries, "country"),
        devices: list(devices, "deviceType"),
    };
}
