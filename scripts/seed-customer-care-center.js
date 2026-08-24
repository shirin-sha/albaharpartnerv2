const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "albaharpartners1";
const COLLECTION_NAME = "customer-care-center";

const DIRECTIONS_URL = "https://maps.app.goo.gl/A1NYpV7HUB2gmMGW6";
const MAP_EMBED =
  "https://maps.google.com/maps?q=BPC+Customer+Care+Center+Shuwaikh+Kuwait&z=15&output=embed";

const ltr = {
  language: "ltr",
  isActive: true,
  seo: {
    title: "Customer Care Center - Al Bahar & Partners",
    description:
      "Al-Bahar Customer Care Center provides dedicated support for BPC solutions: fast, reliable, and always by your side.",
    keywords: [
      "Customer Care",
      "Technical Support",
      "BPC",
      "Al Bahar",
      "Kuwait",
      "Service Center",
    ],
  },
  header: {
    breadcrumb: "Customer Care Center",
    tag: "CUSTOMER CARE & TECHNICAL SUPPORT",
    title: "Al-Bahar Customer Care Center",
    subtitle:
      "Dedicated support for your BPC solutions: fast, reliable and always by your side.",
    imagePath: "/image/section/ccc-hero.jpg",
    isActive: true,
  },
  infoBar: {
    isActive: true,
    items: [
      {
        label: "Call Us",
        value: "+965 184 8848",
        iconClass: "icon-PhoneCall",
      },
      {
        label: "Email Support",
        value: "bpc.info@albahargroup.com",
        iconClass: "icon-Envelope",
      },
      {
        label: "Working Hours",
        value: "Sun–Thu: 8:00 AM–5:00 PM · Sat: 9:00 AM–1:00 PM · Fri: Closed",
        iconClass: "icon-timer",
      },
      {
        label: "Service Center Location",
        value: "BPC Customer Care Center, Shuwaikh, Kuwait",
        iconClass: "icon-MapPin",
      },
    ],
  },
  overviewSection: {
    tag: "OVERVIEW",
    heading: "We keep your business moving forward.",
    description:
      "The BPC Customer Care Center is your single point of contact for service and support. Our teams focus on performance, reliability, and clear follow-through—so your operations stay on track.",
    imagePath: "/image/section/ccc-hero.jpg",
    isActive: true,
  },
  servicesSection: {
    tag: "SUPPORT SERVICES",
    heading: "Comprehensive support for every need.",
    isActive: true,
    services: [
      {
        title: "Customer Care",
        description:
          "A central point for all service requests and general inquiries.",
        iconClass: "icon-PhoneCall",
        order: 0,
        isActive: true,
      },
      {
        title: "Technical Support",
        description:
          "Expert assistance for technical issues and troubleshooting.",
        iconClass: "icon-Wrench",
        order: 1,
        isActive: true,
      },
      {
        title: "Installation & Commissioning",
        description:
          "Professional installation and smooth commissioning of solutions.",
        iconClass: "icon-advanced",
        order: 2,
        isActive: true,
      },
      {
        title: "Corrective Maintenance",
        description:
          "Rapid response and repair to restore normal operation.",
        iconClass: "icon-Lightning",
        order: 3,
        isActive: true,
      },
      {
        title: "Preventive Maintenance",
        description:
          "Planned maintenance to improve reliability and extend equipment life.",
        iconClass: "icon-calendarBlank",
        order: 4,
        isActive: true,
      },
      {
        title: "Service Coordination",
        description:
          "End-to-end coordination and follow-up until resolution.",
        iconClass: "icon-user",
        order: 5,
        isActive: true,
      },
    ],
  },
  processSection: {
    tag: "HOW SUPPORT WORKS",
    heading: "Our support journey in five simple steps.",
    isActive: true,
    steps: [
      {
        title: "Request Received",
        description:
          "We receive your request via phone, email, or online form.",
        iconClass: "icon-Envelope",
        order: 0,
        isActive: true,
      },
      {
        title: "Initial Assessment",
        description:
          "We review and prioritize the issue based on impact and urgency.",
        iconClass: "icon-MagnifyingGlass",
        order: 1,
        isActive: true,
      },
      {
        title: "Technical Assignment",
        description:
          "The right expert is assigned and all required resources are prepared.",
        iconClass: "icon-user",
        order: 2,
        isActive: true,
      },
      {
        title: "Service Delivery",
        description:
          "Support is delivered remotely or on-site to resolve the issue.",
        iconClass: "icon-shipping",
        order: 3,
        isActive: true,
      },
      {
        title: "Resolution & Follow-up",
        description:
          "We confirm resolution, document the case, and ensure your satisfaction.",
        iconClass: "icon-CheckCircle",
        order: 4,
        isActive: true,
      },
    ],
  },
  whySection: {
    tag: "WHY BPC CUSTOMER CARE",
    heading: "Committed to your success.",
    imagePath: "/image/section/ccc-hero.jpg",
    isActive: true,
    benefits: [
      { text: "Skilled and certified support professionals" },
      { text: "Fast response and clear communication" },
      { text: "Remote and on-site support options" },
      { text: "Proactive maintenance to reduce downtime" },
      { text: "Solutions tailored to your business needs" },
      { text: "Complete follow-up until full resolution" },
    ],
  },
  visitSection: {
    tag: "VISIT OR CONTACT THE SERVICE CENTER",
    locationLabel: "Location",
    locationValue: "BPC Customer Care Center, Shuwaikh, Kuwait",
    hoursLabel: "Working Hours",
    hoursValue: "Sun–Thu: 8:00 AM–5:00 PM · Sat: 9:00 AM–1:00 PM · Fri: Closed",
    callLabel: "Call Us",
    callValue: "+965 184 8848",
    emailLabel: "Email Support",
    emailValue: "bpc.info@albahargroup.com",
    directionsText: "Get Directions",
    directionsUrl: DIRECTIONS_URL,
    mapEmbedUrl: MAP_EMBED,
    isActive: true,
  },
  ctaSection: {
    heading: "We're here to help.",
    subheading: "Reach out today and let our team take care of the rest.",
    primaryButtonText: "Request Support",
    primaryButtonLink: "/contact-us",
    secondaryButtonText: "Talk to Customer Care",
    secondaryButtonLink: "tel:+9651848848",
    isActive: true,
  },
};

