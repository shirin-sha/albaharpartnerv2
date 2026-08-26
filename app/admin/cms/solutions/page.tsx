'use client';

import { useState, useEffect, useRef } from 'react';
import { commitPendingUploads } from '@/lib/pending-uploads';
import PageHeaderBackgroundField from '@/components/admin/PageHeaderBackgroundField';
import Link from 'next/link';
import { SolutionsContent, defaultSolutionsDetailPage } from '@/types/solutions';

const SOLUTIONS_SECTIONS = [
  { id: 'meta', label: 'Meta (SEO)', description: 'Title, description, keywords (English & Arabic)' },
  { id: 'header', label: 'Page Header', description: 'Solutions listing breadcrumb, title, subtitle, background image' },
  {
    id: 'detailPage',
    label: 'Solutions Detail Page',
    description: 'Detail page title banner crumbs + sidebar contact card (English & Arabic)',
  },
] as const;

type SolutionsSectionId = (typeof SOLUTIONS_SECTIONS)[number]['id'];

export default function SolutionsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<SolutionsContent | null>(null);
  const contentLtrRef = useRef(contentLtr);
  contentLtrRef.current = contentLtr;
  const [contentRtl, setContentRtl] = useState<SolutionsContent | null>(null);
  const contentRtlRef = useRef(contentRtl);
  contentRtlRef.current = contentRtl;
  const [selectedSection, setSelectedSection] = useState<SolutionsSectionId | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Fetch both LTR and RTL content in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/solutions?language=ltr'),
        fetch('/api/solutions?language=rtl'),
      ]);
      
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      
      if (ltrResult.success && ltrResult.data) {
        setContentLtr({
          ...ltrResult.data,
          detailPage: ltrResult.data.detailPage || defaultSolutionsDetailPage('ltr'),
        });
      } else {
        setContentLtr(getEmptyContent('ltr'));
      }
      
      if (rtlResult.success && rtlResult.data) {
        setContentRtl({
          ...rtlResult.data,
          detailPage: rtlResult.data.detailPage || defaultSolutionsDetailPage('rtl'),
        });
      } else {
        setContentRtl(getEmptyContent('rtl'));
      }
    } catch (error) {
      console.error('Error loading content:', error);
      showMessage('error', 'Failed to load content');
      setContentLtr(getEmptyContent('ltr'));
      setContentRtl(getEmptyContent('rtl'));
    } finally {
      setLoading(false);
    }
  };

  const getEmptyContent = (lang: 'ltr' | 'rtl'): SolutionsContent => ({
    language: lang,
    isActive: true,
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
    header: {
      breadcrumb: 'Solutions',
      title: 'Solutions',
      subtitle: '',
      imagePath: '',
      language: lang,
      isActive: true,
    },
    detailPage: defaultSolutionsDetailPage(lang),
    solutions: [],
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveSection = async (section: string) => {
    setSaving(section);
    try {
      await commitPendingUploads();
      const contentLtr = contentLtrRef.current;
      const contentRtl = contentRtlRef.current;
      if (!contentLtr || !contentRtl) return;

      // Save both LTR and RTL in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/solutions', {
          method: contentLtr._id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...contentLtr, language: 'ltr' }),
        }),
        fetch('/api/solutions', {
          method: contentRtl._id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...contentRtl, language: 'rtl' }),
        }),
      ]);
      
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      
      if (ltrResult.success && rtlResult.success) {
        showMessage('success', `${section} saved successfully!`);
        await loadContent();
      } else {
        showMessage('error', ltrResult.message || rtlResult.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      showMessage('error', 'Failed to save');
    } finally {
      setSaving(null);
    }
  };

  if (loading || !contentLtr || !contentRtl) {
    return <div className="admin-loading">Loading...</div>;
  }

  const renderSelectedSectionForm = () => {
    if (!selectedSection) return null;

    switch (selectedSection) {
      case 'meta':
        return (
          <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
            <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
              <div>
                <h3 style={{ margin: 0 }}>Editing: Meta (SEO)</h3>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  Title, description, and keywords (English + Arabic)
                </div>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => setSelectedSection(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-cms-form">
              <div className="form-row-bilingual-header">
                <div className="form-label-header">English (SEO)</div>
                <div className="form-label-header">العربية (SEO)</div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    value={contentLtr?.seo?.title ?? ''}
                    onChange={(e) =>
                      setContentLtr({ ...(contentLtr as SolutionsContent), seo: { ...(contentLtr?.seo ?? { title: '', description: '', keywords: [] }), title: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={contentRtl?.seo?.title ?? ''}
                    onChange={(e) =>
                      setContentRtl({ ...(contentRtl as SolutionsContent), seo: { ...(contentRtl?.seo ?? { title: '', description: '', keywords: [] }), title: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea
                    rows={3}
                    value={contentLtr?.seo?.description ?? ''}
                    onChange={(e) =>
                      setContentLtr({ ...(contentLtr as SolutionsContent), seo: { ...(contentLtr?.seo ?? { title: '', description: '', keywords: [] }), description: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={contentRtl?.seo?.description ?? ''}
                    onChange={(e) =>
                      setContentRtl({ ...(contentRtl as SolutionsContent), seo: { ...(contentRtl?.seo ?? { title: '', description: '', keywords: [] }), description: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={(contentLtr?.seo?.keywords ?? []).join(', ')}
                    onChange={(e) =>
                      setContentLtr({
                        ...(contentLtr as SolutionsContent),
                        seo: {
                          ...(contentLtr?.seo ?? { title: '', description: '', keywords: [] }),
                          keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Keywords (comma-separated)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={(contentRtl?.seo?.keywords ?? []).join(', ')}
                    onChange={(e) =>
                      setContentRtl({
                        ...(contentRtl as SolutionsContent),
                        seo: {
                          ...(contentRtl?.seo ?? { title: '', description: '', keywords: [] }),
                          keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('meta')}
                  disabled={saving === 'meta'}
                >
                  {saving === 'meta' ? 'Saving...' : 'Save (English & Arabic)'}
                </button>
                <button
                  className="admin-btn admin-btn-edit"
                  onClick={() => setSelectedSection(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      case 'header':
        return (
          <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
            <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
              <div>
                <h3 style={{ margin: 0 }}>Editing: Page Header</h3>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  Breadcrumb, title, subtitle (English + Arabic)
                </div>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => setSelectedSection(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-cms-form">
              <div className="form-row-bilingual-header">
                <div className="form-label-header">English</div>
                <div className="form-label-header">Arabic</div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Breadcrumb</label>
                  <input
                    type="text"
                    value={contentLtr.header.breadcrumb}
                    onChange={(e) =>
                      setContentLtr({
                        ...contentLtr,
                        header: { ...contentLtr.header, breadcrumb: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Breadcrumb</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={contentRtl.header.breadcrumb}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        header: { ...contentRtl.header, breadcrumb: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={contentLtr.header.title}
                    onChange={(e) =>
                      setContentLtr({
                        ...contentLtr,
                        header: { ...contentLtr.header, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={contentRtl.header.title}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        header: { ...contentRtl.header, title: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Subtitle</label>
                  <textarea
                    value={contentLtr.header.subtitle || ''}
                    onChange={(e) =>
                      setContentLtr({
                        ...contentLtr,
                        header: { ...contentLtr.header, subtitle: e.target.value },
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Subtitle</label>
                  <textarea
                    dir="rtl"
                    value={contentRtl.header.subtitle || ''}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        header: { ...contentRtl.header, subtitle: e.target.value },
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
              
              <PageHeaderBackgroundField
                value={contentLtr.header.imagePath || contentRtl.header.imagePath || ''}
                onChange={(value) => {
                  setContentLtr({
                    ...contentLtr,
                    header: { ...contentLtr.header, imagePath: value },
                  });
                  setContentRtl({
                    ...contentRtl,
                    header: { ...contentRtl.header, imagePath: value },
                  });
                }}
              />
<div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('header')}
                  disabled={saving === 'header'}
                >
                  {saving === 'header' ? 'Saving...' : 'Save Header'}
                </button>
              </div>
            </div>
          </div>
        );
      case 'detailPage': {
        const detailLtr = contentLtr.detailPage || defaultSolutionsDetailPage('ltr');
        const detailRtl = contentRtl.detailPage || defaultSolutionsDetailPage('rtl');
        const updateDetail = (
          lang: 'ltr' | 'rtl',
          patch: Omit<Partial<typeof detailLtr>, 'contact'> & {
            contact?: Partial<(typeof detailLtr)['contact']>;
          }
        ) => {
          if (lang === 'ltr') {
            setContentLtr((prev) => {
              if (!prev) return prev;
              const base = prev.detailPage || defaultSolutionsDetailPage('ltr');
              const next = {
                ...prev,
                detailPage: {
                  ...base,
                  ...patch,
                  contact: {
                    ...base.contact,
                    ...(patch.contact || {}),
                  },
                },
              };
              contentLtrRef.current = next;
              return next;
            });
          } else {
            setContentRtl((prev) => {
              if (!prev) return prev;
              const base = prev.detailPage || defaultSolutionsDetailPage('rtl');
              const next = {
                ...prev,
                detailPage: {
                  ...base,
                  ...patch,
                  contact: {
                    ...base.contact,
                    ...(patch.contact || {}),
                  },
                },
              };
              contentRtlRef.current = next;
              return next;
            });
          }
        };
        const listToText = (items: string[]) => items.join('\n');
        const textToList = (value: string) =>
          value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

        return (
          <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
            <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
              <div>
                <h3 style={{ margin: 0 }}>Editing: Solutions Detail Page</h3>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  Shared across all /services-details-1/[id] pages — banner crumbs + contact card
                </div>
              </div>
              <button type="button" className="button" onClick={() => setSelectedSection(null)}>
                Close
              </button>
            </div>

            <div className="admin-cms-form">
              <div className="form-row-bilingual-header">
                <div className="form-label-header">English</div>
                <div className="form-label-header">Arabic</div>
              </div>

              <h4 style={{ margin: '8px 0 12px' }}>Page title banner</h4>
              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Home breadcrumb label</label>
                  <input
                    type="text"
                    value={detailLtr.homeBreadcrumb}
                    onChange={(e) => updateDetail('ltr', { homeBreadcrumb: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Home breadcrumb label</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.homeBreadcrumb}
                    onChange={(e) => updateDetail('rtl', { homeBreadcrumb: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Solutions breadcrumb label</label>
                  <input
                    type="text"
                    value={detailLtr.solutionsBreadcrumb}
                    onChange={(e) => updateDetail('ltr', { solutionsBreadcrumb: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Solutions breadcrumb label</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.solutionsBreadcrumb}
                    onChange={(e) => updateDetail('rtl', { solutionsBreadcrumb: e.target.value })}
                  />
                </div>
              </div>

              <PageHeaderBackgroundField
                value={detailLtr.imagePath || detailRtl.imagePath || ''}
                onChange={(value) => {
                  updateDetail('ltr', { imagePath: value });
                  updateDetail('rtl', { imagePath: value });
                }}
              />

              <h4 style={{ margin: '24px 0 12px' }}>Contact us card (sidebar)</h4>
              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Tag</label>
                  <input
                    type="text"
                    value={detailLtr.contact.tag}
                    onChange={(e) => updateDetail('ltr', { contact: { tag: e.target.value } })}
                  />
                </div>
                <div className="form-group">
                  <label>Tag</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.tag}
                    onChange={(e) => updateDetail('rtl', { contact: { tag: e.target.value } })}
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={detailLtr.contact.title}
                    onChange={(e) => updateDetail('ltr', { contact: { title: e.target.value } })}
                  />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.title}
                    onChange={(e) => updateDetail('rtl', { contact: { title: e.target.value } })}
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Subtitle (use new line for break)</label>
                  <textarea
                    rows={3}
                    value={detailLtr.contact.subtitle}
                    onChange={(e) => updateDetail('ltr', { contact: { subtitle: e.target.value } })}
                  />
                </div>
                <div className="form-group">
                  <label>Subtitle (use new line for break)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={detailRtl.contact.subtitle}
                    onChange={(e) => updateDetail('rtl', { contact: { subtitle: e.target.value } })}
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Address title</label>
                  <input
                    type="text"
                    value={detailLtr.contact.addressTitle}
                    onChange={(e) =>
                      updateDetail('ltr', { contact: { addressTitle: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Address title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.addressTitle}
                    onChange={(e) =>
                      updateDetail('rtl', { contact: { addressTitle: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    rows={3}
                    value={detailLtr.contact.address}
                    onChange={(e) => updateDetail('ltr', { contact: { address: e.target.value } })}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={detailRtl.contact.address}
                    onChange={(e) => updateDetail('rtl', { contact: { address: e.target.value } })}
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Directions label</label>
                  <input
                    type="text"
                    value={detailLtr.contact.directionLabel}
                    onChange={(e) =>
                      updateDetail('ltr', { contact: { directionLabel: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Directions label</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.directionLabel}
                    onChange={(e) =>
                      updateDetail('rtl', { contact: { directionLabel: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Map URL (shared)</label>
                <input
                  type="text"
                  value={detailLtr.contact.mapUrl || detailRtl.contact.mapUrl || ''}
                  onChange={(e) => {
                    updateDetail('ltr', { contact: { mapUrl: e.target.value } });
                    updateDetail('rtl', { contact: { mapUrl: e.target.value } });
                  }}
                />
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Phone title</label>
                  <input
                    type="text"
                    value={detailLtr.contact.phoneTitle}
                    onChange={(e) =>
                      updateDetail('ltr', { contact: { phoneTitle: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.phoneTitle}
                    onChange={(e) =>
                      updateDetail('rtl', { contact: { phoneTitle: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone numbers (one per line, shared)</label>
                <textarea
                  rows={3}
                  value={listToText(detailLtr.contact.phones)}
                  onChange={(e) => {
                    const phones = textToList(e.target.value);
                    updateDetail('ltr', { contact: { phones } });
                    updateDetail('rtl', { contact: { phones } });
                  }}
                />
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Email title</label>
                  <input
                    type="text"
                    value={detailLtr.contact.emailTitle}
                    onChange={(e) =>
                      updateDetail('ltr', { contact: { emailTitle: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.emailTitle}
                    onChange={(e) =>
                      updateDetail('rtl', { contact: { emailTitle: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Emails (one per line, shared)</label>
                <textarea
                  rows={3}
                  value={listToText(detailLtr.contact.emails)}
                  onChange={(e) => {
                    const emails = textToList(e.target.value);
                    updateDetail('ltr', { contact: { emails } });
                    updateDetail('rtl', { contact: { emails } });
                  }}
                />
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>CTA button label</label>
                  <input
                    type="text"
                    value={detailLtr.contact.ctaLabel}
                    onChange={(e) =>
                      updateDetail('ltr', { contact: { ctaLabel: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>CTA button label</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.ctaLabel}
                    onChange={(e) =>
                      updateDetail('rtl', { contact: { ctaLabel: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>CTA link</label>
                  <input
                    type="text"
                    value={detailLtr.contact.ctaHref}
                    onChange={(e) =>
                      updateDetail('ltr', { contact: { ctaHref: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>CTA link</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={detailRtl.contact.ctaHref}
                    onChange={(e) =>
                      updateDetail('rtl', { contact: { ctaHref: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('detailPage')}
                  disabled={saving === 'detailPage'}
                >
                  {saving === 'detailPage' ? 'Saving...' : 'Save Detail Page'}
                </button>
                <button
                  className="admin-btn admin-btn-edit"
                  onClick={() => setSelectedSection(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Solutions</h1>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '6px',
            background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
          }}
        >
          {message.text}
        </div>
      )}

      {renderSelectedSectionForm()}

      <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
        <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
          <div>
            <h3 style={{ margin: 0 }}>Solutions list</h3>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Individual solutions (cards/sidebar items) are managed separately.
            </div>
          </div>
          <Link href="/admin/managesolutions" className="button button-primary">
            Manage Solutions List
          </Link>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Title (English)</th>
              <th>Title (Arabic)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SOLUTIONS_SECTIONS.map((section) => {
              const isEditing = selectedSection === section.id;
              let titleEn = '-';
              let titleAr = '-';
              if (section.id === 'meta') {
                titleEn = contentLtr?.seo?.title || '-';
                titleAr = contentRtl?.seo?.title || '-';
              } else if (section.id === 'header') {
                titleEn = contentLtr?.header?.title || '-';
                titleAr = contentRtl?.header?.title || '-';
              } else if (section.id === 'detailPage') {
                titleEn = contentLtr?.detailPage?.contact?.title || '-';
                titleAr = contentRtl?.detailPage?.contact?.title || '-';
              }
              return (
                <tr key={section.id} className={isEditing ? 'admin-table-row-active' : ''}>
                  <td><strong>{section.label}</strong></td>
                  <td>{titleEn}</td>
                  <td style={{ direction: 'rtl', textAlign: 'right' }}>{titleAr}</td>
                  <td>
                    <button
                      type="button"
                      className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                      onClick={() => {
                        setSelectedSection(section.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {isEditing ? 'Close' : 'Edit'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
