import Hero from "@/components/Hero";
import CustomSection from "@/components/CustomSection";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import PublicSite from "@/components/PublicSite";
import { getPortfolioData } from "@/lib/data";
import { buildPersonJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

// Revalidate this page at most once a minute so admin edits show up
// quickly without needing a full redeploy.
export const revalidate = 60;

export async function generateMetadata() {
    const { profile } = await getPortfolioData();
    if (!profile) return {};

    return pageMetadata({
        siteName: profile.name,
        title: [profile.name, profile.role].filter(Boolean).join(" — "),
        description: profile.bio || profile.tagline,
        path: "/",
    });
}

export default async function Home() {
    const data = await getPortfolioData();
    const { profile, sections, projects, education, skills, experience, certifications } = data;
    const personJsonLd = buildPersonJsonLd(data, getSiteUrl());

    return (
        <PublicSite profile={profile} sections={sections}>
            {personJsonLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }} />
            )}
            <Hero profile={profile} projects={projects} education={education} skills={skills} />
            {sections.map((section) => {
                if (section.kind === "about") {
                    return (
                        <About
                            key={section.id}
                            profile={profile}
                            experience={experience}
                            skills={skills}
                            education={education}
                            certifications={certifications}
                        />
                    );
                }

                if (section.kind === "projects") {
                    return (
                        <Projects
                            key={section.id}
                            projects={projects}
                            profile={profile}
                            label={section.label}
                            heading={section.heading}
                        />
                    );
                }

                if (section.kind === "contact") {
                    return <Contact key={section.id} profile={profile} label={section.label} heading={section.heading} />;
                }

                if (section.kind === "custom") {
                    return (
                        <CustomSection
                            key={section.id}
                            id={`section-${section.id}`}
                            label={section.label}
                            heading={section.heading}
                            body={section.body}
                        />
                    );
                }

                return null;
            })}
        </PublicSite>
    );
}
