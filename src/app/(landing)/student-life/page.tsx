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
  title: "Student Life — Your All-in-One Academic Platform",
  description:
    "Manage your university schedule, track assignments, join study groups, and get AI study help. Free forever for students at CADT, EHT, IMSE, and more.",
  openGraph: {
    url: "https://student-life.app/student-life",
  },
};

export default function LandingPage() {
  return (
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
  );
}
