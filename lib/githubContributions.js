const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const FIRST_CONTRIBUTION_YEAR = 2008;
const PUBLIC_FETCH_REVALIDATE_SECONDS = 3600;
const CONTRIBUTION_LEVELS = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
};

const CONTRIBUTION_QUERY = `
    query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
            createdAt
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            contributionLevel
                            date
                            weekday
                        }
                    }
                }
            }
        }
    }
`;

function unavailable(message, username = null, year = null) {
    return { available: false, message, username, year, availableYears: [], totalContributions: 0, weeks: [] };
}

export function parseGitHubUsername(profileUrl) {
    if (typeof profileUrl !== "string" || !profileUrl.trim()) return null;

    try {
        const url = new URL(profileUrl.trim());
        if (!["http:", "https:"].includes(url.protocol) || !["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) {
            return null;
        }

        const segments = url.pathname.split("/").filter(Boolean);
        if (segments.length !== 1) return null;
        const [username] = segments;
        return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username) ? username : null;
    } catch {
        return null;
    }
}

export function parseContributionYear(value, now = new Date()) {
    const currentYear = now.getUTCFullYear();
    const year = typeof value === "number" ? value : typeof value === "string" && /^\d{4}$/.test(value) ? Number(value) : NaN;
    return Number.isInteger(year) && year >= FIRST_CONTRIBUTION_YEAR && year <= currentYear ? year : currentYear;
}

export function getContributionCalendarRange(now = new Date(), requestedYear) {
    const year = parseContributionYear(requestedYear, now);
    const currentDate = now.toISOString().slice(0, 10);
    const until = year === now.getUTCFullYear() ? currentDate : `${year}-12-31`;

    return {
        from: `${year}-01-01T00:00:00Z`,
        to: `${until}T23:59:59Z`,
    };
}

function getAvailableContributionYears(createdAt, now) {
    const createdDate = new Date(createdAt);
    if (Number.isNaN(createdDate.getTime())) return null;

    const firstYear = Math.max(FIRST_CONTRIBUTION_YEAR, createdDate.getUTCFullYear());
    const currentYear = now.getUTCFullYear();
    return Array.from({ length: Math.max(0, currentYear - firstYear + 1) }, (_, index) => currentYear - index);
}

function normalizeCalendar(calendar) {
    if (!calendar || !Number.isInteger(calendar.totalContributions) || calendar.totalContributions < 0 || !Array.isArray(calendar.weeks)) {
        return null;
    }

    const weeks = [];
    for (const week of calendar.weeks) {
        if (!Array.isArray(week?.contributionDays)) return null;

        const days = [];
        for (const day of week.contributionDays) {
            const date = typeof day?.date === "string" ? new Date(`${day.date}T00:00:00Z`) : null;
            const level = CONTRIBUTION_LEVELS[day?.contributionLevel];
            if (
                !date ||
                Number.isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== day.date ||
                !Number.isInteger(day.contributionCount) ||
                day.contributionCount < 0 ||
                !Number.isInteger(day.weekday) ||
                day.weekday < 0 ||
                day.weekday > 6 ||
                level === undefined
            ) {
                return null;
            }

            days.push({ date: day.date, count: day.contributionCount, level, weekday: day.weekday });
        }
        weeks.push(days);
    }

    return { totalContributions: calendar.totalContributions, weeks };
}

function getGraphQLErrorMessage(errors, token) {
    const message = errors.find((error) => typeof error?.message === "string")?.message;
    if (!message) return "GitHub returned an unspecified GraphQL error.";

    const safeMessage = message.replaceAll(token, "[redacted]").replace(/\s+/g, " ").slice(0, 240);
    return `GitHub GraphQL error: ${safeMessage}`;
}

export async function getGitHubContributions(
    profileUrl,
    { env = process.env, fetchImpl = fetch, now = new Date(), year, fetchCache = "no-store", fetchRevalidate } = {}
) {
    const username = parseGitHubUsername(profileUrl);
    if (!username) {
        return unavailable("Add a valid GitHub profile URL on the Profile page to show contribution activity.");
    }
    const selectedYear = parseContributionYear(year, now);
    if (!env.GITHUB_TOKEN) {
        return unavailable("Add GITHUB_TOKEN to the server environment to load GitHub contributions.", username, selectedYear);
    }

    const range = getContributionCalendarRange(now, selectedYear);
    let response;
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
                "User-Agent": "portfolio-admin",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            body: JSON.stringify({
                query: CONTRIBUTION_QUERY,
                variables: { login: username, ...range },
            }),
            cache: fetchCache,
            signal: AbortSignal.timeout(8000),
        };
        if (fetchRevalidate) requestOptions.next = { revalidate: fetchRevalidate };
        response = await fetchImpl(GITHUB_GRAPHQL_URL, requestOptions);
    } catch {
        return unavailable("GitHub couldn't be reached. Try again in a minute.", username, selectedYear);
    }

    if (!response.ok) {
        return unavailable(
            response.status === 401
                ? "GitHub rejected GITHUB_TOKEN. Check that the token is valid and has read:user access."
                : `GitHub contribution data couldn't be loaded (HTTP ${response.status}).`,
            username,
            selectedYear
        );
    }

    let payload;
    try {
        payload = await response.json();
    } catch {
        return unavailable("GitHub returned an unreadable response. Try again in a minute.", username, selectedYear);
    }

    if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
        return unavailable(getGraphQLErrorMessage(payload.errors, env.GITHUB_TOKEN), username, selectedYear);
    }
    if (!payload?.data?.user) {
        return unavailable(`GitHub account @${username} wasn't found. Check the URL saved on the Profile page.`, username, selectedYear);
    }

    const availableYears = getAvailableContributionYears(payload.data.user.createdAt, now);
    if (!availableYears) {
        return unavailable("GitHub returned an invalid account creation date.", username, selectedYear);
    }

    const calendar = normalizeCalendar(payload.data.user.contributionsCollection?.contributionCalendar);
    if (!calendar) {
        return unavailable("GitHub returned contribution data in an unexpected format.", username, selectedYear);
    }

    return { available: true, username, year: selectedYear, availableYears, ...calendar };
}

export function getPublicGitHubContributions(profileUrl, options = {}) {
    return getGitHubContributions(profileUrl, {
        ...options,
        fetchCache: "force-cache",
        fetchRevalidate: PUBLIC_FETCH_REVALIDATE_SECONDS,
    });
}

export function getContributionMonthLabels(weeks) {
    const seenMonths = new Set();
    const monthFormatter = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });

    return weeks.map((days) => {
        for (const day of days) {
            const monthKey = day.date.slice(0, 7);
            if (!seenMonths.has(monthKey)) {
                seenMonths.add(monthKey);
                return monthFormatter.format(new Date(`${day.date}T00:00:00Z`));
            }
        }
        return "";
    });
}
