import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';

const Landing = () => (
  <div className="min-h-screen">
    <LandingNav />
    <HeroSection />
    <FeaturesSection />
    <PricingSection />
    <Footer />
  </div>
);

export default Landing;
