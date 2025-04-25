import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] bg-gray-800">
      <div className="absolute inset-0">
        <img 
          src="1.jpg" 
          alt="Roofing professional at work" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
      
      <div className="relative container mx-auto px-10 h-full flex items-center ">
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-lg font-medium">30 Years Experience</p>
          <h1 className="text-5xl font-bold mb-6">
            Smart Roofing &<br />Fixing Services
          </h1>
          <p className="mb-8 text-lg">
            Excepteur sint occaecat cupidatat non proident sunt in qui culpa qui officia est laborum. Sed ut perspiciatis unde omnis iste.
          </p>
          <a 
            href="#" 
            className="inline-block bg-blue-500 text-white px-8 py-3 font-medium hover:bg-blue-600 transition duration-300"
          >
            OUR SERVICE
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;