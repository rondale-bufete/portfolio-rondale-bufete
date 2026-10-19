import { truncate } from "@/lib/format";

const FALLBACK_SITE_NAME = "Portfolio";

// Next merges metadata shallowly, so a page that sets `openGraph` replaces
// the layout's whole object. Building every page's metadata here keeps
// siteName/locale/twitter card from silently disappearing on one page.
export function pageMetadata({ siteName, title, description, path, type = "website" }) {
    const name = siteName || FALLBACK_SITE_NAME;
    const summary = truncate(description) || undefined;

    return {
        title,
        description: summary,
        alternates: { canonical: path },
        openGraph: { type, siteName: name, locale: "en_PH", title, description: summary, url: path },
        twitter: { card: "summary_large_image", title, description: summary },
    };
}

export function buildPersonJsonLd({ profile, skills = [], education = [] }, siteUrl) {
    if (!profile?.name) return null;

    const sameAs = [profile.github, profile.linkedin, profile.facebook, profile.instagram].filter(Boolean);
    const knowsAbout = skills.flatMap((group) => group.items);
    const schools = [...new Set(education.map((entry) => entry.school).filter(Boolean))];

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        url: siteUrl,
        ...(profile.role && { jobTitle: profile.role }),
        ...(profile.bio && { description: profile.bio }),
        ...(profile.photo && { image: new URL(profile.photo, siteUrl).href }),
        ...(profile.email && { email: `mailto:${profile.email}` }),
        ...(sameAs.length > 0 && { sameAs }),
        ...(knowsAbout.length > 0 && { knowsAbout }),
        ...(schools.length > 0 && {
            alumniOf: schools.map((school) => ({ "@type": "EducationalOrganization", name: school })),
        }),
    };
}

// JSON.stringify doesn't escape "<", so CMS text containing "</script>"
// could break out of the tag; \u003c keeps it inert.
export function serializeJsonLd(data) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}
