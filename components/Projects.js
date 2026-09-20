"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SectionHeader, { pageShell } from "./SectionHeader";
import { provenanceTagClass } from "@/lib/projectGrouping";
import { stripProtocol } from "@/lib/format";

const PROVENANCE_ORDER = ["Client", "Capstone", "Personal"];

export default function Projects({ projects = [], profile, label = "03 — Projects", heading = "Things I’ve built" }) {
    const [filter, setFilter] = useState("All");

    const counts = useMemo(() => {
        const byProvenance = { All: projects.length };
        for (const p of PROVENANCE_ORDER) byProvenance[p] = 0;
        for (const project of projects) {
            byProvenance[project.provenance] = (byProvenance[project.provenance] || 0) + 1;
        }
        return byProvenance;
    }, [projects]);

    const filtered = filter === "All" ? projects : projects.filter((p) => p.provenance === filter);

    return (
        <section className={pageShell}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
                <SectionHeader label={label} heading={heading} className="mb-0" />
                <div className="flex flex-wrap gap-1.5">
                    {["All", ...PROVENANCE_ORDER].map((p) => (
                        <button
                            key={p}
                            onClick={() => setFilter(p)}
                            aria-pressed={filter === p}
                            className={`tag ${filter === p ? "tag-accent" : "tag-outline"}`}
                        >
                            {p === "All" ? `ALL ${counts.All}` : `${p} ${counts[p] || 0}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b-2 border-[var(--color-divider)]">
                            <th className="field-label w-10 py-2.5 pr-2">#</th>
                            <th className="field-label py-2.5 px-2">Project</th>
                            <th className="field-label hidden md:table-cell py-2.5 px-2 w-[220px]">Stack</th>
                            <th className="field-label py-2.5 px-2 w-[110px]">Origin</th>
                            <th className="field-label hidden sm:table-cell py-2.5 px-2 w-[160px]">Outcome</th>
                            <th className="field-label py-2.5 pl-2 w-[56px]">Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((project, i) => (
                            <tr key={project.id} className="border-b border-[var(--color-divider)] hover:bg-[var(--color-neutral-100)] transition-colors">
                                <td className="py-3.5 pr-2 align-top font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-neutral-500)]">
                                    {String(i + 1).padStart(2, "0")}
                                </td>
                                <td className="py-3.5 px-2 align-top">
                                    <Link href={`/projects/${project.id}`} className="font-[family-name:var(--font-display)] text-[15px] font-extrabold text-[var(--color-text)] hover:text-[var(--color-accent-700)] transition-colors">
                                        {project.title}
                                    </Link>
                                    <div className="mt-1 text-[12px] leading-relaxed text-[var(--color-neutral-700)]">{project.description}</div>
                                </td>
                                <td className="hidden md:table-cell py-3.5 px-2 align-top font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--color-neutral-600)]">
                                    {project.tags.join(", ")}
                                </td>
                                <td className="py-3.5 px-2 align-top">
                                    <span className={`tag ${provenanceTagClass(project.provenance)}`}>{project.provenance.toUpperCase()}</span>
                                </td>
                                <td className="hidden sm:table-cell py-3.5 px-2 align-top text-[11px] font-semibold text-[var(--color-text)]">
                                    {project.outcome || "—"}
                                </td>
                                <td className="py-3.5 pl-2 align-top font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-neutral-600)]">
                                    {project.year || "—"}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-sm text-[var(--color-neutral-500)]">
                                    No projects match this filter yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {profile?.github && (
                <div className="mt-6 p-4 border-2 border-[var(--color-divider)] flex items-center justify-between gap-4">
                    <p className="text-[12.5px] leading-relaxed text-[var(--color-neutral-700)]">
                        More projects and contributions are on GitHub.
                    </p>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary whitespace-nowrap">
                        {stripProtocol(profile.github)}
                    </a>
                </div>
            )}
        </section>
    );
}
