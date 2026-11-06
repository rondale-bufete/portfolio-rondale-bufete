import AdminActionForm from "./AdminActionForm";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/icons";

// Up/down arrows for a list row. The list itself shows the move, so success is
// silent; a failure still shows as a toast.
export default function ReorderControls({ label, isFirst, isLast, onMoveUp, onMoveDown }) {
    return (
        <>
            <AdminActionForm action={onMoveUp} successMessage={null} inlineErrors={false}>
                <button type="submit" disabled={isFirst} className="icon-button" aria-label={`Move ${label} up`} title="Move up">
                    <ArrowUpIcon size={16} />
                </button>
            </AdminActionForm>
            <AdminActionForm action={onMoveDown} successMessage={null} inlineErrors={false}>
                <button type="submit" disabled={isLast} className="icon-button" aria-label={`Move ${label} down`} title="Move down">
                    <ArrowDownIcon size={16} />
                </button>
            </AdminActionForm>
        </>
    );
}
