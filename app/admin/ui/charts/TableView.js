// The same numbers as the chart above it, for screen readers and exact values.
export default function TableView({ caption, columns, rows }) {
    return (
        <details className="chart-table">
            <summary>View as table</summary>
            <table>
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column} scope="col">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row[0]}>
                            {row.map((cell, index) => (index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </details>
    );
}
