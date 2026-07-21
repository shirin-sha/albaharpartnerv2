const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'careers';

const careersDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "Careers",
    title: "Careers",
    subtitle: "Join our team of industry experts and make a meaningful impact. Discover opportunities to grow your career with us in a dynamic & rewarding environment.",
    language: "ltr",
    isActive: true,
  },

  tag: "CAREER OPPORTUNITIES",
  heading: "Explore Career Opportunities",
  subheading: "We're expanding our team and looking for talented individuals like you! Join us and contribute to a dynamic, growth-focused environment.",

  jobs: [
    {
      title: "Business Development Manager",
      description: "Drive growth by developing new business opportunities and building client relationships. Collaborate on strategies to meet revenue goals and expand our market presence.",
      responsibilities: [
        "Expand client portfolio through new business opportunities.",
        "Build and sustain strong client relationships.",
        "Collaborate on strategies to achieve revenue goals.",
      ],
      salary: {
        amount: "$10 - $15",
        period: "/Month",
      },
      applyLink: "#",
      order: 0,
      isActive: true,
    },
    {
      title: "Risk Management Consultant",
      description: "Assess and mitigate business risks while developing comprehensive risk management strategies. Work with clients to identify potential threats and implement effective risk controls.",
      responsibilities: [
        "Assess and analyze business risks across various sectors.",
        "Develop comprehensive risk management strategies.",
        "Implement effective risk controls and monitoring systems.",
      ],
      salary: {
        amount: "$12 - $18",
        period: "/Month",
      },
      applyLink: "#",
      order: 1,
      isActive: true,
    },
    {
      title: "Client Relationship Specialist",
      description: "Foster strong relationships with clients by understanding their needs and providing exceptional service. Act as the primary point of contact and ensure client satisfaction.",
      responsibilities: [
        "Build and maintain strong client relationships.",
        "Understand client needs and provide tailored solutions.",
        "Ensure high levels of client satisfaction and retention.",
      ],
      salary: {
        amount: "$8 - $12",
        period: "/Month",
      },
      applyLink: "#",
      order: 2,
      isActive: true,
    },
    {
      title: "Operations & Compliance Manager",
      description: "Oversee daily operations and ensure compliance with industry regulations. Develop operational procedures and maintain high standards of quality and efficiency.",
      responsibilities: [
        "Oversee daily operations and workflow management.",
        "Ensure compliance with industry regulations and standards.",
        "Develop and implement operational procedures.",
      ],
      salary: {
        amount: "$15 - $20",
        period: "/Month",
      },
      applyLink: "#",
      order: 3,
      isActive: true,
    },
    {
      title: "IT Solutions Architect",
      description: "Design and implement technology solutions that align with business objectives. Work with cross-functional teams to deliver innovative IT solutions.",
      responsibilities: [
        "Design and architect technology solutions.",
        "Collaborate with cross-functional teams.",
        "Ensure solutions align with business objectives.",
      ],
      salary: {
        amount: "$18 - $25",
        period: "/Month",
      },
      applyLink: "#",
      order: 4,
      isActive: true,
    },
    {
      title: "Cybersecurity Specialist",
      description: "Protect organizational assets by implementing security measures and monitoring threats. Develop security policies and respond to security incidents.",
      responsibilities: [
        "Implement and maintain security measures.",
        "Monitor and respond to security threats.",
        "Develop and enforce security policies.",
      ],
      salary: {
        amount: "$16 - $22",
        period: "/Month",
      },
      applyLink: "#",
      order: 5,
      isActive: true,
    },
  ],
};

const careersDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "الوظائف",
    title: "الوظائف",
    subtitle: "انضم إلى فريقنا من خبراء الصناعة واصنع تأثيراً ذا معنى. اكتشف الفرص لنمو مسيرتك المهنية معنا في بيئة ديناميكية ومجزية.",
    language: "rtl",
    isActive: true,
  },

  tag: "فرص العمل",
  heading: "استكشف فرص العمل",
  subheading: "نحن نوسع فريقنا ونبحث عن أفراد موهوبين مثلك! انضم إلينا وساهم في بيئة ديناميكية تركز على النمو.",

  jobs: [
    {
      title: "مدير تطوير الأعمال",
      description: "دفع النمو من خلال تطوير فرص عمل جديدة وبناء علاقات مع العملاء. التعاون في استراتيجيات لتحقيق أهداف الإيرادات وتوسيع وجودنا في السوق.",
      responsibilities: [
        "توسيع محفظة العملاء من خلال فرص عمل جديدة.",
        "بناء والحفاظ على علاقات عملاء قوية.",
        "التعاون في استراتيجيات لتحقيق أهداف الإيرادات.",
      ],
      salary: {
        amount: "$10 - $15",
        period: "/شهر",
      },
      applyLink: "#",
      order: 0,
      isActive: true,
    },
    {
      title: "استشاري إدارة المخاطر",
      description: "تقييم وتخفيف المخاطر التجارية مع تطوير استراتيجيات شاملة لإدارة المخاطر. العمل مع العملاء لتحديد التهديدات المحتملة وتنفيذ ضوابط فعالة للمخاطر.",
      responsibilities: [
        "تقييم وتحليل المخاطر التجارية عبر مختلف القطاعات.",
        "تطوير استراتيجيات شاملة لإدارة المخاطر.",
        "تنفيذ أنظمة مراقبة وضوابط فعالة للمخاطر.",
      ],
      salary: {
        amount: "$12 - $18",
        period: "/شهر",
      },
      applyLink: "#",
      order: 1,
      isActive: true,
    },
    {
      title: "أخصائي علاقات العملاء",
      description: "تعزيز العلاقات القوية مع العملاء من خلال فهم احتياجاتهم وتقديم خدمة استثنائية. العمل كنقطة اتصال أساسية وضمان رضا العملاء.",
      responsibilities: [
        "بناء والحفاظ على علاقات عملاء قوية.",
        "فهم احتياجات العملاء وتقديم حلول مخصصة.",
        "ضمان مستويات عالية من رضا العملاء والاحتفاظ بهم.",
      ],
      salary: {
        amount: "$8 - $12",
        period: "/شهر",
      },
      applyLink: "#",
      order: 2,
      isActive: true,
    },
  ],
};

async function seedCareersData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Careers data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Careers content...');
    const ltrResult = await collection.insertOne({
      ...careersDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Careers content...');
    const rtlResult = await collection.insertOne({
      ...careersDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Careers data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${careersDataLTR.jobs.length} jobs`);
    console.log(`   - RTL (Arabic): ${careersDataRTL.jobs.length} jobs`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/careers to manage content');
    console.log('🌐 Visit http://localhost:3000/career to view the page');

  } catch (error) {
    console.error('❌ Error seeding Careers data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedCareersData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedCareersData };
