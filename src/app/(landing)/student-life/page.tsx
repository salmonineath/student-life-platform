import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "../components/HeroSection";
import TrustBar from "../components/TrustBar";
import WarmUpServer from "../components/WarmUpServer";

// Below-fold sections loaded as separate JS chunks
const FeatureSection = dynamic(() => import("../components/FeatureSection"));
const AIToolSection  = dynamic(() => import("../components/AIToolsSection"));
const BannerSection  = dynamic(() => import("../components/BannerSection"));
const CTASection     = dynamic(() => import("../components/CTASection"));
const Footer         = dynamic(() => import("../components/Footer"));

export const metadata: Metadata = {
  title: "Student Life Cambodia — Free Academic Platform for University Students",
  description:
    "Student Life is the #1 free platform for Cambodian university students. Track assignments, manage your schedule, join study groups, and use AI study tools. Used at CADT, EHT, IMSE and more.",
  alternates: {
    canonical: "https://student-life.app/student-life",
  },
  openGraph: {
    url: "https://student-life.app/student-life",
    title: "Student Life Cambodia — Free Academic Platform for University Students",
    description:
      "Student Life is the #1 free platform for Cambodian university students. Track assignments, manage your schedule, join study groups, and use AI study tools.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://student-life.app/#website",
      "url": "https://student-life.app",
      "name": "Student Life",
      "description": "Free academic platform for Cambodian university students",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://student-life.app/student-life?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://student-life.app/#app",
      "name": "Student Life",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Web",
      "url": "https://student-life.app/student-life",
      "description":
        "Student Life is a free all-in-one academic platform for Cambodian university students. Manage schedules, track assignments, join study groups, and get AI-powered study help.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student",
        "geographicArea": {
          "@type": "Country",
          "name": "Cambodia",
        },
      },
      "featureList": [
        "Weekly schedule management",
        "Assignment tracker with deadlines",
        "Study group chat",
        "AI-powered study plan generator",
        "Free forever",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://student-life.app/#organization",
      "name": "Student Life",
      "url": "https://student-life.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://student-life.app/og-image.png",
      },
      "description": "Building free academic tools for Cambodian university students.",
      "areaServed": {
        "@type": "Country",
        "name": "Cambodia",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        <WarmUpServer />
        <HeroSection />
        <TrustBar />
        <FeatureSection />
        <AIToolSection />
        <BannerSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
