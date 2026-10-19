import { getPortfolioData } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
    const siteUrl = getSiteUrl();
    const { projects } = await getPortfolioData();

    return [
        { url: siteUrl, changeFrequency: "monthly", priority: 1 },
        ...projects.map((project) => ({
            url: `${siteUrl}/projects/${project.id}`,
            changeFrequency: "yearly",
            priority: 0.7,
        })),
    ];
}
