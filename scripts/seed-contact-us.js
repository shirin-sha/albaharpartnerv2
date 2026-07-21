const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'contactus';

const contactUsDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "Contact Us",
    title: "Contact Us",
    subtitle: "Explore success stories from businesses that achieved growth through our tailored strategies and solutions.",
    language: "ltr",
    isActive: true,
  },

  contactSection: {
    tag: "Contact US",
    heading: "Get in Touch with Us",
    subheading: "Reach out today to discuss how we can support your business goals. Our team is ready to provide answers, offer solutions, and start your journey toward success.",
    isActive: true,
    benefits: [
      { text: "24/7 Expert Support" },
      { text: "Free Consultation Before You Commit" },
      { text: "Business-Focused Guidance" },
      { text: "Trusted and Qualified Advisors" },
    ],
    contactInfo: {
      address: "P.O. Box 148 Safat 13002-Kuwait,\nBlock 1, Street 3,\nShuwaikh Industrial 1",
      phone: "+965 184 8848",
      email: "info.bpc@albahargroup.com",
    },
  },

  mapSection: {
    mapUrl: "https://www.google.com/maps?q=29.362696,47.962198&hl=en&z=16&output=embed&cid=17293679640408904591",
    isActive: true,
  },
};

const contactUsDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "اتصل بنا",
    title: "اتصل بنا",
    subtitle: "استكشف قصص نجاح من الشركات التي حققت نمواً من خلال استراتيجياتنا وحلولنا المخصصة.",
    language: "rtl",
    isActive: true,
  },

  contactSection: {
    tag: "اتصل بنا",
    heading: "تواصل معنا",
    subheading: "تواصل اليوم لمناقشة كيف يمكننا دعم أهداف عملك. فريقنا جاهز لتقديم الإجابات وتقديم الحلول وبدء رحلتك نحو النجاح.",
    isActive: true,
    benefits: [
      { text: "دعم خبير على مدار الساعة طوال أيام الأسبوع" },
      { text: "استشارة مجانية قبل الالتزام" },
      { text: "إرشاد يركز على الأعمال" },
      { text: "مستشارون موثوقون ومؤهلون" },
    ],
    contactInfo: {
      address: "ص.ب 148 الصفاة 13002-الكويت،\nالقطعة 1، الشارع 3،\nالشويخ الصناعية 1",
      phone: "+965 184 8848",
      email: "info.bpc@albahargroup.com",
    },
  },

  mapSection: {
    mapUrl: "https://www.google.com/maps?q=29.362696,47.962198&hl=en&z=16&output=embed&cid=17293679640408904591",
    isActive: true,
  },
};

async function seedContactUsData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Contact Us data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Contact Us content...');
    const ltrResult = await collection.insertOne({
      ...contactUsDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Contact Us content...');
    const rtlResult = await collection.insertOne({
      ...contactUsDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Contact Us data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): Complete contact information`);
    console.log(`   - RTL (Arabic): Complete contact information`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/contact-us to manage content');
    console.log('🌐 Visit http://localhost:3000/contact-us to view the page');

  } catch (error) {
    console.error('❌ Error seeding Contact Us data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedContactUsData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedContactUsData };
