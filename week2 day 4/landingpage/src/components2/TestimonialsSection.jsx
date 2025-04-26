import React from 'react';

export const TestimonialsSection = () => {
    const testimonials = [
      {
        content: "The care I received at ProHealth was exceptional. The doctors wI've been a patient at ProHealth for over 5 years,  and I've always received tere knowledgeable and took theI've been a paI've been a patient at ProHealth for over 5 years,  and I've always received ttient at ProHealth for over 5 years,  and I've always received t time to address all of my concerns.",
        author: "Catherine Johnson",
        role: "Patient"
      },
      {
        content: "I've been a patient at ProHealth for over 5 years,  and I'I've been a patient at ProHealth for over 5 years,  and I've always received tve always received tI've been a patient at ProHealth for oveI've been a patient at ProHealth for over 5 years,  and I've always received tr 5 years,  and I've always received top-notch care. Highly recommend their services.",
        author: "Michael Rodriguez",
        role: "Patient"
      }
    ];
  
    const [activeIndex, setActiveIndex] = React.useState(0);
  
    return (
      <section className="p-20 bg-gradient-to-r from-blue-400 to-white via-sky-200">
        <div className="container mx-auto">
          <h2 className="text-xl font-semibold  text-sky-800 mb-2">TESTIMONIALS</h2>
          <h2 className="text-4xl font-bold  text-gray-800 mb-12">What Our Patients Say About Us</h2>
          
          <div className="flex flex-col md:flex-row gap-8 ">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-lg shadow-md w-[50vw] h-72 ${activeIndex === index ? 'border-2 border-blue-400' : ''}`}
              >
                <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <button 
              className="mx-1 w-8 h-8 rounded-full bg-blue-500 text-white"
              onClick={() => setActiveIndex(0)}
            >
              1
            </button>
            <button 
              className="mx-1 w-8 h-8 rounded-full bg-white text-blue-500 border border-blue-500"
              onClick={() => setActiveIndex(1)}
            >
              2
            </button>
          </div>
        </div>
      </section>
    );
  };