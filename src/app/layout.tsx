import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "Student Life — Organize Your University Life",
    template: "%s | Student Life",
  },
  description:
    "Free all-in-one academic platform for Cambodian university students. Manage your schedule, track assignments, join study groups, and get AI-powered study help.",
  keywords: ["student platform", "Cambodia university", "CADT", "academic planner", "study groups", "assignment tracker"],
  authors: [{ name: "Student Life" }],
  openGraph: {
    type: "website",
    siteName: "Student Life",
    title: "Student Life — Organize Your University Life",
    description:
      "Free academic platform for Cambodian university students. Schedule, assignments, study groups & AI tools — all in one place.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Student Life Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Life — Organize Your University Life",
    description: "Free academic platform for Cambodian university students.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth font-sans", geist.variable, sora.variable)}
    >
      <body className={`${geist.variable} ${sora.variable} font-sans`}>
        {" "}
        <Providers>
          {children} <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
