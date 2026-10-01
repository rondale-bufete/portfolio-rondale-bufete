import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getPortfolioData } from "@/lib/data";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";
import PublicSite from "@/components/PublicSite";
import { pageShell } from "@/components/SectionHeader";

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const { id } = await params;
    const project = await getProjectById(id);

    return {
        title: project ? `${project.title} | Portfolio` : "Project Not Found | Portfolio",
        description: project?.description || "Project details from the portfolio.",
    };
}

export default async function ProjectDetailsPage({ params }) {
    const { id } = await params;
    const [project, data] = await Promise.all([getProjectById(id), getPortfolioData()]);

    if (!project) notFound();

    const index = data.projects.findIndex((p) => p.id === project.id);
    const prevProject = index > 0 ? data.projects[index - 1] : null;
    const nextProject = index >= 0 && index < data.projects.length - 1 ? data.projects[index + 1] : null;

    return (
        <PublicSite profile={data.profile} sections={data.sections}>
            <article className={`${pageShell} project-detail`}>
                <div className="pt-6 pb-4 flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)]">
                    <Link href="/projects" className="hover:text-[var(--color-text)] transition-colors">~/projects</Link>
                    <span>/</span>
                    <span className="text-[var(--color-text)]">{project.title.toLowerCase().replace(/\s+/g, "-")}</span>
                </div>

                <header className="project-detail__heading mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--color-border)] pb-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4 font-[family-name:var(--font-mono)] text-xs">
                            <span className="tag tag-accent">{project.provenance.toLowerCase()}</span>
                            {project.liveUrl && <span className="tag tag-live">● live</span>}
                        </div>
                        <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium leading-tight sm:text-5xl tracking-tight text-[var(--color-text)]">
                            {project.title}
                        </h1>
                        {project.description && (
                            <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-body)]">{project.description}</p>
                        )}
                    </div>
                    <div className="flex gap-2.5 font-[family-name:var(--font-mono)] text-sm shrink-0">
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                open live ↗
                            </a>
                        )}
                        {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                view repo ↗
                            </a>
                        )}
                    </div>
                </header>

                <section className="project-detail__media mb-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <ProjectImageCarousel images={project.imageUrls} title={project.title} />

                    <aside className="rounded-[var(--radius-lg)] border border-[var(--color-border)] font-[family-name:var(--font-mono)] text-[13px] self-start">
                        <div className="px-[18px] py-3 border-b border-[var(--color-border)] text-[var(--color-faint)]">project.json</div>
                        <div className="p-[18px] flex flex-col gap-3">
                            <div className="grid grid-cols-[80px_1fr] gap-2.5">
                                <span className="text-[var(--color-faint)]">origin</span>
                                <span className="text-[var(--color-text)]">{project.provenance.toLowerCase()}</span>
                            </div>
                            {project.liveUrl && (
                                <div className="grid grid-cols-[80px_1fr] gap-2.5">
                                    <span className="text-[var(--color-faint)]">status</span>
                                    <span className="text-[var(--color-live)]">live</span>
                                </div>
                            )}
                            {project.role && (
                                <div className="grid grid-cols-[80px_1fr] gap-2.5">
                                    <span className="text-[var(--color-faint)]">role</span>
                                    <span className="text-[var(--color-text)]">{project.role}</span>
                                </div>
                            )}
                            {project.timeline && (
                                <div className="grid grid-cols-[80px_1fr] gap-2.5">
                                    <span className="text-[var(--color-faint)]">timeline</span>
                                    <span className="text-[var(--color-text)]">{project.timeline}</span>
                                </div>
                            )}
                            {project.outcome && (
                                <div className="grid grid-cols-[80px_1fr] gap-2.5">
                                    <span className="text-[var(--color-faint)]">outcome</span>
                                    <span className="text-[var(--color-accent)]">{project.outcome}</span>
                                </div>
                            )}
                            {project.tags.length > 0 && (
                                <div className="grid grid-cols-[80px_1fr] gap-2.5">
                                    <span className="text-[var(--color-faint)]">stack</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="tag tag-neutral">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </section>

                <div className="flex flex-col gap-14">
                    <section>
                        <h2 className="eyebrow mb-4">{"// 01 — Overview"}</h2>
                        <p className="max-w-3xl whitespace-pre-line text-[16px] leading-7 text-[var(--color-body)]">
                            {project.description || "No description available."}
                        </p>
                    </section>

                    {project.highlights.length > 0 && (
                        <section>
                            <h2 className="eyebrow mb-4">{"// 02 — Key highlights"}</h2>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {project.highlights.map((highlight, i) => (
                                    <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[18px]">
                                        <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)] mb-2.5">
                                            0x{String(i + 1).padStart(2, "0")}
                                        </div>
                                        <div className="text-[15px] leading-relaxed text-[var(--color-body)]">{highlight}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {(prevProject || nextProject) && (
                    <div className="mt-16 grid gap-3.5 sm:grid-cols-2">
                        {prevProject ? (
                            <Link href={`/projects/${prevProject.id}`} className="flex flex-col gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-border-strong)]">
                                <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)]">← prev · {String(index).padStart(2, "0")}</span>
                                <span className="text-lg font-medium text-[var(--color-text)]">{prevProject.title}</span>
                            </Link>
                        ) : <div />}
                        {nextProject && (
                            <Link href={`/projects/${nextProject.id}`} className="flex flex-col items-end gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 text-right transition-colors hover:border-[var(--color-border-strong)]">
                                <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)]">next · {String(index + 2).padStart(2, "0")} →</span>
                                <span className="text-lg font-medium text-[var(--color-text)]">{nextProject.title}</span>
                            </Link>
                        )}
                    </div>
                )}
            </article>
        </PublicSite>
    );
}
