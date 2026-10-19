import { ImageResponse } from "next/og";
import OgCard, { OG_SIZE } from "@/components/OgCard";
import { getPortfolioData } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

export const alt = "Portfolio preview card";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image() {
    const { profile } = await getPortfolioData();
    const name = profile?.name || "Portfolio";
    const eyebrow = [profile?.role, profile?.location].filter(Boolean).join(" · ");

    return new ImageResponse(
        <OgCard eyebrow={eyebrow} title={name} subtitle={profile?.tagline} name={name} host={new URL(getSiteUrl()).host} />,
        size
    );
}
