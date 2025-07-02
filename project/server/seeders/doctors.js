import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../models/Doctor.js';

dotenv.config();

const doctors = [
  {
    name: 'Dr. John Smith',
    specialty: 'General Physician',
    qualification: 'MBBS, MD',
    experience: 15,
    consultationFee: 500,
    image: '/doctor2.jpg',
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlots: ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00', '17:00']
    }
  },
  {
    name: 'Dr. Emily Carter',
    specialty: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 12,
    consultationFee: 600,
    image: '/doctor3.jpg',
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      timeSlots: ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00']
    }
  },
  {
    name: 'Dr. Michael Lee',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience: 20,
    consultationFee: 800,
    image: '/doctor4.jpg',
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlots: ['09:00', '10:30', '14:00', '15:30', '16:00']
    }
  },
  {
    name: 'Dr. Robert Lee',
    specialty: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 18,
    consultationFee: 550,
    image: '/doctor5.jpg',
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      timeSlots: ['09:00', '10:30', '11:00', '14:00', '15:30', '17:00']
    }
  }
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert new doctors
    await Doctor.insertMany(doctors);
    console.log('Doctors seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();