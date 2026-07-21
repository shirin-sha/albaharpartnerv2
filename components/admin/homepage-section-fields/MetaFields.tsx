'use client';

import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function MetaFields({ formData, updateField }: SectionFieldsProps) {
  const ltr = formData.ltr as Record<string, unknown>;
  const rtl = formData.rtl as Record<string, unknown>;

  return (
    <div className="meta-fields-container" style={{ padding: '16px' }}>
      <div className="form-row-bilingual-header">
        <div className="form-label-header">English (SEO)</div>
        <div className="form-label-header">العربية (SEO)</div>
      </div>

      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Meta Title</label>
          <input
            type="text"
            value={String(ltr?.title ?? '')}
            onChange={(e) => updateField('ltr', 'title', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Meta Title</label>
          <input
            type="text"
            dir="rtl"
            value={String(rtl?.title ?? '')}
            onChange={(e) => updateField('rtl', 'title', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            rows={3}
            value={String(ltr?.description ?? '')}
            onChange={(e) => updateField('ltr', 'description', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            rows={3}
            dir="rtl"
            value={String(rtl?.description ?? '')}
            onChange={(e) => updateField('rtl', 'description', e.target.value)}
          />
        </div>
      </div>

        <div className="form-row-bilingual">
            <div className="form-group">
            <label>Keywords (comma-separated)</label>
            <input
                type="text"
                placeholder="e.g. construction, partners, UAE"
                value={String(ltr?.keywords ?? '')}
                onChange={(e) => updateField('ltr', 'keywords', e.target.value)}
            />
            </div>
            <div className="form-group">
            <label>Keywords (comma-separated)</label>
            <input
                type="text"
                dir="rtl"
                value={String(rtl?.keywords ?? '')}
                onChange={(e) => updateField('rtl', 'keywords', e.target.value)}
            />
            </div>
        </div>
    </div>
  );
}

