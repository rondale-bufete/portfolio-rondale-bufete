import { supabaseAdmin } from "@/lib/supabase/admin";

// Share the six admin count queries between navigation and the overview.
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
