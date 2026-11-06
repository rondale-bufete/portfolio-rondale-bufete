import AdminNav from "./AdminNav";
import { logoutAction } from "../auth-actions";
import { getAdminCounts } from "@/lib/adminCounts";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
    const [{ counts }, { data: profile }] = await Promise.all([
        getAdminCounts(),
        supabaseAdmin.from("profile").select("name").eq("id", 1).maybeSingle(),
    ]);

    return (
        <div className="admin-app">
            <AdminNav logoutAction={logoutAction} counts={counts} name={profile?.name} />
            <main className="admin-main">
                <div className="admin-content">{children}</div>
            </main>
        </div>
    );
}
