const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'aboutus';

const aboutUsDataLTR = {
  language: "ltr",
  isActive: true,

  header: {
    breadcrumb: "About Us",
    title: "About Us",
    subtitle: "Discover our mission to empower clients with expert solutions for confident, sustainable growth and success.",
    language: "ltr",
    isActive: true,
  },

  aboutAlBahar: {
    tag: "About Al-Bahar Group",
    title: "Al-Bahar Group was founded in 1937 by Mr. Mohamed Abdulrahman Al-Bahar as a General Trading Company.",
    counterValue: 88,
    counterLabel: "Years of Excellence & Impact",
    tabs: [
      {
        id: "growth",
        title: "Growth",
        content: "Over the decades, we've grown to become a leading force in regional markets across a variety of industries. Our diverse portfolio spans everything from consumer goods, home appliances, cutting-edge electronics, shipping, office technology, IT solutions, and beyond.",
      },
      {
        id: "partnerships",
        title: "Partnerships",
        content: "Partnering with global titans like Unilever, Canon, and GE appliances, we bring Kuwait's shoppers the latest in innovation and best practices. Our ethos thrives on collaboration, fostering enduring relationships that benefit both brands and customers alike.",
      },
      {
        id: "community",
        title: "Community",
        content: "More than just commerce, we're committed to community. Through our foundations and corporate social initiatives, we're dedicated to giving back, enriching the lives of those we serve. Join us as we continue our proud tradition of excellence and impact in Kuwait and the region.",
      },
    ],
    language: "ltr",
    isActive: true,
  },

  visionMissionValues: {
    tag: "What Guides Us",
    heading: "What Guides Us and Drives Our Future",
    subheading: "Guided by a clear vision, driven by a shared mission and anchored in strong values, we partner with stakeholders to create sustainable, long-term success.",
    items: [
      {
        id: 1,
        imagePath: "/image/section/process-item-1.jpg",
        label: "Vision",
        title: "Our long-term direction and aspiration.",
        description: "To Always be the Most Trusted and Best-in-Class Partner.",
        points: [],
      },
      {
        id: 2,
        imagePath: "/image/section/process-item-2.jpg",
        label: "Mission",
        title: "How we create value every day.",
        description: "Delivering excellence and success by directing our values, talents, resources and expertise to maximize customer satisfaction and to achieve sustainable growth for all stakeholders.",
        points: [],
      },
      {
        id: 3,
        imagePath: "/image/section/process-item-3.jpg",
        label: "Values",
        title: "Principles that guide our behaviour and decisions.",
        description: "",
        points: [
          "We deliver on our commitments.",
          "We view our people as the source of our strength.",
          "We work together as a team.",
          "We listen, we care, we respect.",
          "We seek continual self and work improvement.",
        ],
      },
    ],
    language: "ltr",
    isActive: true,
  },

  heritage: {
    tag: "Our Heritage",
    heading: "Our founder, Mr. Mohamed Abdulrahman Al-Bahar",
    imagePath: "/image/section/founder.jpg",
    paragraphs: [
      "Stands as the visionary behind the growth of our company since its inception in 1937. His impact reverberates through the corridors of modern Kuwait, where he helped pioneer several cornerstones of the country's blossoming economy.",
      "Mr. Mohamed Al-Bahar's influence also extended far beyond business. He was instrumental in shaping Kuwait's public institutions, including the Kuwait Chamber of Commerce, Educational Council, Health Council, and more, steering the nation towards modernity and self-sufficiency.",
      "A true humanitarian, he espoused the ethos of community service across a variety of causes. Among his many accolades, he was honored with the \"Order of the British Empire\" (OBE) by Queen Elizabeth in 2003, a testament to his enduring legacy of excellence and compassion.",
    ],
    language: "ltr",
    isActive: true,
  },

  aboutBDS: {
    tag: "About BDS",
    heading: "Our Business Digital Solutions (BDS) Division",
    description: "offers a comprehensive suite of services designed to enhance business operations and security. We support banking and payment systems by implementing various transaction methods and facilitating digital onboarding with secure, automated identification verification.",
    servicesIntro: "Our services include:",
    services: [
      "Banking and payment systems with various transaction methods and digital onboarding",
      "Internet of Things (IoT) solutions with real-time data analysis and machine learning",
      "Tokenization technology for enhanced data security",
      "Physical and digital issuance of financial instruments",
      "Advanced secure authentication methods",
      "Robust networking solutions",
      "Asset management for efficient IT resource use",
      "Storage solutions with flexible, future-ready infrastructure",
      "Access control and surveillance systems",
      "Remote access and support",
      "Endpoint security and cybersecurity services",
      "Asset management, SaaS management, and continuous threat monitoring",
    ],
    language: "ltr",
    isActive: true,
  },

  aboutBPC: {
    heading: "About BPC",
    imagePath: "/image/section/section-contact-home-h.jpg",
    description: "Established in 1961, Al-Bahar and Partners (BPC) is a financially solid group specializing in distribution and turnkey project delivery. We offer world-renowned products with comprehensive support services.",
    serviceOfferingsTitle: "Two Service Offerings:",
    serviceOfferings: [
      "BDS: Business Digital Solutions",
      "PAT: Printing & Audio Technology",
    ],
    coreIndustriesTitle: "5 Core Industries:",
    coreIndustries: [
      "Electronic Chip Cards & Payments",
      "Audio Visual Technologies",
      "Office Automation & Document Management",
      "IT Infrastructure & Cybersecurity",
      "Managed Services & Cloud Solutions",
    ],
    language: "ltr",
    isActive: true,
  },

  team: {
    tag: "Our Team",
    heading: "Meet Our Experts",
    subheading: "Our expert team is here to drive your success with tailored, innovative solutions.",
    members: [
      {
        imgSrc: "/image/team-item/team1.jpg",
        name: "Ihab Al Khatib",
        position: "Group General Manager - BKGH",
      },
      {
        imgSrc: "/image/team-item/team2.jpg",
        name: "Abdullateef Al-Bahar",
        position: "Group General Manager - FMCG Group",
      },
      {
        imgSrc: "/image/team-item/team3.jpg",
        name: "Dariusz Sobieraj",
        position: "Group Chief Financial Officer - BKGH",
      },
      {
        imgSrc: "/image/team-item/team4.jpg",
        name: "Dr. James Mcavoy",
        position: "Group Head of Risk & Compliance",
      },
      {
        imgSrc: "/image/team-item/team4.jpg",
        name: "Nishad Victor",
        position: "General Manager, Shipping",
      },
      {
        imgSrc: "/image/team-item/team4.jpg",
        name: "Rajee Rajab",
        position: "General Manager - Food Division",
      },
    ],
    language: "ltr",
    isActive: true,
  },

  history: {
    tag: "Our History",
    heading: "Our Journey So Far",
    subheading: "Explore the milestones that have shaped our growth and commitment to excellence.",
    items: [
      {
        year: "1937",
        title: "Mohamed Abdulrahman Al-Bahar sets up own company.",
        position: "below",
        logos: [
          {
            src: "/image/brand/abdulrahman.png",
            alt: "Mohamed Abdulrahman Al-Bahar",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1946",
        title: "Signs partnership agreement with Unilever.",
        position: "above",
        logos: [
          { src: "/image/brand/b3.png", alt: "Unilever", width: 100, height: 60 },
        ],
      },
      {
        year: "1951",
        title: "Incorporates Bahar Shipping Company.",
        position: "below",
        logos: [
          {
            src: "/image/brand/albaharshiping.png",
            alt: "Bahar Shipping Company",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1954",
        title: "Partners with Coca Cola Co.",
        position: "above",
        logos: [
          { src: "/image/brand/b1.png", alt: "Coca Cola", width: 100, height: 60 },
        ],
      },
      {
        year: "1959",
        title: "Signs on Caterpillar.",
        position: "below",
        logos: [
          { src: "/image/brand/b2.png", alt: "Caterpillar", width: 100, height: 60 },
        ],
      },
      {
        year: "1961",
        title: "Setup Bahar & Partners.",
        position: "above",
        logos: [
          {
            src: "/image/brand/partners.png",
            alt: "Bahar & Partners",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1963",
        title: "Incorporates BEEA and signs up with GE Appliances.",
        position: "below",
        logos: [
          { src: "/image/brand/ge.png", alt: "GE Appliances", width: 100, height: 60 },
          {
            src: "/image/brand/albaharelectro.png",
            alt: "Bahar & Partners",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1968",
        title: "Partnership with PIL.",
        position: "above",
        logos: [
          { src: "/image/brand/pil.png", alt: "PIL", width: 100, height: 60 },
        ],
      },
      {
        year: "1980",
        title: "Partnership with COSCO.",
        position: "below",
        logos: [
          { src: "/image/brand/b4.png", alt: "COSCO", width: 100, height: 60 },
        ],
      },
      {
        year: "1995",
        title: "Partners with Al Alali.",
        position: "above",
        logos: [
          { src: "/image/brand/alalai.png", alt: "Al Alali", width: 100, height: 60 },
        ],
      },
      {
        year: "2004",
        title: "Partners with Master Chef.",
        position: "below",
        logos: [
          { src: "/image/brand/master.png", alt: "Master Chef", width: 100, height: 60 },
        ],
      },
      {
        year: "2005",
        title: "Partners with Ocean.",
        position: "above",
        logos: [
          { src: "/image/brand/ocean.jpg", alt: "Ocean", width: 100, height: 60 },
        ],
      },
      {
        year: "2007",
        title: "Partners with Elite.",
        position: "below",
        logos: [
          { src: "/image/brand/elite.png", alt: "Elite", width: 100, height: 60 },
        ],
      },
      {
        year: "2010",
        title: "Partners with Royxon.",
        position: "above",
        logos: [
          { src: "/image/brand/royxon.png", alt: "Royxon", width: 100, height: 60 },
        ],
      },
      {
        year: "2015",
        title: "Partners with Speed Queen.",
        position: "below",
        logos: [
          {
            src: "/image/brand/speed.png",
            alt: "Speed Queen",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2020",
        title: "New Partnerships Canon, Goody & Baytouti.",
        position: "above",
        logos: [
          { src: "/image/brand/canon.png", alt: "Canon", width: 80, height: 50 },
          { src: "/image/brand/goody.png", alt: "Goody", width: 80, height: 50 },
          { src: "/image/brand/baytu.png", alt: "Baytouti", width: 80, height: 50 },
        ],
      },
      {
        year: "2021",
        title: "New Partnership with Logitech, 3M, Lofratelli & Honeywell.",
        position: "below",
        logos: [
          { src: "/image/brand/logitech.png", alt: "Logitech", width: 80, height: 50 },
          { src: "/image/brand/3m.png", alt: "3M", width: 80, height: 50 },
          { src: "/image/brand/lafra.png", alt: "Lofratelli", width: 80, height: 50 },
          {
            src: "/image/brand/honeywell.png",
            alt: "Honeywell",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2022",
        title: "New Partnerships Hama, Lipton, Lago, & Germanica.",
        position: "above",
        logos: [
          { src: "/image/brand/hama.png", alt: "Hama", width: 80, height: 50 },
          { src: "/image/brand/lipton.png", alt: "Lipton", width: 80, height: 50 },
          { src: "/image/brand/lago.png", alt: "Lago", width: 80, height: 50 },
          {
            src: "/image/brand/germanica.png",
            alt: "Germanica",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2023",
        title: "New Partnerships Tilda, Karcher & Marshall.",
        position: "below",
        logos: [
          { src: "/image/brand/tilda.png", alt: "Tilda", width: 80, height: 50 },
          { src: "/image/brand/karcher.png", alt: "Karcher", width: 80, height: 50 },
          {
            src: "/image/brand/marshall.png",
            alt: "Marshall",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2024",
        title: "Continuing our legacy of excellence.",
        position: "above",
      },
    ],
    language: "ltr",
    isActive: true,
  },

  faqs: {
    tag: "Questions",
    heading: "Have any questions? here some answers.",
    subheading: "In relation to websites and apps, UI design considers the look, interactivity of the making product.",
    buttonText: "Ask Your Question",
    buttonLink: "/contact-us",
    faqs: [
      {
        question: "What types of brands does Al Bahar Group represent?",
        answer: "We work with internationally recognised leaders in consumer goods, technology, shipping, travel and retail. Our partners trust us to represent their brands with the same care and standards they expect in their home markets.",
        isOpen: false,
      },
      {
        question: "How can a new principal explore partnership opportunities?",
        answer: "You can contact our group office through the website or our main telephone number. Our leadership team will review your proposal, assess market fit and connect you with the relevant business vertical.",
        isOpen: true,
      },
      {
        question: "In which channels do you operate?",
        answer: "Our businesses serve a wide range of channels – from large modern trade and hypermarkets to traditional retail, corporate accounts, government entities, and specialised sectors such as education and logistics.",
        isOpen: false,
      },
      {
        question: "How can I apply for a role at Al Bahar Group?",
        answer: "Visit our Careers section to view current opportunities and submit your application online. We regularly participate in career fairs and campus events to meet new talent.",
        isOpen: false,
      },
      {
        question: "Do you support long-term development of your employees?",
        answer: "Yes. Training, coaching and structured learning programs are integral to our HR strategy. We believe investing in our people is essential to sustaining high performance and delivering value to our partners.",
        isOpen: false,
      },
    ],
    language: "ltr",
    isActive: true,
  },
};

const aboutUsDataRTL = {
  language: "rtl",
  isActive: true,

  header: {
    breadcrumb: "من نحن",
    title: "من نحن",
    subtitle: "اكتشف مهمتنا في تمكين العملاء بحلول خبيرة للنمو الواثق والمستدام والنجاح.",
    language: "rtl",
    isActive: true,
  },

  aboutAlBahar: {
    tag: "عن مجموعة البحر",
    title: "تأسست مجموعة البحر في عام 1937 على يد السيد محمد عبدالرحمن البحر كشركة تجارة عامة.",
    counterValue: 88,
    counterLabel: "عامًا من التميز والتأثير",
    tabs: [
      {
        id: "growth",
        title: "النمو",
        content: "على مدى عقود، نمونا لنصبح قوة رائدة في الأسواق الإقليمية عبر مجموعة متنوعة من الصناعات. تمتد محفظتنا المتنوعة من السلع الاستهلاكية والأجهزة المنزلية والإلكترونيات المتطورة والشحن وتكنولوجيا المكاتب وحلول تكنولوجيا المعلومات وما بعدها.",
      },
      {
        id: "partnerships",
        title: "الشراكات",
        content: "من خلال الشراكة مع عمالقة عالميين مثل يونيليفر وكانون وأجهزة جي إي، نقدم للمتسوقين في الكويت أحدث الابتكارات وأفضل الممارسات. تزدهر روحنا على التعاون، وتعزيز العلاقات الدائمة التي تفيد كلاً من العلامات التجارية والعملاء على حد سواء.",
      },
      {
        id: "community",
        title: "المجتمع",
        content: "أكثر من مجرد تجارة، نحن ملتزمون بالمجتمع. من خلال مؤسساتنا ومبادراتنا الاجتماعية للشركات، نحن ملتزمون برد الجميل وإثراء حياة من نخدمهم. انضم إلينا بينما نواصل تقليدنا الفخور بالتميز والتأثير في الكويت والمنطقة.",
      },
    ],
    language: "rtl",
    isActive: true,
  },

  visionMissionValues: {
    tag: "ما يوجهنا",
    heading: "ما يوجهنا ويدفع مستقبلنا",
    subheading: "موجهون برؤية واضحة، مدفوعون بمهمة مشتركة ومرتكزون على قيم قوية، نتشارك مع أصحاب المصلحة لخلق نجاح مستدام وطويل الأجل.",
    items: [
      {
        id: 1,
        imagePath: "/image/section/process-item-1.jpg",
        label: "الرؤية",
        title: "اتجاهنا وطموحنا على المدى الطويل.",
        description: "أن نكون دائماً الشريك الأكثر موثوقية والأفضل في فئته.",
        points: [],
      },
      {
        id: 2,
        imagePath: "/image/section/process-item-2.jpg",
        label: "المهمة",
        title: "كيف نخلق القيمة كل يوم.",
        description: "تقديم التميز والنجاح من خلال توجيه قيمنا ومواهبنا ومواردنا وخبراتنا لتحقيق أقصى قدر من رضا العملاء وتحقيق نمو مستدام لجميع أصحاب المصلحة.",
        points: [],
      },
      {
        id: 3,
        imagePath: "/image/section/process-item-3.jpg",
        label: "القيم",
        title: "المبادئ التي توجه سلوكنا وقراراتنا.",
        description: "",
        points: [
          "نحن نفي بالتزاماتنا.",
          "نحن ننظر إلى موظفينا كمصدر قوتنا.",
          "نحن نعمل معاً كفريق واحد.",
          "نحن نستمع، ونهتم، ونحترم.",
          "نحن نسعى للتحسين المستمر للذات والعمل.",
        ],
      },
    ],
    language: "rtl",
    isActive: true,
  },

  heritage: {
    tag: "تراثنا",
    heading: "مؤسسنا، السيد محمد عبدالرحمن البحر",
    imagePath: "/image/section/founder.jpg",
    paragraphs: [
      "يقف كصاحب الرؤية وراء نمو شركتنا منذ تأسيسها في عام 1937. يتردد تأثيره في أروقة الكويت الحديثة، حيث ساعد في ريادة العديد من أركان اقتصاد البلاد المزدهر.",
      "امتد تأثير السيد محمد البحر أيضاً إلى ما هو أبعد من الأعمال التجارية. كان له دور فعال في تشكيل المؤسسات العامة الكويتية، بما في ذلك غرفة تجارة الكويت والمجلس التعليمي والمجلس الصحي وغيرها، مما وجه الأمة نحو الحداثة والاكتفاء الذاتي.",
      "إنساني حقيقي، تبنى روح خدمة المجتمع عبر مجموعة متنوعة من القضايا. من بين أوسمته العديدة، تم تكريمه بـ 'وسام الإمبراطورية البريطانية' (OBE) من الملكة إليزابيث في عام 2003، شهادة على إرثه الدائم من التميز والرحمة.",
    ],
    language: "rtl",
    isActive: true,
  },

  aboutBDS: {
    tag: "عن BDS",
    heading: "قسم حلول الأعمال الرقمية (BDS)",
    description: "يقدم مجموعة شاملة من الخدمات المصممة لتعزيز العمليات التجارية والأمن. ندعم الأنظمة المصرفية وأنظمة الدفع من خلال تنفيذ طرق معاملات مختلفة وتسهيل التسجيل الرقمي مع التحقق الآمن والآلي من الهوية.",
    servicesIntro: "تشمل خدماتنا:",
    services: [
      "الأنظمة المصرفية وأنظمة الدفع مع طرق معاملات مختلفة والتسجيل الرقمي",
      "حلول إنترنت الأشياء (IoT) مع تحليل البيانات في الوقت الفعلي والتعلم الآلي",
      "تقنية الترميز لتعزيز أمان البيانات",
      "الإصدار المادي والرقمي للأدوات المالية",
      "طرق مصادقة متقدمة وآمنة",
      "حلول شبكات قوية",
      "إدارة الأصول لاستخدام فعال لموارد تكنولوجيا المعلومات",
      "حلول التخزين مع بنية تحتية مرنة وجاهزة للمستقبل",
      "أنظمة التحكم في الوصول والمراقبة",
      "الوصول عن بُعد والدعم",
      "أمن نقاط النهاية وخدمات الأمن السيبراني",
      "إدارة الأصول وإدارة SaaS والمراقبة المستمرة للتهديدات",
    ],
    language: "rtl",
    isActive: true,
  },

  aboutBPC: {
    heading: "عن BPC",
    imagePath: "/image/section/section-contact-home-h.jpg",
    description: "تأسست شركة البحر والشركاء (BPC) في عام 1961، وهي مجموعة قوية مالياً متخصصة في التوزيع وتسليم المشاريع الجاهزة. نقدم منتجات مشهورة عالمياً مع خدمات دعم شاملة.",
    serviceOfferingsTitle: "عرضان للخدمة:",
    serviceOfferings: [
      "BDS: حلول الأعمال الرقمية",
      "PAT: تقنية الطباعة والصوت",
    ],
    coreIndustriesTitle: "5 صناعات أساسية:",
    coreIndustries: [
      "البطاقات الإلكترونية الذكية والمدفوعات",
      "تقنيات الصوت والفيديو",
      "أتمتة المكاتب وإدارة الوثائق",
      "البنية التحتية لتكنولوجيا المعلومات والأمن السيبراني",
      "الخدمات المُدارة والحلول السحابية",
    ],
    language: "rtl",
    isActive: true,
  },

  team: {
    tag: "فريقنا",
    heading: "تعرف على خبرائنا",
    subheading: "فريقنا الخبير هنا لدفع نجاحك بحلول مخصصة ومبتكرة.",
    members: [
      {
        imgSrc: "/image/team-item/team1.jpg",
        name: "إيهاب الخطيب",
        position: "المدير العام للمجموعة - BKGH",
      },
      {
        imgSrc: "/image/team-item/team2.jpg",
        name: "عبداللطيف البحر",
        position: "المدير العام للمجموعة - مجموعة FMCG",
      },
      {
        imgSrc: "/image/team-item/team3.jpg",
        name: "داريسز سوبيراج",
        position: "المدير المالي الرئيسي للمجموعة - BKGH",
      },
    ],
    language: "rtl",
    isActive: true,
  },

  history: {
    tag: "تاريخنا",
    heading: "رحلتنا حتى الآن",
    subheading: "استكشف المعالم التي شكلت نمونا والتزامنا بالتميز.",
    items: [
      {
        year: "1937",
        title: "تأسيس محمد عبدالرحمن البحر لشركته الخاصة.",
        position: "below",
        logos: [
          {
            src: "/image/brand/abdulrahman.png",
            alt: "محمد عبدالرحمن البحر",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1946",
        title: "توقيع اتفاقية شراكة مع يونيليفر.",
        position: "above",
        logos: [
          { src: "/image/brand/b3.png", alt: "يونيليفر", width: 100, height: 60 },
        ],
      },
      {
        year: "1951",
        title: "تأسيس شركة البحر للشحن.",
        position: "below",
        logos: [
          {
            src: "/image/brand/albaharshiping.png",
            alt: "شركة البحر للشحن",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1954",
        title: "شراكة مع شركة كوكا كولا.",
        position: "above",
        logos: [
          { src: "/image/brand/b1.png", alt: "كوكا كولا", width: 100, height: 60 },
        ],
      },
      {
        year: "1959",
        title: "توقيع اتفاقية مع كاتربيلر.",
        position: "below",
        logos: [
          { src: "/image/brand/b2.png", alt: "كاتربيلر", width: 100, height: 60 },
        ],
      },
      {
        year: "1961",
        title: "تأسيس البحر والشركاء.",
        position: "above",
        logos: [
          {
            src: "/image/brand/partners.png",
            alt: "البحر والشركاء",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1963",
        title: "تأسيس BEEA وتوقيع اتفاقية مع GE Appliances.",
        position: "below",
        logos: [
          { src: "/image/brand/ge.png", alt: "GE Appliances", width: 100, height: 60 },
          {
            src: "/image/brand/albaharelectro.png",
            alt: "البحر للإلكترونيات",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "1968",
        title: "شراكة مع PIL.",
        position: "above",
        logos: [
          { src: "/image/brand/pil.png", alt: "PIL", width: 100, height: 60 },
        ],
      },
      {
        year: "1980",
        title: "شراكة مع COSCO.",
        position: "below",
        logos: [
          { src: "/image/brand/b4.png", alt: "COSCO", width: 100, height: 60 },
        ],
      },
      {
        year: "1995",
        title: "شراكة مع العلالي.",
        position: "above",
        logos: [
          { src: "/image/brand/alalai.png", alt: "العلالي", width: 100, height: 60 },
        ],
      },
      {
        year: "2004",
        title: "شراكة مع ماستر شيف.",
        position: "below",
        logos: [
          { src: "/image/brand/master.png", alt: "Master Chef", width: 100, height: 60 },
        ],
      },
      {
        year: "2005",
        title: "شراكة مع أوشن.",
        position: "above",
        logos: [
          { src: "/image/brand/ocean.jpg", alt: "Ocean", width: 100, height: 60 },
        ],
      },
      {
        year: "2007",
        title: "شراكة مع إيليت.",
        position: "below",
        logos: [
          { src: "/image/brand/elite.png", alt: "Elite", width: 100, height: 60 },
        ],
      },
      {
        year: "2010",
        title: "شراكة مع Royxon.",
        position: "above",
        logos: [
          { src: "/image/brand/royxon.png", alt: "Royxon", width: 100, height: 60 },
        ],
      },
      {
        year: "2015",
        title: "شراكة مع Speed Queen.",
        position: "below",
        logos: [
          {
            src: "/image/brand/speed.png",
            alt: "Speed Queen",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2020",
        title: "شراكات جديدة مع كانون، قوودي وبيوتي.",
        position: "above",
        logos: [
          { src: "/image/brand/canon.png", alt: "Canon", width: 80, height: 50 },
          { src: "/image/brand/goody.png", alt: "Goody", width: 80, height: 50 },
          { src: "/image/brand/baytu.png", alt: "Baytouti", width: 80, height: 50 },
        ],
      },
      {
        year: "2021",
        title: "شراكات جديدة مع Logitech، 3M، Lofratelli وHoneywell.",
        position: "below",
        logos: [
          { src: "/image/brand/logitech.png", alt: "Logitech", width: 80, height: 50 },
          { src: "/image/brand/3m.png", alt: "3M", width: 80, height: 50 },
          { src: "/image/brand/lafra.png", alt: "Lofratelli", width: 80, height: 50 },
          {
            src: "/image/brand/honeywell.png",
            alt: "Honeywell",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2022",
        title: "شراكات جديدة مع Hama، Lipton، Lago وGermanica.",
        position: "above",
        logos: [
          { src: "/image/brand/hama.png", alt: "Hama", width: 80, height: 50 },
          { src: "/image/brand/lipton.png", alt: "Lipton", width: 80, height: 50 },
          { src: "/image/brand/lago.png", alt: "Lago", width: 80, height: 50 },
          {
            src: "/image/brand/germanica.png",
            alt: "Germanica",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2023",
        title: "شراكات جديدة مع Tilda، Karcher وMarshall.",
        position: "below",
        logos: [
          { src: "/image/brand/tilda.png", alt: "Tilda", width: 80, height: 50 },
          { src: "/image/brand/karcher.png", alt: "Karcher", width: 80, height: 50 },
          {
            src: "/image/brand/marshall.png",
            alt: "Marshall",
            width: 100,
            height: 60,
          },
        ],
      },
      {
        year: "2024",
        title: "مواصلة إرثنا من التميز.",
        position: "above",
      },
    ],
    language: "rtl",
    isActive: true,
  },

  faqs: {
    tag: "الأسئلة",
    heading: "هل لديك أي أسئلة؟ إليك بعض الإجابات.",
    subheading: "فيما يتعلق بالمواقع والتطبيقات، يعتبر تصميم واجهة المستخدم المظهر والتفاعل لصنع المنتج.",
    buttonText: "اطرح سؤالك",
    buttonLink: "/contact-us",
    faqs: [
      {
        question: "ما أنواع العلامات التجارية التي تمثلها مجموعة البحر؟",
        answer: "نعمل مع قادة معترف بهم دولياً في السلع الاستهلاكية والتكنولوجيا والشحن والسفر والتجزئة. يثق شركاؤنا بنا لتمثيل علاماتهم التجارية بنفس العناية والمعايير التي يتوقعونها في أسواقهم المحلية.",
        isOpen: false,
      },
      {
        question: "كيف يمكن لرئيس جديد استكشاف فرص الشراكة؟",
        answer: "يمكنك الاتصال بمكتب المجموعة من خلال الموقع أو رقم الهاتف الرئيسي. سيراجع فريق القيادة لدينا اقتراحك ويقيم ملاءمة السوق ويوصلك بالقطاع التجاري ذي الصلة.",
        isOpen: true,
      },
    ],
    language: "rtl",
    isActive: true,
  },
};

async function seedAboutUsData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    console.log('🧹 Clearing existing About Us data...');
    await collection.deleteMany({});

    // Insert LTR data
    console.log('📝 Inserting LTR (English) About Us content...');
    const ltrResult = await collection.insertOne({
      ...aboutUsDataLTR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ LTR data inserted with ID: ${ltrResult.insertedId}`);

    // Insert RTL data
    console.log('📝 Inserting RTL (Arabic) About Us content...');
    const rtlResult = await collection.insertOne({
      ...aboutUsDataRTL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ RTL data inserted with ID: ${rtlResult.insertedId}`);

    console.log('\n🎉 About Us data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('   - LTR (English): Complete with all sections');
    console.log('   - RTL (Arabic): Complete with all sections');
    console.log('\n🚀 Visit http://localhost:3000/admin/aboutus to manage content');
    console.log('🌐 Visit http://localhost:3000/about-us to view the page');

  } catch (error) {
    console.error('❌ Error seeding About Us data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedAboutUsData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedAboutUsData };
