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

    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }

    const client = await connectToDatabase();
    const db = client.db('hospital_db');
    const appointments = db.collection('appointments');

    // Find the appointment and verify it belongs to the user
    const appointment = await appointments.findOne({
      _id: new ObjectId(appointmentId),
      userId: new ObjectId(userId),
      status: { $in: ['pending', 'confirmed'] }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or already cancelled'
      });
    }

    // Update appointment status to cancelled
    const result = await appointments.updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          status: 'cancelled',
          cancelledAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully'
      });
    } else {
      throw new Error('Failed to cancel appointment');
    }

  } catch (error) {
    console.error('Cancel appointment error:', error);
    
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