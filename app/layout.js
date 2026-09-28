import { Archivo, JetBrains_Mono } from "next/font/google";
import PublicAnalytics from "@/components/PublicAnalytics";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Rondale Rae Bufete — Full Stack Developer",
  description: "Portfolio of a full stack developer specializing in modern web technologies.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f2f2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-[family-name:var(--font-display)] antialiased">
        {children}
        <PublicAnalytics />
      </body>
    </html>
  );
}