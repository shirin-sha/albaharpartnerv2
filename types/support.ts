// Support Page Content Types

export interface SupportService {
  _id?: string;
  title: string;
  description: string;
  iconClass?: string;
  iconSvg?: string;
  isActive: boolean;
}

export interface SupportContactInfo {
  location: string;
  phoneNumbers: string[];
  email: string;
}

export interface SupportBenefit {
  text: string;
}

export interface SupportHeader {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface SupportContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: SupportHeader;
  servicesSection: {
    tag: string;
    heading: string;
    subheading?: string;
    services: SupportService[];
    isActive: boolean;
  };
  contactSection: {
    tag: string;
    heading: string;
    subheading?: string;
    benefits: SupportBenefit[];
    contactInfo: SupportContactInfo;
    formTitle: string;
    isActive: boolean;
  };
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupportResponse {
  success: boolean;
  message?: string;
  data?: SupportContent;
}
