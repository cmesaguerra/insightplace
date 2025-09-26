import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export const CaseStudies = ({ language = 'es' }) => {
  return (
    <section id="casos-exito" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {language === 'es' ? 'Casos de Éxito' : 'Selected Industries and Sectors'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'es' 
              ? 'Explora nuestros proyectos exitosos en diversos sectores.' 
              : 'Explore our successful projects across various sectors.'
            }
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Card className="p-8 border-0 shadow-xl text-white" style={{background: 'linear-gradient(to right, #BF0004, #9A0003)'}}>
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'es' 
                    ? 'Proyectos' 
                    : 'Projects'
                  }
                </h3>
                <p className="text-lg" style={{color: '#FEF2F2'}}>
                  {language === 'es' 
                    ? 'Desarrollamos soluciones para cada industria' 
                    : 'We develop solutions for each industry'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'Salud' : 'Healthcare'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Análisis de riesgos y acceso' : 'Risk analysis & access'}
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'Política' : 'Politics'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Predicción y segmentación' : 'Prediction & segmentation'}
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'Gobierno' : 'Government'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Planes de desarrollo local' : 'Local development plans'}
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'Retail' : 'Retail'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Análisis predictivo de demanda' : 'Predictive demand analysis'}
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'Fintech' : 'Fintech'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Análisis geoestratégico' : 'Geostrategic analysis'}
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'Transporte' : 'Transportation'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Evaluación de impacto' : 'Impact assessment'}
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'TV & Media' : 'TV & Media'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Comportamiento de suscriptores' : 'Subscriber behavior'}
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all">
                  <h4 className="font-semibold text-sm mb-2">
                    {language === 'es' ? 'Manufactura' : 'Manufacturing'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {language === 'es' ? 'Encadenamientos productivos' : 'Input-output linkages'}
                  </p>
                </div>
              </div>
              
              {/* Button removed as requested */}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};