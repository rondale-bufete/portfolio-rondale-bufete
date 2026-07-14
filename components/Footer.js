import { profile } from "@/data/portfolio";

export default function Footer() {
    return (
        <footer className="max-w-5xl mx-auto px-6 py-10 border-t border-[#E4E4E7] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#5B5F66]">
            <p>© {new Date().getFullYear()} {profile.name}</p>
            <div className="flex items-center gap-6">
                <a href={profile.github} className="hover:text-[#14161A] transition-colors">
                    GitHub
                </a>
                <a href={profile.linkedin} className="hover:text-[#14161A] transition-colors">
                    LinkedIn
                </a>
                <a href={`mailto:${profile.email}`} className="hover:text-[#14161A] transition-colors">
                    Email
                </a>
            </div>
        </footer>
    );
}