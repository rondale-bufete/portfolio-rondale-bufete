import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getPortfolioData } from "@/lib/data";

// Revalidate this page at most once a minute so admin edits show up
// quickly without needing a full redeploy.
export const revalidate = 60;

export default async function Home() {
    const { profile, education, skills, certifications, projects } =
        await getPortfolioData();

    return (
        <>
            <Navbar profile={profile} />
            <main>
                <Hero profile={profile} />
                <About profile={profile} education={education} certifications={certifications} />
                <Skills skills={skills} />
                <Projects projects={projects} />
                <Contact />
                <SpeedInsights />
            </main>
            <Footer profile={profile} />
        </>
    );
}
