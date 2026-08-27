-- =============================================================
-- Portfolio DB schema for Supabase
-- Run this in: Supabase Dashboard -> SQL Editor -> New query
-- =============================================================

-- ---------- PROFILE (single row) ----------
create table if not exists profile (
  id int primary key default 1,
  name text not null default '',
  role text not null default '',
  tagline text not null default '',
  bio text not null default '',
  email text not null default '',
  github text not null default '',
  linkedin text not null default '',
  resume_url text not null default '',
  photo_url text not null default '',
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);

-- ---------- EDUCATION ----------
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  school text not null,
  period text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- SKILLS (category -> items) ----------
create table if not exists skill_categories (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists skill_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references skill_categories(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- CERTIFICATIONS ----------
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  date text not null default '',
  description text not null default '',
  image_url text not null default '',
  url text not null default '',
  pdf_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- PROJECTS ----------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tags text[] not null default '{}',
  live_url text not null default '',
  repo_url text not null default '',
  image_url text not null default '',
  image_urls text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =============================================================
-- Row Level Security
-- Public (anon key) can only READ. All writes happen server-side
-- via the service role key inside Server Actions, which bypasses
-- RLS entirely — so we never need public insert/update/delete policies.
-- =============================================================

alter table profile enable row level security;
alter table education enable row level security;
alter table skill_categories enable row level security;
alter table skill_items enable row level security;
alter table certifications enable row level security;
alter table projects enable row level security;

create policy "public read profile" on profile for select using (true);
create policy "public read education" on education for select using (true);
create policy "public read skill_categories" on skill_categories for select using (true);
create policy "public read skill_items" on skill_items for select using (true);
create policy "public read certifications" on certifications for select using (true);
create policy "public read projects" on projects for select using (true);

-- =============================================================
-- Storage bucket for images / resume / cert PDFs
-- (Run this part too — creates a public-read bucket named
-- "portfolio-assets". Writes are done via service role key only.)
-- =============================================================
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "public read portfolio-assets"
on storage.objects for select
using (bucket_id = 'portfolio-assets');

-- =============================================================
-- Seed data — pulled straight from your existing data/portfolio.js
-- Image paths keep pointing at /public for now; re-upload them via
-- the admin panel whenever you want them served from Storage instead.
-- =============================================================

insert into profile (id, name, role, tagline, bio, email, github, linkedin, resume_url, photo_url)
values (
  1,
  'Rondale Rae Bufete',
  'Full Stack Developer',
  'I design the parts people see, and engineer the parts they don''t.',
  'I work across the full stack — React and Next.js on the front end, PHP, Node.js, and Python on the back, with PostgreSQL, MySQL, MongoDB, or Supabase depending on what the project actually needs.',
  'rondale.bufete7@gmail.com',
  'https://github.com/rondale-bufete',
  'https://www.linkedin.com/in/ronbufete7/',
  '/resume.pdf',
  '/photo_ron.png'
)
on conflict (id) do update set
  name = excluded.name, role = excluded.role, tagline = excluded.tagline,
  bio = excluded.bio, email = excluded.email, github = excluded.github,
  linkedin = excluded.linkedin, resume_url = excluded.resume_url, photo_url = excluded.photo_url;

insert into education (degree, school, period, description, sort_order) values
('Bachelor of Science in Information Technology', 'Camarines Sur Polytechnic Colleges - Nabua Main Campus', '2022 — 2026', '', 0),
('Senior High School - IT in Mobile Application and Web Development', 'STI College - Naga City', '2020 — 2022', '', 1);

with cat1 as (
  insert into skill_categories (category, sort_order) values ('Languages', 0) returning id
), cat2 as (
  insert into skill_categories (category, sort_order) values ('Frameworks & Libraries', 1) returning id
), cat3 as (
  insert into skill_categories (category, sort_order) values ('Tools', 2) returning id
)
insert into skill_items (category_id, name, sort_order)
select id, item, ord from (
  select (select id from cat1) as id, unnest(array['JavaScript','PHP','TypeScript','HTML','CSS']) as item, generate_series(0,4) as ord
  union all
  select (select id from cat2), unnest(array['React','Next.js','Tailwind CSS','Node.js','Express.js','Laravel']), generate_series(0,5)
  union all
  select (select id from cat3), unnest(array['Git','GitHub','GitHub Actions (CI/CD)','VS Code','Vercel','Figma']), generate_series(0,5)
) s;

insert into certifications (title, issuer, date, description, image_url, url, pdf_url, sort_order) values
('Data Analyst: Professional Certificate in Data Analysis', 'Udemy', '2026', 'Completed the Data Analyst Professional Certificate in Data Analysis from Udemy. This certification covers data analysis techniques, statistical methods, and data visualization using tools like Python, Excel, and Power BI.', '/certs/uda.jpg', 'https://www.udemy.com/certificate/UC-384c2ce8-fe37-4636-a9f8-3714a18ca7ff/', '', 0),
('Front-End Development Libraries Certification', 'freeCodeCamp', '2026', 'Completed the Front-End Development Libraries Certification from freeCodeCamp. This certification covers React, Redux, jQuery, and Bootstrap, providing a strong foundation in front-end web development.', '/certs/FEL.png', 'https://www.freecodecamp.org/certification/rondalerae/front-end-development-libraries-v9', '', 1),
('Responsive Web Design Certification', 'freeCodeCamp', '2026', 'Completed the Responsive Web Design Certification from freeCodeCamp, covering HTML, CSS, and responsive design principles.', '/certs/rwc9.png', 'https://www.freecodecamp.org/certification/rondalerae/responsive-web-design-v9', '', 2),
('EF SET English Proficiency Test', 'EF SET', '2025', 'Completed the EF SET English Proficiency Test. This test assesses English language skills in reading and listening, providing a score based on the CEFR scale.', '/certs/EFSET.png', '', '/certs/pdf/efset.pdf', 3),
('System Administration Certification', 'Linux Professional Institute (LPI)', '2019', 'Completed the System Administration Certification from freeCodeCamp. This certification covers Linux system administration, including command-line usage, file management, and basic networking.', '/certs/sa.png', '', '/certs/pdf/lpi-sysadmin.pdf', 4);

insert into projects (title, description, tags, live_url, repo_url, image_url, sort_order) values
('GitHub Profile Dashboard', 'A dashboard to search any GitHub user and view their profile stats, language breakdown, and top repositories with sorting and pagination. It uses the GitHub API to fetch user data and Recharts for data visualization.', array['Next.js','Tailwind CSS','Recharts','GitHub API','REST API'], 'https://githubdashboard-eight.vercel.app/', 'https://github.com/rondale-bufete/github.dashboard.git', '/projects/ss_ghd.png', 0),
('SearchFlix', 'A Netflix-inspired movie discovery app with live search, genre filtering, infinite scroll, and an inline trailer player, powered by TMDB.', array['Next.js','TMDB API','Tailwind CSS','REST API'], 'https://nextjs-movie-search-app.vercel.app/', 'https://github.com/rondale-bufete/nextjs-movie-search.git', '/projects/ss_sf.png', 1),
('Custom Job Application Tracker', 'A custom job application tracker for job seekers with features like status updates, notes, and data visualization. It helps users stay organized and track their job applications effectively.', array['Next.js','Tailwind CSS','Supabase'], 'https://job-application-tracker-navy-rho.vercel.app/login', 'https://github.com/rondale-bufete/job-application-tracker.git', '/projects/ss_jbt.png', 2),
('Home Environment Monitoring System - ESP32 Sensors', 'A personal dashboard for monitoring home environment conditions using ESP32 sensors and visualizing the data. It includes real-time updates, historical data visualization, and weather forecasts.', array['ESP32','IoT','Supabase','Chart.js','REST API','WebSocket','Tailwind CSS','Next.js','Open-Meteo API','C++','Arduino IDE'], 'https://esp32-home-sensors-dashboard.vercel.app/', 'https://github.com/rondale-bufete/esp32-home-sensors-dashboard.git', '/projects/ss_hsd.png', 3),
('AI-Powered Resume Analyzer', 'An AI-powered tool for analyzing and improving resumes. It provides feedback on formatting, content, and overall effectiveness using the Gemini API.', array['Next.js','Gemini API','JavaScript','React','Tailwind CSS','REST API'], 'https://ai-resume-analyzer-lovat-beta.vercel.app/', 'https://github.com/rondale-bufete/ai-resume-analyzer.git', '/projects/ss_ara.png', 4);
