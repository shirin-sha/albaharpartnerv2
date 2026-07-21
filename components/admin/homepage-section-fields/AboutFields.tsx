'use client';

import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function AboutFields({ formData, updateField }: SectionFieldsProps) {
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
            <label>Description</label>
            <textarea value={String(ltr?.description ?? '')} onChange={(e) => updateField('ltr', 'description', e.target.value)} rows={6} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea dir="rtl" value={String(rtl?.description ?? '')} onChange={(e) => updateField('rtl', 'description', e.target.value)} rows={6} />
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
            <label>Button Text</label>
            <input type="text" value={String(ltr?.buttonText ?? '')} onChange={(e) => updateField('ltr', 'buttonText', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Button Text</label>
            <input type="text" dir="rtl" value={String(rtl?.buttonText ?? '')} onChange={(e) => updateField('rtl', 'buttonText', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Button Link</label>
        <input
          type="text"
          value={String(ltr?.buttonLink ?? '')}
          onChange={(e) => {
            updateField('ltr', 'buttonLink', e.target.value);
            updateField('rtl', 'buttonLink', e.target.value);
          }}
        />
      </div>
      <div>
        <div className="form-row-bilingual-header">
          <div className="form-label-header">English</div>
          <div className="form-label-header">العربية</div>
        </div>
        <div className="form-row-bilingual">
          <div className="form-group">
            <label>Phone Label</label>
            <input type="text" value={String(ltr?.phoneLabel ?? '')} onChange={(e) => updateField('ltr', 'phoneLabel', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone Label</label>
            <input type="text" dir="rtl" value={String(rtl?.phoneLabel ?? '')} onChange={(e) => updateField('rtl', 'phoneLabel', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          value={String(ltr?.phoneNumber ?? '')}
          onChange={(e) => {
            updateField('ltr', 'phoneNumber', e.target.value);
            updateField('rtl', 'phoneNumber', e.target.value);
          }}
        />
      </div>
    </>
  );
}
