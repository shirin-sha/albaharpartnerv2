const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'customerstories';

const customerStoriesDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "Customer Stories",
    title: "Customer Stories",
    subtitle: "See how Al Bahar & Partners helps organizations strengthen security, improve visibility, and modernize IT through proven technology deployments.",
    language: "ltr",
    isActive: true,
  },

  tag: "CUSTOMER STORIES",
  heading: "Success Stories",
  subheading: "Real-world deployments showcasing how partner technologies deliver measurable business value.",

  stories: [
    {
      title: "CrowdStrike – Endpoint Protection Rollout",
      description: "Supported customers with a structured cybersecurity rollout approach, improving endpoint visibility and strengthening operational readiness through partner-aligned implementation and support.",
      imagePath: "/image/case-studies-item/case-studies-9.jpg",
      link: "#",
      order: 0,
      isActive: true,
    },
    {
      title: "Entrust – Identity & Authentication",
      description: "Helped enable identity and authentication initiatives with a focus on secure access, user onboarding readiness, and integration planning for enterprise environments.",
      imagePath: "/image/case-studies-item/case-studies-10.jpg",
      link: "#",
      order: 1,
      isActive: true,
    },
    {
      title: "Axonius – Asset Visibility & Control",
      description: "Assisted organizations in improving asset inventory clarity and control by aligning stakeholder requirements, integration needs, and deployment best practices.",
      imagePath: "/image/case-studies-item/case-studies-11.jpg",
      link: "#",
      order: 2,
      isActive: true,
    },
    {
      title: "Pure Storage – Modern Storage",
      description: "Supported modernization initiatives to enhance data storage reliability and scalability, with implementation guidance and ongoing support for stable operations.",
      imagePath: "/image/case-studies-item/case-studies-12.jpg",
      link: "#",
      order: 3,
      isActive: true,
    },
    {
      title: "Fortinet – Network Security",
      description: "Enabled comprehensive network security deployments with firewall, VPN, and threat protection solutions, ensuring robust protection for enterprise networks.",
      imagePath: "/image/case-studies-item/case-studies-9.jpg",
      link: "#",
      order: 4,
      isActive: true,
    },
    {
      title: "Hikvision – Video Surveillance",
      description: "Implemented advanced video surveillance systems for enhanced security monitoring, providing comprehensive coverage and intelligent analytics capabilities.",
      imagePath: "/image/case-studies-item/case-studies-10.jpg",
      link: "#",
      order: 5,
      isActive: true,
    },
    {
      title: "Logitech – Collaboration Solutions",
      description: "Deployed professional audio-visual solutions for meeting rooms and collaboration spaces, enhancing communication and productivity across organizations.",
      imagePath: "/image/case-studies-item/case-studies-11.jpg",
      link: "#",
      order: 6,
      isActive: true,
    },
    {
      title: "ViewSonic – Display Solutions",
      description: "Integrated high-quality display solutions for presentations and digital signage, improving visual communication and engagement in various environments.",
      imagePath: "/image/case-studies-item/case-studies-12.jpg",
      link: "#",
      order: 7,
      isActive: true,
    },
  ],
};

const customerStoriesDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "قصص العملاء",
    title: "قصص العملاء",
    subtitle: "شاهد كيف تساعد البحر والشركاء المؤسسات على تعزيز الأمان وتحسين الرؤية وتحديث تكنولوجيا المعلومات من خلال عمليات نشر تقنية مثبتة.",
    language: "rtl",
    isActive: true,
  },

  tag: "قصص العملاء",
  heading: "قصص النجاح",
  subheading: "عمليات نشر واقعية توضح كيف تقدم تقنيات الشركاء قيمة تجارية قابلة للقياس.",

  stories: [
    {
      title: "CrowdStrike – طرح حماية نقطة النهاية",
      description: "دعم العملاء بنهج طرح أمني منظم، وتحسين رؤية نقطة النهاية وتعزيز الجاهزية التشغيلية من خلال التنفيذ والدعم المتوافق مع الشركاء.",
      imagePath: "/image/case-studies-item/case-studies-9.jpg",
      link: "#",
      order: 0,
      isActive: true,
    },
    {
      title: "Entrust – الهوية والمصادقة",
      description: "ساعد في تمكين مبادرات الهوية والمصادقة مع التركيز على الوصول الآمن وجاهزية تسجيل المستخدمين وتخطيط التكامل للبيئات المؤسسية.",
      imagePath: "/image/case-studies-item/case-studies-10.jpg",
      link: "#",
      order: 1,
      isActive: true,
    },
    {
      title: "Axonius – الرؤية والتحكم في الأصول",
      description: "ساعد المؤسسات في تحسين وضوح ومراقبة مخزون الأصول من خلال محاذاة متطلبات أصحاب المصلحة واحتياجات التكامل وأفضل ممارسات النشر.",
      imagePath: "/image/case-studies-item/case-studies-11.jpg",
      link: "#",
      order: 2,
      isActive: true,
    },
    {
      title: "Pure Storage – التخزين الحديث",
      description: "دعم مبادرات التحديث لتعزيز موثوقية وقابلية التوسع في تخزين البيانات، مع إرشادات التنفيذ والدعم المستمر للعمليات المستقرة.",
      imagePath: "/image/case-studies-item/case-studies-12.jpg",
      link: "#",
      order: 3,
      isActive: true,
    },
  ],
};

async function seedCustomerStoriesData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Customer Stories data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Customer Stories content...');
    const ltrResult = await collection.insertOne({
      ...customerStoriesDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Customer Stories content...');
    const rtlResult = await collection.insertOne({
      ...customerStoriesDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Customer Stories data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${customerStoriesDataLTR.stories.length} stories`);
    console.log(`   - RTL (Arabic): ${customerStoriesDataRTL.stories.length} stories`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/customer-stories to manage content');
    console.log('🌐 Visit http://localhost:3000/customer-stories to view the page');

  } catch (error) {
    console.error('❌ Error seeding Customer Stories data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedCustomerStoriesData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedCustomerStoriesData };
