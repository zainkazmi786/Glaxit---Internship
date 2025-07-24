import React from 'react';
import { TruckIcon, ArrowPathIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const FeatureBar = ({ features }) => {
  // Map of feature icons
  const iconMap = {
    truck: TruckIcon,
    refresh: ArrowPathIcon,
    shield: ShieldCheckIcon,
    headset: ShieldCheckIcon
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 py-6 border-gray-200 px-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 via-transparent to-blue-100/30 animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap justify-between items-center">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div 
                key={feature.id} 
                className="flex items-center space-x-3 my-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-200 via-indigo-100 to-blue-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 group cursor-pointer"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:rotate-6">
                  <IconComponent className="w-6 h-6 text-indigo-600 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:scale-110" />
                </div>
                <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-300/0 to-blue-300/0 group-hover:from-indigo-300/20 group-hover:to-blue-300/20 transition-all duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureBar;