import express from 'express';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .select('name specialty qualification experience consultationFee image')
      .sort({ name: 1 });

    res.json({
      success: true,
      doctors
    });

  } catch (error) {
    console.error('Fetch doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors'
    });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor
    });

  } catch (error) {
    console.error('Fetch doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor details'
    });
  }
});

export default router;