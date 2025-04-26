
import React from 'react';

// About Section Component
export const AboutSection = () => {
  return (
    <section className="p-20  bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-16">
          <div className="w-5/6 md:w-2/5">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              ABOUT US
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ProHealth Is a team of experienced medical professionals
            </h2>
            <p className="text-gray-600 mb-6">
              Our dedicated team of healthcare professionals is committed to providing the highest quality care. 
              With decades of combined experience, we offer comprehensive medical services tailored to your needs.
            </p>
            
          </div>
          <div className="w-5/6 md:w-1/3">
            <img 
              src="/doctor.jpg" 
              alt="Medical professionals" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};