import React from 'react';

export const CTASection = () => {
    return (
      <section className="p-20">
        <div className="container mx-auto bg-sky-600 rounded-lg shadow-lg p-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/3">
              <img 
                src="/doctor.jpg" 
                alt="Healthcare professional" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-3/5 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-white mb-4">Don't Let Your Health Take a Backseat!</h2>
              <p className="text-blue-100 mb-6">
                Schedule your appointment today and take the first step towards better health.
                Our team of experts is ready to provide you with the care you deserve.
              </p>
              <button className="bg-white text-blue-600 py-3 px-6 rounded-md font-semibold hover:bg-blue-50 transition-colors duration-300">
                Book an Appointment
              </button>
            </div>
            
          </div>
        </div>
      </section>
    );
  };