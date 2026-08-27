"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, ExternalLinkIcon } from "../ui/icons";

const NAV = [
    { href: "/admin", label: "Overview", icon: OverviewIcon },
    { href: "/admin/sections", label: "Sections", icon: LayersIcon },
    { href: "/admin/profile", label: "Profile", icon: UserIcon },
    { href: "/admin/experience", label: "Experience", icon: BriefcaseIcon },
    { href: "/admin/projects", label: "Projects", icon: FolderIcon },
    { href: "/admin/certifications", label: "Certifications", icon: BadgeIcon },
    { href: "/admin/education", label: "Education", icon: GradCapIcon },
    { href: "/admin/skills", label: "Skills", icon: SparkIcon },
];

export default function AdminNav({ logoutAction }) {
    const pathname = usePathname();

    return (
        <aside className="gap-3 shrink-0 bg-white border-b md:border-b-0 md:border-r border-[#E4E4E7] md:fixed md:inset-y-0 md:left-0 md:z-30 md:w-60 md:overflow-y-auto w-full flex flex-col">
            <div className="px-6 pt-7 pb-6">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3355FF]" />
                    <p className="font-[family-name:var(--font-display)] text-lg font-medium tracking-tight text-[#14161A] mt-3">
                        Admin
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-3 flex flex-row md:flex-col gap-1 flex-wrap overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                {NAV.map((item) => {
                    const active =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3.5 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                                active
                                    ? "bg-[#3355FF]/10 text-[#3355FF]"
                                    : "text-[#5B5F66] hover:bg-[#FAFAFA] hover:text-[#14161A]"
                            }`}
                        >
                            <Icon className="w-4 h-4 mx-3 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 pb-6 pt-3 border-t border-[#E4E4E7] flex flex-col gap-1">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg text-[#3355FF] hover:bg-[#3355FF]/[0.06] transition-colors"
                >
                    <ExternalLinkIcon className="w-4 h-4 shrink-0" />
                    View site
                </Link>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg text-[#5B5F66] hover:bg-[#FAFAFA] hover:text-[#14161A] transition-colors text-left"
                    >
                        <LogOutIcon className="w-4 h-4 shrink-0" />
                        Log out
                    </button>
                </form>
            </div>
        </aside>
    );
}

function iconBase(props) {
    return {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.75,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
    };
}

function OverviewIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
    );
}

function LayersIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <path d="M12 3 2 8l10 5 10-5-10-5Z" />
            <path d="M2 13l10 5 10-5" />
        </svg>
    );
}

function UserIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
    );
}

function BriefcaseIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function FolderIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        </svg>
    );
}

function BadgeIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <circle cx="12" cy="8" r="6" />
            <path d="M9 14 7 22l5-3 5 3-2-8" />
        </svg>
    );
}

function GradCapIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
            <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
        </svg>
    );
}

function SparkIcon({ className }) {
    return (
        <svg {...iconBase({ className })}>
            <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
    );
}