const rtl = {
  language: "rtl",
  isActive: true,
  seo: {
    title: "مركز خدمة العملاء - البحر والشركاء",
    description:
      "يوفر مركز خدمة العملاء لدى البحر دعماً مخصصاً لحلول BPC: سريع وموثوق ودائماً بجانبك.",
    keywords: [
      "مركز خدمة العملاء",
      "الدعم الفني",
      "البحر والشركاء",
      "الكويت",
    ],
  },
  header: {
    breadcrumb: "مركز خدمة العملاء",
    tag: "خدمة العملاء والدعم الفني",
    title: "مركز خدمة العملاء لدى البحر",
    subtitle:
      "دعم مخصص لحلول BPC الخاصة بك: سريع وموثوق ودائماً بجانبك.",
    imagePath: "/image/section/ccc-hero.jpg",
    isActive: true,
  },
  infoBar: {
    isActive: true,
    items: [
      {
        label: "اتصل بنا",
        value: "+965 184 8848",
        iconClass: "icon-PhoneCall",
      },
      {
        label: "البريد الإلكتروني",
        value: "bpc.info@albahargroup.com",
        iconClass: "icon-Envelope",
      },
      {
        label: "ساعات العمل",
        value: "الأحد–الخميس: 8:00 ص–5:00 م · السبت: 9:00 ص–1:00 م · الجمعة: مغلق",
        iconClass: "icon-timer",
      },
      {
        label: "موقع مركز الخدمة",
        value: "مركز خدمة عملاء BPC، الشويخ، الكويت",
        iconClass: "icon-MapPin",
      },
    ],
  },
  overviewSection: {
    tag: "نظرة عامة",
    heading: "نبقي أعمالك في حركة مستمرة.",
    description:
      "مركز خدمة عملاء BPC هو نقطة الاتصال الموحدة للخدمة والدعم. تركز فرقنا على الأداء والموثوقية والمتابعة الواضحة—حتى تبقى عملياتك على المسار الصحيح.",
    imagePath: "/image/section/ccc-hero.jpg",
    isActive: true,
  },
  servicesSection: {
    tag: "خدمات الدعم",
    heading: "دعم شامل لكل احتياج.",
    isActive: true,
    services: [
      {
        title: "خدمة العملاء",
        description: "نقطة مركزية لجميع طلبات الخدمة والاستفسارات العامة.",
        iconClass: "icon-PhoneCall",
        order: 0,
        isActive: true,
      },
      {
        title: "الدعم الفني",
        description: "مساعدة متخصصة للمشكلات الفنية واستكشاف الأخطاء وإصلاحها.",
        iconClass: "icon-Wrench",
        order: 1,
        isActive: true,
      },
      {
        title: "التركيب والتشغيل",
        description: "تركيب احترافي وتشغيل سلس للحلول.",
        iconClass: "icon-advanced",
        order: 2,
        isActive: true,
      },
      {
        title: "الصيانة التصحيحية",
        description: "استجابة سريعة وإصلاح لاستعادة التشغيل الطبيعي.",
        iconClass: "icon-Lightning",
        order: 3,
        isActive: true,
      },
      {
        title: "الصيانة الوقائية",
        description: "صيانة مخططة لتحسين الموثوقية وإطالة عمر المعدات.",
        iconClass: "icon-calendarBlank",
        order: 4,
        isActive: true,
      },
      {
        title: "تنسيق الخدمة",
        description: "تنسيق ومتابعة من البداية حتى الحل النهائي.",
        iconClass: "icon-user",
        order: 5,
        isActive: true,
      },
    ],
  },
  processSection: {
    tag: "كيف يعمل الدعم",
    heading: "رحلة الدعم في خمس خطوات بسيطة.",
    isActive: true,
    steps: [
      {
        title: "استلام الطلب",
        description: "نستلم طلبك عبر الهاتف أو البريد الإلكتروني أو النموذج عبر الإنترنت.",
        iconClass: "icon-Envelope",
        order: 0,
        isActive: true,
      },
      {
        title: "التقييم الأولي",
        description: "نراجع المشكلة ونحدد أولويتها حسب الأثر والإلحاح.",
        iconClass: "icon-MagnifyingGlass",
        order: 1,
        isActive: true,
      },
      {
        title: "تعيين الفني",
        description: "يُعيَّن الخبير المناسب وتُجهَّز جميع الموارد المطلوبة.",
        iconClass: "icon-user",
        order: 2,
        isActive: true,
      },
      {
        title: "تنفيذ الخدمة",
        description: "يُقدَّم الدعم عن بُعد أو في الموقع لحل المشكلة.",
        iconClass: "icon-shipping",
        order: 3,
        isActive: true,
      },
      {
        title: "الحل والمتابعة",
        description: "نؤكد الحل، ونوثّق الحالة، ونضمن رضاكم.",
        iconClass: "icon-CheckCircle",
        order: 4,
        isActive: true,
      },
    ],
  },
  whySection: {
    tag: "لماذا مركز خدمة عملاء BPC",
    heading: "ملتزمون بنجاحكم.",
    imagePath: "/image/section/ccc-hero.jpg",
    isActive: true,
    benefits: [
      { text: "محترفون دعم مهرة ومعتمدون" },
      { text: "استجابة سريعة وتواصل واضح" },
      { text: "خيارات دعم عن بُعد وفي الموقع" },
      { text: "صيانة استباقية لتقليل التوقف" },
      { text: "حلول مخصّصة لاحتياجات عملكم" },
      { text: "متابعة كاملة حتى الحل النهائي" },
    ],
  },
  visitSection: {
    tag: "زيارة أو التواصل مع مركز الخدمة",
    locationLabel: "الموقع",
    locationValue: "مركز خدمة عملاء BPC، الشويخ، الكويت",
    hoursLabel: "ساعات العمل",
    hoursValue: "الأحد–الخميس: 8:00 ص–5:00 م · السبت: 9:00 ص–1:00 م · الجمعة: مغلق",
    callLabel: "اتصل بنا",
    callValue: "+965 184 8848",
    emailLabel: "البريد الإلكتروني",
    emailValue: "bpc.info@albahargroup.com",
    directionsText: "الحصول على الاتجاهات",
    directionsUrl: DIRECTIONS_URL,
    mapEmbedUrl: MAP_EMBED,
    isActive: true,
  },
  ctaSection: {
    heading: "نحن هنا للمساعدة.",
    subheading: "تواصل اليوم ودع فريقنا يتولى الباقي.",
    primaryButtonText: "طلب الدعم",
    primaryButtonLink: "/contact-us",
    secondaryButtonText: "التحدث مع خدمة العملاء",
    secondaryButtonLink: "tel:+9651848848",
    isActive: true,
  },
};

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const col = client.db(DB_NAME).collection(COLLECTION_NAME);
    await col.deleteMany({});
    await col.insertMany([
      { ...ltr, createdAt: new Date(), updatedAt: new Date() },
      { ...rtl, createdAt: new Date(), updatedAt: new Date() },
    ]);
    console.log("✅ Customer Care Center content seeded (ltr + rtl)");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
