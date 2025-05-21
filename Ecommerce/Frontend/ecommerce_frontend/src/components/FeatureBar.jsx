import React from 'react';
import { TruckIcon, ArrowPathIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const FeatureBar = ({ features }) => {
  // Map of feature icons
  const iconMap = {
    truck: TruckIcon,
    refresh: ArrowPathIcon,
    shield: ShieldCheckIcon,
    headset: ShieldCheckIcon
    // headset: HeadphonesIcon
  };

  return (
    <div className="bg-white py-8 border-t border-b border-gray-200 px-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div key={feature.id} className="flex items-center space-x-3 my-2 p-10  rounded-2xl bg-gray-100 shadow-md hover:shadow-lg trainsition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-blue-500 " />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureBar;