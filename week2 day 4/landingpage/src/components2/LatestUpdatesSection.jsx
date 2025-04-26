import React from 'react';
export const LatestUpdatesSection = () => {
    const updates = [
      {
        image: "/doctor.jpg",
        title: "New Pediatric Services Available",
        description: "Introducing specialized treatments for children and adolescents"
      },
      {
        image: "/doctor.jpg",
        title: "Healthy Eating and Nutrition Workshop",
        description: "Join our nutritionists for tips on balanced diets"
      },
      {
        image: "/doctor.jpg",
        title: "Comprehensive Cancer Screening and Early Detection",
        description: "Early detection saves lives"
      }
    ];
  
    return (
      <section className="p-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Latest Update</h2>
          <p className="text-center text-gray-600 mb-18">Stay informed with our latest news and services</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((update, index) => (
            <div 
                key={index} 
                className={`bg-white rounded-lg overflow-hidden shadow-md transform transition-all duration-300 ${index % 2 !== 0 ? '-translate-y-8' : ''}`}
            >
                <img src={update.image} alt={update.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{update.title}</h3>
                <p className="text-gray-600 mb-4">{update.description}</p>
                <a href="#" className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-300">Read More →</a>
                </div>
            </div>
            ))}

          </div>
        </div>
      </section>
    );
  };
  