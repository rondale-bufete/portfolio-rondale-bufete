import SectionHeader, { sectionShell } from "./SectionHeader";

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
    css: "css",
    css3: "css",
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
            <span className="w-4 h-4 text-[var(--color-accent-700)] transition-transform duration-200 group-hover:scale-110">
                {icon.node}
            </span>
        );
    }

    return (
        <span className="w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-[var(--color-neutral-200)] text-[var(--color-neutral-800)] transition-transform duration-200 group-hover:scale-110">
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export default function Skills({ skills = [], label = "02 — Skills", heading = "Tools I reach for" }) {
    return (
        <section id="skills" className={sectionShell}>
            <SectionHeader label={label} heading={heading} />

            <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
                {skills.map((group) => (
                    <div key={group.category}>
                        <h3 className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wide text-[var(--color-neutral-600)] mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                            {group.category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {group.items.map((item) => (
                                <span
                                    key={item}
                                    className="tag tag-neutral group inline-flex items-center gap-2 transition-colors duration-200 hover:bg-[var(--color-accent-100)] hover:text-[var(--color-accent-800)]"
                                >
                                    <SkillIcon name={item} />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
