import GitHubCalendar from "./GitHubCalendar";
import SectionHeader from "./SectionHeader";
import { getPublicGitHubContributions } from "@/lib/githubContributions";

export function GitHubActivityFallback({ label = "GitHub", heading = "Open-source activity" }) {
    return (
        <section id="github" className="section github-activity" aria-busy="true">
            <div className="container">
                <SectionHeader label={label} heading={heading} />
                <div className="github-activity__card">
                    <p className="github-activity__unavailable" role="status">
                        Loading GitHub activity...
                    </p>
                </div>
            </div>
        </section>
    );
}

export default async function GitHubActivity({ profile, label = "GitHub", heading = "Open-source activity" }) {
    if (!profile?.github) return null;

    const data = await getPublicGitHubContributions(profile.github);

    return (
        <section id="github" className="section github-activity">
            <div className="container">
                <SectionHeader label={label} heading={heading} />
                <div className="github-activity__card">
                    {data.available ? (
                        <GitHubCalendar data={data} />
                    ) : (
                        <p className="github-activity__unavailable" role="status">
                            The contribution calendar is unavailable right now.{" "}
                            <a href={profile.github} target="_blank" rel="noopener noreferrer">
                                View GitHub profile
                            </a>
                            .
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
