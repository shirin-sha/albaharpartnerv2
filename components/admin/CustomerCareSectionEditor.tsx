'use client';

import { useState, useEffect, useRef } from 'react';
import type { CccSectionData, CccSectionEditorProps, CccSectionFormData } from '@/app/admin/cms/customer-care-center/types';
import { CCC_SECTION_LABELS, type CccSectionId } from '@/app/admin/cms/customer-care-center/constants';
import { CCC_SECTION_FIELD_RENDERERS } from './customer-care-section-fields';
import { commitPendingUploads, discardPendingUploads } from '@/lib/pending-uploads';

function emptyForSection(sectionId: string, lang: 'ltr' | 'rtl'): Record<string, unknown> {
  switch (sectionId) {
    case 'meta':
      return { title: '', description: '', keywords: [] };
    case 'header':
      return {
        breadcrumb: lang === 'rtl' ? 'مركز خدمة العملاء' : 'Customer Care Center',
        tag: '',
        title: '',
        subtitle: '',
        imagePath: '',
        isActive: true,
      };
    case 'infoBar':
      return { items: [], isActive: true };
    case 'overview':
      return { tag: '', heading: '', description: '', imagePath: '', isActive: true };
    case 'services':
      return { tag: '', heading: '', services: [], isActive: true };
    case 'process':
      return { tag: '', heading: '', steps: [], isActive: true };
    case 'why':
      return { tag: '', heading: '', imagePath: '', benefits: [], isActive: true };
    case 'visit':
      return {
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
      };
    case 'cta':
      return {
        heading: '',
        subheading: '',
        primaryButtonText: '',
        primaryButtonLink: '/contact-us',
        secondaryButtonText: '',
        secondaryButtonLink: 'tel:+9651848848',
        isActive: true,
      };
    default:
      return {};
  }
}

export default function CustomerCareSectionEditor({
  sectionId,
  section,
  onSave,
  isOpen,
  onToggle,
}: CccSectionEditorProps) {
  const [formData, setFormData] = useState<CccSectionFormData>({
    ltr: section?.ltr ?? {},
    rtl: section?.rtl ?? {},
  });
  const [saving, setSaving] = useState(false);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    if (section) {
      setFormData({
        ltr: (section.ltr ?? {}) as Record<string, unknown>,
        rtl: (section.rtl ?? {}) as Record<string, unknown>,
      });
    } else {
      setFormData({
        ltr: emptyForSection(sectionId, 'ltr'),
        rtl: emptyForSection(sectionId, 'rtl'),
      });
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
      const updateData: Partial<CccSectionData> = {
        enabled: section?.enabled ?? true,
        order: section?.order ?? 0,
        ltr: latest.ltr,
        rtl: latest.rtl,
      };
      await onSave(sectionId, updateData);
    } catch (err) {
      console.error('Failed to save customer care section:', err);
      alert(err instanceof Error ? err.message : 'Failed to save');
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

  const FieldRenderer = CCC_SECTION_FIELD_RENDERERS[sectionId];
  const fields = FieldRenderer ? (
    <FieldRenderer formData={formData} setFormData={setFormData} updateField={updateField} />
  ) : null;

  const label =
    CCC_SECTION_LABELS[sectionId as CccSectionId] ??
    sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

  return (
    <div className="admin-cms-section-card" style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div
        className="admin-cms-section-header"
        onClick={handleCancel}
        style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}
      >
        <h3 style={{ color: '#1f2937', fontWeight: '600', margin: 0 }}>{label}</h3>
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
