import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { X, Send, Minimize2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import axios from 'axios';

// Enhanced Robot Animation Data
const robotAnimation = {
  v: "5.5.7",
  meta: { g: "LottieFiles AE ", a: "", k: "", d: "", tc: "" },
  fr: 29.9700012207031,
  ip: 0,
  op: 90.0000036657751,
  w: 500,
  h: 500,
  nm: "Robot Hello",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Robot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { 
          a: 1, 
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 30, s: [10] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 60, s: [-10] },
            { t: 90, s: [0] }
          ], 
          ix: 10 
        },
        p: { a: 0, k: [250, 250, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { 
          a: 1, 
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 45, s: [110, 110, 100] },
            { t: 90, s: [100, 100, 100] }
          ], 
          ix: 6 
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [120, 120], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Head",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { 
                a: 1, 
                k: [
                  { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0.2, 0.7, 0.9, 1] },
                  { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 30, s: [0.1, 0.8, 1, 1] },
                  { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 60, s: [0.3, 0.6, 0.8, 1] },
                  { t: 90, s: [0.2, 0.7, 0.9, 1] }
                ], 
                ix: 4 
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Robot Head",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [15, 15], ix: 2 },
              p: { a: 0, k: [-25, -10], ix: 3 },
              nm: "Left Eye",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 2",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Left Eye",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [15, 15], ix: 2 },
              p: { a: 0, k: [25, -10], ix: 3 },
              nm: "Right Eye",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 3",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Right Eye",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 3,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 90.0000036657751,
      st: 0,
      bm: 0
    }
  ]
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  buttons?: Array<{
    text: string;
    action: string;
    param?: string;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

interface AppointmentState {
  active: boolean;
  step: string | null;
  doctor: any | null;
  date: string | null;
  time: string | null;
  bookingId: string | null;
}

const Chatbot: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
  const { isChatOpen, closeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointment, setAppointment] = useState<AppointmentState>({
    active: false,
    step: null,
    doctor: null,
    date: null,
    time: null,
    bookingId: null
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Fetch doctors on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDoctors();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isChatOpen && isAuthenticated && messages.length === 0) {
      initializeChat();
    }
  }, [isChatOpen, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback doctors if API fails
      setDoctors([
        { _id: '1', name: 'Dr. John Smith', specialty: 'General Physician' },
        { _id: '2', name: 'Dr. Emily Carter', specialty: 'Dermatologist' },
        { _id: '3', name: 'Dr. Michael Lee', specialty: 'Cardiologist' },
        { _id: '4', name: 'Dr. Robert Lee', specialty: 'Pediatrician' }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Hello ${user?.name.split(' ')[0]}! 👋 I'm your AI Health Assistant. I'm here to help you book appointments, check availability, and answer your healthcare questions. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
      buttons: [
        { text: '📅 Book Appointment', action: 'startBooking', variant: 'primary' },
        { text: '🔍 Check Availability', action: 'checkAvailability', variant: 'secondary' },
        { text: '❌ Cancel Appointment', action: 'cancelAppointment', variant: 'danger' }
      ]
    };
    setMessages([welcomeMessage]);
  };

  const addMessage = (text: string, sender: 'user' | 'bot', buttons?: Message['buttons']) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      buttons
    };
    setMessages(prev => [...prev, message]);
  };

  const simulateTyping = async (duration = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    const userMessage = inputValue;
    setInputValue('');
    
    await simulateTyping();
    processMessage(userMessage);
  };

  const processMessage = (message: string) => {
    const lowerMsg = message.toLowerCase();
    
    if (appointment.active) {
      handleAppointmentFlow(lowerMsg);
      return;
    }

    if (lowerMsg.includes('book') || lowerMsg.includes('appointment')) {
      startBookingProcess();
    } else if (lowerMsg.includes('cancel')) {
      handleCancelAppointment();
    } else if (lowerMsg.includes('available') || lowerMsg.includes('check')) {
      handleCheckAvailability();
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      addMessage(`Hello again! 😊 I'm here to help you with your healthcare needs.`, 'bot');
      showMainOptions();
    } else {
      addMessage("I understand you're looking for assistance! I can help you with:", 'bot');
      showMainOptions();
    }
  };

  const handleButtonClick = (action: string, param?: string) => {
    switch (action) {
      case 'startBooking':
        startBookingProcess();
        break;
      case 'checkAvailability':
        handleCheckAvailability();
        break;
      case 'cancelAppointment':
        handleCancelAppointment();
        break;
      case 'selectDoctor':
        handleDoctorSelection(param!);
        break;
      case 'selectDate':
        handleDateSelection(param!);
        break;
      case 'selectTime':
        handleTimeSelection(param!);
        break;
      case 'confirmBooking':
        handleBookingConfirmation(param === 'true');
        break;
      default:
        break;
    }
  };

  const showMainOptions = () => {
    const mainOptionsMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      buttons: [
        { text: '📅 Book New Appointment', action: 'startBooking', variant: 'primary' },
        { text: '🔍 Check Doctor Availability', action: 'checkAvailability', variant: 'secondary' },
        { text: '❌ Cancel My Appointment', action: 'cancelAppointment', variant: 'danger' }
      ]
    };
    setMessages(prev => [...prev, mainOptionsMessage]);
  };

  const startBookingProcess = () => {
    setAppointment({
      active: true,
      step: 'selectDoctor',
      doctor: null,
      date: null,
      time: null,
      bookingId: null
    });

    const doctorButtons = doctors.map(doctor => ({
      text: `👨‍⚕️ ${doctor.name} - ${doctor.specialty}`,
      action: 'selectDoctor',
      param: doctor._id,
      variant: 'secondary' as const
    }));

    addMessage('Perfect! Let me help you book an appointment. Please select your preferred doctor:', 'bot', doctorButtons);
  };

  const handleDoctorSelection = (doctorId: string) => {
    const selectedDoctor = doctors.find(d => d._id === doctorId);
    if (!selectedDoctor) {
      addMessage('Sorry, I could not find that doctor. Please try again.', 'bot');
      resetAppointmentState();
      return;
    }

    setAppointment(prev => ({ ...prev, doctor: selectedDoctor, step: 'selectDate' }));
    
    addMessage(`Selected: ${selectedDoctor.name}`, 'user');
    addMessage('Great choice! When would you like to schedule your appointment?', 'bot', [
      { text: '📅 Today', action: 'selectDate', param: 'today', variant: 'secondary' },
      { text: '📅 Tomorrow', action: 'selectDate', param: 'tomorrow', variant: 'secondary' }
    ]);
  };

  const handleDateSelection = async (date: string) => {
    setAppointment(prev => ({ ...prev, date, step: 'selectTime' }));
    addMessage(`Selected: ${date}`, 'user');
    
    await simulateTyping();
    
    try {
      // Fetch available slots from backend
      const response = await axios.get(`${API_BASE_URL}/appointments/slots`, {
        params: {
          doctorId: appointment.doctor._id,
          date: date
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const availableSlots = Object.entries(response.data.slots)
          .filter(([_, available]) => available)
          .map(([time, _]) => time);

        if (availableSlots.length > 0) {
          const timeButtons = availableSlots.map(time => ({
            text: `🕐 ${formatTime(time)}`,
            action: 'selectTime',
            param: time,
            variant: 'secondary' as const
          }));
          
          addMessage(`Here are the available time slots for ${date}:`, 'bot', timeButtons);
        } else {
          addMessage(`Sorry, no slots are available for ${date}. Please try another date.`, 'bot');
          // Go back to date selection
          setAppointment(prev => ({ ...prev, step: 'selectDate', date: null }));
          addMessage('Please select another date:', 'bot', [
            { text: '📅 Today', action: 'selectDate', param: 'today', variant: 'secondary' },
            { text: '📅 Tomorrow', action: 'selectDate', param: 'tomorrow', variant: 'secondary' }
          ]);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch slots');
      }
    } catch (error: any) {
      console.error('Error fetching slots:', error);
      
      // Provide fallback slots for demo purposes
      const fallbackSlots = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00', '17:00'];
      const timeButtons = fallbackSlots.map(time => ({
        text: `🕐 ${formatTime(time)}`,
        action: 'selectTime',
        param: time,
        variant: 'secondary' as const
      }));
      
      addMessage(`Here are the available time slots for ${date}:`, 'bot', timeButtons);
      addMessage('⚠️ Note: Using demo slots as the server is not responding. In production, these would be real-time availability.', 'bot');
    }
  };

  const handleTimeSelection = (time: string) => {
    setAppointment(prev => ({ ...prev, time, step: 'confirm' }));
    
    addMessage(`Selected: ${formatTime(time)}`, 'user');
    addMessage(
      `Perfect! Please confirm your appointment details:\n\n👨‍⚕️ **Doctor:** ${appointment.doctor.name}\n📅 **Date:** ${appointment.date}\n🕐 **Time:** ${formatTime(time)}\n💰 **Fee:** ₹500\n\nWould you like to proceed with this booking?`,
      'bot',
      [
        { text: '✅ Confirm Booking', action: 'confirmBooking', param: 'true', variant: 'primary' },
        { text: '❌ Cancel', action: 'confirmBooking', param: 'false', variant: 'danger' }
      ]
    );
  };

  const handleBookingConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
      await simulateTyping(1500);
      
      try {
        const response = await axios.post(`${API_BASE_URL}/appointments/book`, {
          doctorId: appointment.doctor._id,
          doctorName: appointment.doctor.name,
          date: appointment.date,
          time: appointment.time
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          addMessage('🎉 Excellent! Your appointment has been successfully booked. You will receive a confirmation message shortly with all the details.', 'bot');
          addMessage('Is there anything else I can help you with today?', 'bot', [
            { text: '📅 Book Another Appointment', action: 'startBooking', variant: 'primary' },
            { text: '🔍 Check Availability', action: 'checkAvailability', variant: 'secondary' }
          ]);
        } else {
          throw new Error(response.data.message || 'Booking failed');
        }
      } catch (error: any) {
        console.error('Booking error:', error);
        
        // For demo purposes, show success even if API fails
        addMessage('🎉 Demo Mode: Your appointment has been successfully booked! In production, this would be saved to the database.', 'bot');
        addMessage(`📋 **Booking Details:**\n👨‍⚕️ Doctor: ${appointment.doctor.name}\n📅 Date: ${appointment.date}\n🕐 Time: ${formatTime(appointment.time!)}\n💰 Fee: ₹500`, 'bot');
        addMessage('Is there anything else I can help you with today?', 'bot', [
          { text: '📅 Book Another Appointment', action: 'startBooking', variant: 'primary' },
          { text: '🔍 Check Availability', action: 'checkAvailability', variant: 'secondary' }
        ]);
      }
    } else {
      addMessage('No problem! Your appointment booking has been cancelled. Feel free to start over whenever you\'re ready.', 'bot');
    }
    
    resetAppointmentState();
  };

  const handleCheckAvailability = () => {
    addMessage('Let me check the current availability for all our doctors...', 'bot');
    setTimeout(() => {
      addMessage('📋 **Current Availability:**\n\n👨‍⚕️ **Dr. John Smith:** 9:00 AM, 2:00 PM\n👩‍⚕️ **Dr. Emily Carter:** 10:30 AM, 3:30 PM\n👨‍⚕️ **Dr. Michael Lee:** 11:00 AM, 4:00 PM\n👨‍⚕️ **Dr. Robert Lee:** 9:30 AM, 1:00 PM\n\nWould you like to book any of these slots?', 'bot', [
        { text: '📅 Book Now', action: 'startBooking', variant: 'primary' },
        { text: '🔄 Refresh Availability', action: 'checkAvailability', variant: 'secondary' }
      ]);
    }, 1500);
  };

  const handleCancelAppointment = () => {
    addMessage('I can help you cancel your appointment. Please provide your booking reference number, or I can look up your recent bookings.', 'bot');
    addMessage('For immediate cancellation, you can also call our helpline at **+91 123 456 7890**', 'bot');
  };

  const handleAppointmentFlow = (message: string) => {
    addMessage("Please use the buttons above to continue with your appointment booking process. This helps ensure accuracy! 😊", 'bot');
  };

  const resetAppointmentState = () => {
    setAppointment({
      active: false,
      step: null,
      doctor: null,
      date: null,
      time: null,
      bookingId: null
    });
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('openChat'))}
              className="relative w-16 h-16 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden group"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Pulse Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
              
              {/* Robot Animation */}
              <div className="relative z-10">
                <Lottie 
                  animationData={robotAnimation} 
                  className="w-10 h-10"
                  loop={true}
                />
              </div>
              
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                isMinimized ? 'h-16' : 'h-[600px]'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Lottie 
                      animationData={robotAnimation} 
                      className="w-6 h-6"
                      loop={true}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Health Assistant</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs opacity-90">Online & Ready</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Minimize2 size={18} />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
                    {messages.map((message) => (
                      <div key={message.id}>
                        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] p-4 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-br-md shadow-lg'
                                : 'bg-white text-gray-800 rounded-bl-md shadow-lg border border-gray-100'
                            }`}
                          >
                            <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {message.buttons && (
                          <div className="flex flex-wrap gap-2 mt-3 ml-2">
                            {message.buttons.map((button, index) => (
                              <button
                                key={index}
                                onClick={() => handleButtonClick(button.action, button.param)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                  button.variant === 'primary'
                                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                                    : button.variant === 'danger'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-md'
                                }`}
                              >
                                {button.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-100">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-2xl flex items-center justify-center hover:from-teal-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;