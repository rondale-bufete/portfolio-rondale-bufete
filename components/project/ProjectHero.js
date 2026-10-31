import Link from "next/link";
import { provenanceLabel } from "@/lib/projectDetail";
import { ArrowLeftIcon, ExternalLinkIcon } from "./icons";

// Past this length the lead drops to body size, so a description written
// as one long paragraph doesn't turn into a wall of large text.
const LONG_LEAD_LENGTH = 280;

function ExternalLink({ href, className, children }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {children}
            <ExternalLinkIcon size={16} />
            <span className="sr-only"> (opens in a new tab)</span>
        </a>
    );
}

function buildFacts(project) {
    return [
        project.role && { term: "Role", detail: project.role },
        { term: "Type", detail: provenanceLabel(project.provenance) },
        project.year && { term: "Year", detail: project.year },
        project.timeline && { term: "Timeline", detail: project.timeline },
        project.outcome && { term: "Outcome", detail: project.outcome, isEmphasis: true },
    ].filter(Boolean);
}

export default function ProjectHero({ project, lead }) {
    const facts = buildFacts(project);
    const hasPublicLinks = Boolean(project.liveUrl || project.repoUrl);

    return (
        <header className="project-hero">
            <Link href="/#projects" className="project-hero__back">
                <ArrowLeftIcon size={16} />
                All projects
            </Link>

            <div className="project-hero__body">
                <div className="project-hero__intro">
                    <h1 className="project-hero__title">{project.title}</h1>

                    {lead && (
                        <p className={`project-hero__lead ${lead.length > LONG_LEAD_LENGTH ? "is-long" : ""}`}>{lead}</p>
                    )}

                    <div className="project-hero__actions">
                        {project.liveUrl && (
                            <ExternalLink href={project.liveUrl} className="project-button project-button--primary">
                                Visit live site
                            </ExternalLink>
                        )}
                        {project.repoUrl && (
                            <ExternalLink href={project.repoUrl} className="project-button project-button--secondary">
                                View source code
                            </ExternalLink>
                        )}
                        {!hasPublicLinks && (
                            <Link href="/#contact" className="project-button project-button--secondary">
                                Ask me about this project
                            </Link>
                        )}
                    </div>
                </div>

                <dl className="project-facts">
                    {facts.map((fact) => (
                        <div key={fact.term} className={`project-facts__row ${fact.isEmphasis ? "is-emphasis" : ""}`}>
                            <dt>{fact.term}</dt>
                            <dd>{fact.detail}</dd>
                        </div>
                    ))}
                    {project.tags.length > 0 && (
                        <div className="project-facts__row">
                            <dt>Built with</dt>
                            <dd>
                                <ul className="project-facts__tags">
                                    {project.tags.map((tag) => (
                                        <li key={tag} className="tag">{tag}</li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
        </header>
    );
}
