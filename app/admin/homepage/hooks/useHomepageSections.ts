'use client';

import { useState, useEffect, useCallback } from 'react';
import type { HomepageContent } from '@/types/homepage';
import type { SectionData } from '../types';
import { buildSectionsFromContent } from '../constants';

function getEmptyContent(lang: 'ltr' | 'rtl'): HomepageContent {
  return {
    _id: '',
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
    language: lang,
    isActive: true,
    heroSlides: [],
    aboutSection: {
      tag: '',
      heading: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      phoneLabel: '',
      phoneNumber: '',
      language: lang,
      isActive: true,
    },
    processSection: {
      tag: '',
      heading: '',
      subheading: '',
      buttonText: '',
      buttonLink: '',
      imagePath: '',
      steps: [],
      language: lang,
      isActive: true,
    },
    servicesSection: {
      tag: '',
      heading: '',
      subheading: '',
      services: [],
      language: lang,
      isActive: true,
    },
    testimonialSection: {
      tag: '',
      heading: '',
      description: '',
      imagePath: '',
      personName: '',
      personTitle: '',
      buttonText: '',
      buttonLink: '',
      language: lang,
      isActive: true,
    },
    brandsSection: {
      heading: '',
      brands: [],
      language: lang,
      isActive: true,
    },
    caseStudiesSection: {
      tag: '',
      heading: '',
      subheading: '',
      caseStudies: [],
      language: lang,
      isActive: true,
    },
    featuresSection: {
      tag: '',
      heading: '',
      description: '',
      imagePath: '',
      counters: [],
      buttonText: '',
      buttonLink: '',
      language: lang,
      isActive: true,
    },
    ctaSection: {
      tag: '',
      heading: '',
      description: '',
      imagePath: '/image/section/bg-section-banner-h8.jpg',
      buttonText: '',
      buttonLink: '',
      phoneLabel: '',
      phoneNumber: '',
      language: lang,
      isActive: true,
    },
  };
}

function applySectionToContent(
  content: HomepageContent,
  sectionId: string,
  sectionData: Record<string, unknown>,
  lang: 'ltr' | 'rtl'
): void {
  switch (sectionId) {
    case 'meta':
      content.seo = {
        title: String((sectionData?.title as string) ?? content.seo?.title ?? ''),
        description: String((sectionData?.description as string) ?? content.seo?.description ?? ''),
        keywords: Array.isArray(sectionData?.keywords)
          ? (sectionData.keywords as string[])
          : (typeof sectionData?.keywords === 'string'
              ? (sectionData.keywords as string).split(',').map((k) => k.trim()).filter(Boolean)
              : (content.seo?.keywords ?? [])),
      };
      break;
    case 'hero':
      content.heroSlides = (sectionData?.slides as HomepageContent['heroSlides']) ?? [];
      break;
    case 'about':
      content.aboutSection = { ...content.aboutSection, ...sectionData, language: lang };
      break;
    case 'process':
      content.processSection = { ...content.processSection, ...sectionData, language: lang };
      break;
    case 'services':
      content.servicesSection = { ...content.servicesSection, ...sectionData, language: lang };
      break;
    case 'testimonial': {
      const testimonialSection = {
        ...content.testimonialSection,
        ...sectionData,
        language: lang,
      } as HomepageContent['testimonialSection'] & Record<string, unknown>;
      delete testimonialSection.secondaryHeading;
      delete testimonialSection.secondaryDescription;
      content.testimonialSection = testimonialSection;
      break;
    }
    case 'brands':
      content.brandsSection = { ...content.brandsSection, ...sectionData, language: lang };
      break;
    case 'caseStudies':
      content.caseStudiesSection = { ...content.caseStudiesSection, ...sectionData, language: lang };
      break;
    case 'features': {
      const featuresSection = {
        ...content.featuresSection,
        ...sectionData,
        language: lang,
      } as HomepageContent['featuresSection'] & Record<string, unknown>;
      delete featuresSection.benefits;
      content.featuresSection = featuresSection;
      break;
    }
    case 'cta':
      content.ctaSection = { ...content.ctaSection, ...sectionData, language: lang };
      break;
  }
}

