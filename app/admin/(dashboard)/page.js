import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium mb-1">
                Overview
            </h1>
            <p className="text-sm text-[#5B5F66] mb-8">
                Edits here go live on your site within a minute (or immediately, since every save
                revalidates the homepage).
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
                {SECTIONS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className="block rounded-xl border border-[#E4E4E7] bg-white p-5 hover:border-[#3355FF] transition-colors"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-[family-name:var(--font-display)] font-medium">{s.label}</h3>
                            {counts[s.href] !== undefined && (
                                <span className="font-[family-name:var(--font-mono)] text-xs text-[#5B5F66]">
                                    {counts[s.href]}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-[#5B5F66]">{s.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
