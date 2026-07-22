const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

// SVG icons for process steps
const processIcons = {
  partnerships: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_9360_10043)"><path d="M6.30025 27.2812C5.51922 23.0656 6.26859 18.7096 8.41349 14.9972C10.5584 11.2849 13.9579 8.46011 18.0002 7.03125V20.5312L6.30025 27.2812Z" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M24 24.0787V6C27.1537 6.00047 30.2519 6.82949 32.9843 8.40405C35.7168 9.9786 37.9876 12.2434 39.5694 14.9717C41.1512 17.7 41.9884 20.796 41.9972 23.9496C42.0061 27.1033 41.1862 30.2039 39.6197 32.941C38.0532 35.6781 35.7951 37.9556 33.0715 39.5454C30.3479 41.1352 27.2544 41.9816 24.1008 41.9997C20.9472 42.0178 17.8442 41.2071 15.1025 39.6487C12.3608 38.0903 10.0766 35.8389 8.47876 33.12L24 24.0787Z" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_9360_10043"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>`,
  delivery: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_9360_10053)"><path d="M24 43.5V37.5M24 40.5C33.1127 40.5 40.5 33.1127 40.5 24C40.5 14.8873 33.1127 7.5 24 7.5C14.8873 7.5 7.5 14.8873 7.5 24C7.5 33.1127 14.8873 40.5 24 40.5ZM24 4.5V10.5M4.5 24H10.5M43.5 24H37.5M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_9360_10053"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>`,
  security: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_9360_10067)"><path d="M42 39H6V9M37.5 13.5L24 27L18 21L6 33M37.5 21V13.5H30" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_9360_10067"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>`,
  support: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_9360_10078)"><path d="M40.5 21V10.5C40.5 10.1022 40.342 9.72064 40.0607 9.43934C39.7794 9.15804 39.3978 9 39 9H9C8.60218 9 8.22064 9.15804 7.93934 9.43934C7.65804 9.72064 7.5 10.1022 7.5 10.5V21C7.5 39 24 43.5 24 43.5C24 43.5 40.5 39 40.5 21Z" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 25.5L21 30L31.5 19.5" stroke="#24283E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_9360_10078"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>`
};

