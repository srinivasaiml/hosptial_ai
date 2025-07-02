# Srinivasa Hospital - AI-Powered Healthcare Platform

A modern healthcare platform featuring AI-powered appointment booking, comprehensive medical services, and exceptional patient care.

## Features

- 🤖 **AI Health Assistant** - Intelligent chatbot for appointment booking and health queries
- 📅 **Smart Appointment System** - Real-time booking with availability checking
- 👨‍⚕️ **Expert Medical Team** - Specialized doctors across multiple departments
- 🏥 **Comprehensive Services** - Full range of medical services and treatments
- 📱 **Responsive Design** - Optimized for all devices
- 🔐 **Secure Authentication** - User registration and login system
- 💳 **Payment Integration** - Secure payment processing for appointments

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Lottie React
- **Icons**: Lucide React
- **Build Tool**: Vite
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd srinivasa-hospital
```

2. **Install dependencies for both frontend and backend:**
```bash
npm run install-all
```

3. **Set up environment variables:**

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/srinivasa_hospital
JWT_SECRET=hospital-ai-chat-jwt-secret-key-2024-super-secure
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, update MONGODB_URI in server/.env
```

5. **Seed the database with sample doctors:**
```bash
cd server
node seeders/doctors.js
cd ..
```

6. **Start the development servers:**
```bash
npm run dev
```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:5000) servers concurrently.

## Project Structure

```
srinivasa-hospital/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   ├── contexts/                 # React contexts (Auth, Chat)
│   ├── App.tsx                   # Main App component
│   └── main.tsx                  # Entry point
├── server/                       # Backend Node.js application
│   ├── models/                   # MongoDB models
│   │   ├── User.js              # User model
│   │   ├── Doctor.js            # Doctor model
│   │   └── Appointment.js       # Appointment model
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── appointments.js      # Appointment routes
│   │   └── doctors.js           # Doctor routes
│   ├── seeders/                  # Database seeders
│   │   └── doctors.js           # Sample doctors data
│   └── index.js                 # Server entry point
├── public/                       # Static assets
└── package.json                  # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID

### Appointments
- `GET /api/appointments/slots` - Get available time slots
- `POST /api/appointments/book` - Book an appointment
- `GET /api/appointments/my` - Get user's appointments
- `POST /api/appointments/cancel` - Cancel an appointment
- `POST /api/appointments/confirm-payment` - Confirm payment

## Database Models

### User Model
```javascript
{
  name: String,
  username: String (unique),
  mobile: String (unique),
  password: String (hashed),
  role: String (default: 'patient'),
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Doctor Model
```javascript
{
  name: String,
  specialty: String,
  qualification: String,
  experience: Number,
  consultationFee: Number,
  image: String,
  availability: {
    days: [String],
    timeSlots: [String]
  },
  isActive: Boolean,
  timestamps: true
}
```

### Appointment Model
```javascript
{
  userId: ObjectId (ref: User),
  userName: String,
  userMobile: String,
  doctorId: ObjectId (ref: Doctor),
  doctorName: String,
  appointmentDate: Date,
  timeSlot: String,
  status: String (pending/confirmed/cancelled/completed),
  paymentStatus: String (pending/paid/failed/refunded),
  consultationFee: Number,
  notes: String,
  timestamps: true
}
```

## Features Overview

### AI Health Assistant
- Interactive chatbot for appointment booking
- Health tips and medical advice
- Real-time availability checking
- Appointment confirmation and management

### Appointment System
- Doctor selection with specialties
- Date and time slot selection
- Real-time availability checking
- Appointment history and management
- Payment integration ready

### User Authentication
- Secure registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Session persistence
- User profile management

### Security Features
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- Password hashing
- JWT token authentication

## Development Scripts

```bash
# Install all dependencies (frontend + backend)
npm run install-all

# Start both frontend and backend in development mode
npm run dev

# Start only frontend
npm run client

# Start only backend
npm run server

# Build frontend for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Deployment

### Environment Variables for Production

**Frontend:**
- `VITE_API_URL` - Backend API URL

**Backend:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `PORT` - Server port
- `NODE_ENV` - Environment (production)
- `CLIENT_URL` - Frontend URL for CORS

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in server/.env

### Deployment Platforms

- **Frontend**: Netlify, Vercel, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean, AWS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email info@srinivasahospital.com or contact our helpline at +91 123 456 7890.

## Acknowledgments

- Design inspiration from modern healthcare platforms
- Icons from Lucide React
- Animations from Lottie Files
- Images from Unsplash and Pexels