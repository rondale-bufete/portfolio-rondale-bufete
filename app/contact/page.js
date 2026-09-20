import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getPortfolioData } from "@/lib/data";

export const revalidate = 60;

export const metadata = {
    title: "Contact | Portfolio",
};

export default async function ContactPage() {
    const data = await getPortfolioData();
    const { profile, sections } = data;

    const contactSection = sections.find((s) => s.kind === "contact");
    if (!contactSection) notFound();

    return (
        <>
            <Navbar profile={profile} sections={sections} />
            <main>
                <Contact profile={profile} label={contactSection.label} heading={contactSection.heading} />
            </main>
            <Footer profile={profile} />
            <ChatWidget />
        </>
    );
}
