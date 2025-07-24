import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CategoryBanner = ({ categories }) => {
  return (
    <div className="py-10 mb-10 px-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text animate-pulse">
          Top Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className="relative rounded-xl overflow-hidden h-64 group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-800/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300"></div> */}
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                <h3 className="text-white text-2xl font-bold mb-1 transform group-hover:scale-105 transition-transform duration-300">
                  {category.name}
                </h3>
                <p className="text-indigo-200 mb-4 opacity-90">{category.discount}</p>
                <Link 
                  to={`/shop`} 
                  className="flex items-center text-white hover:text-indigo-200 transition-colors duration-300 group/link"
                >
                  <span className="relative">
                    Shop Now 
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-300 to-blue-300 group-hover/link:w-full transition-all duration-300"></span>
                  </span>
                  <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryBanner;