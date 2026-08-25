const VERCEL_API_BASE = "https://api.vercel.com";

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

function buildVercelRequestUrl(path, params) {
    const url = new URL(path, VERCEL_API_BASE);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });
    return url;
}

export async function getVercelAnalyticsSummary() {
    const token = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    if (!token || !projectId) {
        return {
            available: false,
            message: "Vercel analytics is not configured for this project.",
            pageviews: 0,
            visitors: 0,
            trend: [],
        };
    }

    const until = new Date();
    const since = new Date(until);
    since.setDate(until.getDate() - 6);

    const countParams = {
        projectId,
        since: formatDate(since),
        until: formatDate(until),
    };

    if (process.env.VERCEL_TEAM_ID) {
        countParams.teamId = process.env.VERCEL_TEAM_ID;
    }

    if (process.env.VERCEL_TEAM_SLUG) {
        countParams.slug = process.env.VERCEL_TEAM_SLUG;
    }

    const aggregateParams = {
        ...countParams,
        by: "day",
    };

    const countUrl = buildVercelRequestUrl("/v1/query/web-analytics/visits/count", countParams);
    const aggregateUrl = buildVercelRequestUrl(
        "/v1/query/web-analytics/visits/aggregate",
        aggregateParams
    );

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const [countResponse, aggregateResponse] = await Promise.all([
            fetch(countUrl, { headers, cache: "no-store" }),
            fetch(aggregateUrl, { headers, cache: "no-store" }),
        ]);

        if (!countResponse.ok || !aggregateResponse.ok) {
            return {
                available: false,
                message: "Vercel analytics is temporarily unavailable.",
                pageviews: 0,
                visitors: 0,
                trend: [],
            };
        }

        const countJson = await countResponse.json().catch(() => ({}));
        const aggregateJson = await aggregateResponse.json().catch(() => ({ data: [] }));

        const totals = countJson?.data ?? {};
        const trend = Array.isArray(aggregateJson?.data) ? aggregateJson.data : [];

        const totalPageviews = Number(totals.pageviews ?? trend.reduce((sum, row) => sum + Number(row.pageviews ?? 0), 0) ?? 0);
        const totalVisitors = Number(totals.visitors ?? trend.reduce((sum, row) => sum + Number(row.visitors ?? 0), 0) ?? 0);

        return {
            available: true,
            pageviews: totalPageviews,
            visitors: totalVisitors,
            trend: trend.map((row) => ({
                date: row.timestamp ? formatDate(row.timestamp) : row.day || "",
                pageviews: Number(row.pageviews ?? 0),
                visitors: Number(row.visitors ?? 0),
            })),
            message: null,
        };
    } catch (error) {
        return {
            available: false,
            message: "Vercel analytics is temporarily unavailable.",
            pageviews: 0,
            visitors: 0,
            trend: [],
        };
    }
}
