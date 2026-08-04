'use client';

import { HeroSlide } from '@/types/homepage';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function HeroFields({ formData, setFormData }: SectionFieldsProps) {
  const slidesLtr = (formData.ltr?.slides as HeroSlide[] | undefined) ?? [];
  const slidesRtl = (formData.rtl?.slides as HeroSlide[] | undefined) ?? [];
  const maxSlides = Math.max(slidesLtr.length, slidesRtl.length);

  return (
    <>
      {Array.from({ length: maxSlides }).map((_, index: number) => {
        const slideLtr = slidesLtr[index] ?? { title: '', subtitle: '', buttonText: '', buttonLink: '', image: '', order: index, language: 'ltr', isActive: true };
        const slideRtl = slidesRtl[index] ?? { title: '', subtitle: '', buttonText: '', buttonLink: '', image: '', order: index, language: 'rtl', isActive: true };
        return (
          <div key={index} style={{ marginBottom: '24px', padding: '20px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Slide {index + 1}</h4>
              {maxSlides > 1 && (
                <button
                  type="button"
                  className="admin-btn admin-btn-delete"
                  onClick={() => {
                    const newSlidesLtr = slidesLtr.filter((_: unknown, i: number) => i !== index);
                    const newSlidesRtl = slidesRtl.filter((_: unknown, i: number) => i !== index);
                    setFormData({
                      ...formData,
                      ltr: { ...formData.ltr, slides: newSlidesLtr },
                      rtl: { ...formData.rtl, slides: newSlidesRtl },
                    });
                  }}
                >
                  Remove
                </button>
              )}
            </div>
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
                    value={slideLtr.title ?? ''}
                    onChange={(e) => {
                      const newSlides = [...slidesLtr];
                      newSlides[index] = { ...slideLtr, title: e.target.value };
                      setFormData({ ...formData, ltr: { ...formData.ltr, slides: newSlides } });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={slideRtl.title ?? ''}
                    onChange={(e) => {
                      const newSlides = [...slidesRtl];
                      newSlides[index] = { ...slideRtl, title: e.target.value };
                      setFormData({ ...formData, rtl: { ...formData.rtl, slides: newSlides } });
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
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={slideLtr.subtitle ?? ''}
                    onChange={(e) => {
                      const newSlides = [...slidesLtr];
                      newSlides[index] = { ...slideLtr, subtitle: e.target.value };
                      setFormData({ ...formData, ltr: { ...formData.ltr, slides: newSlides } });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={slideRtl.subtitle ?? ''}
                    onChange={(e) => {
                      const newSlides = [...slidesRtl];
                      newSlides[index] = { ...slideRtl, subtitle: e.target.value };
                      setFormData({ ...formData, rtl: { ...formData.rtl, slides: newSlides } });
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
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={slideLtr.buttonText ?? ''}
                    onChange={(e) => {
                      const newSlides = [...slidesLtr];
                      newSlides[index] = { ...slideLtr, buttonText: e.target.value };
                      setFormData({ ...formData, ltr: { ...formData.ltr, slides: newSlides } });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={slideRtl.buttonText ?? ''}
                    onChange={(e) => {
                      const newSlides = [...slidesRtl];
                      newSlides[index] = { ...slideRtl, buttonText: e.target.value };
                      setFormData({ ...formData, rtl: { ...formData.rtl, slides: newSlides } });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                value={slideLtr.buttonLink ?? ''}
                onChange={(e) => {
                  const newSlidesLtr = [...slidesLtr];
                  const newSlidesRtl = [...slidesRtl];
                  newSlidesLtr[index] = { ...slideLtr, buttonLink: e.target.value };
                  newSlidesRtl[index] = { ...slideRtl, buttonLink: e.target.value };
                  setFormData({
                    ...formData,
                    ltr: { ...formData.ltr, slides: newSlidesLtr },
                    rtl: { ...formData.rtl, slides: newSlidesRtl },
                  });
                }}
                placeholder="/solutions"
              />
            </div>
            <div className="form-group">
              <ImageUpload
                label="Image"
                value={slideLtr.image ?? ''}
                onChange={(value) => {
                  const newSlidesLtr = [...slidesLtr];
                  const newSlidesRtl = [...slidesRtl];
                  newSlidesLtr[index] = { ...slideLtr, image: value };
                  newSlidesRtl[index] = { ...slideRtl, image: value };
                  setFormData({
                    ...formData,
                    ltr: { ...formData.ltr, slides: newSlidesLtr },
                    rtl: { ...formData.rtl, slides: newSlidesRtl },
                  });
                }}
                folder="hero"
                helperText="Recommended: 1920 × 1080 px (16:9)."
              />
              <small>Recommended size: 1920 × 1080 px (ratio 16:9)</small>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        className="button button-primary"
        onClick={() => {
          const newSlide: HeroSlide = {
            title: '',
            subtitle: '',
            buttonText: '',
            buttonLink: '',
            image: '',
            order: Math.max(slidesLtr.length, slidesRtl.length),
            language: 'ltr',
            isActive: true,
          };
          setFormData({
            ...formData,
            ltr: { ...formData.ltr, slides: [...slidesLtr, { ...newSlide, language: 'ltr' }] },
            rtl: { ...formData.rtl, slides: [...slidesRtl, { ...newSlide, language: 'rtl' }] },
          });
        }}
      >
        + Add More Slide
      </button>
    </>
  );
}
