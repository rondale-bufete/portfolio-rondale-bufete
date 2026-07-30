import { skills } from "@/data/portfolio";

// Maps a skill's display name to its Simple Icons slug (https://simpleicons.org).
// Add to this as your skills list grows — anything not listed here falls back
// to a plain monogram badge instead of a broken image.
const ICON_SLUGS = {
    react: "react",
    "next.js": "nextdotjs",
    nextjs: "nextdotjs",
    php: "php",
    "node.js": "nodedotjs",
    nodejs: "nodedotjs",
    python: "python",
    mysql: "mysql",
    postgresql: "postgresql",
    mongodb: "mongodb",
    supabase: "supabase",
    git: "git",
    github: "github",
    docker: "docker",
    aws: "amazonaws",
    tailwind: "tailwindcss",
    "tailwind css": "tailwindcss",
    typescript: "typescript",
    javascript: "javascript",
    graphql: "graphql",
    redis: "redis",
    figma: "figma",
    vercel: "vercel",
    linux: "linux",
    firebase: "firebase",
    express: "express",
    "express.js": "express",
    laravel: "laravel",
    jest: "jest",
    vite: "vite",
    html: "html5",
    html5: "html5",
    css: "css3",
    css3: "css3",
};

// Hand-picked icons for concepts that don't have a single "brand" logo.
const SPECIAL_ICONS = {
    "ci/cd": (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M17 2.1l4 4-4 4" />
            <path d="M3 12.9V9a4 4 0 0 1 4-4h12.1" />
            <path d="M7 21.9l-4-4 4-4" />
            <path d="M21 11.1V15a4 4 0 0 1-4 4H4.9" />
        </svg>
    ),
};

// One accent color per category, cycling if there are more categories than colors.
// Keep the first slot as the site's existing blue so category 1 still feels "on brand".
const CATEGORY_ACCENTS = ["#3355FF", "#7C3AED", "#059669", "#DB2777", "#D97706"];

function getIcon(name) {
    const key = name.toLowerCase();
    if (SPECIAL_ICONS[key]) return { type: "svg", node: SPECIAL_ICONS[key] };
    if (ICON_SLUGS[key]) return { type: "img", slug: ICON_SLUGS[key] };
    return { type: "fallback" };
}

function SkillIcon({ name }) {
    const icon = getIcon(name);

    if (icon.type === "img") {
        return (
            <img
                src={`https://cdn.simpleicons.org/${icon.slug}`}
                alt=""
                width={16}
                height={16}
                className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
            />
        );
    }

    if (icon.type === "svg") {
        return (
            <span
                className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                style={{ color: "var(--accent)" }}
            >
                {icon.node}
            </span>
        );
    }

    return (
        <span
            className="w-4 h-4 rounded-[3px] flex items-center justify-center text-[9px] font-semibold transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent)" }}
        >
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export default function Skills() {
    return (
        <section id="skills" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#E4E4E7]">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#3355FF] mb-3">02 — Skills</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight mb-10 max-w-xl">
                Tools I reach for
            </h2>

            <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
                {skills.map((group, gi) => {
                    const accent = CATEGORY_ACCENTS[gi % CATEGORY_ACCENTS.length];
                    return (
                        <div
                            key={group.category}
                            style={{
                                "--accent": accent,
                                "--accent-border": `${accent}4d`,
                                "--accent-bg": `${accent}14`,
                            }}
                        >
                            <h3 className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[#5B5F66] font-medium mb-4">
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: "var(--accent)" }}
                                />
                                {group.category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((item) => (
                                    <span
                                        key={item}
                                        className="group inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs pl-2.5 pr-3 py-1.5 rounded-md bg-white border border-[#E4E4E7] text-[#14161A] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-black/5 hover:border-[color:var(--accent-border)] hover:bg-[color:var(--accent-bg)]"
                                    >
                                        <SkillIcon name={item} />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}