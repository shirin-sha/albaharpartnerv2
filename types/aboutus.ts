// About Us Page Content Types

export interface AboutUsHeader {
  breadcrumb: string;
  title: string;
  subtitle: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface TabContent {
  id: string;
  title: string;
  content: string;
}

export interface AboutAlBaharSection {
  tag: string;
  title: string;
  counterValue: number;
  counterLabel: string;
  tabs: TabContent[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface VisionMissionItem {
  id: number;
  imagePath: string;
  label: string;
  title: string;
  description: string;
  points: string[];
}

export interface VisionMissionValuesSection {
  tag: string;
  heading: string;
  subheading: string;
  items: VisionMissionItem[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface HeritageSection {
  tag: string;
  heading: string;
  imagePath: string;
  paragraphs: string[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface AboutBDSSection {
  tag: string;
  heading: string;
  description: string;
  servicesIntro: string;
  services: string[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface AboutBPCSection {
  tag: string;
  heading: string;
  imagePath: string;
  description: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface TeamMember {
  imgSrc: string;
  name: string;
  position: string;
}

export interface TeamSection {
  tag: string;
  heading: string;
  subheading: string;
  members: TeamMember[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface TimelineLogo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface TimelineItem {
  year: string;
  title: string;
  position: 'above' | 'below';
  logos?: TimelineLogo[];
}

export interface HistorySection {
  tag: string;
  heading: string;
  subheading: string;
  items: TimelineItem[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface FAQsSection {
  tag: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  faqs: FAQItem[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface AboutUsContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: AboutUsHeader;
  aboutAlBahar: AboutAlBaharSection;
  visionMissionValues: VisionMissionValuesSection;
  heritage: HeritageSection;
  aboutBDS: AboutBDSSection;
  aboutBPC: AboutBPCSection;
  team: TeamSection;
  history: HistorySection;
  faqs: FAQsSection;
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AboutUsResponse {
  success: boolean;
  message?: string;
  data?: AboutUsContent;
}
