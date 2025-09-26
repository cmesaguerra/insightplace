import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { LanguageToggle } from './components/LanguageToggle';
import { NetworkBackground } from './components/NetworkBackground';
import { ContactForm } from './components/ContactForm';
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
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                {t.services}
              </button>
              <button 
                onClick={() => scrollToSection('platform')}
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                {t.platform}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-red-600 transition-colors"
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
                src="/logo.jpg" 
                alt="InsightPlace" 
                className="h-24 lg:h-32 w-auto"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg transition-all hover:scale-105"
              >
                <BarChart3 className="mr-2 w-5 h-5" />
                {t.heroCtaPrimary}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToSection('platform')}
                className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 text-lg transition-all hover:scale-105"
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
                <div className="bg-red-100 p-3 rounded-full w-fit mb-6 group-hover:bg-red-200 transition-colors">
                  <Database className="w-8 h-8 text-red-600" />
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
                <div className="bg-red-100 p-3 rounded-full w-fit mb-6 group-hover:bg-red-200 transition-colors">
                  <TrendingUp className="w-8 h-8 text-red-600" />
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
                <div className="bg-red-100 p-3 rounded-full w-fit mb-6 group-hover:bg-red-200 transition-colors">
                  <Globe className="w-8 h-8 text-red-600" />
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
                <div className="bg-red-100 p-3 rounded-full w-fit mb-6 group-hover:bg-red-200 transition-colors">
                  <Brain className="w-8 h-8 text-red-600" />
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

      {/* WONK Platform Section */}
      <section id="platform" className="relative py-24 bg-white overflow-hidden">
        <NetworkBackground className="opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t.wonkTitle}
            </h2>
            <p className="text-xl text-red-600 mb-8 font-semibold">
              {t.wonkSubtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t.wonkDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <Network className="w-10 h-10 text-red-600" />
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
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <Globe className="w-10 h-10 text-red-600" />
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
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <Zap className="w-10 h-10 text-red-600" />
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
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg transition-all hover:scale-105"
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/symbol.png" 
                alt="InsightPlace" 
                className="w-10 h-10 filter brightness-0 invert"
              />
              <div className="text-3xl font-bold">
                <span className="text-white">Insight</span>
                <span style={{color: '#BF0004'}}>Place</span>
              </div>
            </div>
            <p className="text-gray-400 mb-8 text-lg">
              {t.footerTagline}
            </p>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500">
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