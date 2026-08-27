import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";

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
    const project = await getProjectById(id);

    if (!project) notFound();

    return (
        <main className="min-h-screen bg-[#FAFAFA] px-6 py-10 text-[#14161A] sm:py-14">
            <article className="mx-auto max-w-4xl">
                <Link
                    href="/#projects"
                    className="mb-10 inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-[#5B5F66] transition-colors hover:bg-[#EEF0F3] hover:text-[#14161A] focus:outline-none focus:ring-2 focus:ring-[#3355FF] focus:ring-offset-2"
                >
                    <span
                        aria-hidden="true"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D9DDE5] bg-white text-xs"
                    >
                        &larr;
                    </span>
                    Back to projects
                </Link>

                <header className="mb-10 border-b border-[#E4E4E7] pb-8 sm:pb-10">
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#3355FF]">
                        Project details
                    </p>
                    <h1 className="max-w-3xl font-(family-name:--font-display) text-3xl font-medium leading-tight sm:text-5xl">
                        {project.title}
                    </h1>
                </header>

                <section className="mb-12 grid gap-6 lg:grid-cols-[18rem_1fr]">
                    {project.imageUrl ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#14161A] shadow-[0_1px_2px_rgba(20,22,26,0.04)]">
                            <Image
                                src={project.imageUrl}
                                alt={`${project.title} project preview`}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 288px"
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#14161A] text-center font-mono text-xs uppercase tracking-[0.14em] text-[#9A9DA3]">
                            Preview unavailable
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        {project.liveUrl && (
                            <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#E4E4E7] bg-white p-5">
                                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9A9DA3]">
                                    Live demo
                                </p>
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3355FF] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3355FF] focus:ring-offset-2"
                                >
                                    Visit site
                                    <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        )}

                        {project.repoUrl && (
                            <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#E4E4E7] bg-white p-5">
                                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9A9DA3]">
                                    Source code
                                </p>
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#454951] hover:text-[#14161A] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3355FF] focus:ring-offset-2"
                                >
                                    View repository
                                    <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        )}

                        {project.tags.length > 0 && (
                            <div
                                className={`rounded-xl border border-[#E4E4E7] bg-white p-5 ${project.liveUrl && project.repoUrl ? "sm:col-span-2" : ""
                                    }`}
                            >
                                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9A9DA3]">
                                    Technology stack
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-md border border-[#D9DDE5] bg-[#FAFAFA] px-3 py-1.5 font-mono text-xs text-[#454951]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="space-y-12">
                    <section>
                        <h2 className="mb-4 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#3355FF]">
                            <span className="h-px w-6 bg-[#3355FF]" />
                            Overview
                        </h2>
                        <p className="whitespace-pre-line text-[15px] leading-7 text-[#454951]">
                            {project.description || "No description available."}
                        </p>
                    </section>

                    {project.highlights.length > 0 && (
                        <section>
                            <h2 className="mb-4 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#3355FF]">
                                <span className="h-px w-6 bg-[#3355FF]" />
                                Key highlights
                            </h2>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {project.highlights.map((highlight, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-3 rounded-lg border border-[#E4E4E7] bg-white p-4 text-sm leading-6 text-[#454951] transition-colors hover:border-[#D9DDE5]"
                                    >
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8EDFF] font-mono text-xs text-[#3355FF]">
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
    );
}