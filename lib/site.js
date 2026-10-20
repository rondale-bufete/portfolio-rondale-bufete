// Resolve the absolute site origin for metadata, sitemap, and robots.
export function getSiteUrl() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicit) return explicit.replace(/\/+$/, "");

    const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (vercelHost) return `https://${vercelHost}`;

    return "http://localhost:3000";
}
