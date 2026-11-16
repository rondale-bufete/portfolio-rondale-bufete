"use client";

export default function ContributionYearFilter({ years, selectedYear, range }) {
    function handleYearChange(event) {
        event.currentTarget.form?.requestSubmit();
    }

    return (
        <form action="/admin" method="get" className="github-calendar__year-filter">
            <input type="hidden" name="range" value={range} />
            <label htmlFor="github-contribution-year">Year</label>
            <select
                id="github-contribution-year"
                name="githubYear"
                defaultValue={selectedYear}
                className="admin-input"
                onChange={handleYearChange}
            >
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </form>
    );
}
