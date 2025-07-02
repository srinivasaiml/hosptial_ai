import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
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
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get available time slots for a doctor
router.get('/slots', authenticateToken, async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required'
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Calculate the target date
    const today = new Date();
    let targetDate;
    
    if (date === 'today') {
      targetDate = today;
    } else if (date === 'tomorrow') {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() + 1);
    } else {
      targetDate = new Date(date);
    }
    
    // Get start and end of the target date
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);

    // Find all booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Define available time slots
    const allTimeSlots = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00', '17:00'];
    
    // Create slots object with availability
    const slots = {};
    allTimeSlots.forEach(slot => {
      const isBooked = bookedAppointments.some(apt => apt.timeSlot === slot);
      slots[slot] = !isBooked; // true if available, false if booked
    });

    res.json({
      success: true,
      date: date,
      doctorId,
      doctorName: doctor.name,
      slots
    });

  } catch (error) {
    console.error('Slots fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots'
    });
  }
});

// Book an appointment
router.post('/book', authenticateToken, [
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required'),
  body('doctorName')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required'),
  body('date')
    .notEmpty()
    .withMessage('Date is required'),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { doctorId, doctorName, date, time } = req.body;
    const userId = req.user._id;

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Calculate appointment date
    const today = new Date();
    let appointmentDate;
    
    if (date === 'today') {
      appointmentDate = today;
    } else if (date === 'tomorrow') {
      appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + 1);
    } else {
      appointmentDate = new Date(date);
    }

    // Check if slot is already booked
    const startOfDay = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
    const endOfDay = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      timeSlot: time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const newAppointment = new Appointment({
      userId,
      userName: req.user.name,
      userMobile: req.user.mobile,
      doctorId,
      doctorName,
      appointmentDate,
      timeSlot: time,
      consultationFee: doctor.consultationFee || 500
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment slot reserved! Please complete payment to confirm.',
      appointment: newAppointment
    });

  } catch (error) {
    console.error('Appointment booking error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to book appointment'
    });
  }
});

// Get user's appointments
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({
      userId,
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('doctorId', 'name specialty')
    .sort({ appointmentDate: 1, timeSlot: 1 });

    res.json(appointments);

  } catch (error) {
    console.error('Fetch appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
});

// Cancel appointment
router.post('/cancel', authenticateToken, [
  body('appointmentId')
    .notEmpty()
    .withMessage('Appointment ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { appointmentId } = req.body;
    const userId = req.user._id;

    // Find and verify appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or already cancelled'
      });
    }

    // Update appointment status
    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment'
    });
  }
});

// Confirm payment
router.post('/confirm-payment', authenticateToken, [
  body('appointmentId')
    .notEmpty()
    .withMessage('Appointment ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { appointmentId } = req.body;
    const userId = req.user._id;

    // Find and verify appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId,
      status: 'pending'
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or already processed'
      });
    }

    // Update appointment status
    appointment.status = 'confirmed';
    appointment.paymentStatus = 'paid';
    appointment.paymentConfirmedAt = new Date();
    await appointment.save();

    res.json({
      success: true,
      message: `Payment confirmed! Your appointment with ${appointment.doctorName} is confirmed for ${appointment.appointmentDate.toDateString()} at ${appointment.timeSlot}.`,
      appointment
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
});

export default router;