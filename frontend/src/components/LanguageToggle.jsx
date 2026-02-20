import React from 'react';

const LanguageToggle = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </span>
      <button
        onClick={() => onLanguageChange('es')}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          language === 'es' 
            ? 'bg-gray-900 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          language === 'en' 
            ? 'bg-gray-900 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;