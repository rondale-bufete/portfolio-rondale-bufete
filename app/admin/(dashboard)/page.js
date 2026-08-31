import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getVercelAnalyticsSummary } from "@/lib/vercel-analytics";
import PageHeader from "../ui/PageHeader";
import { cardBase } from "../ui/tokens";
import { ChevronIcon } from "../ui/icons";

const SECTIONS = [
    { href: "/admin/profile", label: "Profile", desc: "Name, bio, tagline, contact links, photo, resume." },
    { href: "/admin/experience", label: "Experience", desc: "Your work history, shown as a timeline." },
    { href: "/admin/projects", label: "Projects", desc: "The project grid on your homepage." },
    { href: "/admin/certifications", label: "Certifications", desc: "Certs shown under About." },
    { href: "/admin/education", label: "Education", desc: "The education timeline under About." },
    { href: "/admin/skills", label: "Skills", desc: "Skill categories and the tags inside them." },
];

export default async function AdminOverview() {
    const [
        { count: experienceCount },
        { count: projectCount },
        { count: certCount },
        { count: eduCount },
        { count: skillCount },
        analytics,
    ] = await Promise.all([
        supabaseAdmin.from("experience").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("projects").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("certifications").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("education").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("skill_categories").select("*", { count: "exact", head: true }),
        getVercelAnalyticsSummary(),
    ]);

    const counts = {
        "/admin/experience": experienceCount,
        "/admin/projects": projectCount,
        "/admin/certifications": certCount,
        "/admin/education": eduCount,
        "/admin/skills": skillCount,
    };

    const trend = analytics.trend ?? [];
    const lastDay = trend.at(-1);

    return (
        <div>
            <PageHeader
                title="Overview"
            />

            <div className={`${cardBase} p-5 mb-6`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#5B5F66] mb-2">
                            Web Views
                        </p>
                        <h2 className="text-2xl text-[#14161A]" style={{ fontFamily: "var(--font-display)" }}>
                            {analytics.available ? analytics.pageviews.toLocaleString() : "Unavailable"}
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-[#5B5F66] mb-2">Visitors</p>
                        <p className="text-sm text-[#14161A]" style={{ fontFamily: "var(--font-mono)" }}>
                            {analytics.available ? analytics.visitors.toLocaleString() : "—"}
                        </p>
                    </div>
                </div>

                {analytics.available ? (
                    <div>
                        <div className="flex items-center justify-between text-xs text-[#5B5F66] mb-3">
                            <span>Last 7 days</span>
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
                                                className="w-full rounded-t-md bg-[#3355FF] opacity-80"
                                                style={{ height: `${height}%` }}
                                                title={`${point.date}: ${point.pageviews} pageviews`}
                                            />
                                            <span className="text-[10px] text-[#5B5F66]" style={{ fontFamily: "var(--font-mono)" }}>
                                                {point.date.slice(5)}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="w-full text-sm text-[#5B5F66]">No analytics data for the selected range.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-[#5B5F66]">{analytics.message}</p>
                )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {SECTIONS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className={`group block ${cardBase} p-5 transition-all hover:border-[#3355FF]/40 hover:shadow-[0_4px_12px_rgba(20,22,26,0.06)]`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-medium text-[#14161A]" style={{ fontFamily: "var(--font-display)" }}>
                                {s.label}
                            </h3>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {counts[s.href] !== undefined && (
                                    <span className="text-xs text-[#5B5F66]" style={{ fontFamily: "var(--font-mono)" }}>
                                        {counts[s.href]}
                                    </span>
                                )}
                                <ChevronIcon className="w-4 h-4 text-[#9A9DA3] transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </div>
                        <p className="text-sm text-[#5B5F66] leading-relaxed">{s.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
