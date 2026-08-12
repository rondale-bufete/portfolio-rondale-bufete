export default function EmptyState({ title, description }) {
    return (
        <div className="border border-dashed border-[#D8D8DC] rounded-xl px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#14161A] mb-1">{title}</p>
            {description && <p className="text-sm text-[#5B5F66]">{description}</p>}
        </div>
    );
}
