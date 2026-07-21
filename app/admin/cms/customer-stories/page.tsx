'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerStoriesContent } from '@/types/customer-stories';

const CUSTOMER_STORIES_SECTIONS = [
  { id: 'meta', label: 'Meta (SEO)', description: 'Title, description, keywords (English & Arabic)' },
  { id: 'header', label: 'Page Header', description: 'Breadcrumb, title, subtitle' },
  { id: 'stories', label: 'Stories Section', description: 'Tag, heading, subheading' },
] as const;

type CustomerStoriesSectionId = (typeof CUSTOMER_STORIES_SECTIONS)[number]['id'];

export default function CustomerStoriesManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<CustomerStoriesContent | null>(null);
  const [contentRtl, setContentRtl] = useState<CustomerStoriesContent | null>(null);
  const [selectedSection, setSelectedSection] = useState<CustomerStoriesSectionId | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Fetch both LTR and RTL content in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/customer-stories?language=ltr'),
        fetch('/api/customer-stories?language=rtl'),
      ]);
      
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      
      if (ltrResult.success && ltrResult.data) {
        setContentLtr(ltrResult.data);
      } else {
        setContentLtr(getEmptyContent('ltr'));
      }
      
      if (rtlResult.success && rtlResult.data) {
        setContentRtl(rtlResult.data);
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

  const getEmptyContent = (lang: 'ltr' | 'rtl'): CustomerStoriesContent => ({
    language: lang,
    isActive: true,
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
    header: {
      breadcrumb: 'Customer Stories',
      title: 'Customer Stories',
      subtitle: 'See how Al Bahar & Partners helps organizations strengthen security, improve visibility, and modernize IT through proven technology deployments.',
      language: lang,
      isActive: true,
    },
    tag: 'CUSTOMER STORIES',
    heading: 'Success Stories',
    subheading: 'Real-world deployments showcasing how partner technologies deliver measurable business value.',
    stories: [],
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveSection = async (section: string) => {
    if (!contentLtr || !contentRtl) return;
    setSaving(section);
    try {
      // Save both LTR and RTL in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/customer-stories', {
          method: contentLtr._id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...contentLtr, language: 'ltr' }),
        }),
        fetch('/api/customer-stories', {
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

    const closeBtn = (
      <button type="button" className="button" onClick={() => setSelectedSection(null)}>
        Close
      </button>
    );

    switch (selectedSection) {
      case 'meta':
        return (
          <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
            <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
              <div>
                <h3 style={{ margin: 0 }}>Editing: Meta (SEO)</h3>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Title, description, keywords</div>
              </div>
              {closeBtn}
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
                    value={contentLtr!.seo?.title ?? ''}
                    onChange={(e) =>
                      setContentLtr({ ...(contentLtr as CustomerStoriesContent), seo: { ...(contentLtr?.seo ?? { title: '', description: '', keywords: [] }), title: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={contentRtl!.seo?.title ?? ''}
                    onChange={(e) =>
                      setContentRtl({ ...(contentRtl as CustomerStoriesContent), seo: { ...(contentRtl?.seo ?? { title: '', description: '', keywords: [] }), title: e.target.value } })
                    }
                  />
                </div>
              </div>
              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea
                    rows={3}
                    value={contentLtr!.seo?.description ?? ''}
                    onChange={(e) =>
                      setContentLtr({ ...(contentLtr as CustomerStoriesContent), seo: { ...(contentLtr?.seo ?? { title: '', description: '', keywords: [] }), description: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={contentRtl!.seo?.description ?? ''}
                    onChange={(e) =>
                      setContentRtl({ ...(contentRtl as CustomerStoriesContent), seo: { ...(contentRtl?.seo ?? { title: '', description: '', keywords: [] }), description: e.target.value } })
                    }
                  />
                </div>
              </div>
              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={(contentLtr!.seo?.keywords ?? []).join(', ')}
                    onChange={(e) =>
                      setContentLtr({
                        ...(contentLtr as CustomerStoriesContent),
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
                    value={(contentRtl!.seo?.keywords ?? []).join(', ')}
                    onChange={(e) =>
                      setContentRtl({
                        ...(contentRtl as CustomerStoriesContent),
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
                <div style={{ fontSize: 13, opacity: 0.8 }}>Breadcrumb, title, subtitle</div>
              </div>
              {closeBtn}
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
      case 'stories':
        return (
          <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
            <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
              <div>
                <h3 style={{ margin: 0 }}>Editing: Stories Section</h3>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Tag, heading, subheading</div>
              </div>
              {closeBtn}
            </div>
            <div className="admin-cms-form">
              <div className="form-row-bilingual-header">
                <div className="form-label-header">English</div>
                <div className="form-label-header">Arabic</div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Section Tag</label>
                  <input
                    type="text"
                    value={contentLtr.tag}
                    onChange={(e) =>
                      setContentLtr({
                        ...contentLtr,
                        tag: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Section Tag</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={contentRtl.tag}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        tag: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Heading</label>
                  <input
                    type="text"
                    value={contentLtr.heading}
                    onChange={(e) =>
                      setContentLtr({
                        ...contentLtr,
                        heading: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Heading</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={contentRtl.heading}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        heading: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Subheading</label>
                  <textarea
                    value={contentLtr.subheading || ''}
                    onChange={(e) =>
                      setContentLtr({
                        ...contentLtr,
                        subheading: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Subheading</label>
                  <textarea
                    dir="rtl"
                    value={contentRtl.subheading || ''}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        subheading: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('stories')}
                  disabled={saving === 'stories'}
                >
                  {saving === 'stories' ? 'Saving...' : 'Save Stories Section'}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Customer Stories</h1>
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
            <h3 style={{ margin: 0 }}>Stories Management</h3>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Stories are managed separately.</div>
          </div>
          <Link href="/admin/managestories" className="button button-primary">
            Go to Stories Management →
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
            {CUSTOMER_STORIES_SECTIONS.map((section) => {
              const isEditing = selectedSection === section.id;
              let titleEn = '-';
              let titleAr = '-';
              if (section.id === 'meta') {
                titleEn = contentLtr?.seo?.title || '-';
                titleAr = contentRtl?.seo?.title || '-';
              } else if (section.id === 'header') {
                titleEn = contentLtr?.header?.title || '-';
                titleAr = contentRtl?.header?.title || '-';
              } else if (section.id === 'stories') {
                titleEn = contentLtr?.heading || '-';
                titleAr = contentRtl?.heading || '-';
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
