import { config } from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin';

// Load environment variables
config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Create admin data
    const adminData = {
      username: process.argv[2],
      password: process.argv[3],
      email: process.argv[4],
    };

    // Validate input
    if (!adminData.username || !adminData.password || !adminData.email) {
      throw new Error('Please provide username, password, and email as command line arguments');
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username: adminData.username }, { email: adminData.email }],
    });

    if (existingAdmin) {
      throw new Error('Admin with this username or email already exists');
    }

    // Create new admin
    const admin = new Admin(adminData);
    await admin.save();

    console.log('Admin created successfully:', {
      username: admin.username,
      email: admin.email,
      createdAt: admin.createdAt,
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
