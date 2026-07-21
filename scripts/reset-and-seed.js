const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function resetAndSeed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('albahar');
    const collection = db.collection('homepage');
    
    // Step 1: Delete ALL existing homepage content
    console.log('🗑️  Deleting all existing homepage content...');
    const deleteResult = await collection.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} documents\n`);
    
    // Step 2: Verify it's empty
    const count = await collection.countDocuments();
    console.log(`📊 Current documents in database: ${count}\n`);
    
    if (count === 0) {
      console.log('✅ Database is now empty and ready for fresh data\n');
      console.log('🌱 Now run: npm run seed:homepage');
      console.log('   This will add fresh LTR and RTL content\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

resetAndSeed();
