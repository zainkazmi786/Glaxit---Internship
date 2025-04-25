import React from 'react';

const ServiceCard = ({ image, title, description }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <a href="#" className="inline-block text-blue-500 font-medium hover:text-blue-600">
          READ MORE
        </a>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      image: "/1.jpg",
      title: "Single play roofing",
      description: "Lorem ipsum dolor sit amet vel velit auctor aliquiet. Aenean sollicitudin, lorem is simply free text."
    },
    {
      image: "/1.jpg",
      title: "Expert Mechanical",
      description: "Lorem ipsum dolor sit amet vel velit auctor aliquiet. Aenean sollicitudin, lorem is simply free text."
    },
    {
      image: "/1.jpg",
      title: "Our skill engineers",
      description: "Lorem ipsum dolor sit amet vel velit auctor aliquiet. Aenean sollicitudin, lorem is simply free text."
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-blue-500 font-medium">OUR SERVICE</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">
            We're providing quality Roofing<br />& Fixing Services
          </h2>
          <h3 className="text-xl text-gray-600">& Fixing Services</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              image={service.image}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
