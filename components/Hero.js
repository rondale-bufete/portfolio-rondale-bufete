import Link from "next/link";
import { pageShell } from "./SectionHeader";
import InfoRow from "./InfoRow";
import { provenanceTagClass } from "@/lib/projectGrouping";

export default function Hero({ profile, projects = [], education = [], skills = [] }) {
    if (!profile) return null;

    const coreStack = skills.flatMap((g) => g.items).slice(0, 8);
    const topProjects = projects.slice(0, 3);
    const firstEducation = education[0];

    return (
        <section className={pageShell}>
            <div className="grid md:grid-cols-[1.55fr_1fr] border-b-2 border-[var(--color-divider)]">
                <div className="py-10 pr-8 md:border-r-2 md:border-[var(--color-divider)]">
                    <p className="eyebrow mb-4">
                        {profile.role}
                        {profile.location ? ` · ${profile.location}` : ""}
                    </p>
                    <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.05] mb-6 text-[var(--color-text)] max-w-lg">
                        {profile.tagline}
                    </h1>
                    <p className="text-[15px] leading-relaxed text-[var(--color-neutral-800)] max-w-md mb-7">
                        {profile.bio}
                    </p>
                    <div className="flex items-center gap-3">
                        <Link href="/projects" className="btn btn-primary">
                            See the work <span aria-hidden="true">→</span>
                        </Link>
                        <Link href="/about" className="btn btn-secondary">
                            Read the résumé
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col bg-[var(--color-neutral-100)]">
                    <InfoRow label="Based" value={profile.location} placeholder="Add your location" />
                    <InfoRow
                        label="Degree"
                        value={firstEducation ? `${firstEducation.degree}${firstEducation.school ? ` · ${firstEducation.school}` : ""}` : null}
                        placeholder="Add your education"
                    />
                    <InfoRow label="Open to" value={profile.openTo} placeholder="Add your availability" />
                    {coreStack.length > 0 && (
                        <div className="px-6 py-4 flex-1">
                            <p className="field-label mb-2.5">
                                Core stack
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {coreStack.map((item) => (
                                    <span key={item} className="tag tag-neutral">{item}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {topProjects.length > 0 && (
                <>
                    <div className="flex items-baseline justify-between pt-6 pb-2">
                        <h2 className="font-[family-name:var(--font-display)] text-[15px] font-extrabold tracking-[0.02em] text-[var(--color-text)]">
                            FEATURED PROJECTS
                        </h2>
                        <Link href="/projects" className="font-semibold text-[11.5px] text-[var(--color-accent-700)]">
                            All projects ({projects.length}) <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <div className="border-t-2 border-[var(--color-divider)] pb-6">
                        {topProjects.map((project, i) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className={`grid grid-cols-[2rem_1fr_auto_1.5rem] sm:grid-cols-[2rem_1fr_190px_130px_1.5rem] items-center gap-4 py-4 border-b-2 border-[var(--color-divider)] hover:bg-[var(--color-neutral-100)] transition-colors ${i === topProjects.length - 1 ? "border-b-0" : ""}`}
                            >
                                <div className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-neutral-500)]">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-[var(--color-text)]">
                                        {project.title}
                                    </div>
                                    <div className="mt-1 line-clamp-1 text-[13px] text-[var(--color-neutral-700)]">{project.description}</div>
                                </div>
                                <div className="hidden min-w-0 truncate font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-neutral-600)] sm:block">
                                    {project.tags.join(" · ")}
                                </div>
                                <div className="hidden sm:flex flex-col gap-1 items-start">
                                    <span className={`tag ${provenanceTagClass(project.provenance)}`}>
                                        {project.provenance.toUpperCase()}{project.liveUrl ? " · LIVE" : ""}
                                    </span>
                                    {project.year && (
                                        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-neutral-500)]">
                                            {project.year}
                                        </span>
                                    )}
                                </div>
                                <div className="font-bold text-[var(--color-accent)] text-right" aria-hidden="true">→</div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