export function useHomepageSections() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [cachedLtrContent, setCachedLtrContent] = useState<HomepageContent | null>(null);
  const [cachedRtlContent, setCachedRtlContent] = useState<HomepageContent | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch('/api/homepage/all');
      const result = await res.json();

      if (!result.success || !Array.isArray(result.data)) {
        setLoading(false);
        return;
      }

      const contents = result.data as HomepageContent[];
      const ltrContent = contents.find((c) => c.language === 'ltr' && c.isActive);
      const rtlContent = contents.find((c) => c.language === 'rtl' && c.isActive);

      if (ltrContent) setCachedLtrContent(ltrContent);
      if (rtlContent) setCachedRtlContent(rtlContent);
      if (ltrContent) {
        setSections(buildSectionsFromContent(ltrContent, rtlContent ?? null));
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const saveSection = useCallback(
    async (sectionId: string, data: Partial<SectionData>) => {
      const ltrData = (data.ltr ?? {}) as Record<string, unknown>;
      const rtlData = (data.rtl ?? {}) as Record<string, unknown>;

      let ltrContent: HomepageContent = cachedLtrContent ?? getEmptyContent('ltr');
      let rtlContent: HomepageContent = cachedRtlContent ?? getEmptyContent('rtl');

      if (!cachedLtrContent || !cachedRtlContent) {
        const res = await fetch('/api/homepage/all');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          const contents = result.data as HomepageContent[];
          const fetchedLtr = contents.find((c) => c.language === 'ltr' && c.isActive);
          const fetchedRtl = contents.find((c) => c.language === 'rtl' && c.isActive);
          if (fetchedLtr) {
            ltrContent = fetchedLtr;
            setCachedLtrContent(fetchedLtr);
          }
          if (fetchedRtl) {
            rtlContent = fetchedRtl;
            setCachedRtlContent(fetchedRtl);
          }
        }
      }

      applySectionToContent(ltrContent, sectionId, ltrData, 'ltr');
      applySectionToContent(rtlContent, sectionId, rtlData, 'rtl');

      const { blogsSection: _ltrBlogs, ...ltrPayload } = ltrContent as HomepageContent & {
        blogsSection?: unknown;
      };
      const { blogsSection: _rtlBlogs, ...rtlPayload } = rtlContent as HomepageContent & {
        blogsSection?: unknown;
      };

      try {
        const [ltrSaveRes, rtlSaveRes] = await Promise.all([
          fetch('/api/homepage', {
            method: ltrContent._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ltrPayload, language: 'ltr' }),
          }),
          fetch('/api/homepage', {
            method: rtlContent._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...rtlPayload, language: 'rtl' }),
          }),
        ]);

        const [ltrSaveResult, rtlSaveResult] = await Promise.all([
          ltrSaveRes.json(),
          rtlSaveRes.json(),
        ]);

        if (ltrSaveResult.success && rtlSaveResult.success) {
          setCachedLtrContent(ltrContent);
          setCachedRtlContent(rtlContent);
          setSections((prev) =>
            prev.map((s) =>
              s.sectionId === sectionId ? { ...s, ltr: ltrData, rtl: rtlData } : s
            )
          );
          setSelectedSection(null);
          alert(`${sectionId} saved successfully (English & Arabic)!`);
        } else {
          throw new Error(ltrSaveResult.message || rtlSaveResult.message || 'Failed to save');
        }
      } catch (error) {
        console.error('Error saving section:', error);
        throw error instanceof Error ? error : new Error('Failed to save section');
      }
    },
    [cachedLtrContent, cachedRtlContent]
  );

  return {
    sections,
    loading,
    selectedSection,
    setSelectedSection,
    saveSection,
    fetchSections,
  };
}
