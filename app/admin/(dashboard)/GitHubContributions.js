import GitHubCalendar from "@/components/GitHubCalendar";
import { getGitHubContributions } from "@/lib/githubContributions";
import ContributionYearFilter from "./ContributionYearFilter";

export function GitHubContributionsFallback() {
    return (
        <section className="chart-card github-contributions" aria-busy="true">
            <header className="chart-card__header">
                <h2 className="chart-card__title">GitHub contributions</h2>
            </header>
            <p className="chart-card__empty">Loading GitHub activity…</p>
        </section>
    );
}

export default async function GitHubContributions({ githubUrl, selectedYear, range }) {
    const data = await getGitHubContributions(githubUrl, { year: selectedYear });

    return (
        <section className="chart-card github-contributions">
            <header className="chart-card__header">
                <div>
                    <h2 className="chart-card__title">GitHub contributions</h2>
                    {data.username && <p className="chart-card__subtitle">Activity in {data.year}</p>}
                </div>
                {data.available && <ContributionYearFilter years={data.availableYears} selectedYear={data.year} range={range} />}
            </header>
            {data.available ? (
                <GitHubCalendar data={data} />
            ) : (
                <p className="chart-card__empty" role="status">
                    {data.message}
                </p>
            )}
        </section>
    );
}
