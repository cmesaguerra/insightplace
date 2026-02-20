import React from 'react';

// Professional SVG icons for services
const ServiceIcons = {
  analytics: (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="28" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="16" y="20" width="8" height="24" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="28" y="12" width="8" height="32" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="40" y="4" width="4" height="40" rx="1" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 24L20 16L32 8L44 4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8" cy="24" r="2" fill="#DC2626"/>
      <circle cx="20" cy="16" r="2" fill="#DC2626"/>
      <circle cx="32" cy="8" r="2" fill="#DC2626"/>
    </svg>
  ),
  economic: (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 12V36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 18C18 15.8 20.7 14 24 14C27.3 14 30 15.8 30 18C30 20.2 27.3 22 24 22C20.7 22 18 23.8 18 26C18 28.2 20.7 30 24 30C27.3 30 30 28.2 30 26" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  policy: (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L4 14V24C4 35.05 12.54 45.22 24 48C35.46 45.22 44 35.05 44 24V14L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M16 24L22 30L34 18" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  forecast: (
    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 40L16 28L24 36L44 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 8H44V20" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="28" r="3" fill="currentColor"/>
      <circle cx="24" cy="36" r="3" fill="currentColor"/>
      <circle cx="44" cy="8" r="3" fill="#DC2626"/>
    </svg>
  )
};

const iconKeys = ['analytics', 'economic', 'policy', 'forecast'];

const ServicesSection = ({ language, translations }) => {
  const services = translations.services.items;
  
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {translations.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.services.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group bg-white border border-gray-200 rounded-lg p-8 hover:border-red-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {ServiceIcons[iconKeys[index]]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
