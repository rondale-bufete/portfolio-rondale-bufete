import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CustomSection from "@/components/CustomSection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getPortfolioData } from "@/lib/data";

// Revalidate this page at most once a minute so admin edits show up
// quickly without needing a full redeploy.
export const revalidate = 60;

// Home doubles as the "Work" page (mockup 1a): Hero already carries the
// stat band and selected-work preview. About/Projects/Contact are their own
// routes now (see app/about, app/projects, app/contact) — only
// admin-added "custom" sections still render inline here, in their
// configured order.
export default async function Home() {
    const data = await getPortfolioData();
    const { profile, sections, projects, education, skills } = data;
    const customSections = sections.filter((s) => s.kind === "custom");

    return (
        <>
            <Navbar profile={profile} sections={sections} />
            <main>
                <Hero profile={profile} projects={projects} education={education} skills={skills} />
                {customSections.map((section) => (
                    <CustomSection
                        key={section.id}
                        id={`section-${section.id}`}
                        label={section.label}
                        heading={section.heading}
                        body={section.body}
                    />
                ))}
            </main>
            <Footer profile={profile} />
            <ChatWidget />
        </>
    );
}
