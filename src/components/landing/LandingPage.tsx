"use client";

import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import TrustSection from "./TrustSection";
import BusinessGrowSection from "./BusinessGrowSection";
import StepsSection from "./StepsSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <TrustSection />
      <BusinessGrowSection />
      <StepsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

