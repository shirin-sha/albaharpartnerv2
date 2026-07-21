import type { SectionData } from './types';
import type { HomepageContent } from '@/types/homepage';

/** Section IDs in display order for Home Page CMS */
export const HOME_SECTION_IDS = [
  'meta',
  'hero',
  'about',
  'process',
  'services',
  'testimonial',
  'brands',
  'caseStudies',
  'features',
  'blogs',
  'cta',
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

/**
 * Build section list for CMS from LTR and RTL homepage content.
 */
export function buildSectionsFromContent(
  ltrContent: HomepageContent | null,
  rtlContent: HomepageContent | null
): SectionData[] {
  if (!ltrContent) return [];

  const rtl = rtlContent ?? null;
  return [
    {
      sectionId: 'meta',
      enabled: true,
      order: 0,
      ltr: {
        title: ltrContent.seo?.title ?? '',
        description: ltrContent.seo?.description ?? '',
        keywords: (ltrContent.seo?.keywords ?? []).join(', '),
      },
      rtl: rtl
        ? {
            title: rtl.seo?.title ?? '',
            description: rtl.seo?.description ?? '',
            keywords: (rtl.seo?.keywords ?? []).join(', '),
          }
        : {},
    },
    {
      sectionId: 'hero',
      enabled: true,
      order: 1,
      ltr: { slides: ltrContent.heroSlides ?? [] },
      rtl: rtl ? { slides: rtl.heroSlides ?? [] } : {},
    },
    {
      sectionId: 'about',
      enabled: true,
      order: 2,
      ltr: ltrContent.aboutSection ?? {},
      rtl: rtl?.aboutSection ?? {},
    },
    {
      sectionId: 'process',
      enabled: true,
      order: 3,
      ltr: ltrContent.processSection ?? {},
      rtl: rtl?.processSection ?? {},
    },
    {
      sectionId: 'services',
      enabled: true,
      order: 3,
      ltr: ltrContent.servicesSection ?? {},
      rtl: rtl?.servicesSection ?? {},
    },
    {
      sectionId: 'testimonial',
      enabled: true,
      order: 4,
      ltr: ltrContent.testimonialSection ?? {},
      rtl: rtl?.testimonialSection ?? {},
    },
    {
      sectionId: 'brands',
      enabled: true,
      order: 5,
      ltr: ltrContent.brandsSection ?? {},
      rtl: rtl?.brandsSection ?? {},
    },
    {
      sectionId: 'caseStudies',
      enabled: true,
      order: 6,
      ltr: ltrContent.caseStudiesSection ?? {},
      rtl: rtl?.caseStudiesSection ?? {},
    },
    {
      sectionId: 'features',
      enabled: true,
      order: 7,
      ltr: ltrContent.featuresSection ?? {},
      rtl: rtl?.featuresSection ?? {},
    },
    {
      sectionId: 'blogs',
      enabled: true,
      order: 8,
      ltr: ltrContent.blogsSection ?? {},
      rtl: rtl?.blogsSection ?? {},
    },
    {
      sectionId: 'cta',
      enabled: true,
      order: 9,
      ltr: {
        ...(ltrContent.ctaSection ?? {}),
        imagePath:
          (ltrContent.ctaSection as any)?.imagePath ||
          (ltrContent.ctaSection as any)?.backgroundImage ||
          '',
      },
      rtl: {
        ...(rtl?.ctaSection ?? {}),
        imagePath:
          (rtl?.ctaSection as any)?.imagePath ||
          (rtl?.ctaSection as any)?.backgroundImage ||
          '',
      },
    },
  ];
}
