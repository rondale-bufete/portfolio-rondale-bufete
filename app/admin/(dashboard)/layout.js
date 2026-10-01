import AdminNav from "./AdminNav";
import { logoutAction } from "../auth-actions";
import { getAdminCounts } from "@/lib/adminCounts";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
    const { counts } = await getAdminCounts();

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            <div className="flex flex-col md:block md:h-screen md:overflow-hidden">
                <AdminNav logoutAction={logoutAction} counts={counts} />
                <main className="min-w-0 md:ml-60 md:h-screen md:overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
