import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ scrollToSection, language, translations }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <img 
            src="/InsightPlace-noback.png" 
            alt="InsightPlace Logo" 
            className="h-40 mx-auto mb-6 drop-shadow-2xl"
          />
        </div>
        
        <div className="space-y-6">
          <button
            onClick={() => scrollToSection('casestudies')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mr-4"
          >
            {translations.hero.ctaButton}
          </button>
          
          <Link
            to="/login"
            className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
          >
            🔐 Acceso de Clientes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
