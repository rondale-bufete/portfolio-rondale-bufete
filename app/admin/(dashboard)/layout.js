import Link from "next/link";
import { logoutAction } from "../auth-actions";

const NAV = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/sections", label: "Sections" },
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/experience", label: "Experience" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/certifications", label: "Certifications" },
    { href: "/admin/education", label: "Education" },
    { href: "/admin/skills", label: "Skills" },
];

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#14161A]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-6 py-8">
                <aside className="md:w-56 shrink-0">
                    <p className="font-[family-name:var(--font-display)] text-lg font-medium mb-6">
                        Admin
                    </p>
                    <nav className="flex flex-row md:flex-col gap-1 flex-wrap">
                        {NAV.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm px-3 py-2 rounded-md text-[#5B5F66] hover:bg-white hover:text-[#14161A] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <form action={logoutAction} className="mt-6">
                        <button
                            type="submit"
                            className="text-sm px-3 py-2 rounded-md text-[#5B5F66] hover:bg-white hover:text-[#14161A] transition-colors w-full text-left"
                        >
                            Log out
                        </button>
                    </form>
                    <Link
                        href="/"
                        target="_blank"
                        className="block mt-2 text-sm px-3 py-2 rounded-md text-[#3355FF] hover:bg-white transition-colors"
                    >
                        View site →
                    </Link>
                </aside>

                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
}
