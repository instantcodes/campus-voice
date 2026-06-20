import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in your environment/dotenv file.');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas at:', MONGO_URI.replace(/:[^:@]+@/, ':****@'));

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected successfully. Checking users...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Seed student
    const studentEmail = 'student@gmail.com'; // Mongoose lowercase: true automatically lowers this
    const studentExists = await User.findOne({ email: studentEmail });
    if (!studentExists) {
      await User.create({
        name: 'Demo Student',
        email: 'Student@gmail.com',
        password: hashedPassword,
        role: 'student',
      });
      console.log('Successfully seeded Student@gmail.com / demo123');
    } else {
      console.log('Student@gmail.com already exists in database.');
    }

    // Seed admin
    const adminEmail = 'adim@gmail.com'; // Mongoose lowercase: true automatically lowers this
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Demo Admin',
        email: 'Adim@gmail.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Successfully seeded Adim@gmail.com / demo123');
    } else {
      console.log('Adim@gmail.com already exists in database.');
    }

    console.log('Seeding process complete.');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
