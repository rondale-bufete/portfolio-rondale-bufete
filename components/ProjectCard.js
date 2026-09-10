import Image from "next/image";
import Link from "next/link";

const DESCRIPTION_PREVIEW_LENGTH = 200;

export default function ProjectCard({ project }) {
    const description = project.description || "";
    const descriptionPreview = description.length > DESCRIPTION_PREVIEW_LENGTH
        ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
        : description;

    return (
        <article className="group relative border-2 border-[var(--color-divider)] overflow-hidden bg-[var(--color-bg)] hover:border-[var(--color-text)] transition-colors">
            <Link
                href={`/projects/${project.id}`}
                aria-label={`View ${project.title} project details`}
                className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset"
            />

            <div className="relative z-10 aspect-video bg-[var(--color-neutral-200)] overflow-hidden pointer-events-none">
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-neutral-500)] text-sm font-[family-name:var(--font-mono)]">
                        [ screenshot placeholder ]
                    </div>
                )}
            </div>

            <div className="relative z-10 p-6 pointer-events-none">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[var(--color-text)] mb-2">
                    {project.title}
                </h3>

                <p className="mb-2 text-[var(--color-neutral-700)] text-sm leading-relaxed text-justify">
                    {descriptionPreview || "No description available."}
                </p>

                <div className="flex items-center gap-4 text-sm font-bold mb-5">
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="relative z-20 pointer-events-auto text-[var(--color-accent-700)] hover:underline">
                            Live demo &rarr;
                        </a>
                    )}
                    {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="relative z-20 pointer-events-auto text-[var(--color-neutral-700)] hover:text-[var(--color-text)] transition-colors">
                            View code
                        </a>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span key={tag} className="tag tag-neutral">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}
