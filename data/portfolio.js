
export const profile = {
    name: "Rondale Rae Bufete",
    role: "Software Engineer",
    tagline: "I build fast, thoughtful interfaces — and the systems behind them.",
    bio: "I'm a software engineer with a passion for building web applications that are both functional and visually appealing. I enjoy working on projects that challenge me to learn new technologies and improve my skills.",
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
        tags: ["Next.js", "Tailwind CSS", "Recharts", "GitHub API", "REST API"],
        liveUrl: "https://githubdashboard-eight.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/github.dashboard.git",
        imageUrl: '/projects/ss_ghd.png',
    },
    {
        title: "SearchFlix",
        description:
            "A Netflix-inspired movie discovery app with live search, genre filtering, infinite scroll, and an inline trailer player, powered by TMDB.",
        tags: ["Next.js", "TMDB API", "Tailwind CSS", "REST API"],
        liveUrl: "https://nextjs-movie-search-gccr0hh7l-ron-bufetes-projects.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/nextjs-movie-search.git",
        imageUrl: '/projects/ss_sf.png',
    },
    {
        title: "Custom Job Application Tracker",
        description:
            "A custom job application tracker for job seekers with features like status updates, notes, and data visualization.",
        tags: ["Next.js", "Tailwind CSS", "Supabase"],
        liveUrl: "https://job-application-tracker-navy-rho.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/job-application-tracker.git",
        imageUrl: '/projects/ss_jt.png',
    }
];