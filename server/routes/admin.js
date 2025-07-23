import express from 'express';
import jwt from 'jsonwebtoken';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify admin token
const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get all appointments for admin
router.get('/appointments', verifyAdminToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('doctorId', 'name specialty')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error('Fetch admin appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
});

// Get dashboard statistics
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const totalDoctors = await Doctor.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();

    // Calculate total revenue
    const paidAppointments = await Appointment.find({ paymentStatus: 'paid' });
    const totalRevenue = paidAppointments.reduce((sum, apt) => sum + apt.consultationFee, 0);

    res.json({
      success: true,
      stats: {
        totalAppointments,
        confirmedAppointments,
        pendingAppointments,
        totalDoctors,
        totalUsers,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Update appointment status
router.put('/appointments/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status'
    });
  }
});

// Delete appointment
router.delete('/appointments/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment'
    });
  }
});

export default router;