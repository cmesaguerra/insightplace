import React from 'react';
import { Card, CardContent } from './ui/card';
import { Mail, MapPin } from 'lucide-react';

const ContactInfo = ({ translations, language }) => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {translations.contact.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.contact.subtitle}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Card */}
            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-0 text-center">
                <div className="p-4 rounded-full w-fit mx-auto mb-6" style={{backgroundColor: '#FEF2F2'}}>
                  <Mail className="w-10 h-10" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'es' ? 'Correo Electrónico' : 'Email'}
                </h3>
                <p className="text-lg text-gray-600 mb-4">{translations.contact.email}</p>
                <a 
                  href={`mailto:${translations.contact.email}`}
                  className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-all hover:scale-105"
                  style={{backgroundColor: '#BF0004'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#9A0003'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#BF0004'}
                >
                  {language === 'es' ? 'Enviar Email' : 'Send Email'}
                </a>
              </CardContent>
            </Card>
            
            {/* Location Card */}
            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-0 text-center">
                <div className="p-4 rounded-full w-fit mx-auto mb-6" style={{backgroundColor: '#FEF2F2'}}>
                  <MapPin className="w-10 h-10" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'es' ? 'Ubicaciones' : 'Locations'}
                </h3>
                <div className="space-y-3">
                  <div className="text-lg text-gray-600">
                    <p className="font-semibold">Bogotá, Colombia</p>
                    <p className="text-sm">{language === 'es' ? 'Oficina Principal' : 'Main Office'}</p>
                  </div>
                  <div className="text-lg text-gray-600">
                    <p className="font-semibold">Cartagena, Colombia</p>
                    <p className="text-sm">{language === 'es' ? 'Oficina Regional' : 'Regional Office'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'es' 
                  ? '¿Listo para transformar tus datos?' 
                  : 'Ready to transform your data?'
                }
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {language === 'es' 
                  ? 'Contactanos para discutir cómo podemos ayudarte con tus proyectos de analítica de datos.' 
                  : 'Contact us to discuss how we can help you with your data analytics projects.'
                }
              </p>
              <a 
                href="mailto:contacto@insight-place.com?subject=Consulta sobre servicios de InsightPlace"
                className="inline-block px-8 py-4 text-white font-bold text-lg rounded-lg transition-all hover:scale-105"
                style={{backgroundColor: '#BF0004'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#9A0003'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#BF0004'}
              >
                {language === 'es' ? 'Iniciar Conversación' : 'Start Conversation'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;