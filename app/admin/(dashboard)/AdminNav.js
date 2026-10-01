"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin", label: "overview", countKey: null },
    { href: "/admin/sections", label: "sections", countKey: "sections" },
    { href: "/admin/profile", label: "profile", countKey: null },
    { href: "/admin/experience", label: "experience", countKey: "experience" },
    { href: "/admin/projects", label: "projects", countKey: "projects" },
    { href: "/admin/certifications", label: "certifications", countKey: "certifications" },
    { href: "/admin/education", label: "education", countKey: "education" },
    { href: "/admin/skills", label: "skills", countKey: "skills" },
];

export default function AdminNav({ logoutAction, counts = {} }) {
    const pathname = usePathname();

    return (
        <aside className="gap-3 shrink-0 bg-[var(--color-bg)] border-b md:border-b-0 md:border-r border-[var(--color-border)] md:fixed md:inset-y-0 md:left-0 md:z-30 md:w-60 md:overflow-y-auto w-full flex flex-col font-[family-name:var(--font-mono)] text-[13px]">
            <div className="px-4 pt-6 pb-4">
                <span className="text-[var(--color-accent)]">~/</span>
                <span className="text-[var(--color-text)]">admin</span>
            </div>

            <nav className="flex-1 px-2 flex flex-row md:flex-col gap-0.5 flex-wrap overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                {NAV.map((item) => {
                    const active =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                    const count = item.countKey ? counts[item.countKey] : undefined;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors whitespace-nowrap ${
                                active
                                    ? "bg-[var(--color-raised)] text-[var(--color-text)]"
                                    : "text-[var(--color-muted)] hover:bg-[var(--color-raised)]/60 hover:text-[var(--color-text)]"
                            }`}
                        >
                            <span>{item.label}</span>
                            {count !== undefined && count !== null && (
                                <span className="text-[11px] text-[var(--color-faint)]">{count}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-2 pb-6 pt-3 border-t border-[var(--color-border)] flex flex-col gap-0.5">
                <Link
                    href="/"
                    target="_blank"
                    className="rounded-[var(--radius-md)] px-3 py-2.5 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/[0.08] transition-colors"
                >
                    view site ↗
                </Link>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full rounded-[var(--radius-md)] px-3 py-2.5 text-[var(--color-muted)] hover:bg-[var(--color-raised)] hover:text-[var(--color-text)] transition-colors text-left"
                    >
                        sign out
                    </button>
                </form>
            </div>
        </aside>
    );
}
