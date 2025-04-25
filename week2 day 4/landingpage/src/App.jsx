import React from 'react';
import Header from './components/header';
import Hero from './components/hero';
import Features from './components/features';
import About from './components/about';
import Services from './components/services';
import Footer from './components/footer';

function App() {
  return (
    <div className="font-sans">
      <Header />
      <Hero />
      <Features />
      <About />
      <Services />
      <Footer />
    </div>
  );
}

export default App;