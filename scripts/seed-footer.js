const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'footer';

const footerDataLTR = {
  language: "ltr",
  isActive: true,

  logo: {
    imagePath: "/image/logo/logo-footer.png",
    alt: "Al Bahar & Partners",
    width: 169,
    height: 41,
    link: "#",
  },

  description: "Welcome to Al Bahar & Partners (BPC). We deliver partner-led technology solutions across banking, identity, infrastructure, and cybersecurity, supported by reliable implementation and long-term support.",

  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/albahar-partners",
      icon: "linkedin",
      order: 0,
      isActive: true,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/albaharpartners",
      icon: "icon-ig1",
      order: 1,
      isActive: true,
    },
    {
      name: "Twitter/X",
      url: "https://twitter.com/albaharpartners",
      icon: "icon-x",
      order: 2,
      isActive: true,
    },
    {
      name: "Facebook",
      url: "https://facebook.com/albaharpartners",
      icon: "facebook",
      order: 3,
      isActive: true,
    },
  ],

  newsletter: {
    title: "Subscribe for Updates & Insights",
    description: "Get occasional updates on solutions, case studies, and company news. No spam.",
    placeholder: "Enter your email address",
    isActive: true,
  },

  quickLinks: [
    {
      title: "Quick Links",
      links: [
        { title: "About Us", href: "/about-us", order: 0, isActive: true },
        { title: "Solutions", href: "/solutions", order: 1, isActive: true },
        { title: "Case Studies", href: "/customer-stories", order: 2, isActive: true },
        { title: "Our Partners", href: "/brands", order: 3, isActive: true },
        { title: "News & Insights", href: "/news-updates", order: 4, isActive: true },
        { title: "Careers", href: "/career", order: 5, isActive: true },
      ],
      order: 0,
      isActive: true,
    },
  ],

  serviceAssistance: {
    title: "Service & Assistance",
    items: [
      {
        label: "Service",
        value: "+965 XXXXXX",
        type: "phone",
        order: 0,
        isActive: true,
      },
      {
        label: "Complaints",
        value: "+965 XXXXX",
        type: "phone",
        order: 1,
        isActive: true,
      },
      {
        label: "Help Mail",
        value: "support@albahargroup.com",
        type: "email",
        order: 2,
        isActive: true,
      },
    ],
    isActive: true,
  },

  contactSection: {
    title: "Contact Us",
    items: [
      {
        label: "",
        value: "Kuwait City, Kuwait",
        type: "address",
        order: 0,
        isActive: true,
      },
      {
        label: "Phone",
        value: "+965 XXXXXXXX",
        type: "phone",
        order: 1,
        isActive: true,
      },
      {
        label: "Email",
        value: "info@albahargroup.com",
        type: "email",
        order: 2,
        isActive: true,
      },
    ],
    order: 0,
    isActive: true,
  },

  footerBottom: {
    copyright: "© 2025 Al Bahar & Partners. All Rights Reserved.",
    links: [
      { title: "Contact Us", href: "/contact-us", order: 0, isActive: true },
      { title: "Support", href: "/support", order: 1, isActive: true },
    ],
  },

  backgroundImage: "/image/section/bg-footer-style-2.png",
};

const footerDataRTL = {
  language: "rtl",
  isActive: true,

  logo: {
    imagePath: "/image/logo/logo-footer.png",
    alt: "البحر والشركاء",
    width: 169,
    height: 41,
    link: "#",
  },

  description: "مرحباً بكم في البحر والشركاء (BPC). نقدم حلولاً تقنية مدعومة بالشراكة في مجالات الخدمات المصرفية والهوية والبنية التحتية والأمن السيبراني، مدعومة بتنفيذ موثوق ودعم طويل الأمد.",

  socialLinks: [
    {
      name: "لينكد إن",
      url: "https://linkedin.com/company/albahar-partners",
      icon: "linkedin",
      order: 0,
      isActive: true,
    },
    {
      name: "إنستغرام",
      url: "https://instagram.com/albaharpartners",
      icon: "icon-ig1",
      order: 1,
      isActive: true,
    },
    {
      name: "تويتر/إكس",
      url: "https://twitter.com/albaharpartners",
      icon: "icon-x",
      order: 2,
      isActive: true,
    },
  ],

  newsletter: {
    title: "اشترك للحصول على التحديثات والرؤى",
    description: "احصل على تحديثات دورية حول الحلول ودراسات الحالة وأخبار الشركة. لا بريد مزعج.",
    placeholder: "أدخل عنوان بريدك الإلكتروني",
    isActive: true,
  },

  quickLinks: [
    {
      title: "روابط سريعة",
      links: [
        { title: "من نحن", href: "/about-us", order: 0, isActive: true },
        { title: "الحلول", href: "/solutions", order: 1, isActive: true },
        { title: "دراسات الحالة", href: "/customer-stories", order: 2, isActive: true },
        { title: "شركاؤنا", href: "/brands", order: 3, isActive: true },
        { title: "الأخبار والرؤى", href: "/news-updates", order: 4, isActive: true },
        { title: "الوظائف", href: "/career", order: 5, isActive: true },
      ],
      order: 0,
      isActive: true,
    },
  ],

  serviceAssistance: {
    title: "الخدمة والمساعدة",
    items: [
      {
        label: "الخدمة",
        value: "+965 XXXXXX",
        type: "phone",
        order: 0,
        isActive: true,
      },
      {
        label: "الشكاوى",
        value: "+965 XXXXX",
        type: "phone",
        order: 1,
        isActive: true,
      },
      {
        label: "بريد المساعدة",
        value: "support@albahargroup.com",
        type: "email",
        order: 2,
        isActive: true,
      },
    ],
    isActive: true,
  },

  contactSection: {
    title: "اتصل بنا",
    items: [
      {
        label: "",
        value: "مدينة الكويت، الكويت",
        type: "address",
        order: 0,
        isActive: true,
      },
      {
        label: "الهاتف",
        value: "+965 XXXXXXXX",
        type: "phone",
        order: 1,
        isActive: true,
      },
      {
        label: "البريد الإلكتروني",
        value: "info@albahargroup.com",
        type: "email",
        order: 2,
        isActive: true,
      },
    ],
    order: 0,
    isActive: true,
  },

  footerBottom: {
    copyright: "© 2025 البحر والشركاء. جميع الحقوق محفوظة.",
    links: [
      { title: "اتصل بنا", href: "/contact-us", order: 0, isActive: true },
      { title: "الدعم", href: "/support", order: 1, isActive: true },
    ],
  },

  backgroundImage: "/image/section/bg-footer-style-2.png",
};

async function seedFooterData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing Footer data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) Footer content...');
    const ltrResult = await collection.insertOne({
      ...footerDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) Footer content...');
    const rtlResult = await collection.insertOne({
      ...footerDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 Footer data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LTR (English): ${footerDataLTR.socialLinks.length} social links, ${footerDataLTR.quickLinks[0].links.length} quick links`);
    console.log(`   - RTL (Arabic): ${footerDataRTL.socialLinks.length} social links, ${footerDataRTL.quickLinks[0].links.length} quick links`);
    console.log('\n🚀 Visit http://localhost:3000/admin/cms/footer to manage content');

  } catch (error) {
    console.error('❌ Error seeding Footer data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedFooterData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedFooterData };
