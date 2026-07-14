import { projects } from "@/data/portfolio";
import ProjectCard from "./ProjectCard";

export default function Projects() {
    return (
        <section id="projects" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">03 — Projects</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-10 max-w-xl">
                Things I&rsquo;ve built
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.title} project={project} />
                ))}
            </div>
        </section>
    );
}