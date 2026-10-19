// Covers the login page too, which is a client component and can't export metadata itself.
export const metadata = {
    robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
    return children;
}
