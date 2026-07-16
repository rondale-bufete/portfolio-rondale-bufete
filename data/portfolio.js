
export const profile = {
    name: "Rondale Rae Bufete",
    role: "Software Engineer",
    tagline: "I build fast, thoughtful interfaces — and the systems behind them.",
    bio: "Placeholder bio. Replace this with 2-3 sentences about your background, what you specialize in, and what kind of work excites you. Keep it conversational, not a resume dump.", // TODO: replace
    email: "rondale.bufete7@gmail.com",
    github: "https://github.com/rondale-bufete",
    linkedin: "https://www.linkedin.com/in/ronbufete7/",
    resumeUrl: "#",
};

export const skills = [
    {
        category: "Languages",
        items: ["JavaScript", "PHP", "TypeScript", "HTML", "CSS"],
    },
    {
        category: "Frameworks & Libraries",
        items: ["React", "Next.js", "Tailwind CSS", "Node.js", "Express.js", "Laravel"],
    },
    {
        category: "Tools",
        items: ["Git", "GitHub", "GitHub Actions (CI/CD)", "VS Code", "Vercel", "Figma"],
    },
];

export const projects = [
    {
        title: "GitHub Profile Dashboard",
        description:
            "A dashboard to search any GitHub user and view their profile stats, language breakdown, and top repositories with sorting and pagination.",
        tags: ["Next.js", "Tailwind CSS", "Recharts", "GitHub API"],
        liveUrl: "https://githubdashboard-eight.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/github.dashboard.git",
        imageUrl: '/projects/ss_ghd.png',
    },
    {
        title: "SearchFlix",
        description:
            "A Netflix-inspired movie discovery app with live search, genre filtering, infinite scroll, and an inline trailer player, powered by TMDB.",
        tags: ["Next.js", "TMDB API", "Tailwind CSS"],
        liveUrl: "https://nextjs-movie-search-gccr0hh7l-ron-bufetes-projects.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/nextjs-movie-search.git",
        imageUrl: '/projects/ss_sf.png',
    },
    {
        title: "Custom Job Application Tracker",
        description:
            "A custom job application tracker with features like status updates, notes, and data visualization.",
        tags: ["Next.js", "Tailwind CSS", "Supabase"],
        liveUrl: "https://job-application-tracker-navy-rho.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/job-application-tracker.git",
        imageUrl: '/projects/ss_jt.png',
    }
];