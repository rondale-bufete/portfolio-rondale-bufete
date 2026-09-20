import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getPortfolioData } from "@/lib/data";

export const revalidate = 60;

export const metadata = {
    title: "Projects | Portfolio",
};

export default async function ProjectsPage() {
    const data = await getPortfolioData();
    const { profile, sections, projects } = data;

    const projectsSection = sections.find((s) => s.kind === "projects");
    if (!projectsSection) notFound();

    return (
        <>
            <Navbar profile={profile} sections={sections} />
            <main>
                <Projects
                    projects={projects}
                    profile={profile}
                    label={projectsSection.label}
                    heading={projectsSection.heading}
                />
            </main>
            <Footer profile={profile} />
            <ChatWidget />
        </>
    );
}
