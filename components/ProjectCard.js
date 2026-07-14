import Image from "next/image";

export default function ProjectCard({ project }) {
    return (
        <div className="group border border-[#E4E4E7] rounded-xl overflow-hidden bg-white hover:border-[#3355FF] transition-colors">
            <div className="relative aspect-video bg-[#F0F0F2] overflow-hidden">
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9A9DA3] text-sm font-[family-name:var(--font-mono)]">
                        [ screenshot placeholder ]
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-medium mb-2">
                    {project.title}
                </h3>
                <p className="text-[#5B5F66] text-sm leading-relaxed mb-4">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="font-[family-name:var(--font-mono)] text-xs px-2.5 py-1 rounded bg-[#F0F0F2] text-[#5B5F66]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-sm font-medium">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#3355FF] hover:underline">
                        Live demo →
                    </a>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[#5B5F66] hover:text-[#14161A] transition-colors">
                        View code
                    </a>
                </div>
            </div>
        </div>
    );
}