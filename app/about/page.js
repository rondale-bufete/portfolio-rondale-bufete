import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getPortfolioData } from "@/lib/data";

export const revalidate = 60;

export const metadata = {
    title: "About | Portfolio",
};

export default async function AboutPage() {
    const data = await getPortfolioData();
    const { profile, sections, experience, skills, education, certifications } = data;

    const aboutSection = sections.find((s) => s.kind === "about");
    if (!aboutSection) notFound();

    return (
        <>
            <Navbar profile={profile} sections={sections} />
            <main>
                <About
                    profile={profile}
                    experience={experience}
                    skills={skills}
                    education={education}
                    certifications={certifications}
                />
            </main>
            <Footer profile={profile} />
            <ChatWidget />
        </>
    );
}
