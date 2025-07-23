import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="min-h-screen bg-white overflow-x-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;