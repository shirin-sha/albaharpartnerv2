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

/** Shared chrome for /services-details-1/[id] (banner crumbs + sidebar contact card) */
export interface SolutionsDetailContact {
  tag: string;
  title: string;
  subtitle: string;
  addressTitle: string;
  address: string;
  directionLabel: string;
  mapUrl: string;
  phoneTitle: string;
  phones: string[];
  emailTitle: string;
  emails: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface SolutionsDetailPage {
  /** First breadcrumb link label (e.g. Homepage) */
  homeBreadcrumb: string;
  /** Second breadcrumb link label (e.g. Solutions) */
  solutionsBreadcrumb: string;
  /** Detail page banner background; falls back to listing header.imagePath when empty */
  imagePath?: string;
  contact: SolutionsDetailContact;
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
  /** Detail page banner crumbs + contact card (shared across all solution details) */
  detailPage?: SolutionsDetailPage;
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

export function defaultSolutionsDetailPage(lang: 'ltr' | 'rtl'): SolutionsDetailPage {
  if (lang === 'rtl') {
    return {
      homeBreadcrumb: 'الرئيسية',
      solutionsBreadcrumb: 'الحلول',
      imagePath: '',
      isActive: true,
      contact: {
        tag: 'اتصل بنا',
        title: 'تواصل معنا',
        subtitle: 'تواصل معنا اليوم لمناقشة كيف يمكننا\nدعم أهداف عملك.',
        addressTitle: 'عنوان الشركة',
        address:
          'ص.ب 148 الصفاة 13002 - الكويت، قطعة 1، شارع 3، الشويخ الصناعية 1',
        directionLabel: 'الاتجاهات',
        mapUrl: 'https://maps.google.com/?q=Al+Bahar+and+Partners+Kuwait',
        phoneTitle: 'اتصل بنا',
        phones: ['+965 184 8848', '+965 184 8848'],
        emailTitle: 'راسلنا',
        emails: ['bpc.sales@albahargroup.com', 'bpc.info@albahargroup.com'],
        ctaLabel: 'اتصل بنا',
        ctaHref: '/ar/contact-us',
      },
    };
  }

  return {
    homeBreadcrumb: 'Homepage',
    solutionsBreadcrumb: 'Solutions',
    imagePath: '',
    isActive: true,
    contact: {
      tag: 'Contact US',
      title: 'Get In Touch',
      subtitle: 'Reach out today to discuss how we can\nsupport your business goals.',
      addressTitle: 'Address Business',
      address:
        'P.O.Box 148 Safat 13002 - Kuwait, Block 1, Street 3, Shuwaikh Industrial 1',
      directionLabel: 'Get direction',
      mapUrl: 'https://maps.google.com/?q=Al+Bahar+and+Partners+Kuwait',
      phoneTitle: 'Contact Us',
      phones: ['+965 184 8848', '+965 184 8848'],
      emailTitle: 'Email Us',
      emails: ['bpc.sales@albahargroup.com', 'bpc.info@albahargroup.com'],
      ctaLabel: 'Contact Us',
      ctaHref: '/contact-us',
    },
  };
}
