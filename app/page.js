import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import CustomSection from "@/components/CustomSection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getPortfolioData } from "@/lib/data";

// Revalidate this page at most once a minute so admin edits show up
// quickly without needing a full redeploy.
export const revalidate = 60;

// Maps a section's `kind` to the component that renders it, and the data
// slice each one needs. Order/visibility come from the `sections` table
// itself (managed at /admin/sections) — this object only decides *how*
// each kind renders, not *whether* or *where*.
function renderSection(section, data) {
    const { label, heading } = section;

    switch (section.kind) {
        case "about":
            return (
                <About
                    key={section.id}
                    profile={data.profile}
                    education={data.education}
                    certifications={data.certifications}
                    label={label}
                    heading={heading}
                />
            );
        case "experience":
            return (
                <Experience
                    key={section.id}
                    experience={data.experience}
                    label={label}
                    heading={heading}
                />
            );
        case "skills":
            return <Skills key={section.id} skills={data.skills} label={label} heading={heading} />;
        case "projects":
            return <Projects key={section.id} projects={data.projects} label={label} heading={heading} />;
        case "contact":
            return <Contact key={section.id} label={label} heading={heading} />;
        case "custom":
            return (
                <CustomSection key={section.id} label={label} heading={heading} body={section.body} />
            );
        default:
            return null;
    }
}

export default async function Home() {
    const data = await getPortfolioData();
    const { profile, sections } = data;

    return (
        <>
            <Navbar profile={profile} />
            <main>
                <Hero profile={profile} />
                {sections.map((section) => renderSection(section, data))}
                <SpeedInsights />
                <Analytics />
            </main>
            <Footer profile={profile} />
            <ChatWidget />
        </>
    );
}
