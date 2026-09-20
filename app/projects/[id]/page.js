import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getPortfolioData } from "@/lib/data";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
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

    return (
        <>
        <Navbar profile={data.profile} sections={data.sections} />
        <main>
            <article className={pageShell}>
                <Link
                    href="/projects"
                    className="mb-10 inline-flex items-center gap-2 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                    <span
                        aria-hidden="true"
                        className="flex h-6 w-6 items-center justify-center border-2 border-[var(--color-divider)] bg-[var(--color-bg)] text-xs"
                    >
                        &larr;
                    </span>
                    Back to projects
                </Link>

                <header className="mb-10 border-b-2 border-[var(--color-divider)] pb-8 sm:pb-10">
                    <p className="eyebrow mb-3">
                        {[project.provenance, project.category, project.year].filter(Boolean).join(" · ")}
                    </p>
                    <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight sm:text-5xl">
                        {project.title}
                    </h1>

                    {(project.role || project.timeline || project.outcome) && (
                        <div className="mt-6 grid grid-cols-3 border-t-2 border-[var(--color-divider)]">
                            {project.role && (
                                <div className="py-3 pr-3 border-r-2 border-[var(--color-divider)]">
                                    <div className="field-label">Role</div>
                                    <div className="mt-1 font-bold text-[11.5px] text-[var(--color-text)]">{project.role}</div>
                                </div>
                            )}
                            {project.timeline && (
                                <div className="py-3 px-3 border-r-2 border-[var(--color-divider)]">
                                    <div className="field-label">Timeline</div>
                                    <div className="mt-1 font-bold text-[11.5px] text-[var(--color-text)]">{project.timeline}</div>
                                </div>
                            )}
                            {project.outcome && (
                                <div className="py-3 pl-3">
                                    <div className="field-label">Outcome</div>
                                    <div className="mt-1 font-bold text-[11.5px] text-[var(--color-accent-700)]">{project.outcome}</div>
                                </div>
                            )}
                        </div>
                    )}
                </header>

                <section className="mb-12 grid gap-6">
                    <ProjectImageCarousel images={project.imageUrls} title={project.title} />

                    {(project.tags.length > 0 || project.liveUrl) && (
                        <div className="border-2 border-[var(--color-divider)] bg-[var(--color-neutral-100)] p-5 sm:p-6">
                            <p className="field-label mb-3">
                                Technology stack
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="tag tag-neutral">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-accent-700)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                                >
                                    Visit live site
                                    <span aria-hidden="true">&rarr;</span>
                                </a>
                            )}
                        </div>
                    )}

                    {project.repoUrl && (
                        <div className="flex flex-col justify-between gap-4 border-2 border-[var(--color-divider)] bg-[var(--color-neutral-100)] p-5 sm:flex-row sm:items-center sm:p-6">
                            <p className="field-label">
                                Source code
                            </p>
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-neutral-700)] hover:text-[var(--color-text)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                            >
                                View repository
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    )}
                </section>

                <div className="space-y-12">
                    <section>
                        <h2 className="eyebrow mb-4 flex items-center gap-3">
                            <span className="h-px w-6 bg-[var(--color-accent)]" />
                            Overview
                        </h2>
                        <p className="max-w-3xl whitespace-pre-line text-[15px] leading-7 text-[var(--color-neutral-800)]">
                            {project.description || "No description available."}
                        </p>
                    </section>

                    {project.highlights.length > 0 && (
                        <section>
                            <h2 className="eyebrow mb-4 flex items-center gap-3">
                                <span className="h-px w-6 bg-[var(--color-accent)]" />
                                Key highlights
                            </h2>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {project.highlights.map((highlight, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-3 border-2 border-[var(--color-divider)] bg-[var(--color-bg)] p-4 text-sm leading-6 text-[var(--color-neutral-800)] transition-colors hover:border-[var(--color-text)]"
                                    >
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--color-accent-100)] font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-accent-700)]">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </article>
        </main>
        <Footer profile={data.profile} />
        <ChatWidget />
        </>
    );
}
