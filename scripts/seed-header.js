const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'header';

const headerDataLTR = {
  language: "ltr",
  isActive: true,

  logo: {
    imagePath: "/image/logo/logo-2.png",
    alt: "Al Bahar & Partners",
    width: 169,
    height: 40,
    link: "/",
  },

  menuItems: [
    {
      title: "HOME",
      href: "/",
      order: 0,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "ABOUT US",
      href: "/about-us",
      order: 1,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "SOLUTIONS",
      href: "/solutions",
      order: 2,
      isActive: true,
      hasDropdown: true,
      dropdownItems: [
    
        {
          title: "Banking, Payment and Identity Solutions",
          href: "/services-details-1?id=banking-payment-identity",
          order: 0,
          isActive: true,
        },
        {
          title: "Printing & Imaging",
          href: "/services-details-1?id=printing-imaging",
          order: 1,
          isActive: true,
        },
        {
          title: "Audio & Visual",
          href: "/services-details-1?id=audio-visual",
          order: 2,
          isActive: true,
        },
        {
          title: "IT Infrastructure, Support and Cloud",
          href: "/services-details-1?id=it-infrastructure-support-cloud",
          order: 3,
          isActive: true,
        },
        {
          title: "Information and Cyber Security",
          href: "/services-details-1?id=information-cyber-security",
          order: 4,
          isActive: true,
        },
      ],
    },
    {
      title: "BRANDS",
      href: "/brands",
      order: 3,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "Career",
      href: "/career",
      order: 4,
      isActive: true,
      hasDropdown: false,
    },
  
    {
      title: "SUPPORT",
      href: "/support",
      order: 5,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "CONTACT US",
      href: "/contact-us",
      order: 6,
      isActive: true,
      hasDropdown: false,
    },
  ],

  buttonText: "Profile",
  buttonLink: "#",
};

const headerDataRTL = {
  language: "rtl",
  isActive: true,

  logo: {
    imagePath: "/image/logo/logo-2.png",
    alt: "البحر والشركاء",
    width: 169,
    height: 40,
    link: "/",
  },

  menuItems: [
    {
      title: "الرئيسية",
      href: "/",
      order: 0,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "من نحن",
      href: "/about-us",
      order: 1,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "الحلول",
      href: "/solutions",
      order: 2,
      isActive: true,
      hasDropdown: true,
      dropdownItems: [
        {
          // Banking, Payment and Identity Solutions
          title: "حلول الخدمات المصرفية والدفع والهوية",
          href: "#",
          order: 0,
          isActive: true,
        },
        {
          // Printing & Imaging
          title: "حلول الطباعة والتصوير",
          href: "#",
          order: 1,
          isActive: true,
        },
        {
          // Audio & Visual
          title: "حلول الصوتيات والمرئيات",
          href: "#",
          order: 2,
          isActive: true,
        },
        {
          // IT Infrastructure, Support and Cloud
          title: "البنية التحتية لتقنية المعلومات والدعم والحوسبة السحابية",
          href: "#",
          order: 3,
          isActive: true,
        },
        {
          // Information and Cyber Security
          title: "أمن المعلومات والأمن السيبراني",
          href: "#",
          order: 4,
          isActive: true,
        },
      ],
    },
    {
      title: "العلامات التجارية",
      href: "/brands",
      order: 3,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "معلومات الشركة",
      href: "#",
      order: 4,
      isActive: true,
      hasDropdown: true,
      dropdownItems: [
        {
          title: "قصص العملاء",
          href: "/customer-stories",
          order: 0,
          isActive: true,
        },
        {
          title: "الأخبار والتحديثات",
          href: "/news-updates",
          order: 1,
          isActive: true,
        },
        {
          title: "الوظائف",
          href: "/career",
          order: 2,
          isActive: true,
        },
      ],
    },
    {
      title: "الدعم",
      href: "/support",
      order: 5,
      isActive: true,
      hasDropdown: false,
    },
    {
      title: "اتصل بنا",
      href: "/contact-us",
      order: 6,
      isActive: true,
      hasDropdown: false,
    },
  ],

  buttonText: "الملف الشخصي",
  buttonLink: "#",
};

async function seedHeaderData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Header data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Header content...');
    const ltrResult = await collection.insertOne({
      ...headerDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Header content...');
    const rtlResult = await collection.insertOne({
      ...headerDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Header data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${headerDataLTR.menuItems.length} menu items`);
    console.log(`   - RTL (Arabic): ${headerDataRTL.menuItems.length} menu items`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/header to manage content');

  } catch (error) {
    console.error('❌ Error seeding Header data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedHeaderData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedHeaderData };
