import Image from "next/image";
import Link from "next/link";

const DESCRIPTION_PREVIEW_LENGTH = 200;

export default function ProjectCard({ project }) {
    const description = project.description || "";
    const descriptionPreview = description.length > DESCRIPTION_PREVIEW_LENGTH
        ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
        : description;

    return (
        <article className="group relative border border-[#E4E4E7] rounded-xl overflow-hidden bg-white hover:border-[#3355FF] transition-colors">
            <Link
                href={`/projects/${project.id}`}
                aria-label={`View ${project.title} project details`}
                className="absolute inset-0 z-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3355FF] focus-visible:ring-inset"
            />

            <div className="relative z-10 aspect-video bg-[#ffffff] overflow-hidden pointer-events-none">
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9A9DA3] text-sm font-mono">
                        [ screenshot placeholder ]
                    </div>
                )}
            </div>

            <div className="relative z-10 p-6 pointer-events-none">
                <h3 className="font-(family-name:--font-display) text-xl font-medium mb-2">
                    {project.title}
                </h3>

                <p className="mb-2 text-[#5B5F66] text-sm leading-relaxed text-justify">
                    {descriptionPreview || "No description available."}
                </p>

                <div className="flex items-center gap-4 text-sm font-medium mb-5">
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="relative z-20 pointer-events-auto text-[#3355FF] hover:underline">
                            Live demo &rarr;
                        </a>
                    )}
                    {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="relative z-20 pointer-events-auto text-[#5B5F66] hover:text-[#14161A] transition-colors">
                            View code
                        </a>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="font-mono text-xs px-2.5 py-1 rounded bg-[#F0F0F2] text-[#5B5F66]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}
