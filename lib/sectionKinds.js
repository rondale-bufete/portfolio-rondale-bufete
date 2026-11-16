// The sections table also has legacy "experience"/"skills" rows that render
// inside About, so they are excluded from the homepage section list.
export const HOMEPAGE_SECTION_KINDS = new Set(["about", "projects", "github", "contact", "custom"]);
