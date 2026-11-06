"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    AwardIcon,
    BriefcaseIcon,
    ChartIcon,
    CodeIcon,
    ExternalLinkIcon,
    GraduationIcon,
    GridIcon,
    LayersIcon,
    LogOutIcon,
    UserIcon,
} from "@/components/icons";
import { initials } from "@/lib/format";

const NAV = [
    { group: "Dashboard", items: [{ href: "/admin", label: "Overview", Icon: ChartIcon }] },
    {
        group: "Content",
        items: [
            { href: "/admin/profile", label: "Profile", Icon: UserIcon },
            { href: "/admin/projects", label: "Projects", Icon: GridIcon, countKey: "projects" },
            { href: "/admin/experience", label: "Experience", Icon: BriefcaseIcon, countKey: "experience" },
            { href: "/admin/education", label: "Education", Icon: GraduationIcon, countKey: "education" },
            { href: "/admin/certifications", label: "Certifications", Icon: AwardIcon, countKey: "certifications" },
            { href: "/admin/skills", label: "Skills", Icon: CodeIcon, countKey: "skills" },
        ],
    },
    { group: "Site", items: [{ href: "/admin/sections", label: "Sections", Icon: LayersIcon, countKey: "sections" }] },
];

function isActive(pathname, href) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export default function AdminNav({ logoutAction, counts = {}, name }) {
    const pathname = usePathname();

    return (
        <aside className="admin-sidebar">
            <Link href="/admin" className="admin-sidebar__brand">
                <span className="admin-monogram" aria-hidden="true">
                    {initials(name) || "RB"}
                </span>
                <span className="admin-sidebar__name">
                    <strong>{name || "Portfolio"}</strong>
                    <span>Portfolio admin</span>
                </span>
            </Link>

            <nav className="admin-nav" aria-label="Admin">
                {NAV.map(({ group, items }) => (
                    <div key={group} className="contents">
                        <p className="admin-nav__group">{group}</p>
                        {items.map(({ href, label, Icon, countKey }) => {
                            const count = countKey ? counts[countKey] : null;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-current={isActive(pathname, href) ? "page" : undefined}
                                    className="admin-nav__link"
                                >
                                    <Icon size={18} />
                                    {label}
                                    {typeof count === "number" && <span className="admin-nav__count">{count}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="admin-sidebar__footer">
                <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav__link" title="View site">
                    <ExternalLinkIcon size={18} />
                    <span className="admin-nav__label">View site</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <form action={logoutAction}>
                    <button type="submit" className="admin-nav__link" title="Sign out">
                        <LogOutIcon size={18} />
                        <span className="admin-nav__label">Sign out</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
