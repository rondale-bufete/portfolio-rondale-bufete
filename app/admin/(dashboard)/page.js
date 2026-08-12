import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
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
    ] = await Promise.all([
        supabaseAdmin.from("experience").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("projects").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("certifications").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("education").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("skill_categories").select("*", { count: "exact", head: true }),
    ]);

    const counts = {
        "/admin/experience": experienceCount,
        "/admin/projects": projectCount,
        "/admin/certifications": certCount,
        "/admin/education": eduCount,
        "/admin/skills": skillCount,
    };

    return (
        <div>
            <PageHeader
                title="Overview"
                description="Edits here go live on your site within a minute — every save also revalidates the homepage immediately."
            />

            <div className="grid sm:grid-cols-2 gap-4">
                {SECTIONS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className={`group block ${cardBase} p-5 transition-all hover:border-[#3355FF]/40 hover:shadow-[0_4px_12px_rgba(20,22,26,0.06)]`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-[family-name:var(--font-display)] font-medium text-[#14161A]">
                                {s.label}
                            </h3>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {counts[s.href] !== undefined && (
                                    <span className="font-[family-name:var(--font-mono)] text-xs text-[#5B5F66]">
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
