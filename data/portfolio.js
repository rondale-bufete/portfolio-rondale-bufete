
export const profile = {
    name: "Rondale Rae Bufete",
    role: "Full Stack Developer",
    tagline: "I build fast, thoughtful interfaces — and the systems behind them.",
    bio: "I'm a full stack developer with a passion for building web applications that are both functional and visually appealing. I enjoy working on projects that challenge me to learn new technologies and improve my skills.",
    email: "rondale.bufete7@gmail.com",
    github: "https://github.com/rondale-bufete",
    linkedin: "https://www.linkedin.com/in/ronbufete7/",
    resumeUrl: "/resume.pdf",
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
        imageUrl: '/projects/ss_jbt.png',
    },
    {
        title: "Home Environment Monitoring System - ESP32 Sensors",
        description:
            "A personal dashboard for monitoring home environment conditions using ESP32 sensors and visualizing the data.",
        tags: ["ESP32", "IoT", "Supabase", "Chart.js", "REST API", "WebSocket", "Tailwind CSS", "Next.js", "Open-Meteo API", "C++", "Arduino IDE"],
        liveUrl: "https://esp32-home-sensors-dashboard.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/esp32-home-sensors-dashboard.git",
        imageUrl: '/projects/ss_hsd.png',
    },
];

export const education = [
    {
        degree: "Bachelor of Science in Information Technology",
        school: "Camarines Sur Polytechnic Colleges - Nabua Main Campus",
        period: "2022 — 2026",
        description: "",
    },
    {
        degree: "Senior High School - IT in Mobile Application and Web Development",
        school: "STI College - Naga City",
        period: "2020 — 2022",
        description: "",
    },
];

export const certifications = [
    // {
    //     title: "Full Stack Web Development Certification",
    //     issuer: "freeCodeCamp",
    //     date: "2026",
    //     description: "Completed the Full Stack Web Development Certification from freeCodeCamp, covering HTML, CSS, JavaScript, and backend development principles.",
    // },
    {
        title: "EF SET English Proficiency Test",
        issuer: "EF SET",
        date: "2025",
        description: "Completed the EF SET English Proficiency Test.",
    },
    {
        title: "Responsive Web Design Certification",
        issuer: "freeCodeCamp",
        date: "2023",
        description: "Completed the Responsive Web Design Certification from freeCodeCamp, covering HTML, CSS, and responsive design principles.",

    },
    {
        title: "Data Structures and Algorithms Certification",
        issuer: "freeCodeCamp",
        date: "2023",
        description: "Completed the Data Structures and Algorithms Certification from freeCodeCamp.",
    },

    {
        title: "System Administration Certification",
        issuer: "Linux Professional Institute (LPI)",
        date: "2019",
        description: "Completed the System Administration Certification from freeCodeCamp.",
    },
];