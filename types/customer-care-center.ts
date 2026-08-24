export interface CccInfoItem {
  label: string;
  value: string;
  iconClass?: string;
}

export interface CccServiceItem {
  _id?: string;
  title: string;
  description: string;
  iconClass?: string;
  order: number;
  isActive: boolean;
}

export interface CccProcessStep {
  _id?: string;
  title: string;
  description: string;
  iconClass?: string;
  order: number;
  isActive: boolean;
}

export interface CccBenefit {
  text: string;
}

export interface CustomerCareContent {
  _id?: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: {
    breadcrumb: string;
    tag: string;
    title: string;
    subtitle: string;
    imagePath: string;
    isActive: boolean;
  };
  infoBar: {
    items: CccInfoItem[];
    isActive: boolean;
  };
  overviewSection: {
    tag: string;
    heading: string;
    description: string;
    imagePath: string;
    isActive: boolean;
  };
  servicesSection: {
    tag: string;
    heading: string;
    services: CccServiceItem[];
    isActive: boolean;
  };
  processSection: {
    tag: string;
    heading: string;
    steps: CccProcessStep[];
    isActive: boolean;
  };
  whySection: {
    tag: string;
    heading: string;
    imagePath: string;
    benefits: CccBenefit[];
    isActive: boolean;
  };
  visitSection: {
    tag: string;
    locationLabel: string;
    locationValue: string;
    hoursLabel: string;
    hoursValue: string;
    callLabel: string;
    callValue: string;
    emailLabel: string;
    emailValue: string;
    directionsText: string;
    directionsUrl: string;
    mapEmbedUrl?: string;
    isActive: boolean;
  };
  ctaSection: {
    heading: string;
    subheading: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    isActive: boolean;
  };
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerCareResponse {
  success: boolean;
  message?: string;
  data?: CustomerCareContent;
}
