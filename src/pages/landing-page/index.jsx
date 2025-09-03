import React from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import DemoSection from './components/DemoSection';
import FeatureCards from './components/FeatureCards';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <HeroSection />
        <DemoSection />
        <FeatureCards />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;