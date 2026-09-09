# Rondale Rae Bufete — Portfolio

A full-stack developer portfolio built with **Next.js** and **Supabase** — not just a static site, but a small CMS. Every section (Experience, Projects, Certifications, Education, Skills, and even the sections themselves) is editable from a password-protected admin panel, backed by Postgres. It also ships with a Gemini-powered AI assistant that answers visitor questions grounded in the live portfolio data.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Storage-3ECF8E?logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Gemini-8E75B2?logo=googlegemini&logoColor=white)

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Admin panel](#admin-panel)
- [AI assistant](#ai-assistant)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Features

### Public site
- Responsive homepage with an animated flip-card hero
- Modular sections — About, Experience, Skills, Projects, Certifications, Contact — each reorderable, hideable, and retitlable from the admin panel, plus support for fully custom sections
- Contact form via EmailJS
- Floating AI chat widget grounded in live portfolio content, rate-limited per visitor
- Vercel Speed Insights

### Admin panel (`/admin`)
- Password-protected, signed-cookie session (no third-party auth needed for a single owner)
- Full CRUD for Profile, Experience, Education, Certifications, Projects, and Skills
- Structured inputs where it matters — Month/Year date pickers, bullet-point fields — instead of freeform text
- Section management: reorder with one click, show/hide, rename labels and headings, add custom text sections
- Image and PDF uploads straight to Supabase Storage
- A shared internal design system (buttons, fields, cards, icons) so every admin page looks and behaves consistently

### AI assistant
- Backed by Google Gemini, called only from the server — the API key never reaches the browser
- Grounded in the same live Supabase data the homepage renders, so an admin edit is reflected in the assistant's answers immediately
- Scoped system prompt: stays on portfolio-related topics and declines requests to act as a general-purpose assistant
- Per-visitor daily message limit to keep API usage bounded

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| UI | React 19, Tailwind CSS v4 |
| Fonts | Space Grotesk (display), Inter (body), JetBrains Mono (labels/data) |
| Database | Supabase Postgres, with Row Level Security |
| File storage | Supabase Storage |
| AI | Google Gemini via `@google/genai` |
| Email | EmailJS |
| Analytics | Vercel Speed Insights |
| Hosting | Vercel (recommended) |

---

## Project structure

```
app/
├── layout.js                 # Root layout, fonts, metadata
├── page.js                   # Homepage — fetches data, renders sections in admin-defined order
├── globals.css
├── api/
│   └── chat/route.js         # Gemini chat endpoint
├── components/                # Public site components (Hero, About, Experience, Skills,
│                               #   Projects, Contact, Footer, Navbar, ChatWidget, ...)
└── admin/
    ├── login/page.js          # Password login
    ├── auth-actions.js        # Login/logout server actions
    ├── actions/                # Server Actions for each entity (CRUD)
    ├── ui/                     # Shared admin design system (Button/Field/Card/icons/...)
    └── (dashboard)/            # Protected admin pages: overview, sections, profile,
                                #   experience, projects, certifications, education, skills
lib/
├── data.js                    # getPortfolioData() — single source of truth for public data
├── auth.js                    # Admin session helpers
├── monthYear.js                # Shared date-picker helpers
├── chatContext.js              # Formats portfolio data into a compact prompt context
├── chatRateLimit.js            # Per-visitor daily rate limiting
├── gemini.js                   # Gemini SDK wrapper
└── supabase/
    ├── public.js               # Anon-key client (read-only, used by the public site)
    └── admin.js                 # Service-role client (server-only, used by admin + chat)
middleware.js                  # Protects /admin/* routes
supabase/
├── schema.sql                  # Core tables (profile, education, skills, certifications, projects)
├── sections_migration.sql      # Adds the sections table (order/visibility/titles)
├── experience_migration.sql    # Adds Experience + bullets/highlights/credential fields
└── chat_migration.sql          # Adds the chat rate-limit table
```

---

## Getting started

```bash
git clone https://github.com/rondale-bufete/portfolio-rondale-bufete.git
cd portfolio
npm install
```

1. Create a [Supabase](https://supabase.com) project.
2. In the Supabase SQL Editor, run the migrations **in order**:
   `schema.sql` → `sections_migration.sql` → `experience_migration.sql` → `chat_migration.sql`.
3. Copy `.env.local.example` to `.env.local` and fill in the values (see below).
4. Get a [Gemini API key](https://aistudio.google.com/app/apikey) if you want the chat assistant enabled.
5. Run the dev server:

```bash
npm run dev
```

## Admin panel

- **Sections** — reorder, show/hide, and retitle every section; add custom text sections
- **Profile** — name, bio, tagline, links, photo, resume
- **Experience / Education** — structured Month/Year dates, bullet points for achievements/coursework
- **Projects** — title, description, tags, optional highlight bullets, screenshot
- **Certifications** — issuer, issued date, credential ID, badge image, verification link/PDF
- **Skills** — categories with tag-style items

Saves go live on the public site within about a minute (or immediately — every save revalidates the homepage).

---

## AI assistant

The chat widget (bottom-right on the public site) sends conversation history to `app/api/chat/route.js`, which:

1. Checks the visitor's daily rate limit (`chat_rate_limits`)
2. Fetches the same portfolio data the homepage renders, via `getPortfolioData()`
3. Formats it into a compact context block and sends it to Gemini with a scoped system prompt
4. Returns the reply to the widget

No conversation history is persisted server-side — it resets on page refresh by design.

---

## Deployment

Deployed on [Vercel](https://vercel.com):

1. Import the repo into Vercel
2. Add every environment variable from the table above under Project Settings → Environment Variables
3. Deploy — the build command and output are the Next.js defaults, no extra configuration needed

