import React from 'react';

const WonkSection = ({ language, translations }) => {
  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {translations.wonk.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.wonk.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Features List */}
          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {translations.wonk.description}
            </p>
            
            <div className="space-y-6">
              {translations.wonk.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* WONK Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
              {/* WONK Logo/Branding */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl mb-6 shadow-lg">
                  <span className="text-white text-3xl font-black tracking-tight">W</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  WONK Platform
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Workflow Oriented Network of Knowledge
                </p>
                
                {/* Visual representation of data flow */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Datos</span>
                  </div>
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Análisis</span>
                  </div>
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Insights</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  {language === 'es' 
                    ? 'Plataforma inteligente para análisis de datos avanzado'
                    : 'Intelligent platform for advanced data analysis'
                  }
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-100 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-200 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WonkSection;
