
export const profile = {
    name: "Rondale Rae Bufete",
    role: "Full Stack Developer",
    tagline: "I design the parts people see, and engineer the parts they don't.",
    bio: "I work across the full stack — React and Next.js on the front end, PHP, Node.js, and Python on the back, with PostgreSQL, MySQL, MongoDB, or Supabase depending on what the project actually needs.", // I care about the parts most people never notice: load times, clean data models, and deploys that don't break at 2am.
    email: "rondale.bufete7@gmail.com",
    github: "https://github.com/rondale-bufete",
    linkedin: "https://www.linkedin.com/in/ronbufete7/",
    resumeUrl: "/resume.pdf",
    photo: "/photo_ron.png",
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
            "A dashboard to search any GitHub user and view their profile stats, language breakdown, and top repositories with sorting and pagination. It uses the GitHub API to fetch user data and Recharts for data visualization.",
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
        liveUrl: "https://nextjs-movie-search-app.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/nextjs-movie-search.git",
        imageUrl: '/projects/ss_sf.png',
    },
    {
        title: "Custom Job Application Tracker",
        description:
            "A custom job application tracker for job seekers with features like status updates, notes, and data visualization. It helps users stay organized and track their job applications effectively.",
        tags: ["Next.js", "Tailwind CSS", "Supabase"],
        liveUrl: "https://job-application-tracker-navy-rho.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/job-application-tracker.git",
        imageUrl: '/projects/ss_jbt.png',
    },
    {
        title: "Home Environment Monitoring System - ESP32 Sensors",
        description:
            "A personal dashboard for monitoring home environment conditions using ESP32 sensors and visualizing the data. It includes real-time updates, historical data visualization, and weather forecasts.",
        tags: ["ESP32", "IoT", "Supabase", "Chart.js", "REST API", "WebSocket", "Tailwind CSS", "Next.js", "Open-Meteo API", "C++", "Arduino IDE"],
        liveUrl: "https://esp32-home-sensors-dashboard.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/esp32-home-sensors-dashboard.git",
        imageUrl: '/projects/ss_hsd.png',
    },
    {
        title: "AI-Powered Resume Analyzer",
        description:
            "An AI-powered tool for analyzing and improving resumes. It provides feedback on formatting, content, and overall effectiveness using the Gemini API.",
        tags: ["Next.js", "Gemini API", "JavaScript", "React", "Tailwind CSS", "REST API"],
        liveUrl: "https://ai-resume-analyzer-lovat-beta.vercel.app/",
        repoUrl: "https://github.com/rondale-bufete/ai-resume-analyzer.git",
        imageUrl: '/projects/ss_ara.png',
    }
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
    {
        title: "Data Analyst: Professional Certificate in Data Analysis",
        issuer: "Udemy",
        date: "2026",
        description: "Completed the Data Analyst Professional Certificate in Data Analysis from Udemy. This certification covers data analysis techniques, statistical methods, and data visualization using tools like Python, Excel, and Power BI.",
        image: "/certs/uda.jpg",
        url: "https://www.udemy.com/certificate/UC-384c2ce8-fe37-4636-a9f8-3714a18ca7ff/"
    },
    {
        title: "Front-End Development Libraries Certification",
        issuer: "freeCodeCamp",
        date: "2026",
        description: "Completed the Front-End Development Libraries Certification from freeCodeCamp. This certification covers React, Redux, jQuery, and Bootstrap, providing a strong foundation in front-end web development.",
        image: "/certs/FEL.png",
        url: "https://www.freecodecamp.org/certification/rondalerae/front-end-development-libraries-v9"
    },
    {
        title: "Responsive Web Design Certification",
        issuer: "freeCodeCamp",
        date: "2026",
        description: "Completed the Responsive Web Design Certification from freeCodeCamp, covering HTML, CSS, and responsive design principles.",
        image: "/certs/rwc9.png",
        url: "https://www.freecodecamp.org/certification/rondalerae/responsive-web-design-v9"
    },
    {
        title: "EF SET English Proficiency Test",
        issuer: "EF SET",
        date: "2025",
        description: "Completed the EF SET English Proficiency Test. This test assesses English language skills in reading and listening, providing a score based on the CEFR scale.",
        image: "/certs/EFSET.png",
        pdf: "/certs/pdf/efset.pdf",
    },

    {
        title: "System Administration Certification",
        issuer: "Linux Professional Institute (LPI)",
        date: "2019",
        description: "Completed the System Administration Certification from freeCodeCamp. This certification covers Linux system administration, including command-line usage, file management, and basic networking.",
        image: "/certs/sa.png",
        pdf: "/certs/pdf/lpi-sysadmin.pdf",
    },
];