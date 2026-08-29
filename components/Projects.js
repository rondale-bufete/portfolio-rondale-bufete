import ProjectCard from "./ProjectCard";
import { groupProjectsByCategory } from "@/lib/projectGrouping";

export default function Projects({ projects = [], label = "03 — Projects", heading = "Things I’ve built" }) {
    const groupedProjects = groupProjectsByCategory(projects);

    return (
        <section id="projects" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">{label}</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-10 max-w-xl">
                {heading}
            </h2>

            <div className="space-y-12">
                {groupedProjects.map(({ category, projects: categoryProjects }) => (
                    <div key={category} className="space-y-6">
                        <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[#5B5F66]">
                            {category}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {categoryProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
