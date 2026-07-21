'use client';

import { ProcessStep } from '@/types/homepage';
import type { SectionFieldsProps } from '@/app/admin/homepage/types';

export function ProcessFields({ formData, setFormData, updateField }: SectionFieldsProps) {
  const ltr = formData.ltr as Record<string, unknown>;
  const rtl = formData.rtl as Record<string, unknown>;
  const stepsLtr = (ltr?.steps as ProcessStep[] | undefined) ?? [];
  const stepsRtl = (rtl?.steps as ProcessStep[] | undefined) ?? [];
  const maxSteps = Math.max(stepsLtr.length, stepsRtl.length);

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
        <label>Steps</label>
        <div className="hero-slides-container">
          {Array.from({ length: maxSteps }).map((_, index: number) => {
            const stepLtr = stepsLtr[index] ?? { title: '', description: '', order: index, language: 'ltr', isActive: true };
            const stepRtl = stepsRtl[index] ?? { title: '', description: '', order: index, language: 'rtl', isActive: true };
            return (
              <div key={index} className="hero-slide-card">
                <div className="hero-slide-header">
                  <h4>Step {index + 1}</h4>
                  {maxSteps > 1 && (
                    <button
                      type="button"
                      className="hero-slide-remove"
                      onClick={() => {
                        const newStepsLtr = stepsLtr.filter((_: unknown, i: number) => i !== index);
                        const newStepsRtl = stepsRtl.filter((_: unknown, i: number) => i !== index);
                        setFormData({
                          ...formData,
                          ltr: { ...formData.ltr, steps: newStepsLtr },
                          rtl: { ...formData.rtl, steps: newStepsRtl },
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
                          value={stepLtr.title ?? ''}
                          onChange={(e) => {
                            const newSteps = [...stepsLtr];
                            newSteps[index] = { ...stepLtr, title: e.target.value };
                            setFormData({ ...formData, ltr: { ...formData.ltr, steps: newSteps } });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={stepRtl.title ?? ''}
                          onChange={(e) => {
                            const newSteps = [...stepsRtl];
                            newSteps[index] = { ...stepRtl, title: e.target.value };
                            setFormData({ ...formData, rtl: { ...formData.rtl, steps: newSteps } });
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
                        <label>Description</label>
                        <textarea
                          value={stepLtr.description ?? ''}
                          onChange={(e) => {
                            const newSteps = [...stepsLtr];
                            newSteps[index] = { ...stepLtr, description: e.target.value };
                            setFormData({ ...formData, ltr: { ...formData.ltr, steps: newSteps } });
                          }}
                          rows={4}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          dir="rtl"
                          value={stepRtl.description ?? ''}
                          onChange={(e) => {
                            const newSteps = [...stepsRtl];
                            newSteps[index] = { ...stepRtl, description: e.target.value };
                            setFormData({ ...formData, rtl: { ...formData.rtl, steps: newSteps } });
                          }}
                          rows={4}
                        />
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
              const newStep: ProcessStep = {
                title: '',
                description: '',
                order: Math.max(stepsLtr.length, stepsRtl.length),
                language: 'ltr',
                isActive: true,
              };
              setFormData({
                ...formData,
                ltr: { ...formData.ltr, steps: [...stepsLtr, { ...newStep, language: 'ltr' }] },
                rtl: { ...formData.rtl, steps: [...stepsRtl, { ...newStep, language: 'rtl' }] },
              });
            }}
          >
            + Add More Step
          </button>
        </div>
      </div>
    </>
  );
}
