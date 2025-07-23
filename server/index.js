@@ .. @@
 // Import routes
 import authRoutes from './routes/auth.js';
 import appointmentRoutes from './routes/appointments.js';
 import doctorRoutes from './routes/doctors.js';
+import adminRoutes from './routes/admin.js';

 // Load environment variables
@@ .. @@
 // Routes
 app.use('/api/auth', authRoutes);
 app.use('/api/appointments', appointmentRoutes);
 app.use('/api/doctors', doctorRoutes);
+app.use('/api/admin', adminRoutes);

 // Health check endpoint