const defaultLTRContent = {
  heroSlides: [
    {
      title: "Strategic Technology\nPartnerships That Deliver",
      subtitle: "We help organizations plan, deploy, and support trusted solutions, built for performance, security, and long-term value.",
      buttonText: "Explore Our Solutions",
      buttonLink: "/solutions",
      image: "/image/hero/hero-1.jpg",
      order: 0,
      language: "ltr",
      isActive: true,
    },
    {
      title: "Secure Digital\nBanking & Payments",
      subtitle: "From payment technologies to identity and security, we enable safer transactions and smarter customer experiences.",
      buttonText: "View Banking Solutions",
      buttonLink: "/solutions",
      image: "/image/hero/hero-2.jpg",
      order: 1,
      language: "ltr",
      isActive: true,
    },
    {
      title: "IT & Cybersecurity\nMade Business-Ready",
      subtitle: "Reliable infrastructure, strong security, and responsive support, so your teams can operate with confidence.",
      buttonText: "Talk to Our Team",
      buttonLink: "/contact-us",
      image: "/image/hero/hero-3.jpg",
      order: 2,
      language: "ltr",
      isActive: true,
    },
  ],
  
  aboutSection: {
    tag: "ABOUT AL BAHAR & PARTNERS",
    heading: "Empowering Business Through <br/> Trusted Partnerships",
    description: "Al Bahar & Partners delivers reliable, partner-backed technology solutions <br/>for organizations across Kuwait. We combine deep domain understanding <br/>with proven delivery, helping clients implement solutions with confidence,<br/> efficiency, and long-term support.",
    buttonText: "Schedule a Consultation",
    buttonLink: "/contact-us",
    phoneLabel: "Or Call Us:",
    phoneNumber: "+965 XXX XXXX",
    language: "ltr",
    isActive: true,
  },

  processSection: {
    tag: "OUR ADVANTAGE",
    heading: "Partnership That Delivers Results",
    subheading: "A structured approach, strong partnerships, and reliable support—built to keep your business moving.",
    buttonText: "Schedule A Consultation",
    buttonLink: "/contact-us",
    steps: [
      {
        title: "Trusted Partnerships",
        description: "We work with leading global brands to deliver proven technologies with dependable implementation standards.",
        icon: processIcons.partnerships,
        order: 0,
        language: "ltr",
        isActive: true,
      },
      {
        title: "End-to-End Delivery",
        description: "From requirements and planning to rollout and handover, we manage projects with clear accountability and ownership.",
        icon: processIcons.delivery,
        order: 1,
        language: "ltr",
        isActive: true,
      },
      {
        title: "Security-First Approach",
        description: "Every deployment is aligned to security best practices, access control, and compliance-ready processes.",
        icon: processIcons.security,
        order: 2,
        language: "ltr",
        isActive: true,
      },
      {
        title: "Long-Term Support",
        description: "Responsive support and maintenance to ensure stable performance, uptime, and continuous improvement.",
        icon: processIcons.support,
        order: 3,
        language: "ltr",
        isActive: true,
      },
    ],
    language: "ltr",
    isActive: true,
  },

  servicesSection: {
    tag: "OUR SOLUTIONS",
    heading: "Custom Strategies for Your Goals",
    subheading: "Delivering partner-led solutions tailored to your business goals and growth.",
    services: [
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
        order: 0,
        language: "ltr",
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
        order: 1,
        language: "ltr",
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
        order: 2,
        language: "ltr",
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
        order: 3,
        language: "ltr",
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
        order: 4,
        language: "ltr",
        isActive: true,
      },
    ],
    language: "ltr",
    isActive: true,
  },

  testimonialSection: {
    tag: "Who We Are",
    heading: "Al-Bahar and Partners (BPC)",
    description: "Al-Bahar and Partners (BPC) is a Kuwait-based business solutions provider focused on delivering trusted technologies through strong global partnerships. We support organizations with structured planning, professional deployment, and dependable after-sales service—helping clients improve performance, strengthen reliability, and move forward with confidence.",
    imagePath: "/image/section/Al-Bahar-founder.jpg",
    personName: "Mohamed Abdulrahman Al-Bahar",
    personTitle: "Founder and CEO of Al-Bahar and Partners",
    buttonText: "Learn More",
    buttonLink: "/about-us",
    language: "ltr",
    isActive: true,
  },

  brandsSection: {
    heading: "Trusted by partners and supported by leading technologies worldwide.",
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
    language: "ltr",
    isActive: true,
  },

  caseStudiesSection: {
    tag: "CUSTOMER STORIES",
    heading: "Success Stories",
    subheading: "Real-world deployments showcasing how partner technologies deliver measurable business value.",
    caseStudies: [
      {
        title: "CrowdStrike – Endpoint Protection Rollout",
        description: "Supported customers with a structured cybersecurity rollout approach, improving endpoint visibility and strengthening operational readiness through partner-aligned implementation and support.",
        imagePath: "/image/case-studies-item/case-studies-9.jpg",
        link: "#",
        order: 0,
        language: "ltr",
        isActive: true,
      },
      {
        title: "Entrust – Identity & Authentication",
        description: "Helped enable identity and authentication initiatives with a focus on secure access, user onboarding readiness, and integration planning for enterprise environments.",
        imagePath: "/image/case-studies-item/case-studies-10.jpg",
        link: "#",
        order: 1,
        language: "ltr",
        isActive: true,
      },
      {
        title: "Axonius – Asset Visibility & Control",
        description: "Assisted organizations in improving asset inventory clarity and control by aligning stakeholder requirements, integration needs, and deployment best practices.",
        imagePath: "/image/case-studies-item/case-studies-11.jpg",
        link: "#",
        order: 2,
        language: "ltr",
        isActive: true,
      },
      {
        title: "Pure Storage – Modern Storage",
        description: "Supported modernization initiatives to enhance data storage reliability and scalability, with implementation guidance and ongoing support for stable operations.",
        imagePath: "/image/case-studies-item/case-studies-12.jpg",
        link: "#",
        order: 3,
        language: "ltr",
        isActive: true,
      },
    ],
    language: "ltr",
    isActive: true,
  },

  featuresSection: {
    tag: "WHY AL BAHAR & PARTNERS",
    heading: "Why Choose Us for Digital Transformation?",
    description: "We combine trusted technology partnerships with practical delivery capabilities—helping organizations implement solutions that are secure, scalable, and built to last.",
    imagePath: "/image/section/img-section-why-choose-h7.jpg",
    buttonText: "Request a Consultation",
    buttonLink: "/contact-us",
    counters: [
      { value: 15, label: "Years<br />Experiences", order: 0, isActive: true },
      { value: 3600, label: "Happy<br />Customers", order: 1, isActive: true },
      { value: 900, label: "Project<br />Completed", order: 2, isActive: true },
      { value: 40, label: "Awards &amp;<br />Recognitions", order: 3, isActive: true },
    ],
    language: "ltr",
    isActive: true,
  },

  ctaSection: {
    tag: "Contact US",
    heading: "Get in Touch with Us",
    description: "Reach out today to discuss how we can support your business goals. Our team is ready to provide answers, offer solutions, and start your journey toward success.",
    buttonText: "Schedule A Consultation",
    buttonLink: "/contact-us",
    phoneLabel: "Have any Question?",
    phoneNumber: "1-555-678-8888",
    language: "ltr",
    isActive: true,
  },

  language: "ltr",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultRTLContent = {
  heroSlides: [
    {
      title: "شراكات تكنولوجية استراتيجية\nتحقق النتائج",
      subtitle: "نساعد المؤسسات على التخطيط والنشر والدعم للحلول الموثوقة، المبنية على الأداء والأمان والقيمة طويلة الأمد.",
      buttonText: "استكشف حلولنا",
      buttonLink: "/solutions",
      image: "/image/hero/hero-1.jpg",
      order: 0,
      language: "rtl",
      isActive: true,
    },
    {
      title: "الخدمات المصرفية الرقمية الآمنة\nوالمدفوعات",
      subtitle: "من تقنيات الدفع إلى الهوية والأمان، نمكّن المعاملات الأكثر أمانًا وتجارب عملاء أذكى.",
      buttonText: "عرض الحلول المصرفية",
      buttonLink: "/solutions",
      image: "/image/hero/hero-2.jpg",
      order: 1,
      language: "rtl",
      isActive: true,
    },
    {
      title: "تكنولوجيا المعلومات والأمن السيبراني\nجاهز للأعمال",
      subtitle: "بنية تحتية موثوقة، أمان قوي، ودعم سريع الاستجابة، حتى يتمكن فريقك من العمل بثقة.",
      buttonText: "تحدث إلى فريقنا",
      buttonLink: "/contact-us",
      image: "/image/hero/hero-3.jpg",
      order: 2,
      language: "rtl",
      isActive: true,
    },
  ],

  aboutSection: {
    tag: "حول البحر والشركاء",
    heading: "تمكين الأعمال من خلال <br/> شراكات موثوقة",
    description: "تقدم البحر والشركاء حلول تقنية موثوقة ومدعومة بالشركاء <br/>للمؤسسات في جميع أنحاء الكويت. نجمع بين الفهم العميق للمجال <br/>والتسليم المثبت، لمساعدة العملاء على تنفيذ الحلول بثقة،<br/> كفاءة، ودعم طويل الأمد.",
    buttonText: "حجز استشارة",
    buttonLink: "/contact-us",
    phoneLabel: "أو اتصل بنا:",
    phoneNumber: "+965 XXX XXXX",
    language: "rtl",
    isActive: true,
  },

  processSection: {
    tag: "ميزتنا",
    heading: "شراكة تحقق النتائج",
    subheading: "نهج منظم وشراكات قوية ودعم موثوق - مصمم للحفاظ على عملك في حركة مستمرة.",
    buttonText: "حجز استشارة",
    buttonLink: "/contact-us",
    steps: [
      {
        title: "شراكات موثوقة",
        description: "نعمل مع العلامات التجارية العالمية الرائدة لتقديم تقنيات مثبتة بمعايير تنفيذ موثوقة.",
        icon: processIcons.partnerships,
        order: 0,
        language: "rtl",
        isActive: true,
      },
      {
        title: "التسليم الشامل",
        description: "من المتطلبات والتخطيط إلى الطرح والتسليم، نقوم بإدارة المشاريع بمساءلة وملكية واضحة.",
        icon: processIcons.delivery,
        order: 1,
        language: "rtl",
        isActive: true,
      },
      {
        title: "نهج الأمان أولاً",
        description: "كل عملية نشر متوافقة مع أفضل ممارسات الأمان والتحكم في الوصول والعمليات الجاهزة للامتثال.",
        icon: processIcons.security,
        order: 2,
        language: "rtl",
        isActive: true,
      },
      {
        title: "دعم طويل الأمد",
        description: "دعم وصيانة سريعة الاستجابة لضمان الأداء المستقر ووقت التشغيل والتحسين المستمر.",
        icon: processIcons.support,
        order: 3,
        language: "rtl",
        isActive: true,
      },
    ],
    language: "rtl",
    isActive: true,
  },

  servicesSection: {
    tag: "حلولنا",
    heading: "استراتيجيات مخصصة لأهدافك",
    subheading: "تقديم حلول بقيادة الشركاء مصممة خصيصًا لأهداف عملك ونموك.",
    services: [
      {
        id: "banking-payment-identity-rtl",
        tabTitle: "الخدمات المصرفية والدفع والهوية",
        title: "حلول الخدمات المصرفية والدفع والهوية",
        description: "تمكين تجارب العملاء الآمنة والمعاملات الموثوقة مع حلول مصممة للأداء، والجاهزية للامتثال، وقابلية التوسع.",
        benefits: [
          "تمكين الدفع وحلول المعاملات",
          "التحقق من الهوية ودعم المصادقة",
          "الوصول الآمن وجاهزية تأهيل العملاء",
          "دعم التكامل للمنصات الحالية",
        ],
        imgSrc: "/image/section/service-1.jpg",
        order: 0,
        language: "rtl",
        isActive: true,
      },
      {
        id: "printing-imaging-rtl",
        tabTitle: "خدمات الطباعة والتصوير",
        title: "الطباعة والتصوير",
        description: "تحسين الإنتاجية مع بيئات طباعة وتصوير موثوقة—محسّنة لوقت التشغيل، والتحكم في التكاليف، وسير العمل في المؤسسات.",
        benefits: [
          "بيئات طباعة المكاتب والمؤسسات",
          "كفاءة سير العمل ودعم معالجة المستندات",
          "تخطيط النشر وجاهزية المستخدم",
          "الصيانة واستمرارية الخدمة",
        ],
        imgSrc: "/image/section/service-2.jpg",
        order: 1,
        language: "rtl",
        isActive: true,
      },
    ],
    language: "rtl",
    isActive: true,
  },

  testimonialSection: {
    tag: "من نحن",
    heading: "البحر والشركاء",
    description: "البحر والشركاء (BPC) هو مزود حلول أعمال مقره الكويت يركز على تقديم تقنيات موثوقة من خلال شراكات عالمية قوية. ندعم المؤسسات بالتخطيط المنظم والنشر المهني وخدمة ما بعد البيع الموثوقة—مساعدة العملاء على تحسين الأداء وتعزيز الموثوقية والمضي قدمًا بثقة.",
    imagePath: "/image/section/Al-Bahar-founder.jpg",
    personName: "محمد عبدالرحمن البحر",
    personTitle: "المؤسس والرئيس التنفيذي للبحر والشركاء",
    buttonText: "اعرف المزيد",
    buttonLink: "/about-us",
    language: "rtl",
    isActive: true,
  },

  brandsSection: {
    heading: "موثوق بها من قبل الشركاء ومدعومة بالتقنيات الرائدة في جميع أنحاء العالم.",
    brands: [
      { name: "Fortinet", imagePath: "/image/brand/fort.png", link: "#", order: 0, isActive: true },
      { name: "PureStorage", imagePath: "/image/brand/pure.png", link: "#", order: 1, isActive: true },
      { name: "TeamViewer", imagePath: "/image/brand/team.png", link: "#", order: 2, isActive: true },
      { name: "Hitatchi", imagePath: "/image/brand/hita.png", link: "#", order: 3, isActive: true },
      { name: "Axonius", imagePath: "/image/brand/axo.png", link: "#", order: 4, isActive: true },
    ],
    language: "rtl",
    isActive: true,
  },

  caseStudiesSection: {
    tag: "قصص العملاء",
    heading: "قصص النجاح",
    subheading: "عمليات نشر واقعية توضح كيف تقدم تقنيات الشركاء قيمة تجارية قابلة للقياس.",
    caseStudies: [
      {
        title: "CrowdStrike – طرح حماية نقطة النهاية",
        description: "دعم العملاء بنهج طرح أمني منظم، وتحسين رؤية نقطة النهاية وتعزيز الجاهزية التشغيلية من خلال التنفيذ والدعم المتوافق مع الشركاء.",
        imagePath: "/image/case-studies-item/case-studies-9.jpg",
        link: "#",
        order: 0,
        language: "rtl",
        isActive: true,
      },
      {
        title: "Entrust – الهوية والمصادقة",
        description: "ساعدنا في تمكين مبادرات الهوية والمصادقة مع التركيز على الوصول الآمن وجاهزية تأهيل المستخدم وتخطيط التكامل لبيئات المؤسسات.",
        imagePath: "/image/case-studies-item/case-studies-10.jpg",
        link: "#",
        order: 1,
        language: "rtl",
        isActive: true,
      },
    ],
    language: "rtl",
    isActive: true,
  },

  featuresSection: {
    tag: "لماذا البحر والشركاء",
    heading: "لماذا تختارنا للتحول الرقمي؟",
    description: "نجمع بين شراكات التكنولوجيا الموثوقة وقدرات التسليم العملية—مساعدة المؤسسات على تنفيذ حلول آمنة وقابلة للتوسع ومبنية لتدوم.",
    imagePath: "/image/section/img-section-why-choose-h7.jpg",
    buttonText: "طلب استشارة",
    buttonLink: "/contact-us",
    counters: [
      { value: 15, label: "سنوات<br />الخبرة", order: 0, isActive: true },
      { value: 3600, label: "عملاء<br />سعداء", order: 1, isActive: true },
      { value: 900, label: "مشروع<br />مكتمل", order: 2, isActive: true },
      { value: 40, label: "جوائز<br />وتقديرات", order: 3, isActive: true },
    ],
    language: "rtl",
    isActive: true,
  },

  ctaSection: {
    tag: "اتصل بنا",
    heading: "تواصل معنا",
    description: "تواصل اليوم لمناقشة كيف يمكننا دعم أهداف عملك. فريقنا جاهز لتقديم الإجابات وتقديم الحلول وبدء رحلتك نحو النجاح.",
    buttonText: "حجز استشارة",
    buttonLink: "/contact-us",
    phoneLabel: "هل لديك أي سؤال؟",
    phoneNumber: "1-555-678-8888",
    language: "rtl",
    isActive: true,
  },

  language: "rtl",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function seedHomepage() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('albaharpartners1');
    const collection = db.collection('homepage');
    
    // Check if content already exists
    const existingLTR = await collection.findOne({ language: 'ltr' });
    const existingRTL = await collection.findOne({ language: 'rtl' });
    
    if (!existingLTR) {
      await collection.insertOne(defaultLTRContent);
      console.log('✅ LTR homepage content seeded successfully');
      console.log('   - Hero: 3 slides');
      console.log('   - About: Company info');
      console.log('   - Process: 4 steps');
      console.log('   - Services: 5 services');
      console.log('   - Testimonial: Founder section');
      console.log('   - Brands: 15 partner logos');
      console.log('   - Case Studies: 4 customer stories');
      console.log('   - Features: Why choose us + 4 counters');
      console.log('   - CTA: Contact section');
    } else {
      console.log('ℹ️  LTR homepage content already exists');
    }
    
    if (!existingRTL) {
      await collection.insertOne(defaultRTLContent);
      console.log('✅ RTL homepage content seeded successfully');
      console.log('   - Hero: 3 slides (Arabic)');
      console.log('   - About: Company info (Arabic)');
      console.log('   - Process: 4 steps (Arabic)');
      console.log('   - Services: 2 services (Arabic)');
      console.log('   - Testimonial: Founder section (Arabic)');
      console.log('   - Brands: 5 partner logos');
      console.log('   - Case Studies: 2 customer stories (Arabic)');
      console.log('   - Features: Why choose us + 4 counters (Arabic)');
      console.log('   - CTA: Contact section (Arabic)');
    } else {
      console.log('ℹ️  RTL homepage content already exists');
    }
    
    // Remove deprecated homepage blogs section if present
    await collection.updateMany({}, { $unset: { blogsSection: '' } });

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Admin: http://localhost:3000/admin/homepage');
    console.log('\n✨ Homepage sections are now ready!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

seedHomepage();
