import { supabaseAdmin } from "@/lib/supabase/admin";
import { HOMEPAGE_SECTION_KINDS } from "@/lib/sectionKinds";

// The admin navigation's counts, one query per table.
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
        entries.map(([key, table]) => {
            const query = supabaseAdmin.from(table).select("*", { count: "exact", head: true });
            // Legacy Experience and Skills section rows render inside About, so they aren't counted.
            return key === "sections" ? query.in("kind", [...HOMEPAGE_SECTION_KINDS]) : query;
        })
    );

    const counts = {};
    let error = null;
    entries.forEach(([key], i) => {
        counts[key] = results[i].count;
        if (results[i].error && !error) error = results[i].error;
    });

    return { counts, error };
}
