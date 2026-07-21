const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'newsupdates';

const newsUpdatesDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "News & Updates",
    title: "News & Updates",
    subtitle: "Stay updated with insights, tips, and trends in finance and business strategy—curated by our experts to keep you informed and ahead.",
    language: "ltr",
    isActive: true,
  },

  posts: [
    {
      title: "Building Secure Identity and Access Systems",
      category: "Identity & Access",
      imagePath: "/image/blog/tf-post-grid-absolute-3.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "18", month: "DEC" },
      link: "#",
      order: 0,
      isActive: true,
    },
    {
      title: "Strengthening Cybersecurity for Modern Enterprises",
      category: "Cybersecurity",
      imagePath: "/image/blog/tf-post-grid-absolute-4.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "18", month: "DEC" },
      link: "#",
      order: 1,
      isActive: true,
    },
    {
      title: "Payment Technology Trends Shaping Customer Experience",
      category: "Payment Technology",
      imagePath: "/image/blog/tf-post-grid-absolute-5.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "22", month: "DEC" },
      link: "#",
      order: 2,
      isActive: true,
    },
    {
      title: "Modernizing IT Infrastructure for Cloud Readiness",
      category: "IT Infrastructure",
      imagePath: "/image/blog/tf-post-grid-13.jpg",
      imgWidth: 403,
      imgHeight: 303,
      date: { day: "15", month: "JAN" },
      link: "#",
      order: 3,
      isActive: true,
    },
    {
      title: "Endpoint Security Best Practices for 2024",
      category: "Security",
      imagePath: "/image/blog/tf-post-grid-8.jpg",
      imgWidth: 400,
      imgHeight: 300,
      date: { day: "12", month: "JAN" },
      link: "#",
      order: 4,
      isActive: true,
    },
    {
      title: "Digital Transformation Strategies for Enterprises",
      category: "Digital Transformation",
      imagePath: "/image/blog/tf-post-grid-14.jpg",
      imgWidth: 404,
      imgHeight: 303,
      date: { day: "10", month: "JAN" },
      link: "#",
      order: 5,
      isActive: true,
    },
    {
      title: "Network Security Solutions for Remote Work",
      category: "Network Security",
      imagePath: "/image/blog/tf-post-grid-absolute-3.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "8", month: "JAN" },
      link: "#",
      order: 6,
      isActive: true,
    },
    {
      title: "Cloud Migration Best Practices and Strategies",
      category: "Cloud Services",
      imagePath: "/image/blog/tf-post-grid-absolute-4.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "5", month: "JAN" },
      link: "#",
      order: 7,
      isActive: true,
    },
  ],
};

const newsUpdatesDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "الأخبار والتحديثات",
    title: "الأخبار والتحديثات",
    subtitle: "ابق على اطلاع مع الأفكار والنصائح والاتجاهات في التمويل واستراتيجية الأعمال—من اختيار خبرائنا لإبقائك على اطلاع ومتقدماً.",
    language: "rtl",
    isActive: true,
  },

  posts: [
    {
      title: "بناء أنظمة هوية ووصول آمنة",
      category: "الهوية والوصول",
      imagePath: "/image/blog/tf-post-grid-absolute-3.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "18", month: "ديسمبر" },
      link: "#",
      order: 0,
      isActive: true,
    },
    {
      title: "تعزيز الأمن السيبراني للمؤسسات الحديثة",
      category: "الأمن السيبراني",
      imagePath: "/image/blog/tf-post-grid-absolute-4.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "18", month: "ديسمبر" },
      link: "#",
      order: 1,
      isActive: true,
    },
    {
      title: "اتجاهات تكنولوجيا المدفوعات التي تشكل تجربة العملاء",
      category: "تكنولوجيا المدفوعات",
      imagePath: "/image/blog/tf-post-grid-absolute-5.jpg",
      imgWidth: 410,
      imgHeight: 546,
      date: { day: "22", month: "ديسمبر" },
      link: "#",
      order: 2,
      isActive: true,
    },
    {
      title: "تحديث البنية التحتية لتكنولوجيا المعلومات للجاهزية السحابية",
      category: "البنية التحتية لتكنولوجيا المعلومات",
      imagePath: "/image/blog/tf-post-grid-13.jpg",
      imgWidth: 403,
      imgHeight: 303,
      date: { day: "15", month: "يناير" },
      link: "#",
      order: 3,
      isActive: true,
    },
  ],
};

async function seedNewsUpdatesData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing News & Updates data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) News & Updates content...');
    const ltrResult = await collection.insertOne({
      ...newsUpdatesDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) News & Updates content...');
    const rtlResult = await collection.insertOne({
      ...newsUpdatesDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 News & Updates data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${newsUpdatesDataLTR.posts.length} posts`);
    console.log(`   - RTL (Arabic): ${newsUpdatesDataRTL.posts.length} posts`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/news-updates to manage content');
    console.log('🌐 Visit http://localhost:3000/news-updates to view the page');

  } catch (error) {
    console.error('❌ Error seeding News & Updates data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedNewsUpdatesData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedNewsUpdatesData };
