import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Send, Mail, MapPin } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const ContactForm = ({ translations, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const t = translations[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mailto link
      const subject = encodeURIComponent(`Consulta de ${formData.name} - ${formData.company}`);
      const body = encodeURIComponent(
        `Nombre: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Empresa: ${formData.company}\n\n` +
        `Mensaje:\n${formData.message}`
      );
      
      window.location.href = `mailto:contacto@insight-place.com?subject=${subject}&body=${body}`;
      
      toast({
        title: language === 'es' ? 'Mensaje enviado' : 'Message sent',
        description: language === 'es' 
          ? 'Te contactaremos pronto.' 
          : 'We will contact you soon.',
      });
      
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'Hubo un problema. Intenta de nuevo.' 
          : 'There was a problem. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.contactSubtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-8 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-full" style={{backgroundColor: '#FEF2F2'}}>
                    <Mail className="w-6 h-6" style={{color: '#BF0004'}} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{t.contactEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full" style={{backgroundColor: '#FEF2F2'}}>
                    <MapPin className="w-6 h-6" style={{color: '#BF0004'}} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {language === 'es' ? 'Ubicaciones' : 'Locations'}
                    </h3>
                    <p className="text-gray-600">{t.contactLocations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Case Studies Preview CTA */}
            <Card className="p-8 border-0 shadow-lg text-white" style={{background: 'linear-gradient(to right, #BF0004, #9A0003)'}}>
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4">
                  {language === 'es' 
                    ? 'Casos de Estudio' 
                    : 'Case Studies'
                  }
                </h3>
                <p className="mb-6" style={{color: '#FEF2F2'}}>
                  {language === 'es' 
                    ? 'Explora nuestros proyectos en sectores como salud, análisis electoral y más.' 
                    : 'Explore our projects in sectors like health, electoral analysis, and more.'
                  }
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'Sector Salud' : 'Health Sector'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Análisis de riesgos y acceso' : 'Risk analysis & access'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'Política' : 'Politics'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Predicción y segmentación' : 'Prediction & segmentation'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'Gobierno' : 'Government'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Planes de desarrollo local' : 'Local development plans'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'Retail' : 'Retail'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Análisis predictivo de demanda' : 'Predictive demand analysis'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'Fintech' : 'Fintech'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Análisis geoestratégico' : 'Geostrategic analysis'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'Transporte' : 'Transportation'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Evaluación de impacto' : 'Impact assessment'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'TV & Media' : 'TV & Media'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Comportamiento de suscriptores' : 'Subscriber behavior'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs mb-1">
                      {language === 'es' ? 'Más sectores...' : 'More sectors...'}
                    </h4>
                    <p className="text-xs opacity-90">
                      {language === 'es' ? 'Soluciones personalizadas' : 'Custom solutions'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white hover:bg-gray-100"
                  style={{color: '#BF0004'}}
                >
                  {language === 'es' ? 'Ver Casos de Estudio' : 'View Case Studies'}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form */}
          <Card className="p-8 border-0 shadow-lg">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder={t.contactFormName}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-gray-300"
                      style={{'&:focus': {borderColor: '#BF0004', boxShadow: '0 0 0 1px #BF0004'}}}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder={t.contactFormEmail}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-gray-300"
                      style={{'&:focus': {borderColor: '#BF0004', boxShadow: '0 0 0 1px #BF0004'}}}
                    />
                  </div>
                </div>
                
                <div>
                  <Input
                    type="text"
                    name="company"
                    placeholder={t.contactFormCompany}
                    value={formData.company}
                    onChange={handleChange}
                    className="border-gray-300"
                    style={{'&:focus': {borderColor: '#BF0004', boxShadow: '0 0 0 1px #BF0004'}}}
                  />
                </div>
                
                <div>
                  <Textarea
                    name="message"
                    placeholder={t.contactFormMessage}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="border-gray-300"
                    style={{'&:focus': {borderColor: '#BF0004', boxShadow: '0 0 0 1px #BF0004'}}}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-3"
                  style={{backgroundColor: '#BF0004', '&:hover': {backgroundColor: '#9A0003'}}}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'es' ? 'Enviando...' : 'Sending...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>{t.contactFormSubmit}</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};