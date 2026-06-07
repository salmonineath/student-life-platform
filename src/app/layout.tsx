import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://student-life.app"),
  title: {
    default: "Student Life — Organize Your University Life in Cambodia",
    template: "%s | Student Life",
  },
  description:
    "Student Life is a free all-in-one platform for Cambodian university students. Manage your schedule, track assignments, join study groups, and get AI-powered study help. Used by students at CADT, EHT, IMSE and more.",
  keywords: [
    "student life",
    "student life cambodia",
    "cambodia university app",
    "student platform cambodia",
    "CADT student",
    "EHT student",
    "academic planner cambodia",
    "study groups cambodia",
    "assignment tracker",
    "university schedule cambodia",
    "khmer student app",
    "cambodian student tools",
  ],
  authors: [{ name: "Student Life" }],
  openGraph: {
    type: "website",
    siteName: "Student Life",
    url: "https://student-life.app",
    title: "Student Life — Organize Your University Life in Cambodia",
    description:
      "Free academic platform for Cambodian university students. Schedule, assignments, study groups & AI tools — all in one place. 100% free forever.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Student Life — Academic Platform for Cambodian Students" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Life — Organize Your University Life in Cambodia",
    description: "Free academic platform for Cambodian university students. Schedule, assignments, study groups & AI tools.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: "https://student-life.app/student-life",
  },
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
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand
          visibleToasts={5}
          duration={4000}
          toastOptions={{
            classNames: {
              toast: "rounded-2xl! shadow-lg! border-slate-100!",
            },
          }}
        />
      </body>
    </html>
  );
}
