import Sparkline from "./Sparkline";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/icons";

// Label, value and (when there's a previous period to compare) the change.
export default function StatTile({ label, value, change, comparedTo, note, trend }) {
    const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";

    return (
        <div className="stat-tile">
            <p className="stat-tile__label">{label}</p>
            <div className="stat-tile__body">
                <p className="stat-tile__value">{value}</p>
                <Sparkline values={trend} />
            </div>
            {typeof change === "number" ? (
                <p className={`stat-delta stat-delta--${direction}`}>
                    {direction === "up" && <ArrowUpIcon size={14} />}
                    {direction === "down" && <ArrowDownIcon size={14} />}
                    {change > 0 ? "+" : ""}
                    {change}%<span>vs {comparedTo}</span>
                </p>
            ) : (
                <p className="stat-delta">{note}</p>
            )}
        </div>
    );
}
