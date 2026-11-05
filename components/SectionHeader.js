import { stripOrdinal } from "@/lib/format";

// Every homepage section opens the same way: a rule draws across and the
// heading rises into place (globals.css, "section header"). `children` sits
// opposite the heading, e.g. the project filter.
export default function SectionHeader({ label, heading, children }) {
    const title = heading || stripOrdinal(label);

    return (
        <div className="section-header" data-reveal>
            {title && (
                <h2 className="section-header__title">
                    <span>{title}</span>
                </h2>
            )}
            {children && <div className="section-header__aside">{children}</div>}
        </div>
    );
}
