import AdminActionForm from "./AdminActionForm";
import { TrashIcon } from "@/components/icons";

// The one place an admin action asks for confirmation: deleting can't be undone.
export default function DeleteAction({ action, label, confirmMessage, successMessage }) {
    return (
        <AdminActionForm action={action} confirmMessage={confirmMessage} confirmTitle={`${label}?`} successMessage={successMessage}>
            <button type="submit" className="danger-link">
                <TrashIcon size={16} />
                {label}
            </button>
        </AdminActionForm>
    );
}
