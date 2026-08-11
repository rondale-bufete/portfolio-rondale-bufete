import { supabasePublic } from "@/lib/supabase/public";

// Fetches everything the public site needs in one go. Called once from
// app/page.js and passed down as props — keeps each component a plain,
// prop-driven component (easy to test, no duplicate network calls).
export async function getPortfolioData() {
    const [
        { data: profile },
        { data: education },
        { data: skillCategories },
        { data: certifications },
        { data: projects },
    ] = await Promise.all([
        supabasePublic.from("profile").select("*").eq("id", 1).maybeSingle(),
        supabasePublic.from("education").select("*").order("sort_order"),
        supabasePublic
            .from("skill_categories")
            .select("id, category, sort_order, skill_items(id, name, sort_order)")
            .order("sort_order"),
        supabasePublic.from("certifications").select("*").order("sort_order"),
        supabasePublic.from("projects").select("*").order("sort_order"),
    ]);

    const skills = (skillCategories || []).map((cat) => ({
        category: cat.category,
        items: (cat.skill_items || [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((i) => i.name),
    }));

    // camelCase mapping so existing components (which expect e.g.
    // profile.resumeUrl, cert.image, project.imageUrl) don't need to
    // change their JSX at all — only how they receive props.
    return {
        profile: profile
            ? {
                  name: profile.name,
                  role: profile.role,
                  tagline: profile.tagline,
                  bio: profile.bio,
                  email: profile.email,
                  github: profile.github,
                  linkedin: profile.linkedin,
                  resumeUrl: profile.resume_url,
                  photo: profile.photo_url,
              }
            : null,
        education: (education || []).map((e) => ({
            degree: e.degree,
            school: e.school,
            period: e.period,
            description: e.description,
        })),
        skills,
        certifications: (certifications || []).map((c) => ({
            title: c.title,
            issuer: c.issuer,
            date: c.date,
            description: c.description,
            image: c.image_url || null,
            url: c.url || null,
            pdf: c.pdf_url || null,
        })),
        projects: (projects || []).map((p) => ({
            title: p.title,
            description: p.description,
            tags: p.tags || [],
            liveUrl: p.live_url,
            repoUrl: p.repo_url,
            imageUrl: p.image_url || null,
        })),
    };
}
