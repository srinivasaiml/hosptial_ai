const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Verify JWT token
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    const { doctorId, doctorName, date, time } = req.body;

    if (!doctorId || !doctorName || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'All appointment details are required'
      });
    }

    const client = await connectToDatabase();
    const db = client.db('hospital_db');
    const appointments = db.collection('appointments');
    const users = db.collection('users');

    // Get user details
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate appointment date
    const today = new Date();
    const appointmentDate = date === 'today' ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Check if slot is already booked
    const existingAppointment = await appointments.findOne({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
        $lt: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1)
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
    const newAppointment = {
      userId: new ObjectId(userId),
      userName: user.name,
      userMobile: user.mobile,
      doctorId,
      doctorName,
      appointmentDate,
      timeSlot: time,
      status: 'pending', // pending -> confirmed (after payment)
      paymentStatus: 'pending',
      consultationFee: 500,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await appointments.insertOne(newAppointment);

    if (result.insertedId) {
      const appointment = await appointments.findOne({ _id: result.insertedId });
      
      res.status(201).json({
        success: true,
        message: 'Appointment slot reserved! Please complete payment to confirm.',
        appointment
      });
    } else {
      throw new Error('Failed to create appointment');
    }

  } catch (error) {
    console.error('Appointment booking error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};