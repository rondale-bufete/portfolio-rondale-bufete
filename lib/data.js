import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { normalizeProjectCategory } from "@/lib/projectGrouping";

function normalizeProject(project) {
    return {
        id: project.id,
        title: project.title,
        description: project.description,
        category: normalizeProjectCategory(project.category),
        tags: project.tags || [],
        highlights: project.highlights || [],
        liveUrl: project.live_url,
        repoUrl: project.repo_url,
        imageUrl: project.image_url || null,
        imageUrls: project.image_urls?.length
            ? project.image_urls
            : project.image_url
                ? [project.image_url]
                : [],
        provenance: project.provenance || "Personal",
        year: project.year || "",
        role: project.role || "",
        timeline: project.timeline || "",
        outcome: project.outcome || "",
    };
}

// Reuse the request's Supabase result between generateMetadata and the page.
export const getProjectById = cache(async function getProjectById(id) {
    const { data: project, error } = await supabasePublic
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error || !project) return null;
    return normalizeProject(project);
});

// Fetch public-site data once in app/page.js and pass it to components as props.
export const getPortfolioData = cache(async function getPortfolioData() {
    const [
        { data: profile },
        { data: experience },
        { data: education },
        { data: skillCategories },
        { data: certifications },
        { data: projects },
        { data: sections },
    ] = await Promise.all([
        supabasePublic.from("profile").select("*").eq("id", 1).maybeSingle(),
        supabasePublic.from("experience").select("*").order("sort_order"),
        supabasePublic.from("education").select("*").order("sort_order"),
        supabasePublic
            .from("skill_categories")
            .select("id, category, sort_order, skill_items(id, name, sort_order)")
            .order("sort_order"),
        supabasePublic.from("certifications").select("*").order("sort_order"),
        supabasePublic.from("projects").select("*").order("sort_order"),
        supabasePublic
            .from("sections")
            .select("*")
            .eq("visible", true)
            .order("sort_order"),
    ]);

    const skills = (skillCategories || []).map((cat) => ({
        category: cat.category,
        items: (cat.skill_items || [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((i) => i.name),
    }));

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
                  facebook: profile.facebook || "",
                  instagram: profile.instagram || "",
                  resumeUrl: profile.resume_url,
                  photo: profile.photo_url,
                  location: profile.location || "",
                  phone: profile.phone || "",
                  openTo: profile.open_to || "",
                  statusLabel: profile.status_label || "OPEN TO WORK",
                  available: profile.available ?? true,
                  chatVisible: profile.chat_visible ?? true,
              }
            : null,
        experience: (experience || []).map((e) => ({
            company: e.company,
            role: e.role,
            location: e.location,
            companyUrl: e.company_url || null,
            period: e.period,
            bullets: e.bullets || [],
        })),
        education: (education || []).map((e) => ({
            degree: e.degree,
            school: e.school,
            period: e.period,
            description: e.description,
            bullets: e.bullets || [],
        })),
        skills,
        certifications: (certifications || []).map((c) => ({
            title: c.title,
            issuer: c.issuer,
            date: c.date,
            credentialId: c.credential_id || null,
            description: c.description,
            image: c.image_url || null,
            url: c.url || null,
            pdf: c.pdf_url || null,
        })),
        projects: (projects || []).map(normalizeProject),
        // Include visible sections in display order below Hero.
        sections: (sections || []).map((s) => ({
            id: s.id,
            kind: s.kind,
            label: s.label,
            heading: s.heading,
            body: s.body,
        })),
    };
});
