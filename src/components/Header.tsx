@@ .. @@
 import React, { useState, useEffect } from 'react';
+import { useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { Menu, X, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
 import { useChat } from '../contexts/ChatContext';

 const Header: React.FC = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const { isAuthenticated, user, logout } = useAuth();
   const { openChat } = useChat();
+  const navigate = useNavigate();

   useEffect(() => {
@@ .. @@
             <motion.div 
               className="flex items-center space-x-3"
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.5 }}
+              onClick={() => navigate('/')}
+              style={{ cursor: 'pointer' }}
             >
               <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                 <span className="text-white font-bold text-xl">S</span>
@@ .. @@
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   Get Started
                 </motion.button>
+                
+                <motion.button
+                  onClick={() => navigate('/admin/login')}
+                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-sm"
+                  initial={{ y: -20, opacity: 0 }}
+                  animate={{ y: 0, opacity: 1 }}
+                  transition={{ duration: 0.5, delay: 0.6 }}
+                  whileHover={{ scale: 1.05 }}
+                  whileTap={{ scale: 0.95 }}
+                >
+                  Admin
+                </motion.button>
               )}
             </div>

@@ .. @@
                     Get Started
                   </button>
                 )}
+                <button
+                  onClick={() => {
+                    navigate('/admin/login');
+                    setIsMenuOpen(false);
+                  }}
+                  className="px-3 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium"
+                >
+                  Admin Login
+                </button>
               </div>
             </motion.div>
           )}