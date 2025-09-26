import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { LanguageToggle } from './components/LanguageToggle';
import { NetworkBackground } from './components/NetworkBackground';
import { ContactInfo } from './components/ContactInfo';
import { DTAModel } from './components/DTAModel';
import { CaseStudies } from './components/CaseStudies';
import { Toaster } from './components/ui/sonner';
import { translations } from './data/translations';
import { 
  Database, 
  TrendingUp, 
  Globe, 
  Brain, 
  BarChart3, 
  Network, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

function App() {
  const [language, setLanguage] = useState('es');
  const t = translations[language];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/symbol.png" 
                alt="InsightPlace" 
                className="w-10 h-10"
              />
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-700 transition-colors"
                style={{'&:hover': {color: '#BF0004'}}}
                onMouseEnter={(e) => e.target.style.color = '#BF0004'}
                onMouseLeave={(e) => e.target.style.color = '#374151'}
              >
                {t.services}
              </button>
              <button 
                onClick={() => scrollToSection('platform')}
                className="text-gray-700 transition-colors"
                style={{'&:hover': {color: '#BF0004'}}}
                onMouseEnter={(e) => e.target.style.color = '#BF0004'}
                onMouseLeave={(e) => e.target.style.color = '#374151'}
              >
                {t.platform}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 transition-colors"
                style={{'&:hover': {color: '#BF0004'}}}
                onMouseEnter={(e) => e.target.style.color = '#BF0004'}
                onMouseLeave={(e) => e.target.style.color = '#374151'}
              >
                {t.contact}
              </button>
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </nav>
            
            <div className="md:hidden">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <NetworkBackground className="opacity-30" showSymbol={true} enhanced={true} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Large hero logo */}
            <div className="flex justify-center mb-12">
              <img 
                src="/logo-transparent.png" 
                alt="InsightPlace" 
                className="h-24 lg:h-32 w-auto"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('casos-exito')}
                className="text-white px-8 py-4 text-lg transition-all hover:scale-105"
                style={{backgroundColor: '#BF0004'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#9A0003'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#BF0004'}
              >
                <BarChart3 className="mr-2 w-5 h-5" />
                {t.heroCtaPrimary}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToSection('platform')}
                className="px-8 py-4 text-lg transition-all hover:scale-105"
                style={{borderColor: '#BF0004', color: '#BF0004'}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FEF2F2';
                  e.target.style.borderColor = '#BF0004';
                  e.target.style.color = '#BF0004';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#BF0004';
                  e.target.style.color = '#BF0004';
                }}
              >
                {t.heroCtaSecondary}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t.servicesTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.servicesSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="p-3 rounded-full w-fit mb-6 transition-colors" style={{backgroundColor: '#FEF2F2'}}>
                  <Database className="w-8 h-8" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.service1Title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.service1Desc}
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="p-3 rounded-full w-fit mb-6 transition-colors" style={{backgroundColor: '#FEF2F2'}}>
                  <TrendingUp className="w-8 h-8" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.service2Title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.service2Desc}
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="p-3 rounded-full w-fit mb-6 transition-colors" style={{backgroundColor: '#FEF2F2'}}>
                  <Globe className="w-8 h-8" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.service3Title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.service3Desc}
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="p-3 rounded-full w-fit mb-6 transition-colors" style={{backgroundColor: '#FEF2F2'}}>
                  <Brain className="w-8 h-8" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.service4Title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.service4Desc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DTA Model Section */}
      <DTAModel language={language} />

      {/* WONK Platform Section */}
      <section id="platform" className="relative py-24 bg-white overflow-hidden">
        <NetworkBackground className="opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t.wonkTitle}
            </h2>
            <p className="text-xl mb-8 font-semibold" style={{color: '#BF0004'}}>
              {t.wonkSubtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t.wonkDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="p-4 rounded-full w-fit mx-auto mb-6 transition-colors" style={{backgroundColor: '#FEF2F2'}}>
                  <Network className="w-10 h-10" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.wonkFeature1}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.wonkFeature1Desc}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="p-4 rounded-full w-fit mx-auto mb-6 transition-colors" style={{backgroundColor: '#FEF2F2'}}>
                  <Globe className="w-10 h-10" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.wonkFeature2}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.wonkFeature2Desc}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="p-4 rounded-full w-fit mx-auto mb-6 transition-colors" style={{backgroundColor: '#FEF2F2'}}>
                  <Zap className="w-10 h-10" style={{color: '#BF0004'}} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t.wonkFeature3}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.wonkFeature3Desc}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* WONK CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="text-white px-12 py-4 text-lg transition-all hover:scale-105"
              style={{backgroundColor: '#BF0004'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#9A0003'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#BF0004'}
            >
              {language === 'es' ? 'Solicitar Demo de WONK' : 'Request WONK Demo'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm translations={translations} language={language} />

      {/* Footer */}
      <footer className="text-white py-12" style={{backgroundColor: 'rgb(128, 128, 128)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* InsightPlace Logo - transparent background */}
            <div className="mb-4">
              <img 
                src="/footer-logo-transparent.png" 
                alt="InsightPlace" 
                className="h-12 w-auto mx-auto"
              />
            </div>
            <p className="text-white mb-8 text-lg">
              {t.footerTagline}
            </p>
            <div className="border-t border-white pt-8">
              <p className="text-white">
                {t.footerRights}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;