import { notFound } from "next/navigation";
import { getProjectById, getPortfolioData } from "@/lib/data";
import PublicSite from "@/components/PublicSite";
import ProjectHero from "@/components/project/ProjectHero";
import ProjectGallery from "@/components/project/ProjectGallery";
import ProjectSection from "@/components/project/ProjectSection";
import ProjectHighlights from "@/components/project/ProjectHighlights";
import ProjectPager from "@/components/project/ProjectPager";
import { splitParagraphs } from "@/lib/format";
import { adjacentProjects } from "@/lib/projectDetail";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const { id } = await params;
    const [project, { profile }] = await Promise.all([getProjectById(id), getPortfolioData()]);
    if (!project) return { title: "Project not found", robots: { index: false } };

    const siteName = profile?.name;
    return pageMetadata({
        siteName,
        title: siteName ? `${project.title} — ${siteName}` : project.title,
        description: splitParagraphs(project.description)[0],
        path: `/projects/${project.id}`,
        type: "article",
    });
}

export default async function ProjectDetailsPage({ params }) {
    const { id } = await params;
    const [project, data] = await Promise.all([getProjectById(id), getPortfolioData()]);

    if (!project) notFound();

    const { previous, next } = adjacentProjects(data.projects, project.id);

    // The first paragraph is the lead under the title; the rest becomes the
    // Overview, so a one-paragraph description is never shown twice.
    const [lead, ...overviewParagraphs] = splitParagraphs(project.description);
    const hasOverview = overviewParagraphs.length > 0;
    const hasHighlights = project.highlights.length > 0;

    return (
        <PublicSite profile={data.profile} sections={data.sections}>
            <article className="project-page">
                <div className="project-page__container">
                    <ProjectHero project={project} lead={lead} />
                </div>

                <ProjectGallery images={project.imageUrls} title={project.title} />

                <div className="project-page__container">
                    {(hasOverview || hasHighlights) && (
                        <div className="project-page__sections">
                            {hasOverview && (
                                <ProjectSection id="overview" title="Overview">
                                    {overviewParagraphs.map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </ProjectSection>
                            )}
                            {hasHighlights && (
                                <ProjectSection id="highlights" title="Highlights">
                                    <ProjectHighlights highlights={project.highlights} />
                                </ProjectSection>
                            )}
                        </div>
                    )}

                    <ProjectPager previous={previous} next={next} />
                </div>
            </article>
        </PublicSite>
    );
}
