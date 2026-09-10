import ProjectCard from "./ProjectCard";
import SectionHeader, { sectionShell } from "./SectionHeader";
import { groupProjectsByCategory } from "@/lib/projectGrouping";

export default function Projects({ projects = [], label = "03 — Projects", heading = "Things I’ve built" }) {
    const groupedProjects = groupProjectsByCategory(projects);

    return (
        <section id="projects" className={sectionShell}>
            <SectionHeader label={label} heading={heading} />

            <div className="space-y-12">
                {groupedProjects.map(({ category, projects: categoryProjects }) => (
                    <div key={category} className="space-y-6">
                        <h3 className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-neutral-600)]">
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
