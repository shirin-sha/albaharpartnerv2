'use client';

import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { CccInfoItem, CccServiceItem, CccProcessStep, CccBenefit } from '@/types/customer-care-center';
import type { CccSectionFieldComponent, CccSectionFieldsProps } from '@/app/admin/cms/customer-care-center/types';

function BilingualHeader() {
  return (
    <div className="form-row-bilingual-header">
      <div className="form-label-header">English</div>
      <div className="form-label-header">العربية</div>
    </div>
  );
}

export function MetaFields({ formData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  return (
    <>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Meta Title</label>
          <input value={String(ltr.title ?? '')} onChange={(e) => updateField('ltr', 'title', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Meta Title</label>
          <input dir="rtl" value={String(rtl.title ?? '')} onChange={(e) => updateField('rtl', 'title', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Meta Description</label>
          <textarea rows={3} value={String(ltr.description ?? '')} onChange={(e) => updateField('ltr', 'description', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Meta Description</label>
          <textarea rows={3} dir="rtl" value={String(rtl.description ?? '')} onChange={(e) => updateField('rtl', 'description', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Keywords (comma-separated)</label>
          <input value={String(ltr.keywords ?? '')} onChange={(e) => updateField('ltr', 'keywords', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Keywords (comma-separated)</label>
          <input dir="rtl" value={String(rtl.keywords ?? '')} onChange={(e) => updateField('rtl', 'keywords', e.target.value)} />
        </div>
      </div>
    </>
  );
}

export function HeaderFields({ formData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  return (
    <>
      <div className="form-group">
        <ImageUpload
          label="Hero Image"
          value={String(ltr.imagePath || rtl.imagePath || '')}
          onChange={(value) => {
            updateField('ltr', 'imagePath', value);
            updateField('rtl', 'imagePath', value);
          }}
          folder="section"
          helperText="Recommended: 1920 × 900 px (JPEG, PNG, or WebP)."
        />
      </div>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Breadcrumb</label>
          <input value={String(ltr.breadcrumb ?? '')} onChange={(e) => updateField('ltr', 'breadcrumb', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Breadcrumb</label>
          <input dir="rtl" value={String(rtl.breadcrumb ?? '')} onChange={(e) => updateField('rtl', 'breadcrumb', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Tag</label>
          <input value={String(ltr.tag ?? '')} onChange={(e) => updateField('ltr', 'tag', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input dir="rtl" value={String(rtl.tag ?? '')} onChange={(e) => updateField('rtl', 'tag', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Title</label>
          <input value={String(ltr.title ?? '')} onChange={(e) => updateField('ltr', 'title', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input dir="rtl" value={String(rtl.title ?? '')} onChange={(e) => updateField('rtl', 'title', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Subtitle</label>
          <textarea rows={3} value={String(ltr.subtitle ?? '')} onChange={(e) => updateField('ltr', 'subtitle', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Subtitle</label>
          <textarea rows={3} dir="rtl" value={String(rtl.subtitle ?? '')} onChange={(e) => updateField('rtl', 'subtitle', e.target.value)} />
        </div>
      </div>
    </>
  );
}

export function InfoBarFields({ formData, setFormData }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  const itemsLtr = (ltr.items as CccInfoItem[] | undefined) ?? [];
  const itemsRtl = (rtl.items as CccInfoItem[] | undefined) ?? [];
  const max = Math.max(itemsLtr.length, itemsRtl.length, 1);

  return (
    <div className="form-group">
      <label>Info Bar Items</label>
      <div className="hero-slides-container">
        {Array.from({ length: max }).map((_, index) => {
          const itemLtr = itemsLtr[index] ?? { label: '', value: '', iconClass: '' };
          const itemRtl = itemsRtl[index] ?? { label: '', value: '', iconClass: '' };
          return (
            <div key={index} className="hero-slide-card">
              <div className="hero-slide-header">
                <h4>Item {index + 1}</h4>
                {max > 1 && (
                  <button
                    type="button"
                    className="hero-slide-remove"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        ltr: { ...ltr, items: itemsLtr.filter((_, i) => i !== index) },
                        rtl: { ...rtl, items: itemsRtl.filter((_, i) => i !== index) },
                      });
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <label>Icon Class</label>
                <input
                  value={itemLtr.iconClass || ''}
                  onChange={(e) => {
                    const nextLtr = [...itemsLtr];
                    const nextRtl = [...itemsRtl];
                    nextLtr[index] = { ...itemLtr, iconClass: e.target.value };
                    nextRtl[index] = { ...itemRtl, iconClass: e.target.value };
                    setFormData({ ...formData, ltr: { ...ltr, items: nextLtr }, rtl: { ...rtl, items: nextRtl } });
                  }}
                  placeholder="icon-PhoneCall"
                />
              </div>
              <BilingualHeader />
              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Label</label>
                  <input
                    value={itemLtr.label}
                    onChange={(e) => {
                      const next = [...itemsLtr];
                      next[index] = { ...itemLtr, label: e.target.value };
                      setFormData({ ...formData, ltr: { ...ltr, items: next } });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Label</label>
                  <input
                    dir="rtl"
                    value={itemRtl.label}
                    onChange={(e) => {
                      const next = [...itemsRtl];
                      next[index] = { ...itemRtl, label: e.target.value };
                      setFormData({ ...formData, rtl: { ...rtl, items: next } });
                    }}
                  />
                </div>
              </div>
              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Value</label>
                  <input
                    value={itemLtr.value}
                    onChange={(e) => {
                      const next = [...itemsLtr];
                      next[index] = { ...itemLtr, value: e.target.value };
                      setFormData({ ...formData, ltr: { ...ltr, items: next } });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Value</label>
                  <input
                    dir="rtl"
                    value={itemRtl.value}
                    onChange={(e) => {
                      const next = [...itemsRtl];
                      next[index] = { ...itemRtl, value: e.target.value };
                      setFormData({ ...formData, rtl: { ...rtl, items: next } });
                    }}
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
            const blank: CccInfoItem = { label: '', value: '', iconClass: '' };
            setFormData({
              ...formData,
              ltr: { ...ltr, items: [...itemsLtr, blank] },
              rtl: { ...rtl, items: [...itemsRtl, { ...blank }] },
            });
          }}
        >
          + Add Item
        </button>
      </div>
    </div>
  );
}

export function OverviewFields({ formData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  return (
    <>
      <div className="form-group">
        <ImageUpload
          label="Overview Image"
          value={String(ltr.imagePath || rtl.imagePath || '')}
          onChange={(value) => {
            updateField('ltr', 'imagePath', value);
            updateField('rtl', 'imagePath', value);
          }}
          folder="section"
          helperText="Recommended: 900 × 700 px."
        />
      </div>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Tag</label>
          <input value={String(ltr.tag ?? '')} onChange={(e) => updateField('ltr', 'tag', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input dir="rtl" value={String(rtl.tag ?? '')} onChange={(e) => updateField('rtl', 'tag', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Heading</label>
          <input value={String(ltr.heading ?? '')} onChange={(e) => updateField('ltr', 'heading', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Heading</label>
          <input dir="rtl" value={String(rtl.heading ?? '')} onChange={(e) => updateField('rtl', 'heading', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Description</label>
          <textarea rows={4} value={String(ltr.description ?? '')} onChange={(e) => updateField('ltr', 'description', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={4} dir="rtl" value={String(rtl.description ?? '')} onChange={(e) => updateField('rtl', 'description', e.target.value)} />
        </div>
      </div>
    </>
  );
}

export function ServicesFields({ formData, setFormData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  const servicesLtr = (ltr.services as CccServiceItem[] | undefined) ?? [];
  const servicesRtl = (rtl.services as CccServiceItem[] | undefined) ?? [];
  const max = Math.max(servicesLtr.length, servicesRtl.length);

  return (
    <>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Tag</label>
          <input value={String(ltr.tag ?? '')} onChange={(e) => updateField('ltr', 'tag', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input dir="rtl" value={String(rtl.tag ?? '')} onChange={(e) => updateField('rtl', 'tag', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Heading</label>
          <input value={String(ltr.heading ?? '')} onChange={(e) => updateField('ltr', 'heading', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Heading</label>
          <input dir="rtl" value={String(rtl.heading ?? '')} onChange={(e) => updateField('rtl', 'heading', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Services</label>
        <div className="hero-slides-container">
          {Array.from({ length: max }).map((_, index) => {
            const sLtr = servicesLtr[index] ?? { title: '', description: '', iconClass: '', order: index, isActive: true };
            const sRtl = servicesRtl[index] ?? { title: '', description: '', iconClass: '', order: index, isActive: true };
            return (
              <div key={index} className="hero-slide-card">
                <div className="hero-slide-header">
                  <h4>Service {index + 1}</h4>
                  {max > 1 && (
                    <button
                      type="button"
                      className="hero-slide-remove"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          ltr: { ...ltr, services: servicesLtr.filter((_, i) => i !== index) },
                          rtl: { ...rtl, services: servicesRtl.filter((_, i) => i !== index) },
                        });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label>Icon Class</label>
                  <input
                    value={sLtr.iconClass || ''}
                    onChange={(e) => {
                      const nextLtr = [...servicesLtr];
                      const nextRtl = [...servicesRtl];
                      nextLtr[index] = { ...sLtr, iconClass: e.target.value };
                      nextRtl[index] = { ...sRtl, iconClass: e.target.value };
                      setFormData({ ...formData, ltr: { ...ltr, services: nextLtr }, rtl: { ...rtl, services: nextRtl } });
                    }}
                  />
                </div>
                <BilingualHeader />
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      value={sLtr.title}
                      onChange={(e) => {
                        const next = [...servicesLtr];
                        next[index] = { ...sLtr, title: e.target.value };
                        setFormData({ ...formData, ltr: { ...ltr, services: next } });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      dir="rtl"
                      value={sRtl.title}
                      onChange={(e) => {
                        const next = [...servicesRtl];
                        next[index] = { ...sRtl, title: e.target.value };
                        setFormData({ ...formData, rtl: { ...rtl, services: next } });
                      }}
                    />
                  </div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      value={sLtr.description}
                      onChange={(e) => {
                        const next = [...servicesLtr];
                        next[index] = { ...sLtr, description: e.target.value };
                        setFormData({ ...formData, ltr: { ...ltr, services: next } });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={sRtl.description}
                      onChange={(e) => {
                        const next = [...servicesRtl];
                        next[index] = { ...sRtl, description: e.target.value };
                        setFormData({ ...formData, rtl: { ...rtl, services: next } });
                      }}
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
              const order = Math.max(servicesLtr.length, servicesRtl.length);
              const blank: CccServiceItem = { title: '', description: '', iconClass: '', order, isActive: true };
              setFormData({
                ...formData,
                ltr: { ...ltr, services: [...servicesLtr, blank] },
                rtl: { ...rtl, services: [...servicesRtl, { ...blank }] },
              });
            }}
          >
            + Add Service
          </button>
        </div>
      </div>
    </>
  );
}

export function ProcessFields({ formData, setFormData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  const stepsLtr = (ltr.steps as CccProcessStep[] | undefined) ?? [];
  const stepsRtl = (rtl.steps as CccProcessStep[] | undefined) ?? [];
  const max = Math.max(stepsLtr.length, stepsRtl.length);

  return (
    <>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Tag</label>
          <input value={String(ltr.tag ?? '')} onChange={(e) => updateField('ltr', 'tag', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input dir="rtl" value={String(rtl.tag ?? '')} onChange={(e) => updateField('rtl', 'tag', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Heading</label>
          <input value={String(ltr.heading ?? '')} onChange={(e) => updateField('ltr', 'heading', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Heading</label>
          <input dir="rtl" value={String(rtl.heading ?? '')} onChange={(e) => updateField('rtl', 'heading', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Steps</label>
        <div className="hero-slides-container">
          {Array.from({ length: max }).map((_, index) => {
            const sLtr = stepsLtr[index] ?? { title: '', description: '', iconClass: '', order: index, isActive: true };
            const sRtl = stepsRtl[index] ?? { title: '', description: '', iconClass: '', order: index, isActive: true };
            return (
              <div key={index} className="hero-slide-card">
                <div className="hero-slide-header">
                  <h4>Step {index + 1}</h4>
                  {max > 1 && (
                    <button
                      type="button"
                      className="hero-slide-remove"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          ltr: { ...ltr, steps: stepsLtr.filter((_, i) => i !== index) },
                          rtl: { ...rtl, steps: stepsRtl.filter((_, i) => i !== index) },
                        });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label>Icon Class</label>
                  <input
                    value={sLtr.iconClass || ''}
                    onChange={(e) => {
                      const nextLtr = [...stepsLtr];
                      const nextRtl = [...stepsRtl];
                      nextLtr[index] = { ...sLtr, iconClass: e.target.value };
                      nextRtl[index] = { ...sRtl, iconClass: e.target.value };
                      setFormData({ ...formData, ltr: { ...ltr, steps: nextLtr }, rtl: { ...rtl, steps: nextRtl } });
                    }}
                  />
                </div>
                <BilingualHeader />
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      value={sLtr.title}
                      onChange={(e) => {
                        const next = [...stepsLtr];
                        next[index] = { ...sLtr, title: e.target.value };
                        setFormData({ ...formData, ltr: { ...ltr, steps: next } });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      dir="rtl"
                      value={sRtl.title}
                      onChange={(e) => {
                        const next = [...stepsRtl];
                        next[index] = { ...sRtl, title: e.target.value };
                        setFormData({ ...formData, rtl: { ...rtl, steps: next } });
                      }}
                    />
                  </div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      value={sLtr.description}
                      onChange={(e) => {
                        const next = [...stepsLtr];
                        next[index] = { ...sLtr, description: e.target.value };
                        setFormData({ ...formData, ltr: { ...ltr, steps: next } });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={sRtl.description}
                      onChange={(e) => {
                        const next = [...stepsRtl];
                        next[index] = { ...sRtl, description: e.target.value };
                        setFormData({ ...formData, rtl: { ...rtl, steps: next } });
                      }}
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
              const order = Math.max(stepsLtr.length, stepsRtl.length);
              const blank: CccProcessStep = { title: '', description: '', iconClass: '', order, isActive: true };
              setFormData({
                ...formData,
                ltr: { ...ltr, steps: [...stepsLtr, blank] },
                rtl: { ...rtl, steps: [...stepsRtl, { ...blank }] },
              });
            }}
          >
            + Add Step
          </button>
        </div>
      </div>
    </>
  );
}

export function WhyFields({ formData, setFormData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  const benefitsLtr = (ltr.benefits as CccBenefit[] | undefined) ?? [];
  const benefitsRtl = (rtl.benefits as CccBenefit[] | undefined) ?? [];
  const max = Math.max(benefitsLtr.length, benefitsRtl.length);

  return (
    <>
      <div className="form-group">
        <ImageUpload
          label="Section Image"
          value={String(ltr.imagePath || rtl.imagePath || '')}
          onChange={(value) => {
            updateField('ltr', 'imagePath', value);
            updateField('rtl', 'imagePath', value);
          }}
          folder="section"
        />
      </div>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Tag</label>
          <input value={String(ltr.tag ?? '')} onChange={(e) => updateField('ltr', 'tag', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input dir="rtl" value={String(rtl.tag ?? '')} onChange={(e) => updateField('rtl', 'tag', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Heading</label>
          <input value={String(ltr.heading ?? '')} onChange={(e) => updateField('ltr', 'heading', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Heading</label>
          <input dir="rtl" value={String(rtl.heading ?? '')} onChange={(e) => updateField('rtl', 'heading', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Benefits</label>
        <div className="hero-slides-container">
          {Array.from({ length: max }).map((_, index) => {
            const bLtr = benefitsLtr[index] ?? { text: '' };
            const bRtl = benefitsRtl[index] ?? { text: '' };
            return (
              <div key={index} className="hero-slide-card">
                <div className="hero-slide-header">
                  <h4>Benefit {index + 1}</h4>
                  {max > 1 && (
                    <button
                      type="button"
                      className="hero-slide-remove"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          ltr: { ...ltr, benefits: benefitsLtr.filter((_, i) => i !== index) },
                          rtl: { ...rtl, benefits: benefitsRtl.filter((_, i) => i !== index) },
                        });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <BilingualHeader />
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Text</label>
                    <input
                      value={bLtr.text}
                      onChange={(e) => {
                        const next = [...benefitsLtr];
                        next[index] = { text: e.target.value };
                        setFormData({ ...formData, ltr: { ...ltr, benefits: next } });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Text</label>
                    <input
                      dir="rtl"
                      value={bRtl.text}
                      onChange={(e) => {
                        const next = [...benefitsRtl];
                        next[index] = { text: e.target.value };
                        setFormData({ ...formData, rtl: { ...rtl, benefits: next } });
                      }}
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
              setFormData({
                ...formData,
                ltr: { ...ltr, benefits: [...benefitsLtr, { text: '' }] },
                rtl: { ...rtl, benefits: [...benefitsRtl, { text: '' }] },
              });
            }}
          >
            + Add Benefit
          </button>
        </div>
      </div>
    </>
  );
}

export function VisitFields({ formData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  return (
    <>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Tag</label>
          <input value={String(ltr.tag ?? '')} onChange={(e) => updateField('ltr', 'tag', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input dir="rtl" value={String(rtl.tag ?? '')} onChange={(e) => updateField('rtl', 'tag', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Location Label</label>
          <input value={String(ltr.locationLabel ?? '')} onChange={(e) => updateField('ltr', 'locationLabel', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location Label</label>
          <input dir="rtl" value={String(rtl.locationLabel ?? '')} onChange={(e) => updateField('rtl', 'locationLabel', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Location Value</label>
          <input value={String(ltr.locationValue ?? '')} onChange={(e) => updateField('ltr', 'locationValue', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location Value</label>
          <input dir="rtl" value={String(rtl.locationValue ?? '')} onChange={(e) => updateField('rtl', 'locationValue', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Hours Label</label>
          <input value={String(ltr.hoursLabel ?? '')} onChange={(e) => updateField('ltr', 'hoursLabel', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Hours Label</label>
          <input dir="rtl" value={String(rtl.hoursLabel ?? '')} onChange={(e) => updateField('rtl', 'hoursLabel', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Hours Value</label>
          <textarea rows={2} value={String(ltr.hoursValue ?? '')} onChange={(e) => updateField('ltr', 'hoursValue', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Hours Value</label>
          <textarea rows={2} dir="rtl" value={String(rtl.hoursValue ?? '')} onChange={(e) => updateField('rtl', 'hoursValue', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Call Label</label>
          <input value={String(ltr.callLabel ?? '')} onChange={(e) => updateField('ltr', 'callLabel', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Call Label</label>
          <input dir="rtl" value={String(rtl.callLabel ?? '')} onChange={(e) => updateField('rtl', 'callLabel', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Call Value (shared)</label>
        <input
          value={String(ltr.callValue ?? '')}
          onChange={(e) => {
            updateField('ltr', 'callValue', e.target.value);
            updateField('rtl', 'callValue', e.target.value);
          }}
        />
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Email Label</label>
          <input value={String(ltr.emailLabel ?? '')} onChange={(e) => updateField('ltr', 'emailLabel', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email Label</label>
          <input dir="rtl" value={String(rtl.emailLabel ?? '')} onChange={(e) => updateField('rtl', 'emailLabel', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Email Value (shared)</label>
        <input
          value={String(ltr.emailValue ?? '')}
          onChange={(e) => {
            updateField('ltr', 'emailValue', e.target.value);
            updateField('rtl', 'emailValue', e.target.value);
          }}
        />
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Directions Button Text</label>
          <input value={String(ltr.directionsText ?? '')} onChange={(e) => updateField('ltr', 'directionsText', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Directions Button Text</label>
          <input dir="rtl" value={String(rtl.directionsText ?? '')} onChange={(e) => updateField('rtl', 'directionsText', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Directions URL</label>
        <input
          value={String(ltr.directionsUrl ?? '')}
          onChange={(e) => {
            updateField('ltr', 'directionsUrl', e.target.value);
            updateField('rtl', 'directionsUrl', e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <label>Map Embed URL</label>
        <input
          value={String(ltr.mapEmbedUrl ?? '')}
          onChange={(e) => {
            updateField('ltr', 'mapEmbedUrl', e.target.value);
            updateField('rtl', 'mapEmbedUrl', e.target.value);
          }}
        />
      </div>
    </>
  );
}

export function CtaFields({ formData, updateField }: CccSectionFieldsProps) {
  const ltr = formData.ltr;
  const rtl = formData.rtl;
  return (
    <>
      <BilingualHeader />
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Heading</label>
          <input value={String(ltr.heading ?? '')} onChange={(e) => updateField('ltr', 'heading', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Heading</label>
          <input dir="rtl" value={String(rtl.heading ?? '')} onChange={(e) => updateField('rtl', 'heading', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Subheading</label>
          <textarea rows={2} value={String(ltr.subheading ?? '')} onChange={(e) => updateField('ltr', 'subheading', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Subheading</label>
          <textarea rows={2} dir="rtl" value={String(rtl.subheading ?? '')} onChange={(e) => updateField('rtl', 'subheading', e.target.value)} />
        </div>
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Primary Button Text</label>
          <input value={String(ltr.primaryButtonText ?? '')} onChange={(e) => updateField('ltr', 'primaryButtonText', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Primary Button Text</label>
          <input dir="rtl" value={String(rtl.primaryButtonText ?? '')} onChange={(e) => updateField('rtl', 'primaryButtonText', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Primary Button Link</label>
        <input
          value={String(ltr.primaryButtonLink ?? '')}
          onChange={(e) => {
            updateField('ltr', 'primaryButtonLink', e.target.value);
            updateField('rtl', 'primaryButtonLink', e.target.value);
          }}
        />
      </div>
      <div className="form-row-bilingual">
        <div className="form-group">
          <label>Secondary Button Text</label>
          <input value={String(ltr.secondaryButtonText ?? '')} onChange={(e) => updateField('ltr', 'secondaryButtonText', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Secondary Button Text</label>
          <input dir="rtl" value={String(rtl.secondaryButtonText ?? '')} onChange={(e) => updateField('rtl', 'secondaryButtonText', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Secondary Button Link</label>
        <input
          value={String(ltr.secondaryButtonLink ?? '')}
          onChange={(e) => {
            updateField('ltr', 'secondaryButtonLink', e.target.value);
            updateField('rtl', 'secondaryButtonLink', e.target.value);
          }}
        />
      </div>
    </>
  );
}

export const CCC_SECTION_FIELD_RENDERERS: Record<string, CccSectionFieldComponent> = {
  meta: MetaFields,
  header: HeaderFields,
  infoBar: InfoBarFields,
  overview: OverviewFields,
  services: ServicesFields,
  process: ProcessFields,
  why: WhyFields,
  visit: VisitFields,
  cta: CtaFields,
};
