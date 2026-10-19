import { ImageResponse } from "next/og";
import OgCard, { OG_SIZE } from "@/components/OgCard";
import { getPortfolioData, getProjectById } from "@/lib/data";
import { splitParagraphs, truncate } from "@/lib/format";
import { getSiteUrl } from "@/lib/site";

export const alt = "Project preview card";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }) {
    const { id } = await params;
    const [project, { profile }] = await Promise.all([getProjectById(id), getPortfolioData()]);
    const name = profile?.name || "Portfolio";
    const host = new URL(getSiteUrl()).host;

    if (!project) {
        return new ImageResponse(<OgCard title={name} name={name} host={host} />, size);
    }

    const eyebrow = ["Project", project.provenance, project.year].filter(Boolean).join(" · ");
    const subtitle = truncate(splitParagraphs(project.description)[0], 110);

    return new ImageResponse(
        <OgCard eyebrow={eyebrow} title={project.title} subtitle={subtitle} name={name} host={host} />,
        size
    );
}
