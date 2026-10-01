import { supabaseAdmin } from "@/lib/supabase/admin";

// Shared by the admin layout (sidebar nav counts) and the Overview page
// (section-card counts) so both read the same six head-count queries
// instead of each page inventing its own.
const TABLES = {
    experience: "experience",
    education: "education",
    projects: "projects",
    certifications: "certifications",
    skills: "skill_categories",
    sections: "sections",
};

export async function getAdminCounts() {
    const entries = Object.entries(TABLES);
    const results = await Promise.all(
        entries.map(([, table]) => supabaseAdmin.from(table).select("*", { count: "exact", head: true }))
    );

    const counts = {};
    let error = null;
    entries.forEach(([key], i) => {
        counts[key] = results[i].count;
        if (results[i].error && !error) error = results[i].error;
    });

    return { counts, error };
}
