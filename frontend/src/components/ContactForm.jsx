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
                  <div className="bg-red-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{t.contactEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-red-600" />
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
            
            {/* Dynamic Visualization CTA */}
            <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4">
                  {language === 'es' 
                    ? 'Visualizaciones Dinámicas' 
                    : 'Dynamic Visualizations'
                  }
                </h3>
                <p className="text-red-100 mb-6">
                  {language === 'es' 
                    ? 'Explora nuestras capacidades de visualización de datos interactivas y descubre insights únicos.' 
                    : 'Explore our interactive data visualization capabilities and discover unique insights.'
                  }
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  {language === 'es' ? 'Ver Demos' : 'View Demos'}
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
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
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