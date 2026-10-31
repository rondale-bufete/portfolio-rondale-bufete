const PROVENANCE_LABELS = {
    Client: "Client project",
    Capstone: "Capstone project",
    Personal: "Personal project",
};

export function provenanceLabel(provenance) {
    return PROVENANCE_LABELS[provenance] || PROVENANCE_LABELS.Personal;
}

// Highlights are often written "Interactive Odontogram: A charting tool…".
// Only a short lead-in followed by ": " counts as a label, so an ordinary
// sentence that happens to contain a colon (or a URL) stays whole.
const HIGHLIGHT_LABEL = /^([^:.!?]{2,40}):\s+([\s\S]+)$/;

export function splitHighlight(highlight) {
    const text = (highlight || "").trim();
    const match = text.match(HIGHLIGHT_LABEL);
    if (!match) return { label: null, text };
    return { label: match[1].trim(), text: match[2].trim() };
}

export function adjacentProjects(projects = [], id) {
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) return { previous: null, next: null };
    return {
        previous: projects[index - 1] ?? null,
        next: projects[index + 1] ?? null,
    };
}
