import SectionHeader from "./SectionHeader";
import { splitParagraphs } from "@/lib/format";

export default function CustomSection({ id, label, heading, body }) {
    const paragraphs = splitParagraphs(body);

    return (
        <section id={id} className="section custom-section">
            <div className="container">
                <SectionHeader label={label} heading={heading} />
                {paragraphs.length > 0 && (
                    <div className="custom-section__body" data-reveal>
                        {paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
