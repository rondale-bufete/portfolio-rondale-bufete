import AdminNav from "./AdminNav";
import { logoutAction } from "../auth-actions";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#14161A]">
            <div className="flex flex-col md:block md:h-screen md:overflow-hidden">
                <AdminNav logoutAction={logoutAction} />
                <main className="min-w-0 md:ml-60 md:h-screen md:overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
