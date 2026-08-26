// Careers Page Content Types

export interface Job {
  _id?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  responsibilities: string[];
  responsibilitiesAr?: string[];
  salary: {
    amount: string;
    period: string;
  };
  applyLink: string;
  order: number;
  isActive: boolean;
}

export interface CareersHeader {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface CareersContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: CareersHeader;
  tag: string;
  heading: string;
  subheading?: string;
  jobs: Job[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CareersResponse {
  success: boolean;
  message?: string;
  data?: CareersContent;
}
