'use client';

import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { SectionFieldsProps } from '@/app/admin/homepage/types';

interface BrandItem {
  name?: string;
  imagePath?: string;
  link?: string;
  isActive?: boolean;
}

export function BrandsFields({ formData, setFormData, updateField }: SectionFieldsProps) {
  const ltr = formData.ltr as Record<string, unknown>;
  const rtl = formData.rtl as Record<string, unknown>;
  const brandsLtr = (ltr?.brands as BrandItem[] | undefined) ?? [];
  const brandsRtl = (rtl?.brands as BrandItem[] | undefined) ?? [];
  const maxBrands = Math.max(brandsLtr.length, brandsRtl.length);

  return (
    <>
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
      <div className="form-group">
        <label>Brands</label>
        <div className="hero-slides-container">
          {Array.from({ length: maxBrands }).map((_, index: number) => {
            const brandLtr = brandsLtr[index] ?? { name: '', imagePath: '', link: '#', isActive: true };
            const brandRtl = brandsRtl[index] ?? { name: '', imagePath: '', link: '#', isActive: true };
            return (
              <div key={index} className="hero-slide-card">
                <div className="hero-slide-header">
                  <h4>Brand {index + 1}</h4>
                  {maxBrands > 1 && (
                    <button
                      type="button"
                      className="hero-slide-remove"
                      onClick={() => {
                        const newBrandsLtr = brandsLtr.filter((_: unknown, i: number) => i !== index);
                        const newBrandsRtl = brandsRtl.filter((_: unknown, i: number) => i !== index);
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, brands: newBrandsLtr },
                          rtl: { ...formData.rtl, brands: newBrandsRtl },
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
                        <label>Name</label>
                        <input
                          type="text"
                          value={String(brandLtr.name ?? '')}
                          onChange={(e) => {
                            const newBrands = [...brandsLtr];
                            newBrands[index] = { ...brandLtr, name: e.target.value };
                            setFormData({ ...formData, ltr: { ...formData.ltr, brands: newBrands } });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={String(brandRtl.name ?? '')}
                          onChange={(e) => {
                            const newBrands = [...brandsRtl];
                            newBrands[index] = { ...brandRtl, name: e.target.value };
                            setFormData({ ...formData, rtl: { ...formData.rtl, brands: newBrands } });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <ImageUpload
                      label="Image"
                      value={String(brandLtr.imagePath ?? '')}
                      onChange={(value) => {
                        const newBrandsLtr = [...brandsLtr];
                        const newBrandsRtl = [...brandsRtl];
                        newBrandsLtr[index] = { ...brandLtr, imagePath: value };
                        newBrandsRtl[index] = { ...brandRtl, imagePath: value };
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, brands: newBrandsLtr },
                          rtl: { ...formData.rtl, brands: newBrandsRtl },
                        });
                      }}
                      folder="brand"
                      helperText="Recommended: 400 × 200 px (2:1). Transparent PNG; contained, no crop."
                    />
                  </div>
                  <div className="form-group">
                    <label>Link</label>
                    <input
                      type="text"
                      value={String(brandLtr.link ?? '')}
                      onChange={(e) => {
                        const newBrandsLtr = [...brandsLtr];
                        const newBrandsRtl = [...brandsRtl];
                        newBrandsLtr[index] = { ...brandLtr, link: e.target.value };
                        newBrandsRtl[index] = { ...brandRtl, link: e.target.value };
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, brands: newBrandsLtr },
                          rtl: { ...formData.rtl, brands: newBrandsRtl },
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
              const newBrand = { name: '', imagePath: '', link: '#', isActive: true };
              setFormData({
                ...formData,
                ltr: { ...formData.ltr, brands: [...brandsLtr, newBrand] },
                rtl: { ...formData.rtl, brands: [...brandsRtl, newBrand] },
              });
            }}
          >
            + Add More Brand
          </button>
        </div>
      </div>
    </>
  );
}
