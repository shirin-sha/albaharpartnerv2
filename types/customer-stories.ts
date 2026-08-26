// Customer Stories Page Content Types

export interface CustomerStory {
  _id?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imagePath: string;
  link: string;
  order: number;
  isActive: boolean;
}

export interface CustomerStoriesHeader {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface CustomerStoriesContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: CustomerStoriesHeader;
  tag: string;
  heading: string;
  subheading?: string;
  stories: CustomerStory[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerStoriesResponse {
  success: boolean;
  message?: string;
  data?: CustomerStoriesContent;
}
