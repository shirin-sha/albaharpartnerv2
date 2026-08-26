// Brands Page Content Types

export interface BrandProduct {
  _id?: string;
  name: string;
  imagePath: string;
  description?: string;
}

export interface Brand {
  _id?: string;
  name: string;
  nameAr?: string;
  imagePath: string;
  link: string;
  description?: string;
  descriptionAr?: string;
  products?: BrandProduct[];
  isActive: boolean;
}

export interface BrandsHeader {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface BrandsContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: BrandsHeader;
  tag: string;
  heading: string;
  subheading?: string;
  brands: Brand[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BrandsResponse {
  success: boolean;
  message?: string;
  data?: BrandsContent;
}
