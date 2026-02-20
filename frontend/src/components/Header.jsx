import React from 'react';
import { Link } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';

const Header = ({ scrollToSection, language, translations, setLanguage }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <img 
              src="/symbol.png" 
              alt="InsightPlace Symbol" 
              className="w-10 h-10"
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                {translations.nav.services}
              </button>
              <button
                onClick={() => scrollToSection('casestudies')}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                {translations.nav.caseStudies}
              </button>
              <button
                onClick={() => scrollToSection('dta-model')}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                {translations.nav.platform}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                {translations.nav.contact}
              </button>
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                🔐 {translations.nav.clientPortal}
              </Link>
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
