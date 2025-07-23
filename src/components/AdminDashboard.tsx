import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Appointment {
  _id: string;
  userName: string;
  userMobile: string;
  doctorName: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  consultationFee: number;
  createdAt: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  isActive: boolean;
}

interface DashboardStats {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  totalPatients: number;
  activeDoctors: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    totalPatients: 0,
    activeDoctors: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch appointments
      const appointmentsResponse = await axios.get(`${API_BASE_URL}/admin/appointments`);
      if (appointmentsResponse.data.success) {
        setAppointments(appointmentsResponse.data.appointments);
      }

      // Fetch doctors
      const doctorsResponse = await axios.get(`${API_BASE_URL}/doctors`);
      if (doctorsResponse.data.success) {
        setDoctors(doctorsResponse.data.doctors);
      }

      // Calculate stats
      const appointmentsData = appointmentsResponse.data.appointments || [];
      const doctorsData = doctorsResponse.data.doctors || [];
      
      const totalAppointments = appointmentsData.length;
      const confirmedAppointments = appointmentsData.filter((apt: Appointment) => apt.status === 'confirmed').length;
      const pendingAppointments = appointmentsData.filter((apt: Appointment) => apt.status === 'pending').length;
      const totalRevenue = appointmentsData
        .filter((apt: Appointment) => apt.paymentStatus === 'paid')
        .reduce((sum: number, apt: Appointment) => sum + apt.consultationFee, 0);
      const totalPatients = new Set(appointmentsData.map((apt: Appointment) => apt.userMobile)).size;
      const activeDoctors = doctorsData.filter((doc: Doctor) => doc.isActive).length;

      setStats({
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        totalRevenue,
        totalPatients,
        activeDoctors
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.userMobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${color.replace('text-', 'from-').replace('-600', '-500')} to-${color.split('-')[1]}-600 rounded-xl flex items-center justify-center`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Srinivasa Hospital Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'doctors', label: 'Doctors', icon: UserCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                icon={Calendar}
                title="Total Appointments"
                value={stats.totalAppointments}
                color="text-blue-600"
              />
              <StatCard
                icon={CheckCircle}
                title="Confirmed Appointments"
                value={stats.confirmedAppointments}
                color="text-green-600"
              />
              <StatCard
                icon={Clock}
                title="Pending Appointments"
                value={stats.pendingAppointments}
                color="text-yellow-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                color="text-purple-600"
              />
              <StatCard
                icon={Users}
                title="Total Patients"
                value={stats.totalPatients}
                color="text-indigo-600"
              />
              <StatCard
                icon={UserCheck}
                title="Active Doctors"
                value={stats.activeDoctors}
                color="text-teal-600"
              />
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Appointments</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Doctor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((appointment) => (
                      <tr key={appointment._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-800">{appointment.userName}</p>
                            <p className="text-sm text-gray-600">{appointment.userMobile}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{appointment.doctorName}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-gray-800">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">{appointment.timeSlot}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                            {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by patient name, doctor, or mobile..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button className="flex items-center space-x-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Patient Details</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Doctor</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Appointment</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Payment</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Fee</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-800">{appointment.userName}</p>
                            <p className="text-sm text-gray-600">{appointment.userMobile}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{appointment.doctorName}</td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-gray-800">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">{appointment.timeSlot}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                            {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-800">₹{appointment.consultationFee}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Doctors Management</h3>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Add New Doctor
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-3 h-3 rounded-full ${doctor.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-500">{doctor.experience} years exp.</span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{doctor.name}</h4>
                    <p className="text-teal-600 font-medium mb-3">{doctor.specialty}</p>
                    <p className="text-gray-700 font-medium">₹{doctor.consultationFee} consultation fee</p>
                    
                    <div className="flex space-x-2 mt-4">
                      <button className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                        Edit
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;