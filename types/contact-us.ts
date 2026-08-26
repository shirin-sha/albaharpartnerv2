// Contact Us Page Content Types

export interface ContactBenefit {
  text: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface ContactInfoLabels {
  address: string;
  phone: string;
  email: string;
}

export interface ContactUsHeader {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface ContactUsContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: ContactUsHeader;
  contactSection: {
    tag: string;
    heading: string;
    subheading?: string;
    benefits: ContactBenefit[];
    contactInfo: ContactInfo;
    contactInfoLabels?: ContactInfoLabels;
    isActive: boolean;
  };
  mapSection: {
    mapUrl: string;
    isActive: boolean;
  };
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactUsResponse {
  success: boolean;
  message?: string;
  data?: ContactUsContent;
}
