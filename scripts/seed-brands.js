const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'brands';

const brandsDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "Brands",
    title: "Brands",
    subtitle: "",
    language: "ltr",
    isActive: true,
  },

  tag: "OUR PARTNERS",
  heading: "Trusted by partners and supported by leading technologies worldwide.",
  subheading: "",

  brands: [
    { name: "Fortinet", imagePath: "/image/brand/fort.png", link: "#", order: 0, isActive: true },
    { name: "PureStorage", imagePath: "/image/brand/pure.png", link: "#", order: 1, isActive: true },
    { name: "TeamViewer", imagePath: "/image/brand/team.png", link: "#", order: 2, isActive: true },
    { name: "Hitatchi", imagePath: "/image/brand/hita.png", link: "#", order: 3, isActive: true },
    { name: "Axonius", imagePath: "/image/brand/axo.png", link: "#", order: 4, isActive: true },
    { name: "Dahua", imagePath: "/image/brand/alhua.png", link: "#", order: 5, isActive: true },
    { name: "CrowdStrike", imagePath: "/image/brand/crowd.png", link: "#", order: 6, isActive: true },
    { name: "Entrust", imagePath: "/image/brand/entrust.png", link: "#", order: 7, isActive: true },
    { name: "Hikvision", imagePath: "/image/brand/hik.png", link: "#", order: 8, isActive: true },
    { name: "Logitech", imagePath: "/image/brand/logi.png", link: "#", order: 9, isActive: true },
    { name: "Nexusguard", imagePath: "/image/brand/nexus.png", link: "#", order: 10, isActive: true },
    { name: "Sedco", imagePath: "/image/brand/sedco.png", link: "#", order: 11, isActive: true },
    { name: "Thales", imagePath: "/image/brand/thales.png", link: "#", order: 12, isActive: true },
    { name: "TriCerat", imagePath: "/image/brand/tri.png", link: "#", order: 13, isActive: true },
    { name: "ViewSonic", imagePath: "/image/brand/view.png", link: "#", order: 14, isActive: true },
  ],
};

const brandsDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "العلامات التجارية",
    title: "العلامات التجارية",
    subtitle: "",
    language: "rtl",
    isActive: true,
  },

  tag: "شركاؤنا",
  heading: "موثوق بها من قبل الشركاء ومدعومة بالتقنيات الرائدة في جميع أنحاء العالم.",
  subheading: "",

  brands: [
    { name: "Fortinet", imagePath: "/image/brand/fort.png", link: "#", order: 0, isActive: true },
    { name: "PureStorage", imagePath: "/image/brand/pure.png", link: "#", order: 1, isActive: true },
    { name: "TeamViewer", imagePath: "/image/brand/team.png", link: "#", order: 2, isActive: true },
    { name: "Hitatchi", imagePath: "/image/brand/hita.png", link: "#", order: 3, isActive: true },
    { name: "Axonius", imagePath: "/image/brand/axo.png", link: "#", order: 4, isActive: true },
    { name: "Dahua", imagePath: "/image/brand/alhua.png", link: "#", order: 5, isActive: true },
    { name: "CrowdStrike", imagePath: "/image/brand/crowd.png", link: "#", order: 6, isActive: true },
    { name: "Entrust", imagePath: "/image/brand/entrust.png", link: "#", order: 7, isActive: true },
    { name: "Hikvision", imagePath: "/image/brand/hik.png", link: "#", order: 8, isActive: true },
    { name: "Logitech", imagePath: "/image/brand/logi.png", link: "#", order: 9, isActive: true },
    { name: "Nexusguard", imagePath: "/image/brand/nexus.png", link: "#", order: 10, isActive: true },
    { name: "Sedco", imagePath: "/image/brand/sedco.png", link: "#", order: 11, isActive: true },
    { name: "Thales", imagePath: "/image/brand/thales.png", link: "#", order: 12, isActive: true },
    { name: "TriCerat", imagePath: "/image/brand/tri.png", link: "#", order: 13, isActive: true },
    { name: "ViewSonic", imagePath: "/image/brand/view.png", link: "#", order: 14, isActive: true },
  ],
};

async function seedBrandsData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Brands data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Brands content...');
    const ltrResult = await collection.insertOne({
      ...brandsDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Brands content...');
    const rtlResult = await collection.insertOne({
      ...brandsDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Brands data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${brandsDataLTR.brands.length} brands`);
    console.log(`   - RTL (Arabic): ${brandsDataRTL.brands.length} brands`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/brands to manage content');
    console.log('🌐 Visit http://localhost:3000/brands to view the page');

  } catch (error) {
    console.error('❌ Error seeding Brands data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedBrandsData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedBrandsData };
