import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBanner = ({ categories }) => {
  return (
    <div className="py-10  mb-10 px-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Featured Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category.id} className="relative rounded-md overflow-hidden h-64 group">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-bold mb-1">{category.name}</h3>
                <p className="text-white mb-4">{category.discount}</p>
                <Link 
                  to={`/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="flex items-center text-white hover:underline"
                >
                  Shop Now <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;