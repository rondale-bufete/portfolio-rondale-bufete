import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/data";
import { getPublicGitHubContributions, parseContributionYear } from "@/lib/githubContributions";

export async function GET(request) {
    const requestedYear = new URL(request.url).searchParams.get("year");
    const year = parseContributionYear(requestedYear);
    if (!requestedYear || !/^\d{4}$/.test(requestedYear) || year !== Number(requestedYear)) {
        return NextResponse.json({ error: "Select a valid contribution year." }, { status: 400 });
    }

    const { profile } = await getPortfolioData();
    if (!profile?.github) {
        return NextResponse.json({ error: "A GitHub profile is not configured." }, { status: 404 });
    }

    const data = await getPublicGitHubContributions(profile.github, { year });
    return NextResponse.json(data, { status: data.available ? 200 : 503 });
}
