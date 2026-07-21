'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SolutionsContent } from '@/types/solutions';

const SOLUTIONS_SECTIONS = [
  { id: 'meta', label: 'Meta (SEO)', description: 'Title, description, keywords (English & Arabic)' },
  { id: 'header', label: 'Page Header', description: 'Breadcrumb, title, subtitle' },
] as const;

type SolutionsSectionId = (typeof SOLUTIONS_SECTIONS)[number]['id'];

export default function SolutionsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<SolutionsContent | null>(null);
  const [contentRtl, setContentRtl] = useState<SolutionsContent | null>(null);
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
      language: lang,
      isActive: true,
    },
    solutions: [],
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
