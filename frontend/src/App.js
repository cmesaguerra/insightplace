import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

// Import existing components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import NetworkBackground from './components/NetworkBackground';
import ServicesSection from './components/ServicesSection';
import DTAModel from './components/DTAModel';
import CaseStudies from './components/CaseStudies';
import WonkSection from './components/WonkSection';
import ContactInfo from './components/ContactInfo';
import LanguageToggle from './components/LanguageToggle';

// Import new authentication and portal components
import { AuthProvider } from './components/auth/AuthContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ClientPortal from './components/portal/ClientPortal';
import AdminPanel from './components/portal/AdminPanel';

// Import translations
import { translations } from './data/translations';

// Main landing page component
const LandingPage = ({ language, setLanguage }) => {
  const t = translations[language];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="App">
      <Header 
        scrollToSection={scrollToSection} 
        language={language} 
        translations={t} 
        setLanguage={setLanguage}
      />
      
      <main>
        <section id="hero" className="relative">
          <NetworkBackground />
          <HeroSection 
            scrollToSection={scrollToSection} 
            language={language} 
            translations={t} 
          />
        </section>
        
        <section id="services">
          <ServicesSection language={language} translations={t} />
        </section>
        
        <section id="casestudies">
          <CaseStudies language={language} translations={t} />
        </section>
        
        <section id="dta-model">
          <DtaModel language={language} translations={t} />
        </section>
        
        <section id="wonk">
          <WonkSection language={language} translations={t} />
        </section>
        
        <section id="contact">
          <ContactInfo language={language} translations={t} />
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img 
                src="/symbol.png" 
                alt="InsightPlace Logo" 
                className="w-8 h-8"
              />
              <span className="text-lg font-semibold">InsightPlace</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Portal Clientes
              </Link>
              <LanguageToggle 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            </div>
          </div>
          <div className="mt-6 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 InsightPlace. Todos los derechos reservados.</p>
            <p className="mt-1">Analítica de Datos y Consultoría Económica</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component with routing
function App() {
  const [language, setLanguage] = useState('es');

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage language={language} setLanguage={setLanguage} />} 
            />
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <ClientPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;