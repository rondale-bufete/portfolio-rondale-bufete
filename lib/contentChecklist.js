// What still needs doing on the site, worst gaps first, built from data the
// admin already has. Each item links to the page that fixes it.
export function buildContentChecklist({ profile, projects = [], certifications = [], experience = [] }) {
    const featured = projects.slice(0, 2);
    const withoutImages = projects.filter((project) => !(project.image_urls?.length || project.image_url));
    const featuredWithoutOutcome = featured.filter((project) => !project.outcome?.trim());
    const certsWithoutLink = certifications.filter((cert) => !cert.url && !cert.pdf_url);
    const stats = Array.isArray(profile?.stats) ? profile.stats.filter((stat) => stat?.value) : [];

    const items = [
        {
            id: "photo",
            done: Boolean(profile?.photo_url),
            title: "Profile photo",
            detail: profile?.photo_url ? "Shown in the hero." : "The hero falls back to a project screenshot without one.",
            href: "/admin/profile",
        },
        {
            id: "resume",
            done: Boolean(profile?.resume_url),
            title: "Resume PDF",
            detail: profile?.resume_url ? "Opens from the navbar and About." : "Upload one to show the Resume button.",
            href: "/admin/profile",
        },
        {
            id: "stats",
            done: stats.length >= 2,
            title: "Headline numbers",
            detail: stats.length ? `${stats.length} set under your intro.` : "Add two to four results, like 300+ accounts managed.",
            href: "/admin/profile",
        },
        {
            id: "screenshots",
            done: projects.length > 0 && withoutImages.length === 0,
            title: "Project screenshots",
            detail:
                projects.length === 0
                    ? "Add your first project."
                    : withoutImages.length
                      ? `Missing on ${withoutImages.map((project) => project.title).join(", ")}.`
                      : `All ${projects.length} projects have at least one.`,
            href: "/admin/projects",
        },
        {
            id: "outcomes",
            done: featured.length > 0 && featuredWithoutOutcome.length === 0,
            title: "Outcomes on featured projects",
            detail: featuredWithoutOutcome.length
                ? `Add a result to ${featuredWithoutOutcome.map((project) => project.title).join(", ")}.`
                : "Your two featured projects say what they achieved.",
            href: "/admin/projects",
        },
        {
            id: "experience",
            done: experience.length > 0,
            title: "Work experience",
            detail: experience.length ? `${experience.length} ${experience.length === 1 ? "role" : "roles"} on the timeline.` : "Add at least one role.",
            href: "/admin/experience",
        },
        {
            id: "cert-links",
            done: certsWithoutLink.length === 0,
            title: "Certificate links",
            detail: certsWithoutLink.length
                ? `${certsWithoutLink.length} without a verification URL or PDF.`
                : "Every certificate can be verified.",
            href: "/admin/certifications",
        },
    ];

    return items.sort((first, second) => Number(first.done) - Number(second.done));
}
