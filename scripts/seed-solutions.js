const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'solutions';

const solutionsDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "Solutions",
    title: "Solutions",
    subtitle: "",
    language: "ltr",
    isActive: true,
  },

  detailPage: {
    homeBreadcrumb: "Homepage",
    solutionsBreadcrumb: "Solutions",
    imagePath: "",
    isActive: true,
    contact: {
      tag: "Contact US",
      title: "Get In Touch",
      subtitle: "Reach out today to discuss how we can\nsupport your business goals.",
      addressTitle: "Address Business",
      address: "P.O.Box 148 Safat 13002 - Kuwait, Block 1, Street 3, Shuwaikh Industrial 1",
      directionLabel: "Get direction",
      mapUrl: "https://maps.google.com/?q=Al+Bahar+and+Partners+Kuwait",
      phoneTitle: "Contact Us",
      phones: ["+965 184 8848", "+965 184 8848"],
      emailTitle: "Email Us",
      emails: ["bpc.sales@albahargroup.com", "bpc.info@albahargroup.com"],
      ctaLabel: "Contact Us",
      ctaHref: "/contact-us",
    },
  },

  solutions: [
    {
      id: "banking-payment-identity",
      tabTitle: "Banking, Payment & Identity",
      title: "Banking, Payment & Identity Solutions",
      description: "Enable secure customer experiences and reliable transactions with solutions designed for performance, compliance readiness, and scalability.",
      benefits: [
        "Payment enablement & transaction solutions",
        "Identity verification & authentication support",
        "Secure access and customer onboarding readiness",
        "Integration support for existing platforms",
      ],
      imgSrc: "/image/section/service-1.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "printing-imaging",
      tabTitle: "Printing & Imaging Services",
      title: "Printing & Imaging",
      description: "Improve productivity with reliable printing and imaging environments—optimized for uptime, cost control, and enterprise workflows.",
      benefits: [
        "Office and enterprise printing environments",
        "Workflow efficiency and document handling support",
        "Deployment planning and user readiness",
        "Maintenance and service continuity",
      ],
      imgSrc: "/image/section/service-2.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "audio-visual",
      tabTitle: "Audio & Visual Services",
      title: "Audio & Visual",
      description: "Create impactful meeting and communication spaces with professional audiovisual solutions for boardrooms, training rooms, and enterprise environments.",
      benefits: [
        "Meeting rooms & collaboration spaces",
        "Display, conferencing, and control system support",
        "Site assessment and implementation planning",
        "Training, configuration, and after-support",
      ],
      imgSrc: "/image/section/service-3.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "it-infrastructure-support-cloud",
      tabTitle: "IT Infrastructure, Support & Cloud",
      title: "IT Infrastructure, Support & Cloud",
      description: "Build resilient and scalable IT foundations with infrastructure planning, modernization, and cloud enablement—supported by structured delivery and support.",
      benefits: [
        "Infrastructure planning and modernization",
        "Cloud readiness and migration support",
        "Performance, monitoring, and continuity focus",
        "Ongoing technical support and optimization",
      ],
      imgSrc: "/image/section/service-4.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "information-cyber-security",
      tabTitle: "Information & Cyber Security",
      title: "Information & Cyber Security",
      description: "Protect data, systems, and users with security-first practices and cybersecurity solutions aligned to today's evolving threat landscape.",
      benefits: [
        "Security assessment and risk alignment",
        "Access control and protection measures",
        "Secure deployment practices and hardening",
        "Support for incident readiness and continuity",
      ],
      imgSrc: "/image/section/service-5.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
  ],
};

const solutionsDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "الحلول",
    title: "الحلول",
    subtitle: "",
    language: "rtl",
    isActive: true,
  },

  detailPage: {
    homeBreadcrumb: "الرئيسية",
    solutionsBreadcrumb: "الحلول",
    imagePath: "",
    isActive: true,
    contact: {
      tag: "اتصل بنا",
      title: "تواصل معنا",
      subtitle: "تواصل معنا اليوم لمناقشة كيف يمكننا\nدعم أهداف عملك.",
      addressTitle: "عنوان الشركة",
      address: "ص.ب 148 الصفاة 13002 - الكويت، قطعة 1، شارع 3، الشويخ الصناعية 1",
      directionLabel: "الاتجاهات",
      mapUrl: "https://maps.google.com/?q=Al+Bahar+and+Partners+Kuwait",
      phoneTitle: "اتصل بنا",
      phones: ["+965 184 8848", "+965 184 8848"],
      emailTitle: "راسلنا",
      emails: ["bpc.sales@albahargroup.com", "bpc.info@albahargroup.com"],
      ctaLabel: "اتصل بنا",
      ctaHref: "/ar/contact-us",
    },
  },

  solutions: [
    {
      id: "banking-payment-identity",
      tabTitle: "الخدمات المصرفية والمدفوعات والهوية",
      title: "حلول الخدمات المصرفية والمدفوعات والهوية",
      description: "تمكين تجارب عملاء آمنة ومعاملات موثوقة مع حلول مصممة للأداء والجاهزية للامتثال وقابلية التوسع.",
      benefits: [
        "تمكين المدفوعات وحلول المعاملات",
        "دعم التحقق من الهوية والمصادقة",
        "الوصول الآمن وجاهزية تسجيل العملاء",
        "دعم التكامل للأنظمة الحالية",
      ],
      imgSrc: "/image/section/service-1.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "printing-imaging",
      tabTitle: "خدمات الطباعة والتصوير",
      title: "الطباعة والتصوير",
      description: "تحسين الإنتاجية مع بيئات طباعة وتصوير موثوقة—محسّنة لوقت التشغيل والتحكم في التكاليف وسير عمل المؤسسات.",
      benefits: [
        "بيئات الطباعة المكتبية والمؤسسية",
        "كفاءة سير العمل ودعم معالجة المستندات",
        "تخطيط النشر وجاهزية المستخدمين",
        "الصيانة واستمرارية الخدمة",
      ],
      imgSrc: "/image/section/service-2.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "audio-visual",
      tabTitle: "خدمات الصوت والصورة",
      title: "الصوت والصورة",
      description: "إنشاء مساحات اجتماعات وتواصل مؤثرة مع حلول صوتية ومرئية احترافية لغرف الاجتماعات وقاعات التدريب والبيئات المؤسسية.",
      benefits: [
        "غرف الاجتماعات ومساحات التعاون",
        "دعم أنظمة العرض والمؤتمرات والتحكم",
        "تقييم الموقع وتخطيط التنفيذ",
        "التدريب والتكوين والدعم اللاحق",
      ],
      imgSrc: "/image/section/service-3.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "it-infrastructure-support-cloud",
      tabTitle: "البنية التحتية لتكنولوجيا المعلومات والدعم والسحابة",
      title: "البنية التحتية لتكنولوجيا المعلومات والدعم والسحابة",
      description: "بناء أسس تكنولوجيا معلومات مرنة وقابلة للتوسع مع تخطيط البنية التحتية والتحديث وتمكين السحابة—مدعومة بالتسليم المنظم والدعم.",
      benefits: [
        "تخطيط البنية التحتية والتحديث",
        "دعم جاهزية السحابة والهجرة",
        "التركيز على الأداء والمراقبة والاستمرارية",
        "الدعم الفني المستمر والتحسين",
      ],
      imgSrc: "/image/section/service-4.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
    {
      id: "information-cyber-security",
      tabTitle: "أمن المعلومات والأمن السيبراني",
      title: "أمن المعلومات والأمن السيبراني",
      description: "حماية البيانات والأنظمة والمستخدمين مع ممارسات الأمان أولاً وحلول الأمن السيبراني المتوافقة مع مشهد التهديدات المتطور اليوم.",
      benefits: [
        "تقييم الأمان ومحاذاة المخاطر",
        "تدابير التحكم في الوصول والحماية",
        "ممارسات النشر الآمن والتأمين",
        "الدعم لجاهزية الحوادث والاستمرارية",
      ],
      imgSrc: "/image/section/service-5.jpg",
      imgWidth: 960,
      imgHeight: 720,
      isActive: true,
    },
  ],
};

async function seedSolutionsData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Solutions data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Solutions content...');
    const ltrResult = await collection.insertOne({
      ...solutionsDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Solutions content...');
    const rtlResult = await collection.insertOne({
      ...solutionsDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Solutions data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${solutionsDataLTR.solutions.length} solutions`);
    console.log(`   - RTL (Arabic): ${solutionsDataRTL.solutions.length} solutions`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/solutions to manage content');
    console.log('🌐 Visit http://localhost:3000/solutions to view the page');

  } catch (error) {
    console.error('❌ Error seeding Solutions data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedSolutionsData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedSolutionsData };
