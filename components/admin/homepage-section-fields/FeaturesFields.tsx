'use client';

import { Counter } from '@/types/homepage';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function FeaturesFields({ formData, setFormData, updateField }: SectionFieldsProps) {
  const ltr = formData.ltr as Record<string, unknown>;
  const rtl = formData.rtl as Record<string, unknown>;
  const benefitsLtr = (ltr?.benefits as string[] | undefined) ?? [];
  const benefitsRtl = (rtl?.benefits as string[] | undefined) ?? [];
  const countersLtr = (ltr?.counters as Counter[] | undefined) ?? [];
  const countersRtl = (rtl?.counters as Counter[] | undefined) ?? [];
  const maxCounters = Math.max(countersLtr.length, countersRtl.length);

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
          folder="section"
        />
      </div>
      <div className="form-group">
        <label>Benefits (English, one per line)</label>
        <textarea
          value={Array.isArray(benefitsLtr) ? benefitsLtr.join('\n') : ''}
          onChange={(e) => {
            const newBenefits = e.target.value.split('\n').filter((f) => f.trim());
            setFormData({ ...formData, ltr: { ...formData.ltr, benefits: newBenefits } });
          }}
          rows={6}
          placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
        />
        <small>Enter each benefit on a new line</small>
      </div>
      <div className="form-group">
        <label>Benefits (Arabic, one per line)</label>
        <textarea
          dir="rtl"
          value={Array.isArray(benefitsRtl) ? benefitsRtl.join('\n') : ''}
          onChange={(e) => {
            const newBenefits = e.target.value.split('\n').filter((f) => f.trim());
            setFormData({ ...formData, rtl: { ...formData.rtl, benefits: newBenefits } });
          }}
          rows={6}
          placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
        />
        <small>Enter each benefit on a new line</small>
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
      <div className="form-group">
        <label>Counters</label>
        <div className="hero-slides-container">
          {Array.from({ length: maxCounters }).map((_, index: number) => {
            const counterLtr = countersLtr[index] ?? { value: 0, label: '', order: index, isActive: true };
            const counterRtl = countersRtl[index] ?? { value: 0, label: '', order: index, isActive: true };
            return (
              <div key={index} className="hero-slide-card">
                <div className="hero-slide-header">
                  <h4>Counter {index + 1}</h4>
                  {maxCounters > 1 && (
                    <button
                      type="button"
                      className="hero-slide-remove"
                      onClick={() => {
                        const newCountersLtr = countersLtr.filter((_: unknown, i: number) => i !== index);
                        const newCountersRtl = countersRtl.filter((_: unknown, i: number) => i !== index);
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, counters: newCountersLtr },
                          rtl: { ...formData.rtl, counters: newCountersRtl },
                        });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="hero-slide-fields">
                  <div className="form-group">
                    <label>Value</label>
                    <input
                      type="number"
                      value={Number(counterLtr.value ?? 0)}
                      onChange={(e) => {
                        const newCountersLtr = [...countersLtr];
                        const newCountersRtl = [...countersRtl];
                        const val = parseInt(e.target.value, 10) || 0;
                        newCountersLtr[index] = { ...counterLtr, value: val };
                        newCountersRtl[index] = { ...counterRtl, value: val };
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, counters: newCountersLtr },
                          rtl: { ...formData.rtl, counters: newCountersRtl },
                        });
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
                        <label>Label</label>
                        <input
                          type="text"
                          value={String(counterLtr.label ?? '')}
                          onChange={(e) => {
                            const newCounters = [...countersLtr];
                            newCounters[index] = { ...counterLtr, label: e.target.value };
                            setFormData({ ...formData, ltr: { ...formData.ltr, counters: newCounters } });
                          }}
                          placeholder="Years<br />Experiences"
                        />
                        <small>Use &lt;br /&gt; for line breaks</small>
                      </div>
                      <div className="form-group">
                        <label>Label</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={String(counterRtl.label ?? '')}
                          onChange={(e) => {
                            const newCounters = [...countersRtl];
                            newCounters[index] = { ...counterRtl, label: e.target.value };
                            setFormData({ ...formData, rtl: { ...formData.rtl, counters: newCounters } });
                          }}
                          placeholder="Years<br />Experiences"
                        />
                        <small>Use &lt;br /&gt; for line breaks</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className="hero-add-slide-button"
            onClick={() => {
              const newCounter: Counter = {
                value: 0,
                label: '',
                order: Math.max(countersLtr.length, countersRtl.length),
                isActive: true,
              };
              setFormData({
                ...formData,
                ltr: { ...formData.ltr, counters: [...countersLtr, newCounter] },
                rtl: { ...formData.rtl, counters: [...countersRtl, newCounter] },
              });
            }}
          >
            + Add More Counter
          </button>
        </div>
      </div>
    </>
  );
}
