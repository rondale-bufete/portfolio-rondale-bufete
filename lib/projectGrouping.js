function titleCaseWords(value) {
    return (value || "")
        .trim()
        .replace(/[_-]+/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
        .join(" ");
}

// Provenance -> tag treatment, matching the mockup: Client is a solid
// accent-tinted fill, Capstone is an accent outline, Personal stays neutral
// so it doesn't read as over-claimed. Shared by Hero and Projects instead
// of each re-implementing the same three-way switch.
export function provenanceTagClass(provenance) {
    if (provenance === "Client") return "tag-accent";
    if (provenance === "Capstone") return "tag-outline";
    return "tag-neutral";
}

export function normalizeProjectCategory(value) {
    const normalizedValue = (value || "").trim().toLowerCase();

    if (!normalizedValue) return "General";
    if (normalizedValue === "front-end" || normalizedValue === "frontend") return "Front-end";
    if (normalizedValue === "back end" || normalizedValue === "backend") return "Back end";
    if (normalizedValue === "fullstack" || normalizedValue === "full-stack") return "Fullstack";

    return titleCaseWords(normalizedValue);
}

const CATEGORY_ORDER = { "Front-end": 0, "Back end": 1, "Fullstack": 2 };

export function groupProjectsByCategory(projects = []) {
    const categories = new Map();

    for (const project of projects) {
        const categoryName = normalizeProjectCategory(project.category);

        if (!categories.has(categoryName)) {
            categories.set(categoryName, []);
        }

        categories.get(categoryName).push(project);
    }

    return Array.from(categories.entries())
        .sort(([categoryA], [categoryB]) => {
            const orderA = CATEGORY_ORDER[categoryA] ?? Number.MAX_SAFE_INTEGER;
            const orderB = CATEGORY_ORDER[categoryB] ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
        })
        .map(([category, categoryProjects]) => ({
            category,
            projects: categoryProjects,
        }));
}
