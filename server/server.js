import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Root Ping Route
app.get('/', (req, res) => {
  res.json({ message: 'Campus Voice API Server is operational' });
});

// Database & Server Setup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusvoice';

import bcrypt from 'bcryptjs';
import User from './models/User.js';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB successfully connected.');
    
    // Auto-seed demo users if not present
    try {
      const studentEmail = 'Student@gmail.com';
      const studentExists = await User.findOne({ email: studentEmail });
      if (!studentExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('demo123', salt);
        await User.create({
          name: 'Aravind Nair',
          email: studentEmail,
          password: hashedPassword,
          role: 'student',
        });
        console.log('Seeded demo student: Student@gmail.com / demo123');
      }

      const adminEmail = 'Adim@gmail.com';
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('demo123', salt);
        await User.create({
          name: 'Dean Admin Office',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        });
        console.log('Seeded demo admin: Adim@gmail.com / demo123');
      }
    } catch (seedErr) {
      console.error('Error seeding demo users:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err.message);
    process.exit(1);
  });
