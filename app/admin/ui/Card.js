export default function Card({ children, className = "" }) {
    return <div className={`admin-card admin-card--padded ${className}`}>{children}</div>;
}
