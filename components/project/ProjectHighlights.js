import { splitHighlight } from "@/lib/projectDetail";

export default function ProjectHighlights({ highlights }) {
    return (
        <ul className="project-highlights">
            {highlights.map((highlight, index) => {
                const { label, text } = splitHighlight(highlight);
                return (
                    <li key={index} className="project-highlights__item">
                        {label && <strong className="project-highlights__label">{label}</strong>}
                        <span>{text}</span>
                    </li>
                );
            })}
        </ul>
    );
}
