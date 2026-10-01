import Link from "next/link";
import { getVercelAnalyticsSummary } from "@/lib/vercel-analytics";
import { getAdminCounts } from "@/lib/adminCounts";
import PageHeader from "../ui/PageHeader";
import ErrorState from "../ui/ErrorState";
import { cardBase } from "../ui/tokens";
import { ChevronIcon } from "../ui/icons";

const SECTIONS = [
    { href: "/admin/profile", label: "Profile", key: null, desc: "Name, bio, tagline, contact links, photo, resume." },
    { href: "/admin/experience", label: "Experience", key: "experience", desc: "Your work history, shown as a timeline." },
    { href: "/admin/projects", label: "Projects", key: "projects", desc: "The project grid on your homepage." },
    { href: "/admin/certifications", label: "Certifications", key: "certifications", desc: "Certs shown under About." },
    { href: "/admin/education", label: "Education", key: "education", desc: "The education timeline under About." },
    { href: "/admin/skills", label: "Skills", key: "skills", desc: "Skill categories and the tags inside them." },
];

export default async function AdminOverview() {
    const [{ counts, error: countsError }, analytics] = await Promise.all([
        getAdminCounts(),
        getVercelAnalyticsSummary(),
    ]);

    const trend = analytics.trend ?? [];
    const lastDay = trend.at(-1);

    return (
        <div>
            <PageHeader
                title="Overview"
            />

            {countsError && (
                <ErrorState
                    title="Some counts couldn't load"
                    message={countsError.message}
                />
            )}

            <div className={`${cardBase} p-5 mb-6 font-[family-name:var(--font-mono)]`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <p className="field-label mb-2">
                            web_views
                        </p>
                        <h2 className="text-2xl text-[var(--color-text)] font-[family-name:var(--font-display)]">
                            {analytics.available ? analytics.pageviews.toLocaleString() : "Unavailable"}
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="field-label mb-2">visitors</p>
                        <p className="text-sm text-[var(--color-text)]">
                            {analytics.available ? analytics.visitors.toLocaleString() : "—"}
                        </p>
                    </div>
                </div>

                {analytics.available ? (
                    <div>
                        <div className="flex items-center justify-between text-xs text-[var(--color-faint)] mb-3">
                            <span>last 7 days</span>
                            <span>
                                {lastDay
                                    ? `${lastDay.pageviews.toLocaleString()} views on ${lastDay.date}`
                                    : "No data yet"}
                            </span>
                        </div>

                        <div className="flex items-end gap-2 h-20">
                            {trend.length > 0 ? (
                                trend.map((point) => {
                                    const maxValue = Math.max(...trend.map((row) => row.pageviews), 1);
                                    const height = Math.max((point.pageviews / maxValue) * 100, 10);

                                    return (
                                        <div key={`${point.date}-${point.pageviews}`} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className="w-full rounded-t-[3px] bg-[var(--color-accent)]"
                                                style={{ height: `${height}%` }}
                                                title={`${point.date}: ${point.pageviews} pageviews`}
                                            />
                                            <span className="text-[10px] text-[var(--color-faint)]">
                                                {point.date.slice(5)}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="w-full text-sm text-[var(--color-faint)]">No analytics data for the selected range.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-[var(--color-faint)]">{analytics.message}</p>
                )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {SECTIONS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className={`group block ${cardBase} p-5 transition-colors hover:border-[var(--color-border-strong)]`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-medium text-[var(--color-text)] font-[family-name:var(--font-display)]">
                                {s.label}
                            </h3>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {s.key && counts[s.key] !== undefined && (
                                    <span className="text-xs text-[var(--color-faint)] font-[family-name:var(--font-mono)]">
                                        {counts[s.key]}
                                    </span>
                                )}
                                <ChevronIcon className="w-4 h-4 text-[var(--color-faint)] transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </div>
                        <p className="text-sm text-[var(--color-body)] leading-relaxed">{s.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
