import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import AIToolSection from "../components/AIToolsSection";
import CTASection from "../components/CTASection";
import Header from "../components/Header";
import BannerSection from "../components/BannerSection";
import TrustBar from "../components/TrustBar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
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
