export interface HeroSlide {
  _id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  order: number;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface AboutSection {
  _id?: string;
  tag: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  phoneLabel: string;
  phoneNumber: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface ServiceItem {
  _id?: string;
  id: string;
  tabTitle: string;
  title: string;
  description: string;
  benefits: string[];
  imgSrc: string;
  order: number;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface ServicesSection {
  _id?: string;
  tag: string;
  heading: string;
  subheading: string;
  services: ServiceItem[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface CtaSection {
  _id?: string;
  tag: string;
  heading: string;
  description: string;
  imagePath?: string;
  buttonText: string;
  buttonLink: string;
  phoneLabel: string;
  phoneNumber: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface ProcessStep {
  _id?: string;
  title: string;
  description: string;
  order: number;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface ProcessSection {
  _id?: string;
  tag: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  steps: ProcessStep[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface TestimonialSection {
  _id?: string;
  tag: string;
  heading: string;
  description: string;
  imagePath: string;
  personName: string;
  personTitle: string;
  secondaryHeading: string;
  secondaryDescription: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface Brand {
  _id?: string;
  name: string;
  imagePath: string;
  link: string;
  isActive: boolean;
}

export interface BrandsSection {
  _id?: string;
  heading: string;
  brands: Brand[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface CaseStudy {
  _id?: string;
  title: string;
  description: string;
  imagePath: string;
  link: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface CaseStudiesSection {
  _id?: string;
  tag: string;
  heading: string;
  subheading: string;
  caseStudies: CaseStudy[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface Counter {
  _id?: string;
  value: number;
  label: string;
  order: number;
  isActive: boolean;
}

export interface FeaturesSection {
  _id?: string;
  tag: string;
  heading: string;
  description: string;
  imagePath: string;
  benefits: string[];
  buttonText: string;
  buttonLink: string;
  counters: Counter[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface BlogPost {
  _id?: string;
  title: string;
  category: string;
  imagePath: string;
  date: {
    day: string;
    month: string;
  };
  link: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface BlogsSection {
  _id?: string;
  tag: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  posts: BlogPost[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export interface HomepageContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: SeoMetadata;
  heroSlides: HeroSlide[];
  aboutSection: AboutSection;
  processSection: ProcessSection;
  servicesSection: ServicesSection;
  testimonialSection: TestimonialSection;
  brandsSection: BrandsSection;
  caseStudiesSection: CaseStudiesSection;
  featuresSection: FeaturesSection;
  blogsSection: BlogsSection;
  ctaSection: CtaSection;
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HomepageResponse {
  success: boolean;
  data?: HomepageContent | HomepageContent[];
  message?: string;
}
