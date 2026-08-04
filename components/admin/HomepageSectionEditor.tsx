'use client';

import { useState, useEffect, useRef } from 'react';
import type { SectionData, SectionEditorProps, SectionFormData } from '@/app/admin/homepage/types';
import { SECTION_FIELD_RENDERERS } from './homepage-section-fields';
import { commitPendingUploads, discardPendingUploads } from '@/lib/pending-uploads';

export default function HomepageSectionEditor({
  sectionId,
  section,
  onSave,
  isOpen,
  onToggle,
}: SectionEditorProps) {
  const [formData, setFormData] = useState<SectionFormData>({
    ltr: section?.ltr ?? {},
    rtl: section?.rtl ?? {},
  });
  const [saving, setSaving] = useState(false);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    if (section) {
      const ltrData = (section.ltr ?? {}) as Record<string, unknown>;
      const rtlData = (section.rtl ?? {}) as Record<string, unknown>;
      if (sectionId === 'hero') {
        setFormData({
          ltr: { slides: Array.isArray(ltrData.slides) ? ltrData.slides : (ltrData.title ? [ltrData] : []) },
          rtl: { slides: Array.isArray(rtlData.slides) ? rtlData.slides : (rtlData.title ? [rtlData] : []) },
        });
      } else if (sectionId === 'process') {
        setFormData({
          ltr: { ...ltrData, steps: Array.isArray(ltrData.steps) ? ltrData.steps : [] },
          rtl: { ...rtlData, steps: Array.isArray(rtlData.steps) ? rtlData.steps : [] },
        });
      } else if (sectionId === 'caseStudies') {
        setFormData({
          ltr: { ...ltrData, caseStudies: Array.isArray(ltrData.caseStudies) ? ltrData.caseStudies : [] },
          rtl: { ...rtlData, caseStudies: Array.isArray(rtlData.caseStudies) ? rtlData.caseStudies : [] },
        });
      } else if (sectionId === 'features') {
        setFormData({
          ltr: {
            ...ltrData,
            benefits: Array.isArray(ltrData.benefits) ? ltrData.benefits : [],
            counters: Array.isArray(ltrData.counters) ? ltrData.counters : [],
          },
          rtl: {
            ...rtlData,
            benefits: Array.isArray(rtlData.benefits) ? rtlData.benefits : [],
            counters: Array.isArray(rtlData.counters) ? rtlData.counters : [],
          },
        });
      } else if (sectionId === 'brands') {
        setFormData({
          ltr: { ...ltrData, brands: Array.isArray(ltrData.brands) ? ltrData.brands : [] },
          rtl: { ...rtlData, brands: Array.isArray(rtlData.brands) ? rtlData.brands : [] },
        });
      } else {
        setFormData({ ltr: ltrData, rtl: rtlData });
      }
    } else {
      const emptyLtr: Record<string, unknown> =
        sectionId === 'hero'
          ? { slides: [] }
          : sectionId === 'services'
            ? { tag: '', heading: '', subheading: '', language: 'ltr', isActive: true }
            : sectionId === 'process'
              ? { steps: [], tag: '', heading: '', subheading: '', buttonText: '', buttonLink: '', language: 'ltr', isActive: true }
              : sectionId === 'caseStudies'
                ? { caseStudies: [], tag: '', heading: '', subheading: '', language: 'ltr', isActive: true }
                : sectionId === 'features'
                  ? {
                      benefits: [],
                      counters: [],
                      tag: '',
                      heading: '',
                      description: '',
                      imagePath: '',
                      buttonText: '',
                      buttonLink: '',
                      language: 'ltr',
                      isActive: true,
                    }
                  : sectionId === 'brands'
                      ? { brands: [], heading: '', language: 'ltr', isActive: true }
                      : {};
      setFormData({ ltr: emptyLtr, rtl: { ...emptyLtr, language: 'rtl' } });
    }
  }, [section, sectionId]);

  const handleCancel = () => {
    discardPendingUploads();
    onToggle();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await commitPendingUploads();
      const latest = formDataRef.current;
      const updateData: Partial<SectionData> = {
        enabled: section?.enabled ?? true,
        order: section?.order ?? 0,
        ltr: latest.ltr,
        rtl: latest.rtl,
      };
      await onSave(sectionId, updateData);
    } catch (err) {
      console.error('Failed to upload pending images:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (lang: 'ltr' | 'rtl', path: string, value: unknown) => {
    const keys = path.split('.');
    setFormData((prev) => {
      const newData = { ...prev };
      const langData = { ...newData[lang] } as Record<string, unknown>;
      let current: Record<string, unknown> = langData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object') current[keys[i]] = {};
        current = current[keys[i]] as Record<string, unknown>;
      }
      current[keys[keys.length - 1]] = value;
      return { ...newData, [lang]: langData };
    });
  };

  const FieldRenderer = SECTION_FIELD_RENDERERS[sectionId];
  const fields = FieldRenderer ? (
    <FieldRenderer formData={formData} setFormData={setFormData} updateField={updateField} />
  ) : null;

  return (
    <div className="admin-cms-section-card" style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div
        className="admin-cms-section-header"
        onClick={handleCancel}
        style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}
      >
        <h3 style={{ color: '#1f2937', fontWeight: '600', margin: 0, textTransform: 'capitalize' }}>{sectionId}</h3>
        <span className="admin-cms-toggle">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <form onSubmit={handleSubmit} className="admin-cms-form">
          {fields}
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save (English & Arabic)'}
            </button>
            <button type="button" className="admin-btn admin-btn-edit" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
