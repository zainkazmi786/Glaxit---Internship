import React, { useState } from 'react';

const HowItWorksTimeline = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  const steps = [
    {
      id: 1,
      title: "Book Appointment",
      description: "You can book an appointment with us by calling our office, filling out an online form, or using our mobile app.",
      icon: "calendar"
    },
    {
      id: 2,
      title: "Visit Our Facility",
      description: "On the day of your appointment, come to our facility at the designated time. Our staff will greet you and guide you through the check-in process.",
      icon: "facility"
    },
    {
      id: 3,
      title: "Meet with Our Healthcare Professionals",
      description: "You will meet with one of our healthcare professionals who will conduct a thorough examination and provide a diagnosis or treatment plan.",
      icon: "healthcare"
    },
    {
      id: 4,
      title: "Follow-up Care",
      description: "We will schedule any necessary follow-up appointments, tests, or procedures to ensure that you receive the best possible care.",
      icon: "followup"
    },
    {
      id: 5,
      title: "Insurance and Billing",
      description: "We accept most major insurance plans and our billing department will work with you to ensure that you understand your coverage and any out-of-pocket expenses.",
      icon: "billing"
    }
  ];

  // Generate icon based on step
  const getIcon = (iconType) => {
    switch(iconType) {
      case 'calendar':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'facility':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'healthcare':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'followup':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'billing':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-20">How it Works</h2>
        
        {/* Navigation buttons - visible on mobile */}
        <div className="flex justify-center mb-8 md:hidden">
          <button 
            onClick={() => setActiveStep(activeStep > 1 ? activeStep - 1 : activeStep)}
            className="mx-2 px-4 py-2 bg-white rounded-md shadow"
            disabled={activeStep === 1}
          >
            Previous
          </button>
          <button 
            onClick={() => setActiveStep(activeStep < steps.length ? activeStep + 1 : activeStep)}
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow"
            disabled={activeStep === steps.length}
          >
            Next
          </button>
        </div>
        
        <div className="relative">
          {/* Central vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-500 transform -translate-x-1/2"></div>
          
          {steps.map((step, index) => {
            const isOdd = index % 2 === 0;
            const isActive = step.id === activeStep;
            
            return (
              <div 
                key={step.id}
                className={`flex flex-col md:flex-row items-center md:items-start relative mb-24 last:mb-0 ${
                  isOdd ? 'md:flex-row-reverse' : ''
                } transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                {/* Timeline center circle and number */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center text-xl font-bold z-20 transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-500 border-blue-600 text-white' 
                      : 'bg-blue-50 border-blue-300 text-blue-500'
                  }`}>
                    {String(step.id).padStart(2, '0')}
                  </div>
                </div>
                
                {/* Content containers (alternating) */}
                <div className="w-full md:w-5/12"></div>
                
                <div className="w-full md:w-5/12 mt-12 md:mt-0">
                  <div className={`${isOdd ? 'text-left md:pr-36' : 'text-right md:text-left md:pl-36'} cursor-pointer`}>
                    {/* Icon for odd steps (right side) */}
                    {!isOdd && (
                      <div className={`w-16 h-16 rounded-full ${
                        step.id === 2 ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'
                      } mb-4 inline-flex items-center justify-center ${
                        !isOdd ? 'ml-auto md:ml-0' : ''
                      } transition-all duration-300 ${
                        isActive ? 'scale-110 shadow-lg' : 'scale-100'
                      }`}>
                        {getIcon(step.icon)}
                      </div>
                    )}
                    
                    <h3 className={`text-xl font-semibold text-gray-800 mb-3 ${isOdd ? 'md:text-right' : ''} transition-all duration-300 ${
                      isActive ? 'text-blue-600' : ''
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-gray-600 ${isOdd ? 'md:text-right' : ''}`}>
                      {step.description}
                    </p>
                    
                    {/* Icon for even steps (left side) */}
                    {isOdd && (
                      <div className={`w-16 h-16 rounded-full ${
                        step.id === 2 ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'
                      } mt-4 inline-flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'scale-110 shadow-lg' : 'scale-100'
                      }`}>
                        {getIcon(step.icon)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Step indicators */}
        <div className="hidden md:flex justify-center mt-12">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`w-2 h-2 mx-2 rounded-full transition-all duration-300 ${
                step.id === activeStep 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-blue-300 hover:bg-blue-400'
              }`}
              aria-label={`Go to step ${step.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksTimeline;