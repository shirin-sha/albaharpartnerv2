'use client';

import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function TestimonialFields({ formData, updateField }: SectionFieldsProps) {
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
      <div className="form-group">
        <ImageUpload
          label="Image"
          value={String(ltr?.imagePath ?? '')}
          onChange={(value) => {
            updateField('ltr', 'imagePath', value);
            updateField('rtl', 'imagePath', value);
          }}
          folder="about"
        />
      </div>
      <div>
        <div className="form-row-bilingual-header">
          <div className="form-label-header">English</div>
          <div className="form-label-header">العربية</div>
        </div>
        <div className="form-row-bilingual">
          <div className="form-group">
            <label>Person Name</label>
            <input type="text" value={String(ltr?.personName ?? '')} onChange={(e) => updateField('ltr', 'personName', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Person Name</label>
            <input type="text" dir="rtl" value={String(rtl?.personName ?? '')} onChange={(e) => updateField('rtl', 'personName', e.target.value)} />
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
            <label>Person Title</label>
            <input type="text" value={String(ltr?.personTitle ?? '')} onChange={(e) => updateField('ltr', 'personTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Person Title</label>
            <input type="text" dir="rtl" value={String(rtl?.personTitle ?? '')} onChange={(e) => updateField('rtl', 'personTitle', e.target.value)} />
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
            <label>Secondary Heading</label>
            <input type="text" value={String(ltr?.secondaryHeading ?? '')} onChange={(e) => updateField('ltr', 'secondaryHeading', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Secondary Heading</label>
            <input type="text" dir="rtl" value={String(rtl?.secondaryHeading ?? '')} onChange={(e) => updateField('rtl', 'secondaryHeading', e.target.value)} />
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
            <label>Secondary Description</label>
            <textarea value={String(ltr?.secondaryDescription ?? '')} onChange={(e) => updateField('ltr', 'secondaryDescription', e.target.value)} rows={6} />
          </div>
          <div className="form-group">
            <label>Secondary Description</label>
            <textarea dir="rtl" value={String(rtl?.secondaryDescription ?? '')} onChange={(e) => updateField('rtl', 'secondaryDescription', e.target.value)} rows={6} />
          </div>
        </div>
      </div>
    </>
  );
}
