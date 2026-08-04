'use client';

import ImageUpload from '@/components/admin/ui/ImageUpload';
import RichTextEditor from '@/components/admin/ui/RichTextEditor';
import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function CtaFields({ formData, updateField }: SectionFieldsProps) {
  const ltr = formData.ltr as Record<string, unknown>;
  const rtl = formData.rtl as Record<string, unknown>;
  return (
    <>
      <div className="hero-slides-container">
        <div className="hero-slide-card">
          <div className="hero-slide-fields">
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
                  <RichTextEditor
                    label="Description"
                    value={String(ltr?.description ?? '')}
                    onChange={(value) => updateField('ltr', 'description', value)}
                    placeholder="Enter description..."
                  />
                </div>
                <div className="form-group">
                  <RichTextEditor
                    label="Description"
                    value={String(rtl?.description ?? '')}
                    onChange={(value) => updateField('rtl', 'description', value)}
                    placeholder="أدخل الوصف..."
                    className="rtl-editor"
                  />
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
              <ImageUpload
                label="Background Image"
                value={String(ltr?.imagePath ?? '')}
                onChange={(value) => {
                  updateField('ltr', 'imagePath', value);
                  updateField('rtl', 'imagePath', value);
                }}
                folder="section"
                helperText="Recommended: 1920 × 800 px (~12:5)."
              />
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
          </div>
        </div>
      </div>
    </>
  );
}
