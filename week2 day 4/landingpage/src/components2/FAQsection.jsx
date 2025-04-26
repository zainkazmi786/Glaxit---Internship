import React from 'react';
export const FAQSection = () => {
    const faqs = [
      {
        question: "What insurance do you accept?",
        answer: "We accept most major insurance plans. Please contact our office to verify that we accept your specific insurance plan."
      },
      {
        question: "How do I schedule an appointment?",
        answer: "You can schedule an appointment through our website, by calling our office, or by visiting us in person."
      },
      {
        question: "What should I bring to my appointment?",
        answer: "Please bring your ID, insurance card, a list of current medications, and any relevant medical records."
      },
      {
        question: "How do I access my medical records?",
        answer: "You can access your medical records through our patient portal or by submitting a request to our medical records department."
      }
    ];
  
    const [openIndex, setOpenIndex] = React.useState(null);
  
    const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Usually Asked</h2>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <button 
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-blue-500 transition-colors duration-300"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="ml-2">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-3 text-gray-600 pl-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };