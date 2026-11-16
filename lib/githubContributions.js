const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
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

function unavailable(message, username = null) {
    return { available: false, message, username, totalContributions: 0, weeks: [] };
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

export function getContributionCalendarRange(now = new Date()) {
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const year = end.getUTCFullYear() - 1;
    const month = end.getUTCMonth();
    const day = Math.min(end.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
    const start = new Date(Date.UTC(year, month, day));

    return {
        from: `${start.toISOString().slice(0, 10)}T00:00:00Z`,
        to: `${end.toISOString().slice(0, 10)}T23:59:59Z`,
    };
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

export async function getGitHubContributions(profileUrl, { env = process.env, fetchImpl = fetch, now = new Date() } = {}) {
    const username = parseGitHubUsername(profileUrl);
    if (!username) {
        return unavailable("Add a valid GitHub profile URL on the Profile page to show contribution activity.");
    }
    if (!env.GITHUB_TOKEN) {
        return unavailable("Add GITHUB_TOKEN to the server environment to load GitHub contributions.", username);
    }

    const range = getContributionCalendarRange(now);
    let response;
    try {
        response = await fetchImpl(GITHUB_GRAPHQL_URL, {
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
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
        });
    } catch {
        return unavailable("GitHub couldn't be reached. Try again in a minute.", username);
    }

    if (!response.ok) {
        return unavailable(
            response.status === 401
                ? "GitHub rejected GITHUB_TOKEN. Check that the token is valid and has read:user access."
                : `GitHub contribution data couldn't be loaded (HTTP ${response.status}).`,
            username
        );
    }

    let payload;
    try {
        payload = await response.json();
    } catch {
        return unavailable("GitHub returned an unreadable response. Try again in a minute.", username);
    }

    if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
        return unavailable(getGraphQLErrorMessage(payload.errors, env.GITHUB_TOKEN), username);
    }
    if (!payload?.data?.user) {
        return unavailable(`GitHub account @${username} wasn't found. Check the URL saved on the Profile page.`, username);
    }

    const calendar = normalizeCalendar(payload.data.user.contributionsCollection?.contributionCalendar);
    if (!calendar) {
        return unavailable("GitHub returned contribution data in an unexpected format.", username);
    }

    return { available: true, username, ...calendar };
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
