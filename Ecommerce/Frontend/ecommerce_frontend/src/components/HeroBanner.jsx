import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ banner }) => {
  return (
    <div className="relative h-[85vh] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 overflow-hidden w-full">
      {/* Animated background overlay - full width */}
      <div className="absolute inset-0 w-full bg-gradient-to-l from-indigo-600/20 via-transparent to-blue-600/20 animate-pulse"></div>
      
      <div className="container mx-auto  flex items-center h-full relative z-20 max-w-full px-16">
        <div className="w-full z-10 py-16">
          <div 
            className="text-blue-300 italic text-3xl mb-2 transform animate-fadeInLeft"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            {banner.subtitle}
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text mb-4 transform animate-fadeInLeft"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            {banner.title}
          </h1>
          <p 
            className="text-indigo-200 mb-8 text-lg transform animate-fadeInLeft"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            {banner.discount}
          </p>
          <div 
            className="flex space-x-4 transform animate-fadeInUp"
            style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
          >
            <Link 
              to="/shop" 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg group relative overflow-hidden"
            >
              <span className="relative z-10">{banner.primaryButton}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-indigo-300 hover:border-indigo-400 bg-transparent hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-blue-600/10 text-indigo-200 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm group relative overflow-hidden"
            >
              <span className="relative z-10">{banner.secondaryButton}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-blue-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>
        </div>
        
        {/* Enhanced background image with overlay effects - full width */}
        <div className="absolute right-0 top-0 h-full w-full z-0 left-0">
          <div className="h-full w-full bg-cover bg-center bg-no-repeat transform scale-105 animate-slowZoom" 
               style={{ backgroundImage: `url(${banner.image})` }}>
          </div>
          {/* Full width gradient overlays */}
          {/* <div className="absolute inset-0 w-full bg-gradient-to-l from-transparent via-indigo-900/30 to-indigo-900/60"></div> */}
          <div className="absolute inset-0 w-full bg-gradient-to-b from-indigo-900/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 w-full bg-gradient-to-l from-indigo-900/50 via-transparent to-blue-900/30"></div>
        </div>
        
        {/* Floating particles effect - full width */}
        <div className="absolute inset-0 w-full overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            ></div>
          ))}
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
        
        @keyframes slowZoom {
          0%, 100% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;