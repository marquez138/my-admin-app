// /scripts/ensureAdmin.js
require('dotenv').config({ path: '.env.local' }); // Ensure environment variables are loaded
const mongoose = require('mongoose');
const User = require('../models/UserImport'); // Adjust path if necessary

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

async function ensureAdminUser() {
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined. Check your .env.local file.');
    process.exit(1);
  }
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('❌ Error: SEED_ADMIN_USERNAME or SEED_ADMIN_PASSWORD is not defined in .env.local.');
    console.error('Please define them with secure credentials.');
    process.exit(1);
  }
  // Basic check for a common insecure default, if you had one temporarily
  if (ADMIN_PASSWORD === 'YourSuperSecurePassword123!' && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ WARNING: You are using a default example password for SEED_ADMIN_PASSWORD in a production-like environment. This is insecure. Please update it via environment variables.');
      // Depending on policy, you might want to exit: process.exit(1);
  }


  let connection;
  try {
    console.log('Attempting to connect to MongoDB...');
    connection = await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully.');

    // 1. Check if an admin user with the specified username already exists
    const existingAdmin = await User.findOne({ username: ADMIN_USERNAME });

    if (existingAdmin) {
      console.log(`ℹ️ Admin user '${ADMIN_USERNAME}' already exists.`);
      if (!existingAdmin.isAdmin) {
        console.warn(`⚠️ User '${ADMIN_USERNAME}' exists but is not marked as admin. You might need to update this manually or adjust the script.`);
      }
    } else {
      console.log(`Admin user '${ADMIN_USERNAME}' not found. Creating one...`);
      // 2. If not, create the admin user
      const newAdmin = new User({
       email: ADMIN_USERNAME,
        password: ADMIN_PASSWORD, // The 'pre' save hook in UserSchema will hash this
        isAdmin: true,
      });
      await newAdmin.save();
      console.log(`✅ Admin user '${ADMIN_USERNAME}' created successfully!`);
      console.log('IMPORTANT: Ensure this user\'s credentials are stored securely and remembered.');
    }
  } catch (error) {
    console.error('❌ Error during the admin user check/seed process:', error);
    if (error.code === 11000) { // MongoDB duplicate key error
        console.error(`ℹ️ It seems a user with username '${ADMIN_USERNAME}' might already exist, but the initial check failed or there was a race condition.`);
    }
  } finally {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) { // 1 = connected, 2 = connecting
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected.');
    }
  }
}

ensureAdminUser();