'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CustomerCareContent } from '@/types/customer-care-center';
import { buildCccSectionsFromContent } from '../constants';
import type { CccSectionData } from '../types';

function emptyContent(lang: 'ltr' | 'rtl'): CustomerCareContent {
  return {
    language: lang,
    isActive: true,
    seo: { title: '', description: '', keywords: [] },
    header: {
      breadcrumb: lang === 'rtl' ? 'مركز خدمة العملاء' : 'Customer Care Center',
      tag: '',
      title: '',
      subtitle: '',
      imagePath: '',
      isActive: true,
    },
    infoBar: { items: [], isActive: true },
    overviewSection: {
      tag: '',
      heading: '',
      description: '',
      imagePath: '',
      isActive: true,
    },
    servicesSection: { tag: '', heading: '', services: [], isActive: true },
    processSection: { tag: '', heading: '', steps: [], isActive: true },
    whySection: { tag: '', heading: '', imagePath: '', benefits: [], isActive: true },
    visitSection: {
      tag: '',
      locationLabel: '',
      locationValue: '',
      hoursLabel: '',
      hoursValue: '',
      callLabel: '',
      callValue: '',
      emailLabel: '',
      emailValue: '',
      directionsText: '',
      directionsUrl: '',
      mapEmbedUrl: '',
      isActive: true,
    },
    ctaSection: {
      heading: '',
      subheading: '',
      primaryButtonText: '',
      primaryButtonLink: '/contact-us',
      secondaryButtonText: '',
      secondaryButtonLink: 'tel:+9651848848',
      isActive: true,
    },
  };
}

function applySection(
  content: CustomerCareContent,
  sectionId: string,
  sectionData: Record<string, unknown>,
  lang: 'ltr' | 'rtl'
): CustomerCareContent {
  const next = { ...content, language: lang };

  switch (sectionId) {
    case 'meta': {
      const keywordsRaw = sectionData.keywords;
      const keywords = Array.isArray(keywordsRaw)
        ? (keywordsRaw as string[])
        : String(keywordsRaw ?? '')
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean);
      next.seo = {
        title: String(sectionData.title ?? ''),
        description: String(sectionData.description ?? ''),
        keywords,
      };
      break;
    }
    case 'header':
      next.header = {
        ...next.header,
        ...sectionData,
        isActive: sectionData.isActive !== false,
      } as CustomerCareContent['header'];
      break;
    case 'infoBar':
      next.infoBar = {
        items: Array.isArray(sectionData.items) ? (sectionData.items as CustomerCareContent['infoBar']['items']) : [],
        isActive: sectionData.isActive !== false,
      };
      break;
    case 'overview':
      next.overviewSection = {
        ...next.overviewSection,
        ...sectionData,
        isActive: sectionData.isActive !== false,
      } as CustomerCareContent['overviewSection'];
      break;
    case 'services':
      next.servicesSection = {
        tag: String(sectionData.tag ?? ''),
        heading: String(sectionData.heading ?? ''),
        services: Array.isArray(sectionData.services)
          ? (sectionData.services as CustomerCareContent['servicesSection']['services'])
          : [],
        isActive: sectionData.isActive !== false,
      };
      break;
    case 'process':
      next.processSection = {
        tag: String(sectionData.tag ?? ''),
        heading: String(sectionData.heading ?? ''),
        steps: Array.isArray(sectionData.steps)
          ? (sectionData.steps as CustomerCareContent['processSection']['steps'])
          : [],
        isActive: sectionData.isActive !== false,
      };
      break;
    case 'why':
      next.whySection = {
        tag: String(sectionData.tag ?? ''),
        heading: String(sectionData.heading ?? ''),
        imagePath: String(sectionData.imagePath ?? ''),
        benefits: Array.isArray(sectionData.benefits)
          ? (sectionData.benefits as CustomerCareContent['whySection']['benefits'])
          : [],
        isActive: sectionData.isActive !== false,
      };
      break;
    case 'visit':
      next.visitSection = {
        ...next.visitSection,
        ...sectionData,
        isActive: sectionData.isActive !== false,
      } as CustomerCareContent['visitSection'];
      break;
    case 'cta':
      next.ctaSection = {
        ...next.ctaSection,
        ...sectionData,
        isActive: sectionData.isActive !== false,
      } as CustomerCareContent['ctaSection'];
      break;
  }

  return next;
}

export function useCustomerCareSections() {
  const [sections, setSections] = useState<CccSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [cachedLtr, setCachedLtr] = useState<CustomerCareContent | null>(null);
  const [cachedRtl, setCachedRtl] = useState<CustomerCareContent | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/customer-care-center?language=ltr'),
        fetch('/api/customer-care-center?language=rtl'),
      ]);
      const [ltrJson, rtlJson] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      const ltr = (ltrJson.success && ltrJson.data ? ltrJson.data : emptyContent('ltr')) as CustomerCareContent;
      const rtl = (rtlJson.success && rtlJson.data ? rtlJson.data : emptyContent('rtl')) as CustomerCareContent;
      setCachedLtr(ltr);
      setCachedRtl(rtl);
      setSections(buildCccSectionsFromContent(ltr, rtl));
    } catch (error) {
      console.error(error);
      const ltr = emptyContent('ltr');
      const rtl = emptyContent('rtl');
      setCachedLtr(ltr);
      setCachedRtl(rtl);
      setSections(buildCccSectionsFromContent(ltr, rtl));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const saveSection = useCallback(
    async (sectionId: string, data: Partial<CccSectionData>) => {
      const ltrBase = cachedLtr ?? emptyContent('ltr');
      const rtlBase = cachedRtl ?? emptyContent('rtl');
      const ltrData = (data.ltr ?? {}) as Record<string, unknown>;
      const rtlData = (data.rtl ?? {}) as Record<string, unknown>;

      const nextLtr = applySection(ltrBase, sectionId, ltrData, 'ltr');
      const nextRtl = applySection(rtlBase, sectionId, rtlData, 'rtl');

      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/customer-care-center', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextLtr, language: 'ltr' }),
        }),
        fetch('/api/customer-care-center', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextRtl, language: 'rtl' }),
        }),
      ]);

      const [ltrJson, rtlJson] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      if (!ltrJson.success || !rtlJson.success) {
        throw new Error(ltrJson.message || rtlJson.message || 'Failed to save');
      }

      setCachedLtr(nextLtr);
      setCachedRtl(nextRtl);
      setSections(buildCccSectionsFromContent(nextLtr, nextRtl));
      setSelectedSection(null);
      alert(`${sectionId} saved successfully (English & Arabic)!`);
    },
    [cachedLtr, cachedRtl]
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
