import React from 'react';
import { Link } from 'react-router-dom';

const PromotionGrid = ({ promotions }) => {
  return (
    <div className="container mx-auto py-10 px-16 bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Woman's Style */}
        <div
          className="md:col-span-1 relative rounded-xl overflow-hidden h-80 bg-gradient-to-br from-indigo-100 to-blue-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group"
          style={{ animation: 'fadeInLeft 0.8s ease-out' }}
        >
          <img
            src={promotions[0].image}
            alt={promotions[0].title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Enhanced gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-500"></div>

          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="absolute inset-0 flex flex-col justify-end p-6 transform group-hover:translate-y-[-8px] transition-transform duration-300">
            <span className="font-bold text-blue-200 py-1 text-sm mb-2 inline-block transform group-hover:scale-105 transition-transform duration-300">
              {promotions[0].label}
            </span>
            <h3 className="text-xl font-semibold text-transparent bg-gradient-to-r from-white to-indigo-100 bg-clip-text mb-2">
              {promotions[0].title}
            </h3>
            <p className="text-sm text-indigo-200 mb-3">{promotions[0].discount}</p>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-white to-indigo-50 hover:from-indigo-50 hover:to-white text-indigo-800 text-sm px-4 py-2 rounded-lg inline-block w-max transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg group/button relative overflow-hidden"
            >
              <span className="relative z-10">{promotions[0].button}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/0 via-indigo-100/50 to-indigo-100/0 transform scale-x-0 group-hover/button:scale-x-100 transition-transform duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Right column - 3 small promo boxes */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Handbag Promo */}
            <div
              className="relative rounded-xl overflow-hidden h-36 bg-gradient-to-br from-indigo-100 to-blue-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              <img
                src={promotions[1].image}
                alt={promotions[1].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-indigo-800/50 to-blue-900/60 group-hover:from-indigo-800/80 group-hover:to-blue-800/70 transition-all duration-500"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <div className="absolute inset-0 flex flex-col justify-center p-4 z-10">
                <span className="font-bold text-blue-200 py-1 text-xs mb-1 inline-block animate-pulse">
                  {promotions[1].label}
                </span>
                <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                  {promotions[1].title}
                </h3>
                <p className="text-xs text-indigo-300 mb-2">{promotions[1].discount}</p>
                <Link
                  to="/shop"
                  className="bg-gradient-to-r from-white to-indigo-50 hover:from-indigo-50 hover:to-white text-indigo-800 text-xs px-3 py-1.5 rounded-md inline-block w-max transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  {promotions[1].button}
                </Link>
              </div>
            </div>

            {/* Watch Promo */}
            <div
              className="relative rounded-xl overflow-hidden h-36 bg-gradient-to-br from-indigo-100 to-blue-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              <img
                src={promotions[2].image}
                alt={promotions[2].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-800/30 to-transparent group-hover:from-indigo-800/80 group-hover:via-indigo-700/40 transition-all duration-500"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <div className="absolute inset-0 flex flex-col justify-center p-4">
                <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-white to-indigo-100 bg-clip-text">
                  {promotions[2].title}
                </h3>
                <p className="text-xs text-indigo-200 mb-2">{promotions[2].discount}</p>
                <Link
                  to="/shop"
                  className="bg-gradient-to-r from-white to-indigo-50 hover:from-indigo-50 hover:to-white text-indigo-800 text-xs px-3 py-1.5 rounded-md inline-block w-max transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  {promotions[2].button}
                </Link>
              </div>
            </div>

            {/* Backpack Promo */}
            <div
              className="md:col-span-2 relative rounded-xl overflow-hidden h-36 bg-gradient-to-br from-indigo-100 to-blue-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <img
                src={promotions[3].image}
                alt={promotions[3].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Enhanced gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-indigo-900/60 to-transparent group-hover:from-slate-800/90 group-hover:via-indigo-800/70 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="absolute inset-0 flex flex-col justify-center p-4">
                <span className="font-bold text-indigo-200 py-1 text-xs mb-2 inline-block transform group-hover:scale-105 transition-transform duration-300 animate-pulse">
                  {promotions[3].label}
                </span>
                <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-white to-indigo-200 bg-clip-text mb-1">
                  {promotions[3].title}
                </h3>
                <p className="text-xs text-indigo-300 mb-3">{promotions[3].discount}</p>
                <Link
                  to="/shop"
                  className="bg-gradient-to-r from-white to-indigo-50 hover:from-indigo-50 hover:to-white text-indigo-800 text-xs px-3 py-1.5 rounded-md inline-block w-max transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  {promotions[3].button}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
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

export default PromotionGrid;