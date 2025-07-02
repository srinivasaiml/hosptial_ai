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
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required'
      });
    }

    const client = await connectToDatabase();
    const db = client.db('hospital_db');
    const appointments = db.collection('appointments');

    // Calculate the target date
    const today = new Date();
    const targetDate = date === 'today' ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    // Get start and end of the target date
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);

    // Find all booked appointments for this doctor on this date
    const bookedAppointments = await appointments.find({
      doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: { $in: ['pending', 'confirmed'] }
    }).toArray();

    // Define available time slots
    const allTimeSlots = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00', '17:00'];
    
    // Create slots object with availability
    const slots = {};
    allTimeSlots.forEach(slot => {
      const isBooked = bookedAppointments.some(apt => apt.timeSlot === slot);
      slots[slot] = !isBooked; // true if available, false if booked
    });

    res.status(200).json({
      success: true,
      date: date,
      doctorId,
      slots
    });

  } catch (error) {
    console.error('Slots fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};