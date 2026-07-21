'use client';

import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function ServicesFields({ formData, updateField }: SectionFieldsProps) {
  const ltr = formData.ltr as Record<string, unknown>;
  const rtl = formData.rtl as Record<string, unknown>;
  return (
    <>
      <div>
        <div className="form-row-bilingual-header">
          <div className="form-label-header">English</div>
          <div className="form-label-header">العربية</div>
        </div>
        <div className="form-row-bilingual">
          <div className="form-group">
            <label>Tag</label>
            <input type="text" value={String(ltr?.tag ?? '')} onChange={(e) => updateField('ltr', 'tag', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tag</label>
            <input type="text" dir="rtl" value={String(rtl?.tag ?? '')} onChange={(e) => updateField('rtl', 'tag', e.target.value)} />
          </div>
        </div>
      </div>
      <div>
        <div className="form-row-bilingual-header">
          <div className="form-label-header">English</div>
          <div className="form-label-header">العربية</div>
        </div>
        <div className="form-row-bilingual">
          <div className="form-group">
            <label>Heading</label>
            <input type="text" value={String(ltr?.heading ?? '')} onChange={(e) => updateField('ltr', 'heading', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Heading</label>
            <input type="text" dir="rtl" value={String(rtl?.heading ?? '')} onChange={(e) => updateField('rtl', 'heading', e.target.value)} />
          </div>
        </div>
      </div>
      <div>
        <div className="form-row-bilingual-header">
          <div className="form-label-header">English</div>
          <div className="form-label-header">العربية</div>
        </div>
        <div className="form-row-bilingual">
          <div className="form-group">
            <label>Subheading</label>
            <input type="text" value={String(ltr?.subheading ?? '')} onChange={(e) => updateField('ltr', 'subheading', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Subheading</label>
            <input type="text" dir="rtl" value={String(rtl?.subheading ?? '')} onChange={(e) => updateField('rtl', 'subheading', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={ltr?.isActive !== undefined ? Boolean(ltr.isActive) : true}
            onChange={(e) => updateField('ltr', 'isActive', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Active
        </label>
      </div>
      <div className="form-group" style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '6px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          <strong>Note:</strong> Individual solutions are managed in <strong>Solutions Management</strong> page.
          This section only controls the section header (tag, heading, subheading).
        </p>
      </div>
    </>
  );
}
