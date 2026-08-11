import Link from "next/link";
import { logoutAction } from "../auth-actions";

const NAV = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/certifications", label: "Certifications" },
    { href: "/admin/education", label: "Education" },
    { href: "/admin/skills", label: "Skills" },
];

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen text-slate-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-6 lg:px-8">
                <aside className="md:w-72 md:shrink-0">
                    <div className="rounded-3xl border border-slate-200/80 bg-slate-950 p-5 text-slate-50 shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
                        <div className="mb-6 border-b border-white/10 pb-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                Portfolio
                            </p>
                            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
                                Admin
                            </p>
                        </div>

                        <nav className="flex flex-row gap-2 md:flex-col md:gap-1.5">
                            {NAV.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/10 hover:bg-white/5 hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
                            <form action={logoutAction}>
                                <button
                                    type="submit"
                                    className="w-full rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
                                >
                                    Log out
                                </button>
                            </form>

                            <Link
                                href="/"
                                target="_blank"
                                className="block rounded-xl border border-indigo-400/40 bg-indigo-500/10 px-3 py-2.5 text-sm font-medium text-indigo-200 transition-colors hover:bg-indigo-500/20 hover:text-white"
                            >
                                View site →
                            </Link>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm md:p-7">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
