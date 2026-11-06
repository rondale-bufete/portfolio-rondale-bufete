import * as simpleIcons from "simple-icons";

// Brand icons for skills, from Simple Icons (CC0, https://simpleicons.org).
// A skill is matched by its name using Simple Icons' own slug rules, plus a
// few common spellings. Some brands have asked Simple Icons to remove their
// marks (Java, C#, Playwright, VS Code…), so those skills get no icon and the
// UI shows their initials instead. Server-side only: the icon set is large.

const ALIASES = {
    html: "html5",
    css3: "css",
    node: "nodedotjs",
    nodejs: "nodedotjs",
    next: "nextdotjs",
    nextjs: "nextdotjs",
    reactjs: "react",
    reactdotjs: "react",
    reactnative: "react",
    vue: "vuedotjs",
    vuejs: "vuedotjs",
    expressjs: "express",
    expressdotjs: "express",
    tailwind: "tailwindcss",
    compose: "jetpackcompose",
    postgres: "postgresql",
    mongo: "mongodb",
    gcp: "googlecloud",
    googlecloudplatform: "googlecloud",
    gemini: "googlegemini",
    supabasedb: "supabase",
};

const REPLACEMENTS = { "+": "plus", ".": "dot", "&": "and", "đ": "d", "ħ": "h", "ı": "i", "ĸ": "k", "ŀ": "l", "ł": "l", "ß": "ss", "ŧ": "t", "ø": "o" };

// Simple Icons' titleToSlug: "Next.js" → "nextdotjs", "C++" → "cplusplus".
export function toSlug(name) {
    return String(name ?? "")
        .toLowerCase()
        .replace(/[+.&đħıĸŀłßŧø]/g, (char) => REPLACEMENTS[char])
        .normalize("NFD")
        .replace(/[^a-z\d]/g, "");
}

let bySlug;
function iconsBySlug() {
    bySlug ??= new Map(Object.values(simpleIcons).filter((icon) => icon?.slug).map((icon) => [icon.slug, icon]));
    return bySlug;
}

function luminance(hex) {
    const [r, g, b] = [0, 2, 4].map((start) => {
        const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// White or black, whichever reads better on the brand color.
export function inkOn(hex) {
    const light = luminance(hex);
    return (1.05) / (light + 0.05) >= (light + 0.05) / 0.05 ? "#ffffff" : "#000000";
}

// { title, slug, path, color, ink } for a skill name, or null when there's no icon.
export function findTechIcon(name) {
    const slug = toSlug(name);
    if (!slug) return null;
    const icon = iconsBySlug().get(ALIASES[slug] ?? slug);
    if (!icon) return null;
    return { title: icon.title, slug: icon.slug, path: icon.path, color: `#${icon.hex}`, ink: inkOn(icon.hex) };
}

// Up to two letters for skills without an icon: "Java" → "Ja", "C#" → "C#".
export function techInitials(name) {
    const words = String(name ?? "").trim().split(/\s+/).filter(Boolean);
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
    return (words[0] ?? "").slice(0, 2);
}
