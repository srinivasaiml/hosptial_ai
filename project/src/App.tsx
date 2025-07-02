import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import WhyChooseUs from './components/WhyChooseUs';
import Doctors from './components/Doctors';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <div className="min-h-screen bg-white overflow-x-hidden">
          <Header />
          <Hero />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Services />
            <About />
            <WhyChooseUs />
            <Stats />
            <Doctors />
            <Testimonials />
          </motion.main>
          
          <Footer />
          <Chatbot />
          <AuthModal />
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;