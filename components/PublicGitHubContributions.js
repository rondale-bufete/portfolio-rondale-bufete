"use client";

import { useState } from "react";
import GitHubCalendar from "./GitHubCalendar";

export default function PublicGitHubContributions({ initialData, title }) {
    const [data, setData] = useState(initialData);
    const [selectedYear, setSelectedYear] = useState(initialData.year);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleYearChange(event) {
        const year = event.currentTarget.value;
        setSelectedYear(Number(year));
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/github-contributions?year=${encodeURIComponent(year)}`, {
                headers: { Accept: "application/json" },
            });
            const nextData = await response.json();

            if (!response.ok) {
                throw new Error(nextData.error || nextData.message || "Could not load contributions for that year.");
            }
            if (!nextData.available) {
                throw new Error(nextData.message || "Could not load contributions for that year.");
            }

            setData(nextData);
        } catch (requestError) {
            setSelectedYear(data.year);
            setError(requestError instanceof Error ? requestError.message : "Could not load contributions for that year.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="project-card--github__content" aria-busy={isLoading}>
            <header className="project-card--github__header">
                <h3 className="project-card__title project-card--github__title">{title}</h3>
                <label className="project-card--github__year">
                    <span>Year</span>
                    <select
                        aria-label="Contribution year"
                        value={selectedYear}
                        onChange={handleYearChange}
                        disabled={isLoading}
                        className="project-card--github__year-select"
                    >
                        {data.availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </label>
            </header>
            {error && (
                <p className="project-card--github__error" role="status">
                    {error}
                </p>
            )}
            <GitHubCalendar data={data} />
        </div>
    );
}
