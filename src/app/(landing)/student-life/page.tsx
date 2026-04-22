"use client";

import { useEffect } from "react";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import AIToolSection from "../components/AIToolsSection";
import CTASection from "../components/CTASection";
import Header from "../components/Header";
import BannerSection from "../components/BannerSection";
import TrustBar from "../components/TrustBar";

function WarmUpServer() {
  const backendUrl = process.env.NEXT_PUBLIC_HEALTH_API_URL || "http://localhost:5000/health";

  useEffect(() => {
    fetch(`${backendUrl}`)
      .then(() => console.log("Backend warmed up", backendUrl))
      .catch((err) => console.error("Error warming up backend:", err));
  }, []);

  return null;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <WarmUpServer />

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Bar */}
      <TrustBar />

      {/* Features Section */}
      <FeatureSection />

      {/* AI Tools Section */}
      <AIToolSection />

      {/* For Cambodian Students */}
      <BannerSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
