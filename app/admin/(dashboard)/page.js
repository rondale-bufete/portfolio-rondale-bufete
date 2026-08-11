import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

const SECTIONS = [
    { href: "/admin/profile", label: "Profile", desc: "Name, bio, tagline, contact links, photo, resume." },
    { href: "/admin/projects", label: "Projects", desc: "The project grid on your homepage." },
    { href: "/admin/certifications", label: "Certifications", desc: "Certs shown under About." },
    { href: "/admin/education", label: "Education", desc: "The education timeline under About." },
    { href: "/admin/skills", label: "Skills", desc: "Skill categories and the tags inside them." },
];

export default async function AdminOverview() {
    const [{ count: projectCount }, { count: certCount }, { count: eduCount }, { count: skillCount }] =
        await Promise.all([
            supabaseAdmin.from("projects").select("*", { count: "exact", head: true }),
            supabaseAdmin.from("certifications").select("*", { count: "exact", head: true }),
            supabaseAdmin.from("education").select("*", { count: "exact", head: true }),
            supabaseAdmin.from("skill_categories").select("*", { count: "exact", head: true }),
        ]);

    const counts = {
        "/admin/projects": projectCount,
        "/admin/certifications": certCount,
        "/admin/education": eduCount,
        "/admin/skills": skillCount,
    };

    return (
        <div>
            <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Dashboard
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900">
                    Overview
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    Edits here go live on your site within a minute (or immediately, since every save
                    revalidates the homepage).
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {SECTIONS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className="group block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-[0_12px_24px_rgba(79,70,229,0.08)]"
                    >
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <h3 className="font-[family-name:var(--font-display)] text-lg font-medium text-slate-900">
                                {s.label}
                            </h3>
                            {counts[s.href] !== undefined && (
                                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                                    {counts[s.href]}
                                </span>
                            )}
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{s.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
