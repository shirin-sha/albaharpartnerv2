const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'support';

const supportDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "Support",
    title: "Support",
    subtitle: "From incident resolution to preventive maintenance, our support teams keep your operations secure, stable, and always available.",
    language: "ltr",
    isActive: true,
  },

  servicesSection: {
    tag: "INDUSTRIES WE HELP",
    heading: "Support services tailored to each industry.",
    subheading: "Reliable maintenance, faster issue resolution, and secure operations aligned to your environment.",
    isActive: true,
    services: [
      {
        title: "Financial Services",
        description: "Secure, compliant support for banking, payments, identity, and high-availability infrastructure.",
        iconClass: "icon-Bank",
        order: 0,
        isActive: true,
      },
      {
        title: "Government & Public Sector",
        description: "Structured service delivery with documentation, SLAs, security controls, and audit-ready support.",
        iconClass: "icon-Briefcase",
        order: 1,
        isActive: true,
      },
      {
        title: "Healthcare",
        description: "Protect clinical operations with secure access, device uptime, and resilient networks.",
        iconClass: "icon-FirstAidKit",
        order: 2,
        isActive: true,
      },
      {
        title: "Retail & Hospitality",
        description: "Keep checkout, customer experience, Wi-Fi, digital signage, and POS environments running smoothly.",
        iconClass: "icon-Basket",
        order: 3,
        isActive: true,
      },
      {
        title: "Oil, Gas & Energy",
        description: "Support for critical sites—rugged infrastructure, secure connectivity, and operational continuity.",
        iconClass: "icon-LightbulbFilament",
        order: 4,
        isActive: true,
      },
      {
        title: "Logistics & Warehousing",
        description: "Uptime-focused support for tracking, connectivity, printing, scanning, and secure access.",
        iconClass: "icon-AirplaneTakeoff",
        order: 5,
        isActive: true,
      },
      {
        title: "Education",
        description: "Support for campuses and training centers—networks, AV, identity access, and endpoint reliability.",
        iconClass: "",
        iconSvg: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4L4 10L16 16L28 10L16 4Z" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 22L16 28L28 22" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16L16 22L28 16" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>',
        order: 6,
        isActive: true,
      },
      {
        title: "Enterprise & Commercial",
        description: "End-to-end support across cybersecurity, cloud, infrastructure, printing, and collaboration tools.",
        iconClass: "",
        iconSvg: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_9360_11765)"><path d="M6 24L26 24C27.1046 24 28 23.1046 28 22L28 8C28 6.89543 27.1046 6 26 6L6 6C4.89543 6 4 6.89543 4 8L4 22C4 23.1046 4.89543 24 6 24Z" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 28H12" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_9360_11765"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>',
        order: 7,
        isActive: true,
      },
      {
        title: "Telecom & Service Providers",
        description: "Support for large-scale networks and customer platforms—ensuring uptime, security, and fast incident response.",
        iconClass: "icon-PhoneCall",
        order: 8,
        isActive: true,
      },
    ],
  },

  contactSection: {
    tag: "CONTACT FOR SUPPORT",
    heading: "Get in Touch with Our Support Team",
    subheading: "Need technical assistance or service information? Our support desk is ready to help you resolve incidents, manage service requests, and maintain your solutions across Banking, Payment & Identity, IT Infrastructure, Cybersecurity, Printing & Imaging, and Audio-Visual systems.",
    isActive: true,
    benefits: [
      { text: "24/7 options for critical systems (as per SLA)" },
      { text: "Remote support and on-site assistance" },
      { text: "Preventive maintenance & health checks" },
      { text: "Certified engineers and trusted escalation paths" },
    ],
    contactInfo: {
      location: "Kuwait City, Kuwait",
      phoneNumbers: ["+965 XXXXXXXX", "+965 XXXXXXXX"],
      email: "support@albahargroup.com",
    },
    formTitle: "Schedule a free consultation",
  },
};

const supportDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "الدعم",
    title: "الدعم",
    subtitle: "من حل الحوادث إلى الصيانة الوقائية، تحافظ فرق الدعم لدينا على عملياتك آمنة ومستقرة ومتاحة دائماً.",
    language: "rtl",
    isActive: true,
  },

  servicesSection: {
    tag: "الصناعات التي نساعدها",
    heading: "خدمات دعم مصممة لكل صناعة.",
    subheading: "صيانة موثوقة، حل أسرع للمشاكل، وعمليات آمنة متوافقة مع بيئتك.",
    isActive: true,
    services: [
      {
        title: "الخدمات المالية",
        description: "دعم آمن ومتوافق للخدمات المصرفية والمدفوعات والهوية والبنية التحتية عالية التوفر.",
        iconClass: "icon-Bank",
        order: 0,
        isActive: true,
      },
      {
        title: "الحكومة والقطاع العام",
        description: "تسليم خدمة منظم مع التوثيق واتفاقيات مستوى الخدمة وضوابط الأمان والدعم الجاهز للتدقيق.",
        iconClass: "icon-Briefcase",
        order: 1,
        isActive: true,
      },
      {
        title: "الرعاية الصحية",
        description: "حماية العمليات السريرية مع الوصول الآمن ووقت تشغيل الأجهزة والشبكات المرنة.",
        iconClass: "icon-FirstAidKit",
        order: 2,
        isActive: true,
      },
    ],
  },

  contactSection: {
    tag: "اتصل للحصول على الدعم",
    heading: "تواصل مع فريق الدعم لدينا",
    subheading: "تحتاج إلى مساعدة تقنية أو معلومات خدمة؟ مكتب الدعم لدينا جاهز لمساعدتك في حل الحوادث وإدارة طلبات الخدمة والحفاظ على حلولك عبر الخدمات المصرفية والمدفوعات والهوية والبنية التحتية لتكنولوجيا المعلومات والأمن السيبراني والطباعة والتصوير وأنظمة الصوت والصورة.",
    isActive: true,
    benefits: [
      { text: "خيارات 24/7 للأنظمة الحرجة (حسب اتفاقية مستوى الخدمة)" },
      { text: "الدعم عن بُعد والمساعدة في الموقع" },
      { text: "الصيانة الوقائية وفحوصات الصحة" },
      { text: "مهندسون معتمدون ومسارات تصعيد موثوقة" },
    ],
    contactInfo: {
      location: "مدينة الكويت، الكويت",
      phoneNumbers: ["+965 XXXXXXXX", "+965 XXXXXXXX"],
      email: "support@albahargroup.com",
    },
    formTitle: "جدولة استشارة مجانية",
  },
};

async function seedSupportData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Support data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Support content...');
    const ltrResult = await collection.insertOne({
      ...supportDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Support content...');
    const rtlResult = await collection.insertOne({
      ...supportDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Support data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${supportDataLTR.servicesSection.services.length} services`);
    console.log(`   - RTL (Arabic): ${supportDataRTL.servicesSection.services.length} services`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/support to manage content');
    console.log('🌐 Visit http://localhost:3000/support to view the page');

  } catch (error) {
    console.error('❌ Error seeding Support data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedSupportData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedSupportData };
