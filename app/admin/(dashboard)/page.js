import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getWebAnalytics } from "@/lib/vercel-analytics";
import { getChatActivity } from "@/lib/chatActivity";
import { parseRange, percentChange, rangeWindows, RANGE_OPTIONS } from "@/lib/analyticsRange";
import { buildContentChecklist } from "@/lib/contentChecklist";
import { formatCount, shortDate } from "@/lib/chartScale";
import PageHeader from "../ui/PageHeader";
import ErrorState from "../ui/ErrorState";
import StatTile from "../ui/charts/StatTile";
import LineChart from "../ui/charts/LineChart";
import ColumnChart from "../ui/charts/ColumnChart";
import BarList from "../ui/charts/BarList";
import SegmentedBar from "../ui/charts/SegmentedBar";
import TableView from "../ui/charts/TableView";
import { CheckIcon } from "@/components/icons";

const PROJECT_PATH = /^\/projects\/([^/?#]+)\/?$/;
const DEVICE_LABELS = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" };
const DEVICE_COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code) {
    try {
        return code && code.length === 2 ? regionNames.of(code.toUpperCase()) : code || "Unknown";
    } catch {
        return code || "Unknown";
    }
}

function pageLabel(path, titles) {
    if (path === "/") return "Home";
    const projectId = path.match(PROJECT_PATH)?.[1];
    return (projectId && titles.get(projectId)) || path || "Unknown";
}

async function loadContent() {
    const [profile, projects, certifications, experience] = await Promise.all([
        supabaseAdmin.from("profile").select("*").eq("id", 1).maybeSingle(),
        supabaseAdmin.from("projects").select("id, title, image_url, image_urls, outcome").order("sort_order"),
        supabaseAdmin.from("certifications").select("id, url, pdf_url"),
        supabaseAdmin.from("experience").select("id"),
    ]);
    const error = [profile, projects, certifications, experience].find((result) => result.error)?.error ?? null;
    return {
        error,
        profile: profile.data,
        projects: projects.data ?? [],
        certifications: certifications.data ?? [],
        experience: experience.data ?? [],
    };
}

function ChartCard({ title, subtitle, className = "", children, empty }) {
    return (
        <section className={`chart-card ${className}`}>
            <header className="chart-card__header">
                <div>
                    <h2 className="chart-card__title">{title}</h2>
                    {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
                </div>
            </header>
            {empty ? <p className="chart-card__empty">{empty}</p> : children}
        </section>
    );
}

export default async function AdminOverview({ searchParams }) {
    const { range } = await searchParams;
    const days = parseRange(range);
    const now = new Date();
    const windows = rangeWindows(days, now);
    const [analytics, chat, content] = await Promise.all([getWebAnalytics(days, { now }), getChatActivity(windows), loadContent()]);

    const period = `previous ${days} days`;
    const periodLabel = `${shortDate(windows.current.since)} – ${shortDate(windows.current.until)}`;
    const titles = new Map(content.projects.map((project) => [String(project.id), project.title]));
    const traffic = analytics.available ? analytics : null;

    const caseStudies = (traffic?.pages ?? [])
        .map((row) => ({ ...row, projectId: row.value.match(PROJECT_PATH)?.[1] }))
        .filter((row) => row.projectId && titles.has(row.projectId));
    const caseStudyViews = caseStudies.reduce((sum, row) => sum + row.pageviews, 0);
    const checklist = buildContentChecklist(content);
    const remaining = checklist.filter((item) => !item.done).length;

    return (
        <div>
            <PageHeader title="Overview" description="How the site is doing and what's left to polish." />

            <div className="dashboard-toolbar">
                <nav className="range-filter" aria-label="Date range">
                    {RANGE_OPTIONS.map((option) => (
                        <Link key={option} href={`/admin?range=${option}`} aria-current={option === days ? "true" : undefined} scroll={false}>
                            Last {option} days
                        </Link>
                    ))}
                </nav>
                <p>{periodLabel} (UTC) · traffic from Vercel Web Analytics</p>
            </div>

            <div className="dashboard-grid">
                <div className="span-3">
                    <StatTile
                        label="Visitors"
                        value={traffic ? formatCount(traffic.totals.visitors) : "—"}
                        change={traffic?.previous ? percentChange(traffic.totals.visitors, traffic.previous.visitors) : null}
                        comparedTo={period}
                        note={traffic ? "No earlier data" : "Not connected"}
                        trend={traffic?.trend.map((day) => day.visitors)}
                    />
                </div>
                <div className="span-3">
                    <StatTile
                        label="Page views"
                        value={traffic ? formatCount(traffic.totals.pageviews) : "—"}
                        change={traffic?.previous ? percentChange(traffic.totals.pageviews, traffic.previous.pageviews) : null}
                        comparedTo={period}
                        note={traffic ? "No earlier data" : "Not connected"}
                        trend={traffic?.trend.map((day) => day.pageviews)}
                    />
                </div>
                <div className="span-3">
                    <StatTile
                        label="Case study views"
                        value={traffic?.pages ? formatCount(caseStudyViews) : "—"}
                        note={
                            traffic?.pages && traffic.totals.pageviews > 0
                                ? `${Math.round((caseStudyViews / traffic.totals.pageviews) * 100)}% of page views`
                                : "Project pages only"
                        }
                    />
                </div>
                <div className="span-3">
                    <StatTile
                        label="Chat questions"
                        value={chat.available ? formatCount(chat.current.questions) : "—"}
                        change={chat.available ? percentChange(chat.current.questions, chat.previous.questions) : null}
                        comparedTo={period}
                        note={chat.available ? `${formatCount(chat.current.conversations)} conversations` : "Couldn't load"}
                        trend={chat.available ? chat.current.daily.map((day) => day.questions) : null}
                    />
                </div>

                {traffic ? (
                    <>
                        <ChartCard title="Visitors and page views" subtitle={`Per day, ${periodLabel}`}>
                            <ul className="chart-legend" aria-hidden="true">
                                <li>
                                    <span className="chart-key" style={{ "--key": "var(--series-1)" }} />
                                    Visitors
                                </li>
                                <li>
                                    <span className="chart-key" style={{ "--key": "var(--series-2)" }} />
                                    Page views
                                </li>
                            </ul>
                            <LineChart
                                label={`Visitors and page views per day, ${periodLabel}`}
                                dates={traffic.trend.map((day) => day.date)}
                                series={[
                                    { key: "visitors", label: "visitors", color: "var(--series-1)", values: traffic.trend.map((day) => day.visitors) },
                                    { key: "pageviews", label: "page views", color: "var(--series-2)", values: traffic.trend.map((day) => day.pageviews) },
                                ]}
                            />
                            <TableView
                                caption="Visitors and page views per day"
                                columns={["Day", "Visitors", "Page views"]}
                                rows={traffic.trend.map((day) => [shortDate(day.date), formatCount(day.visitors), formatCount(day.pageviews)])}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Top pages"
                            subtitle="Page views"
                            className="span-6"
                            empty={!traffic.pages ? "Couldn't load pages." : traffic.pages.length === 0 ? "No page views in this period." : null}
                        >
                            <BarList
                                label="Top pages by page views"
                                total={traffic.totals.pageviews}
                                rows={(traffic.pages ?? []).slice(0, 6).map((row) => ({
                                    key: row.value || "unknown",
                                    label: pageLabel(row.value, titles),
                                    title: row.value,
                                    value: row.pageviews,
                                }))}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Case studies"
                            subtitle="Views of each project page"
                            className="span-6"
                            empty={!traffic.pages ? "Couldn't load pages." : caseStudies.length === 0 ? "No one opened a project page in this period." : null}
                        >
                            <BarList
                                label="Project page views"
                                total={caseStudyViews}
                                rows={caseStudies.slice(0, 6).map((row) => ({
                                    key: row.projectId,
                                    label: titles.get(row.projectId),
                                    value: row.pageviews,
                                }))}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Where visitors come from"
                            subtitle="Referring sites"
                            className="span-4"
                            empty={!traffic.referrers ? "Couldn't load referrers." : traffic.referrers.length === 0 ? "No visits in this period." : null}
                        >
                            <BarList
                                label="Referring sites by page views"
                                total={traffic.totals.pageviews}
                                rows={(traffic.referrers ?? []).map((row) => ({
                                    key: row.value || "direct",
                                    label: row.value || "Direct or unknown",
                                    value: row.pageviews,
                                }))}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Countries"
                            subtitle="Page views"
                            className="span-4"
                            empty={!traffic.countries ? "Couldn't load countries." : traffic.countries.length === 0 ? "No visits in this period." : null}
                        >
                            <BarList
                                label="Countries by page views"
                                total={traffic.totals.pageviews}
                                rows={(traffic.countries ?? []).map((row) => ({ key: row.value || "unknown", label: countryName(row.value), value: row.pageviews }))}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Devices"
                            subtitle="Share of page views"
                            className="span-4"
                            empty={!traffic.devices ? "Couldn't load devices." : traffic.devices.length === 0 ? "No visits in this period." : null}
                        >
                            <SegmentedBar
                                label="Page views by device"
                                parts={(traffic.devices ?? []).slice(0, 3).map((row, index) => ({
                                    label: DEVICE_LABELS[row.value?.toLowerCase()] ?? (row.value || "Other"),
                                    value: row.pageviews,
                                    color: DEVICE_COLORS[index],
                                }))}
                            />
                        </ChartCard>
                    </>
                ) : (
                    <div>
                        <ErrorState title="Traffic isn't available" message={analytics.message} />
                    </div>
                )}

                <ChartCard
                    title="Chat assistant"
                    subtitle={chat.available ? `${formatCount(chat.current.questions)} questions in ${formatCount(chat.current.conversations)} conversations` : null}
                    className="span-8"
                    empty={!chat.available ? `Couldn't load chat activity: ${chat.message}` : chat.current.questions === 0 ? "No one asked the assistant anything in this period." : null}
                >
                    {chat.available && (
                        <>
                            <ColumnChart
                                label={`Chat questions per day, ${periodLabel}`}
                                unit="questions"
                                dates={chat.current.daily.map((day) => day.date)}
                                values={chat.current.daily.map((day) => day.questions)}
                                height={260}
                            />
                            <TableView
                                caption="Chat questions and conversations per day"
                                columns={["Day", "Questions", "Conversations"]}
                                rows={chat.current.daily.map((day) => [shortDate(day.date), formatCount(day.questions), formatCount(day.conversations)])}
                            />
                        </>
                    )}
                </ChartCard>

                <ChartCard
                    title="Site checklist"
                    subtitle={content.error ? null : remaining ? `${remaining} ${remaining === 1 ? "thing" : "things"} to finish` : "Everything's in place"}
                    className="span-4"
                    empty={content.error ? `Couldn't check your content: ${content.error.message}` : null}
                >
                    <ul className="checklist">
                        {checklist.map((item) => (
                            <li key={item.id} className={item.done ? "is-done" : undefined}>
                                <span className="checklist__icon" aria-hidden="true">
                                    {item.done && <CheckIcon size={14} />}
                                </span>
                                <span className="checklist__text">
                                    {item.title}
                                    <span className="sr-only">{item.done ? " (done)" : " (to do)"}</span>
                                    <span className="checklist__detail">{item.detail}</span>
                                </span>
                                {!item.done && (
                                    <Link href={item.href} aria-label={`Fix: ${item.title}`}>
                                        Fix
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </ChartCard>
            </div>
        </div>
    );
}
