"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";
import Morph from "./motion/Morph";
import { ArrowRightIcon, GitHubIcon } from "./icons";
import { splitParagraphs, stripProtocol, truncate } from "@/lib/format";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { provenanceLabel } from "@/lib/projectDetail";

const PROVENANCE_ORDER = ["Client", "Personal"];
// The first projects in admin order get the large treatment under "All".
const FEATURED_COUNT = 2;

function summaryOf(project, maxLength) {
    return truncate(splitParagraphs(project.description)[0], maxLength);
}

function TagList({ tags, limit }) {
    const shown = tags.slice(0, limit);
    const hidden = tags.length - shown.length;
    if (shown.length === 0) return null;

    return (
        <ul className="project-tags" aria-label="Built with">
            {shown.map((tag) => (
                <li key={tag} className="tech-tag">{tag}</li>
            ))}
            {hidden > 0 && <li className="tech-tag tech-tag--more">+{hidden}</li>}
        </ul>
    );
}

function ProjectMeta({ project }) {
    return (
        <p className="project-meta">
            <span>{provenanceLabel(project.provenance)}</span>
            {project.year && <span>{project.year}</span>}
        </p>
    );
}

function ProjectCover({ project, sizes, className }) {
    return (
        <div className={className}>
            {project.imageUrl ? (
                <Image src={project.imageUrl} alt="" fill sizes={sizes} className="project-cover" />
            ) : (
                <div className="project-cover project-cover--empty" aria-hidden="true" />
            )}
        </div>
    );
}

function FeaturedProject({ project, index }) {
    return (
        <Link
            href={`/projects/${project.id}`}
            className={`featured-project ${index % 2 === 1 ? "featured-project--flip" : ""}`}
            data-reveal
        >
            <ProjectCover project={project} sizes="(min-width: 900px) 58vw, 100vw" className="featured-project__media" />
            <div className="featured-project__body">
                <ProjectMeta project={project} />
                <Morph name={`project-title-${project.id}`}>
                    <h3 className="featured-project__title">{project.title}</h3>
                </Morph>
                <p className="featured-project__summary">{summaryOf(project, 220)}</p>
                {project.outcome && <p className="featured-project__outcome">{project.outcome}</p>}
                <TagList tags={project.tags} limit={4} />
                <span className="featured-project__cta">
                    Read the case study
                    <ArrowRightIcon size={16} />
                </span>
            </div>
        </Link>
    );
}

// Tilts the card toward the pointer and moves a soft glare with it, by
// writing CSS variables directly (no React state, no re-render per move).
function tiltToward(event) {
    if (event.pointerType !== "mouse" || prefersReducedMotion() || !hasFinePointer()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${((0.5 - y) * 6).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${((x - 0.5) * 8).toFixed(2)}deg`);
    card.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
}

function resetTilt(event) {
    const card = event.currentTarget;
    ["--tilt-x", "--tilt-y", "--glare-x", "--glare-y"].forEach((property) => card.style.removeProperty(property));
}

function ProjectCard({ project, index }) {
    return (
        <li className="project-grid__item" style={{ "--i": index }}>
            <Link href={`/projects/${project.id}`} className="project-card" onPointerMove={tiltToward} onPointerLeave={resetTilt}>
                <ProjectCover project={project} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="project-card__media" />
                <div className="project-card__body">
                    <ProjectMeta project={project} />
                    <Morph name={`project-title-${project.id}`}>
                        <h3 className="project-card__title">{project.title}</h3>
                    </Morph>
                    <p className="project-card__summary">{summaryOf(project, 130)}</p>
                    <TagList tags={project.tags} limit={3} />
                </div>
            </Link>
        </li>
    );
}

// Segmented filter with a pill that slides to the selected option.
function ProjectFilter({ options, counts, value, onChange }) {
    const groupRef = useRef(null);

    useLayoutEffect(() => {
        const group = groupRef.current;
        if (!group) return;

        function placePill() {
            const selected = group.querySelector('[aria-pressed="true"]');
            if (!selected) return;
            group.style.setProperty("--pill-x", `${selected.offsetLeft}px`);
            group.style.setProperty("--pill-width", `${selected.offsetWidth}px`);
        }

        placePill();
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(placePill);
        observer?.observe(group);
        return () => observer?.disconnect();
    }, [value]);

    return (
        <div ref={groupRef} className="project-filter" role="group" aria-label="Filter projects">
            <span className="project-filter__pill" aria-hidden="true" />
            {options.map((option) => {
                const count = counts[option] || 0;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        aria-label={`${option} ${count}`}
                        aria-pressed={value === option}
                        disabled={count === 0}
                        className="project-filter__option"
                    >
                        {option} <span className="project-filter__count">{count}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default function Projects({ projects = [], profile, label = "Projects", heading = "Things I’ve built" }) {
    const [filter, setFilter] = useState("All");

    const counts = useMemo(() => {
        const byProvenance = { All: projects.length };
        for (const project of projects) {
            byProvenance[project.provenance] = (byProvenance[project.provenance] || 0) + 1;
        }
        return byProvenance;
    }, [projects]);

    const filtered = filter === "All" ? projects : projects.filter((project) => project.provenance === filter);
    const featured = filter === "All" ? filtered.slice(0, FEATURED_COUNT) : [];
    const rest = filter === "All" ? filtered.slice(FEATURED_COUNT) : filtered;

    return (
        <section id="projects" className="section projects">
            <div className="container">
                <SectionHeader label={label} heading={heading}>
                    <ProjectFilter options={["All", ...PROVENANCE_ORDER]} counts={counts} value={filter} onChange={setFilter} />
                </SectionHeader>

                {featured.length > 0 && (
                    <div className="featured-projects">
                        {featured.map((project, index) => (
                            <FeaturedProject key={project.id} project={project} index={index} />
                        ))}
                    </div>
                )}

                {filtered.length === 0 && <p className="projects__empty">No projects match this filter yet.</p>}

                {(rest.length > 0 || profile?.github) && (
                    // Keyed by filter so a new selection remounts the grid and its cards re-enter in sequence.
                    <ul key={filter} className="project-grid" data-reveal>
                        {rest.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                        {profile?.github && (
                            <li className="project-grid__item" style={{ "--i": rest.length }}>
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="project-card project-card--github">
                                    <GitHubIcon size={28} />
                                    <span className="project-card--github__title">More on GitHub</span>
                                    <span className="project-card--github__handle">{stripProtocol(profile.github)}</span>
                                </a>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </section>
    );
}
