// Solutions Page Content Types

export interface SolutionsHeader {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface SolutionItem {
  id: string;
  tabTitle: string;
  tabTitleAr?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  detailDescription?: string;
  detailDescriptionAr?: string;
  benefits: string[];
  benefitsAr?: string[];
  imgSrc: string;
  detailImgSrc?: string;
  imgWidth: number;
  imgHeight: number;
  detailImgWidth?: number;
  detailImgHeight?: number;
  isActive: boolean;
}

export interface SolutionsContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: SolutionsHeader;
  solutions: SolutionItem[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SolutionsResponse {
  success: boolean;
  message?: string;
  data?: SolutionsContent;
}
