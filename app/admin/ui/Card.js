import { cardBase } from "./tokens";

export default function Card({ children, className = "" }) {
    return <div className={`${cardBase} p-6 md:p-7 ${className}`}>{children}</div>;
}
