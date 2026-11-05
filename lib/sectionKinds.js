// Section kinds that render on the homepage. The sections table also has
// leftover "experience"/"skills" rows from an older layout; they render
// nothing, so they can't be toggled or moved and are skipped when swapping.
export const HOMEPAGE_SECTION_KINDS = new Set(["about", "projects", "contact", "custom"]);
