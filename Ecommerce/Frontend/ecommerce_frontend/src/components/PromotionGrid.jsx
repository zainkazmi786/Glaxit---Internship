import React from 'react';
import { Link } from 'react-router-dom';

const PromotionGrid = ({ promotions }) => {
  return (
    <div className="container mx-auto  py-10 px-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Woman's Style */}
        <div className="md:col-span-1 relative rounded-md overflow-hidden h-80 bg-gray-100">
          <img 
            src={promotions[0].image} 
            alt={promotions[0].title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <span className="font-bold text-blue-100 py-1 text-sm mb-1 inline-block">
              {promotions[0].label}
            </span>
            <h3 className="text-xl font-semibold text-gray-200">{promotions[0].title}</h3>
            <p className="text-sm text-gray-300 mb-2">{promotions[0].discount}</p>
            <Link 
              to="/shop/womens" 
              className="bg-white hover:bg-gray-100 text-gray-800 text-sm px-4 py-2 rounded-md inline-block w-max transition"
            >
              {promotions[0].button}
            </Link>
          </div>
        </div>
        
        {/* Right column - 3 small promo boxes */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Handbag Promo */}
            <div className="relative rounded-md overflow-hidden h-36 bg-gray-100">
              <img 
                src={promotions[1].image} 
                alt={promotions[1].title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center p-4">
                <span className="font-bold text-blue-600 py-1 text-xs mb-1 inline-block">
                  {promotions[1].label}
                </span>
                <h3 className="text-lg font-semibold text-gray-800">{promotions[1].title}</h3>
                <p className="text-xs text-gray-700 mb-1">{promotions[1].discount}</p>
                <Link 
                  to="/shop/handbags" 
                  className="bg-white hover:bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-md inline-block w-max transition"
                >
                  {promotions[1].button}
                </Link>
              </div>
            </div>
            
            {/* Watch Promo */}
            <div className="relative rounded-md overflow-hidden h-36 bg-gray-100">
              <img 
                src={promotions[2].image} 
                alt={promotions[2].title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center p-4">
               
                <h3 className="text-lg font-semibold text-gray-200">{promotions[2].title}</h3>
                <p className="text-xs text-gray-300 mb-1">{promotions[2].discount}</p>
                <Link 
                  to="/shop/watches" 
                  className="bg-white hover:bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-md inline-block w-max transition"
                >
                  {promotions[2].button}
                </Link>
              </div>
            </div>
            
            {/* Backpack Promo */}
            <div className="md:col-span-2 relative rounded-md overflow-hidden h-36 bg-gray-100 shadow-md ">
              <img 
                src={promotions[3].image} 
                alt={promotions[3].title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center p-4">
                <span className="font-bold text-blue-600 py-1 text-xs mb-1 inline-block">
                  {promotions[3].label}
                </span>
                <h3 className="text-lg font-semibold text-gray-800">{promotions[3].title}</h3>
                <p className="text-xs text-gray-700 mb-1">{promotions[3].discount}</p>
                <Link 
                  to="/shop/backpacks" 
                  className="bg-white hover:bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-md inline-block w-max transition"
                >
                  {promotions[3].button}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionGrid;