import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ banner }) => {
  return (
    <div className="relative min-h-[500px] bg-gray-100 overflow-hidden px-16">
      <div className="container mx-auto px-4 flex items-center h-full">
        <div className="w-full z-10 py-16">
          <div className="text-blue-200 italic text-xl mb-2">{banner.subtitle}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            {banner.title}
          </h1>
          <p className="text-gray-200 mb-8">{banner.discount}</p>
          <div className="flex space-x-4">
            <Link 
              to="/shop" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition duration-300"
            >
              {banner.primaryButton}
            </Link>
            <Link 
              to="/about" 
              className="border border-gray-300 hover:border-gray-400 text-gray-200 px-6 py-2 rounded-md font-medium transition duration-300"
            >
              {banner.secondaryButton}
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-full">
          <div className="h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${banner.image})` }}></div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;