"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Vercel Analytics/SpeedInsights live in the root layout so every public
// page gets tracked (see lib history: they used to live only in the
// homepage, missing every other page). The root layout also wraps /admin,
// though — and admin visits are just the site owner using their own tool,
// not real traffic. Gate them here instead of counting every login as a
// pageview.
export default function PublicAnalytics() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;

    return (
        <>
            <SpeedInsights />
            <Analytics />
        </>
    );
}
