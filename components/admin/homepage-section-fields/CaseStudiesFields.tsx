'use client';

import ImageUpload from '@/components/admin/ui/ImageUpload';
import RichTextEditor from '@/components/admin/ui/RichTextEditor';
import type { SectionFieldsProps } from '@/app/admin/homepage/types';

interface CaseStudyItem {
  title?: string;
  description?: string;
  imagePath?: string;
  link?: string;
  language?: string;
  isActive?: boolean;
}

export function CaseStudiesFields({ formData, setFormData, updateField }: SectionFieldsProps) {
  const ltr = formData.ltr as Record<string, unknown>;
  const rtl = formData.rtl as Record<string, unknown>;
  const caseStudiesLtr = (ltr?.caseStudies as CaseStudyItem[] | undefined) ?? [];
  const caseStudiesRtl = (rtl?.caseStudies as CaseStudyItem[] | undefined) ?? [];
  const maxStudies = Math.max(caseStudiesLtr.length, caseStudiesRtl.length);

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
        <label>Case Studies</label>
        <div className="hero-slides-container">
          {Array.from({ length: maxStudies }).map((_, index: number) => {
            const studyLtr = caseStudiesLtr[index] ?? { title: '', description: '', imagePath: '', link: '#', language: 'ltr', isActive: true };
            const studyRtl = caseStudiesRtl[index] ?? { title: '', description: '', imagePath: '', link: '#', language: 'rtl', isActive: true };
            return (
              <div key={index} className="hero-slide-card">
                <div className="hero-slide-header">
                  <h4>Case Study {index + 1}</h4>
                  {maxStudies > 1 && (
                    <button
                      type="button"
                      className="hero-slide-remove"
                      onClick={() => {
                        const newStudiesLtr = caseStudiesLtr.filter((_: unknown, i: number) => i !== index);
                        const newStudiesRtl = caseStudiesRtl.filter((_: unknown, i: number) => i !== index);
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, caseStudies: newStudiesLtr },
                          rtl: { ...formData.rtl, caseStudies: newStudiesRtl },
                        });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="hero-slide-fields">
                  <div>
                    <div className="form-row-bilingual-header">
                      <div className="form-label-header">English</div>
                      <div className="form-label-header">العربية</div>
                    </div>
                    <div className="form-row-bilingual">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={String(studyLtr.title ?? '')}
                          onChange={(e) => {
                            const newStudies = [...caseStudiesLtr];
                            newStudies[index] = { ...studyLtr, title: e.target.value };
                            setFormData({ ...formData, ltr: { ...formData.ltr, caseStudies: newStudies } });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={String(studyRtl.title ?? '')}
                          onChange={(e) => {
                            const newStudies = [...caseStudiesRtl];
                            newStudies[index] = { ...studyRtl, title: e.target.value };
                            setFormData({ ...formData, rtl: { ...formData.rtl, caseStudies: newStudies } });
                          }}
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
                        <RichTextEditor
                          label="Description"
                          value={String(studyLtr.description ?? '')}
                          onChange={(value) => {
                            const newStudies = [...caseStudiesLtr];
                            newStudies[index] = { ...studyLtr, description: value };
                            setFormData({ ...formData, ltr: { ...formData.ltr, caseStudies: newStudies } });
                          }}
                          placeholder="Enter case study description..."
                        />
                      </div>
                      <div className="form-group">
                        <RichTextEditor
                          label="Description"
                          value={String(studyRtl.description ?? '')}
                          onChange={(value) => {
                            const newStudies = [...caseStudiesRtl];
                            newStudies[index] = { ...studyRtl, description: value };
                            setFormData({ ...formData, rtl: { ...formData.rtl, caseStudies: newStudies } });
                          }}
                          placeholder="أدخل وصف دراسة الحالة..."
                          className="rtl-editor"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <ImageUpload
                      label="Image"
                      value={String(studyLtr.imagePath ?? '')}
                      onChange={(value) => {
                        const newStudiesLtr = [...caseStudiesLtr];
                        const newStudiesRtl = [...caseStudiesRtl];
                        newStudiesLtr[index] = { ...studyLtr, imagePath: value };
                        newStudiesRtl[index] = { ...studyRtl, imagePath: value };
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, caseStudies: newStudiesLtr },
                          rtl: { ...formData.rtl, caseStudies: newStudiesRtl },
                        });
                      }}
                      folder="case-studies-item"
                      helperText="Recommended: 946 × 1260 px (~3:4)."
                    />
                  </div>
                  <div className="form-group">
                    <label>Link</label>
                    <input
                      type="text"
                      value={String(studyLtr.link ?? '')}
                      onChange={(e) => {
                        const newStudiesLtr = [...caseStudiesLtr];
                        const newStudiesRtl = [...caseStudiesRtl];
                        newStudiesLtr[index] = { ...studyLtr, link: e.target.value };
                        newStudiesRtl[index] = { ...studyRtl, link: e.target.value };
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, caseStudies: newStudiesLtr },
                          rtl: { ...formData.rtl, caseStudies: newStudiesRtl },
                        });
                      }}
                      placeholder="#"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className="hero-add-slide-button"
            onClick={() => {
              const newStudy = { title: '', description: '', imagePath: '', link: '#', language: 'ltr', isActive: true };
              setFormData({
                ...formData,
                ltr: { ...formData.ltr, caseStudies: [...caseStudiesLtr, { ...newStudy, language: 'ltr' }] },
                rtl: { ...formData.rtl, caseStudies: [...caseStudiesRtl, { ...newStudy, language: 'rtl' }] },
              });
            }}
          >
            + Add More Case Study
          </button>
        </div>
      </div>
    </>
  );
}
