import type { CustomerCareContent } from '@/types/customer-care-center';
import type { CccSectionData } from './types';

export const CCC_SECTION_IDS = [
  'meta',
  'header',
  'infoBar',
  'overview',
  'services',
  'process',
  'why',
  'visit',
  'cta',
] as const;

export type CccSectionId = (typeof CCC_SECTION_IDS)[number];

export const CCC_SECTION_LABELS: Record<CccSectionId, string> = {
  meta: 'SEO Meta',
  header: 'Hero / Page Header',
  infoBar: 'Info Bar',
  overview: 'Overview',
  services: 'Support Services',
  process: 'How Support Works',
  why: 'Why BPC Customer Care',
  visit: 'Visit / Contact',
  cta: 'CTA Banner',
};

export const CCC_SECTION_DESCRIPTIONS: Record<CccSectionId, string> = {
  meta: 'Page title, description, and keywords',
  header: 'Hero image, tag, title, subtitle, breadcrumb',
  infoBar: 'Call, email, hours, and location strip',
  overview: 'Overview text and image',
  services: 'Six support service cards',
  process: 'Five-step support journey',
  why: 'Benefits list and image',
  visit: 'Map, address, hours, directions',
  cta: 'Bottom call-to-action banner',
};

export function buildCccSectionsFromContent(
  ltrContent: CustomerCareContent | null,
  rtlContent: CustomerCareContent | null
): CccSectionData[] {
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
      sectionId: 'header',
      enabled: ltrContent.header?.isActive ?? true,
      order: 1,
      ltr: { ...(ltrContent.header ?? {}) },
      rtl: { ...(rtl?.header ?? {}) },
    },
    {
      sectionId: 'infoBar',
      enabled: ltrContent.infoBar?.isActive ?? true,
      order: 2,
      ltr: { ...(ltrContent.infoBar ?? { items: [], isActive: true }) },
      rtl: { ...(rtl?.infoBar ?? { items: [], isActive: true }) },
    },
    {
      sectionId: 'overview',
      enabled: ltrContent.overviewSection?.isActive ?? true,
      order: 3,
      ltr: { ...(ltrContent.overviewSection ?? {}) },
      rtl: { ...(rtl?.overviewSection ?? {}) },
    },
    {
      sectionId: 'services',
      enabled: ltrContent.servicesSection?.isActive ?? true,
      order: 4,
      ltr: { ...(ltrContent.servicesSection ?? { services: [] }) },
      rtl: { ...(rtl?.servicesSection ?? { services: [] }) },
    },
    {
      sectionId: 'process',
      enabled: ltrContent.processSection?.isActive ?? true,
      order: 5,
      ltr: { ...(ltrContent.processSection ?? { steps: [] }) },
      rtl: { ...(rtl?.processSection ?? { steps: [] }) },
    },
    {
      sectionId: 'why',
      enabled: ltrContent.whySection?.isActive ?? true,
      order: 6,
      ltr: { ...(ltrContent.whySection ?? { benefits: [] }) },
      rtl: { ...(rtl?.whySection ?? { benefits: [] }) },
    },
    {
      sectionId: 'visit',
      enabled: ltrContent.visitSection?.isActive ?? true,
      order: 7,
      ltr: { ...(ltrContent.visitSection ?? {}) },
      rtl: { ...(rtl?.visitSection ?? {}) },
    },
    {
      sectionId: 'cta',
      enabled: ltrContent.ctaSection?.isActive ?? true,
      order: 8,
      ltr: { ...(ltrContent.ctaSection ?? {}) },
      rtl: { ...(rtl?.ctaSection ?? {}) },
    },
  ];
}
