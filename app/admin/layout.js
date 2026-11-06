import { ToastProvider } from "./ui/Toaster";

// This layout also covers the client-rendered login page.
export const metadata = {
    title: "Admin",
    robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
    return (
        <div className="admin-shell">
            <ToastProvider>{children}</ToastProvider>
        </div>
    );
}
