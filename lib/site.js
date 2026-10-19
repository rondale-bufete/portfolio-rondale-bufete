// Absolute origin for metadata, the sitemap and robots.txt.
// NEXT_PUBLIC_SITE_URL wins so a custom domain can be set without code
// changes; Vercel injects VERCEL_PROJECT_PRODUCTION_URL on every deploy.
export function getSiteUrl() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicit) return explicit.replace(/\/+$/, "");

    const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (vercelHost) return `https://${vercelHost}`;

    return "http://localhost:3000";
}
