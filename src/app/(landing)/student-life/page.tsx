import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import AIToolSection from "../components/AIToolsSection";
import CTASection from "../components/CTASection";
import Header from "../components/Header";
import BannerSection from "../components/BannerSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <div>
        <HeroSection />
      </div>

      {/* Trust Bar */}
      {/* <div></div> */}

      {/* Features Section */}
      <div>
        <FeatureSection />
      </div>

      {/* AI Tools Section */}
      <div>
        <AIToolSection />
      </div>

      {/* For Cambodian Students */}
      <div>
        <BannerSection />
      </div>

      {/* Final CTA */}
      <div>
        <CTASection />
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
