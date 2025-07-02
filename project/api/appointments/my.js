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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Verify JWT token
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    const client = await connectToDatabase();
    const db = client.db('hospital_db');
    const appointments = db.collection('appointments');

    // Find all appointments for this user
    const userAppointments = await appointments.find({
      userId: new ObjectId(userId),
      status: { $in: ['pending', 'confirmed'] }
    }).sort({ appointmentDate: 1, timeSlot: 1 }).toArray();

    res.status(200).json(userAppointments);

  } catch (error) {
    console.error('Fetch appointments error:', error);
    
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