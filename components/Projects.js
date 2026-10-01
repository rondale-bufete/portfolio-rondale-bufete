"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import SectionHeader, { pageShell } from "./SectionHeader";
import { stripProtocol } from "@/lib/format";

const PROVENANCE_ORDER = ["Client", "Capstone", "Personal"];

function ProjectCard({ project, index }) {
    return (
        <Link
            href={`/projects/${project.id}`}
            className="project-card flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-colors hover:border-[var(--color-border-strong)]"
        >
            <div className="project-card__image relative aspect-video bg-[var(--color-raised)]">
                {project.imageUrl ? (
                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover object-top" sizes="(min-width: 1024px) 33vw, 100vw" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-faint)]">
                        [ preview unavailable ]
                    </div>
                )}
            </div>
            <div className="project-card__content p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)]">
                    <span>
                        {String(index + 1).padStart(2, "0")} · <span className="text-[var(--color-accent)]">{project.provenance.toLowerCase()}</span>
                    </span>
                    <span>{project.year || ""}</span>
                </div>
                <div className="font-[family-name:var(--font-display)] text-lg font-medium tracking-tight text-[var(--color-text)]">
                    {project.title}
                </div>
                <div className="text-sm text-[var(--color-body)] leading-relaxed line-clamp-2">{project.description}</div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-faint)] truncate">
                    {project.tags.join(" · ")}
                </div>
            </div>
        </Link>
    );
}

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
        <section id="projects" className={`${pageShell} projects-page`}>
            <div className="projects-heading flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
                <SectionHeader label={label} heading={heading} className="mb-0" />
                <div className="projects-filter flex flex-wrap gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] p-1 font-[family-name:var(--font-mono)] text-[13px]">
                    {["All", ...PROVENANCE_ORDER].map((p) => {
                        const count = p === "All" ? counts.All : counts[p] || 0;
                        const active = filter === p;
                        return (
                            <button
                                key={p}
                                onClick={() => setFilter(p)}
                                aria-label={`${p} ${count}`}
                                aria-pressed={active}
                                disabled={count === 0}
                                className={`projects-filter__button rounded-[4px] px-3.5 py-1.5 whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                    active ? "bg-[var(--color-accent)] text-[var(--color-bg)]" : "text-[var(--color-body)] hover:text-[var(--color-text)]"
                                }`}
                            >
                                {p} <span className="projects-filter__count">{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="project-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                ))}

                {filtered.length === 0 && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-faint)]">
                        No projects match this filter yet.
                    </p>
                )}

                {profile?.github && (
                    <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card project-card--github flex flex-col justify-center gap-2.5 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] p-6 font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-body)] transition-colors hover:border-[var(--color-body)]"
                    >
                        <span>More on GitHub</span>
                        <span className="text-[var(--color-text)]">{stripProtocol(profile.github)} ↗</span>
                    </a>
                )}
            </div>
        </section>
    );
}
