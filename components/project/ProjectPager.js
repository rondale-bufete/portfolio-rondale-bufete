import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

export default function ProjectPager({ previous, next }) {
    if (!previous && !next) return null;

    return (
        <nav className="project-pager" aria-label="More projects">
            {previous ? (
                <Link href={`/projects/${previous.id}`} className="project-pager__link">
                    <span className="project-pager__label">
                        <ArrowLeftIcon size={16} />
                        Previous project
                    </span>{" "}
                    <span className="project-pager__title">{previous.title}</span>
                </Link>
            ) : (
                <span aria-hidden="true" />
            )}
            {next && (
                <Link href={`/projects/${next.id}`} className="project-pager__link project-pager__link--next">
                    <span className="project-pager__label">
                        Next project
                        <ArrowRightIcon size={16} />
                    </span>{" "}
                    <span className="project-pager__title">{next.title}</span>
                </Link>
            )}
        </nav>
    );
}
