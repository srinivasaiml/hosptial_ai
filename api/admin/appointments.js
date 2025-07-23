const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

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

function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  
  if (decoded.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return decoded;
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
    // Verify admin token
    verifyAdminToken(req);

    const client = await connectToDatabase();
    const db = client.db('hospital_db');
    const appointments = db.collection('appointments');

    // Fetch all appointments with sorting
    const allAppointments = await appointments.find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      appointments: allAppointments
    });

  } catch (error) {
    console.error('Fetch admin appointments error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.message === 'Admin access required') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};