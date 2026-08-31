// Formats the object returned by lib/data.js's getPortfolioData() into a
// compact, plain-text block used as grounding context for the chatbot.
// Deliberately not a full dump of every field — keeping this short keeps
// token cost (and therefore latency and $) down on every single message.
export function formatPortfolioContext(data) {
    const { profile, experience, education, skills, projects, certifications } = data;
    const lines = [];

    if (profile) {
        lines.push(`Name: ${profile.name}`);
        lines.push(`Role: ${profile.role}`);
        if (profile.tagline) lines.push(`Tagline: ${profile.tagline}`);
        if (profile.bio) lines.push(`Bio: ${profile.bio}`);
        lines.push(`Contact email: ${profile.email}`);
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
            lines.push(`- ${p.title}: ${p.description}${tags}`);
        });
    }

    if (certifications?.length) {
        lines.push("\nCertifications:");
        certifications.forEach((c) => {
            lines.push(`- ${c.title} (${c.issuer}, ${c.date})`);
        });
    }

    return lines.join("\n");
}
