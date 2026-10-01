import { Geist, Geist_Mono, Space_Grotesk, DM_Sans } from "next/font/google";
import PublicAnalytics from "@/components/PublicAnalytics";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-space",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-body",
});

export const metadata = {
  title: "Rondale Rae Bufete — Full Stack Developer",
  description: "Portfolio of a full stack developer specializing in modern web technologies.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1f4ef",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-[family-name:var(--font-display)] antialiased">
        {children}
        <PublicAnalytics />
      </body>
    </html>
  );
}