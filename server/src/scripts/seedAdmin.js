import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import '../config/env.js'; // loads .env
import { connectDB } from '../config/db.js';
import { User } from '../models/index.js';
import { ROLES } from '../constants/roles.js';

async function seedAdmin() {
  const { ADMIN_NAME = 'Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role === ROLES.ADMIN) {
      console.log(`Admin already exists: ${email}`);
    } else {
      existing.role = ROLES.ADMIN;
      await existing.save();
      console.log(`Promoted existing user to admin: ${email}`);
    }
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({ name: ADMIN_NAME, email, passwordHash, role: ROLES.ADMIN });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});