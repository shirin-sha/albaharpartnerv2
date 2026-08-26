// News & Updates Page Content Types

export interface NewsPost {
  _id?: string;
  title: string;
  titleAr?: string;
  category: string;
  categoryAr?: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  longDescription?: string;
  longDescriptionAr?: string;
  isFeatured?: boolean;
  /** Featured image — used for large hero/detail header when set; otherwise falls back to main. */
  imagePath: string;
  /** Main image — used for list/grid thumbnails (preferred over featured when both exist). */
  detailImagePath?: string;
  dateIso?: string;
  imgWidth?: number;
  imgHeight?: number;
  date: {
    day: string;
    month: string;
  };
  link: string;
  isActive: boolean;
}

export interface NewsUpdatesHeader {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  /** Page-title / breadcrumb banner background */
  imagePath?: string;
  language: 'ltr' | 'rtl';
  isActive: boolean;
}

export interface NewsUpdatesContent {
  _id?: string;
  /** SEO metadata for the page (per language document) */
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  header: NewsUpdatesHeader;
  posts: NewsPost[];
  language: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsUpdatesResponse {
  success: boolean;
  message?: string;
  data?: NewsUpdatesContent;
}
