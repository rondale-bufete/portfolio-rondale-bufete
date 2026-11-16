import { getContributionMonthLabels } from "@/lib/githubContributions";

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const CONTRIBUTION_COUNT = new Intl.NumberFormat("en");

function ContributionLegend() {
    return (
        <div className="github-calendar__legend" role="img" aria-label="Contribution levels from less to more">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
                <span key={level} className="github-calendar__swatch" data-level={level} aria-hidden="true" />
            ))}
            <span>More</span>
        </div>
    );
}

export default function GitHubCalendar({ data }) {
    const months = getContributionMonthLabels(data.weeks);

    return (
        <>
            <p className="github-calendar__summary">
                <strong>{CONTRIBUTION_COUNT.format(data.totalContributions)}</strong> contributions in {data.year}
            </p>
            <div className="github-calendar" role="group" aria-label={`${data.totalContributions} GitHub contributions in ${data.year}`}>
                <div className="github-calendar__weekday-labels" aria-hidden="true">
                    {WEEKDAY_LABELS.map((label, index) => (
                        <span key={index}>{label}</span>
                    ))}
                </div>
                <div className="github-calendar__body">
                    <div className="github-calendar__months" aria-hidden="true">
                        {months.map((month, index) => (
                            <span key={index}>{month}</span>
                        ))}
                    </div>
                    <div className="github-calendar__weeks" role="group" aria-label="Daily contribution activity">
                        {data.weeks.map((days, weekIndex) => {
                            const firstDay = days[0]?.weekday ?? 0;
                            const lastDay = days[days.length - 1]?.weekday ?? 6;

                            return (
                                <div key={weekIndex} className="github-calendar__week">
                                    {Array.from({ length: firstDay }, (_, index) => (
                                        <span key={`leading-${index}`} className="github-calendar__day github-calendar__day--empty" aria-hidden="true" />
                                    ))}
                                    {days.map((day) => {
                                        const contribution = `${CONTRIBUTION_COUNT.format(day.count)} ${
                                            day.count === 1 ? "contribution" : "contributions"
                                        } on ${day.date}`;
                                        return (
                                            <span
                                                key={day.date}
                                                className="github-calendar__day"
                                                data-level={day.level}
                                                title={contribution}
                                                role="img"
                                                aria-label={contribution}
                                            />
                                        );
                                    })}
                                    {Array.from({ length: 6 - lastDay }, (_, index) => (
                                        <span key={`trailing-${index}`} className="github-calendar__day github-calendar__day--empty" aria-hidden="true" />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="github-calendar__footer">
                <a href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer">
                    @{data.username} on GitHub
                    <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <ContributionLegend />
            </div>
        </>
    );
}
