"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Exclude /admin visits from analytics while tracking every public page.
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
