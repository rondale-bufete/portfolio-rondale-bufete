
export function formatPortfolioContext(data) {
    const { profile, experience, education, skills, projects, certifications, sections } = data;
    const lines = [];

    if (profile) {
        lines.push(`Name: ${profile.name}`);
        lines.push(`Role: ${profile.role}`);
        if (profile.tagline) lines.push(`Tagline: ${profile.tagline}`);
        if (profile.bio) lines.push(`Bio: ${profile.bio}`);
        if (profile.chatJobAvailability) lines.push(`Job availability: ${profile.chatJobAvailability}`);
        if (profile.chatPreferredRoles) lines.push(`Preferred roles: ${profile.chatPreferredRoles}`);
        if (profile.chatWorkArrangements) lines.push(`Work arrangements: ${profile.chatWorkArrangements}`);
        if (profile.chatStartAvailability) lines.push(`Start availability: ${profile.chatStartAvailability}`);
        if (profile.chatRelocation) lines.push(`Relocation: ${profile.chatRelocation}`);
        if (profile.email) {
            lines.push(`Contact email: ${profile.email} (mailto:${profile.email})`);
        }
        if (sections?.some((section) => section.kind === "contact")) {
            lines.push("Contact form: /#contact");
        }
        if (profile.resumeUrl) lines.push(`Resume: ${profile.resumeUrl}`);
        if (profile.github) lines.push(`GitHub: ${profile.github}`);
        if (profile.linkedin) lines.push(`LinkedIn: ${profile.linkedin}`);
    }

    if (experience?.length) {
        lines.push("\nExperience:");
        experience.forEach((e) => {
            lines.push(`- ${e.role} at ${e.company} (${e.period})${e.location ? `, ${e.location}` : ""}`);
            (e.bullets || []).forEach((b) => lines.push(`  • ${b}`));
        });
    }

    if (education?.length) {
        lines.push("\nEducation:");
        education.forEach((e) => {
            lines.push(`- ${e.degree}, ${e.school} (${e.period})`);
            if (e.description) lines.push(`  ${e.description}`);
            (e.bullets || []).forEach((b) => lines.push(`  • ${b}`));
        });
    }

    if (skills?.length) {
        lines.push("\nSkills:");
        skills.forEach((s) => {
            lines.push(`- ${s.category}: ${s.items.join(", ")}`);
        });
    }

    if (projects?.length) {
        lines.push("\nProjects:");
        projects.forEach((p) => {
            const tags = p.tags?.length ? ` (${p.tags.join(", ")})` : "";
            const projectUrl = p.id ? `/projects/${encodeURIComponent(p.id)}` : "";
            lines.push(`- ${p.title}${projectUrl ? ` — ${projectUrl}` : ""}: ${p.description}${tags}`);
            if (p.role) lines.push(`  Role: ${p.role}`);
            if (p.timeline) lines.push(`  Timeline: ${p.timeline}`);
            if (p.outcome) lines.push(`  Outcome: ${p.outcome}`);
            (p.highlights || []).forEach((highlight) => lines.push(`  Highlight: ${highlight}`));
            if (p.liveUrl) lines.push(`  Live demo: ${p.liveUrl}`);
            if (p.repoUrl) lines.push(`  Repository: ${p.repoUrl}`);
        });
    }

    if (certifications?.length) {
        lines.push("\nCertifications:");
        certifications.forEach((c) => {
            lines.push(`- ${c.title} (${c.issuer}, ${c.date})`);
            if (c.description) lines.push(`  ${c.description}`);
        });
    }

    return lines.join("\n");
}

export function getPortfolioLinks(data) {
    const links = new Set();
    const { profile, projects, sections } = data;

    if (profile?.email) links.add(`mailto:${profile.email}`);
    if (sections?.some((section) => section.kind === "contact")) links.add("/#contact");
    if (profile?.resumeUrl) links.add(profile.resumeUrl);
    if (profile?.github) links.add(profile.github);
    if (profile?.linkedin) links.add(profile.linkedin);

    (projects || []).forEach((project) => {
        if (project.id) links.add(`/projects/${encodeURIComponent(project.id)}`);
        if (project.liveUrl) links.add(project.liveUrl);
        if (project.repoUrl) links.add(project.repoUrl);
    });

    return [...links];
}
