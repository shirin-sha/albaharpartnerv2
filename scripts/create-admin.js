/**
 * Script to create the first admin user
 * Run: node scripts/create-admin.js
 * 
 * Make sure to set MONGODB_URI and ADMIN_CREATE_SECRET in your .env.local file
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('albaharpartners1');
    const adminCollection = db.collection('admins');

    // Default admin credentials (change these!)
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    // Check if admin already exists
    const existingAdmin = await adminCollection.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin with this email already exists');
      console.log('   Email:', existingAdmin.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const result = await adminCollection.insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name,
      role: 'admin',
      createdAt: new Date(),
      lastLogin: null,
    });

    console.log('✅ Admin created successfully!');
    console.log('   ID:', result.insertedId.toString());
    console.log('   Email:', email);
    console.log('   Name:', name);
    console.log('\n📝 You can now login with these credentials at /admin');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createAdmin();
