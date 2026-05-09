import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ArchitectureSection from '@/components/ArchitectureSection';
import ApiSection from '@/components/ApiSection';
import DemoSection from '@/components/DemoSection';
import FooterSection from '@/components/FooterSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <ApiSection />
      <DemoSection />
      <FooterSection />
    </div>
  );
};

export default Index;
