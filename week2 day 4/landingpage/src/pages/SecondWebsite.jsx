import React from 'react';
// import Hero from '../components2/Hero';
import {AboutSection} from '../components2/AboutSection';
import {ServicesSection} from '../components2/ServicesSection';
import {TestimonialsSection} from '../components2/TestimonialsSection';
import  HowItWorksSection  from '../components2/HowitworksSection';
import { CTASection } from '../components2/CTAsection';
import { LatestUpdatesSection } from '../components2/LatestUpdatesSection';
import { FAQSection } from '../components2/FAQsection';
import { AppointmentFormSection } from '../components2/Appointmentform';
import { NewsletterSection } from '../components2/newsletter';
import { Footer } from '../components2/footer';
import Hero from '../components2/Hero';

function SecondWebsite() {
  return (
    <div className="font-sans">
      {/* <Navbar/> */}
      <Hero />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <CTASection />
      <LatestUpdatesSection />
      {/* <FAQSection /> */}
      <AppointmentFormSection />
      <div className="relative w-full">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-11/12 z-10">
            <NewsletterSection />
        </div>

        <Footer />
    </div>
      </div>
     
  );
}

export default SecondWebsite;
