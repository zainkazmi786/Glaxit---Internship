import React from 'react';
export const ServicesSection = () => {
    const services = [
      {
        icon: "🚑",
        title: "Emergency Department",
        description: "24/7 emergency care for critical conditions"
      },
      {
        icon: "👨‍⚕️",
        title: "Primary Care",
        description: "Regular check-ups and preventive healthcare"
      },
      {
        icon: "🧠",
        title: "Specialized Care",
        description: "Expert treatment for specific medical conditions"
      },
      {
        icon: "🩺",
        title: "Diagnosis Department",
        description: "Comprehensive testing and medical evaluations"
      },
      {
        icon: "💊",
        title: "Pharmacy Department",
        description: "Full-service pharmacy for all your medication needs"
      },
      {
        icon: "🏥",
        title: "Outpatient Department",
        description: "Non-emergency treatments and follow-up care"
      }
    ];
  
    return (
      <section className="p-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h4 className="text-center text-gray-600 mb-2">OUR DEPARTMENTS</h4>
          <h2 className="text-3xl font-bold text-center text-sky-800 mb-12">For Your Health</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-10 rounded-lg shadow-md hover:shadow-lg group hover:bg-sky-800 transition-all duration-300 flex itmes-center gap-8"> 
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">{service.icon}</span>
                </div>
                <div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-white">{service.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-200">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };