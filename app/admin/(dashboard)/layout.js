import AdminNav from "./AdminNav";
import { logoutAction } from "../auth-actions";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#14161A]">
            <div className="flex flex-col md:flex-row md:min-h-screen">
                <AdminNav logoutAction={logoutAction} />
                <main className="flex-1 min-w-0">
                    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
