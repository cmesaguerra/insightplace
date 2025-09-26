import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Target, Cog, Package, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export const DTAModel = ({ language = 'es' }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [hoveredComponent, setHoveredComponent] = useState(null);

  const content = {
    es: {
      title: 'Modelo DTA',
      subtitle: 'Potenciamos el uso de datos para la toma de mejores decisiones',
      components: {
        desarrollo: {
          title: 'DESARROLLO',
          subtitle: 'Valor',
          question: '¿Qué se obtiene?',
          description: 'Desarrollo de sistemas de información robustos, flexibles y pertinentes.',
          details: [
            'Sistemas de información adaptables',
            'Arquitecturas de datos escalables',
            'Plataformas de análisis integradas',
            'Soluciones personalizadas por sector'
          ]
        },
        transformacion: {
          title: 'TRANSFORMACIÓN',
          subtitle: 'Estructura',
          question: '¿Cómo usamos lo que tenemos?',
          description: 'Transformación, mapeo y visualización de múltiples conjuntos de datos.',
          details: [
            'Limpieza y preparación de datos',
            'Integración de fuentes múltiples',
            'Mapeo georreferenciado',
            'Visualizaciones interactivas'
          ]
        },
        analisis: {
          title: 'ANÁLISIS',
          subtitle: 'Activo',
          question: '¿Por qué lo hacemos?',
          description: 'Análisis complejos: información local/regional, análisis de mercado, modelos de predicción.',
          details: [
            'Análisis predictivo avanzado',
            'Inteligencia de mercado',
            'Evaluación de impacto regional',
            'Modelado de escenarios'
          ]
        }
      }
    },
    en: {
      title: 'DTA Model',
      subtitle: 'We enhance data usage for better decision-making',
      components: {
        desarrollo: {
          title: 'DEVELOPMENT',
          subtitle: 'Value',
          question: 'What is obtained?',
          description: 'Development of robust, flexible, and relevant information systems.',
          details: [
            'Adaptable information systems',
            'Scalable data architectures',
            'Integrated analysis platforms',
            'Sector-customized solutions'
          ]
        },
        transformacion: {
          title: 'TRANSFORMATION',
          subtitle: 'Structure',
          question: 'How do we use what we have?',
          description: 'Transformation, mapping, and visualization of multiple datasets.',
          details: [
            'Data cleaning and preparation',
            'Multiple source integration',
            'Georeferenced mapping',
            'Interactive visualizations'
          ]
        },
        analisis: {
          title: 'ANALYSIS',
          subtitle: 'Asset',
          question: 'Why do we do it?',
          description: 'Complex analyses: local/regional information, market analysis, prediction models.',
          details: [
            'Advanced predictive analysis',
            'Market intelligence',
            'Regional impact assessment',
            'Scenario modeling'
          ]
        }
      }
    }
  };

  const t = content[language];

  const getIcon = (component) => {
    switch (component) {
      case 'desarrollo': return Package;
      case 'transformacion': return Cog;
      case 'analisis': return Target;
      default: return Package;
    }
  };

  const handleComponentHover = (component) => {
    setHoveredComponent(component);
  };

  const handleComponentLeave = () => {
    setHoveredComponent(null);
  };

  const toggleComponent = (component) => {
    setActiveComponent(activeComponent === component ? null : component);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Interactive DTA Model */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Hub */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{backgroundColor: '#BF0004'}}>
              <span className="text-2xl font-bold text-white">DTA</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {language === 'es' ? 'Modelo Integrado' : 'Integrated Model'}
            </h3>
          </div>

          {/* Three Interactive Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {Object.entries(t.components).map(([key, component], index) => {
              const Icon = getIcon(key);
              const isHovered = hoveredComponent === key;
              const isActive = activeComponent === key;
              const isExpanded = isHovered || isActive;

              return (
                <div key={key} className="relative">
                  <Card 
                    className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                      isExpanded ? 'shadow-2xl' : 'shadow-lg'
                    }`}
                    onMouseEnter={() => handleComponentHover(key)}
                    onMouseLeave={handleComponentLeave}
                    onClick={() => toggleComponent(key)}
                    style={{
                      borderColor: isExpanded ? '#BF0004' : 'transparent',
                      borderWidth: '2px'
                    }}
                  >
                    <CardContent className="p-6">
                      {/* Icon and Title */}
                      <div className="text-center mb-4">
                        <div 
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${
                            isExpanded ? 'scale-110' : ''
                          }`}
                          style={{
                            backgroundColor: isExpanded ? '#BF0004' : '#FEF2F2',
                          }}
                        >
                          <Icon 
                            className={`w-8 h-8 transition-colors duration-300`}
                            style={{
                              color: isExpanded ? 'white' : '#BF0004'
                            }}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {component.title}
                        </h3>
                        <p className="text-sm font-semibold" style={{color: '#BF0004'}}>
                          {component.subtitle}
                        </p>
                      </div>

                      {/* Question */}
                      <div className="text-center mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {component.question}
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {component.description}
                        </p>
                      </div>

                      {/* Expand/Collapse Indicator */}
                      <div className="text-center">
                        {isActive ? (
                          <ChevronUp className="w-5 h-5 mx-auto" style={{color: '#BF0004'}} />
                        ) : (
                          <ChevronDown className="w-5 h-5 mx-auto" style={{color: '#BF0004'}} />
                        )}
                      </div>

                      {/* Expanded Details */}
                      <div className={`transition-all duration-500 overflow-hidden ${
                        isActive ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="border-t pt-4" style={{borderColor: '#FEF2F2'}}>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            {language === 'es' ? 'Características:' : 'Features:'}
                          </h4>
                          <ul className="space-y-2">
                            {component.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: '#BF0004'}}></div>
                                <span className="text-sm text-gray-700">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connection Arrows */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight 
                        className={`w-8 h-8 transition-all duration-300 ${
                          isHovered ? 'scale-125' : ''
                        }`}
                        style={{color: '#BF0004'}}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Flow Indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
              <span>{language === 'es' ? 'Flujo de Proceso' : 'Process Flow'}</span>
              <ArrowRight className="w-4 h-4" style={{color: '#BF0004'}} />
              <span>{language === 'es' ? 'Decisiones Informadas' : 'Informed Decisions'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};