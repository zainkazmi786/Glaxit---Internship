import React from 'react';
import Header from '../components/header';
import Hero from '../components/hero';
import Features from '../components/features';
import About from '../components/about';
import Services from '../components/services';
import Footer from '../components/footer';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <About />
      <Services />
      <Footer />
    </>
  );
}

export default HomePage;
