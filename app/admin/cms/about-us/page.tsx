'use client';

import { useState, useEffect } from 'react';
import { AboutUsContent } from '@/types/aboutus';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import RichTextEditor from '@/components/admin/ui/RichTextEditor';
import Link from 'next/link';
import { prepareRichTextContent } from '@/lib/rich-text-utils';

const ABOUT_SECTIONS = [
  { id: 'meta', label: 'Meta (SEO)' },
  { id: 'header', label: 'Page Header' },
  { id: 'heritage', label: 'Our Heritage' },
  { id: 'aboutAlBahar', label: 'About Al-Bahar Group' },
  { id: 'history', label: 'Our History' },
  { id: 'aboutBPC', label: 'About BPC' },
  { id: 'visionMissionValues', label: 'What Guides and Drives Our Future' },
  { id: 'faqs', label: 'FAQs' },
] as const;

export default function AboutUsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<AboutUsContent | null>(null);
  const [contentRtl, setContentRtl] = useState<AboutUsContent | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    meta: false,
    header: false,
    aboutAlBahar: false,
    visionMissionValues: false,
    heritage: false,
    aboutBDS: false,
    aboutBPC: false,
    team: false,
    history: false,
    faqs: false,
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Fetch both LTR and RTL content in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/aboutus?language=ltr'),
        fetch('/api/aboutus?language=rtl'),
      ]);
      
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      
      if (ltrResult.success && ltrResult.data) {
        setContentLtr(normalizeLoadedContent(ltrResult.data));
      } else {
        setContentLtr(getEmptyContent('ltr'));
      }
      
      if (rtlResult.success && rtlResult.data) {
        setContentRtl(normalizeLoadedContent(rtlResult.data));
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

  const normalizeLoadedContent = (content: AboutUsContent): AboutUsContent => ({
    ...content,
    aboutBPC: {
      ...content.aboutBPC,
      description: prepareRichTextContent(content.aboutBPC?.description || ''),
    },
  });

  const getEmptyContent = (lang: 'ltr' | 'rtl'): AboutUsContent => ({
    language: lang,
    isActive: true,
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
    header: {
      breadcrumb: 'About Us',
      title: 'About Us',
      subtitle: 'Discover our mission to empower clients with expert solutions',
      language: lang,
      isActive: true,
    },
    aboutAlBahar: {
      tag: 'About Al-Bahar Group',
      title: 'Al-Bahar Group was founded in 1937...',
      counterValue: 88,
      counterLabel: 'Years of Excellence & Impact',
      tabs: [],
      language: lang,
      isActive: true,
    },
    visionMissionValues: {
      tag: 'What Guides Us',
      heading: 'What Guides Us and Drives Our Future',
      subheading: 'Guided by a clear vision, driven by a shared mission...',
      items: [],
      language: lang,
      isActive: true,
    },
    heritage: {
      tag: 'Our Heritage',
      heading: 'Our Heritage',
      imagePath: '',
      paragraphs: [],
      language: lang,
      isActive: true,
    },
    aboutBDS: {
      tag: 'About BDS',
      heading: 'About BDS',
      description: '',
      servicesIntro: '',
      services: [],
      language: lang,
      isActive: true,
    },
    aboutBPC: {
      tag: 'About BPC',
      heading: 'About BPC',
      imagePath: '',
      description: '',
      language: lang,
      isActive: true,
    },
    team: {
      tag: 'Our Team',
      heading: 'Our Team',
      subheading: '',
      members: [],
      language: lang,
      isActive: true,
    },
    history: {
      tag: 'Our History',
      heading: 'Our History',
      subheading: '',
      items: [],
      language: lang,
      isActive: true,
    },
    faqs: {
      tag: 'FAQs',
      heading: 'Frequently Asked Questions',
      subheading: '',
      buttonText: '',
      buttonLink: '',
      faqs: [],
      language: lang,
      isActive: true,
    },
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSaveSection = async (section: string) => {
    if (!contentLtr || !contentRtl) return;
    setSaving(section);
    try {
      const normalizeAboutBPC = (content: AboutUsContent) => ({
        ...content,
        aboutBPC: {
          tag: content.aboutBPC?.tag || '',
          heading: content.aboutBPC?.heading || '',
          imagePath: content.aboutBPC?.imagePath || '',
          description: prepareRichTextContent(content.aboutBPC?.description || ''),
          language: content.language,
          isActive: content.aboutBPC?.isActive ?? true,
        },
      });

      const ltrPayload = normalizeAboutBPC(contentLtr);
      const rtlPayload = normalizeAboutBPC(contentRtl);

      // Save both LTR and RTL in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/aboutus', {
          method: contentLtr._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ltrPayload, language: 'ltr' }),
        }),
        fetch('/api/aboutus', {
          method: contentRtl._id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...rtlPayload, language: 'rtl' }),
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

  const addVisionMissionItem = () => {
    if (!contentLtr || !contentRtl) return;

    const existingIds = [
      ...(contentLtr.visionMissionValues.items || []).map((item) => item.id || 0),
      ...(contentRtl.visionMissionValues.items || []).map((item) => item.id || 0),
    ];
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    const newLtrItem = {
      id: nextId,
      imagePath: '',
      label: 'Vision',
      title: 'New item title',
      description: 'New item description',
      points: [],
    };
    const newRtlItem = {
      id: nextId,
      imagePath: '',
      label: 'الرؤية',
      title: 'عنوان جديد',
      description: 'وصف جديد',
      points: [],
    };

    setContentLtr({
      ...contentLtr,
      visionMissionValues: {
        ...contentLtr.visionMissionValues,
        items: [...(contentLtr.visionMissionValues.items || []), newLtrItem],
      },
    });
    setContentRtl({
      ...contentRtl,
      visionMissionValues: {
        ...contentRtl.visionMissionValues,
        items: [...(contentRtl.visionMissionValues.items || []), newRtlItem],
      },
    });
  };

  const removeVisionMissionItem = (index: number) => {
    if (!contentLtr || !contentRtl) return;

    setContentLtr({
      ...contentLtr,
      visionMissionValues: {
        ...contentLtr.visionMissionValues,
        items: (contentLtr.visionMissionValues.items || []).filter((_, i) => i !== index),
      },
    });
    setContentRtl({
      ...contentRtl,
      visionMissionValues: {
        ...contentRtl.visionMissionValues,
        items: (contentRtl.visionMissionValues.items || []).filter((_, i) => i !== index),
      },
    });
  };

  const renderSelectedSectionForm = () => {
    if (!selectedSection || !contentLtr || !contentRtl) return null;

    switch (selectedSection) {
      case 'meta':
        return (
          <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
            <div className="admin-cms-form">
              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English (SEO)</div>
                  <div className="form-label-header">العربية (SEO)</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Meta Title</label>
                    <input
                      type="text"
                      value={contentLtr.seo?.title ?? ''}
                      onChange={(e) =>
                        setContentLtr({ ...contentLtr, seo: { ...(contentLtr.seo ?? { title: '', description: '', keywords: [] }), title: e.target.value } })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Meta Title</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentRtl.seo?.title ?? ''}
                      onChange={(e) =>
                        setContentRtl({ ...contentRtl, seo: { ...(contentRtl.seo ?? { title: '', description: '', keywords: [] }), title: e.target.value } })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English (SEO)</div>
                  <div className="form-label-header">العربية (SEO)</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Meta Description</label>
                    <textarea
                      rows={3}
                      value={contentLtr.seo?.description ?? ''}
                      onChange={(e) =>
                        setContentLtr({ ...contentLtr, seo: { ...(contentLtr.seo ?? { title: '', description: '', keywords: [] }), description: e.target.value } })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Meta Description</label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={contentRtl.seo?.description ?? ''}
                      onChange={(e) =>
                        setContentRtl({ ...contentRtl, seo: { ...(contentRtl.seo ?? { title: '', description: '', keywords: [] }), description: e.target.value } })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English (SEO)</div>
                  <div className="form-label-header">العربية (SEO)</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={(contentLtr.seo?.keywords ?? []).join(', ')}
                      onChange={(e) =>
                        setContentLtr({
                          ...contentLtr,
                          seo: {
                            ...(contentLtr.seo ?? { title: '', description: '', keywords: [] }),
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
                      value={(contentRtl.seo?.keywords ?? []).join(', ')}
                      onChange={(e) =>
                        setContentRtl({
                          ...contentRtl,
                          seo: {
                            ...(contentRtl.seo ?? { title: '', description: '', keywords: [] }),
                            keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="button button-primary" onClick={() => handleSaveSection('meta')} disabled={saving === 'meta'}>
                  {saving === 'meta' ? 'Saving...' : 'Save (English & Arabic)'}
                </button>
                <button type="button" className="admin-btn admin-btn-edit" onClick={() => setSelectedSection(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      case 'header':
        return (
          <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
            <div className="admin-cms-form">
              {/* Breadcrumb */}
              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">العربية</div>
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
              </div>

              {/* Title */}
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
              </div>

              {/* Subtitle */}
              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">العربية</div>
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
        case 'aboutAlBahar':
          return (
            <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
              <div className="admin-cms-form">
                {/* Tag */}
                <div>
                  <div className="form-row-bilingual-header">
                    <div className="form-label-header">English</div>
                    <div className="form-label-header">العربية</div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Tag</label>
                      <input
                        type="text"
                        value={contentLtr.aboutAlBahar.tag}
                        onChange={(e) =>
                          setContentLtr({
                            ...contentLtr,
                            aboutAlBahar: { ...contentLtr.aboutAlBahar, tag: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Tag</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={contentRtl.aboutAlBahar.tag}
                        onChange={(e) =>
                          setContentRtl({
                            ...contentRtl,
                            aboutAlBahar: { ...contentRtl.aboutAlBahar, tag: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
        
                {/* Title */}
                <div>
                  <div className="form-row-bilingual-header">
                    <div className="form-label-header">English</div>
                    <div className="form-label-header">العربية</div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Title</label>
                      <textarea
                        value={contentLtr.aboutAlBahar.title}
                        onChange={(e) =>
                          setContentLtr({
                            ...contentLtr,
                            aboutAlBahar: { ...contentLtr.aboutAlBahar, title: e.target.value },
                          })
                        }
                        rows={4}
                      />
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <textarea
                        dir="rtl"
                        value={contentRtl.aboutAlBahar.title}
                        onChange={(e) =>
                          setContentRtl({
                            ...contentRtl,
                            aboutAlBahar: { ...contentRtl.aboutAlBahar, title: e.target.value },
                          })
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
        
                {/* Counter value + label (kept as 2-column grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Counter Value</label>
                    <input
                      type="number"
                      value={contentLtr.aboutAlBahar.counterValue}
                      onChange={(e) =>
                        setContentLtr({
                          ...contentLtr,
                          aboutAlBahar: {
                            ...contentLtr.aboutAlBahar,
                            counterValue: Number(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Counter Label (English)</label>
                    <input
                      type="text"
                      value={contentLtr.aboutAlBahar.counterLabel}
                      onChange={(e) =>
                        setContentLtr({
                          ...contentLtr,
                          aboutAlBahar: { ...contentLtr.aboutAlBahar, counterLabel: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Counter Label (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={contentRtl.aboutAlBahar.counterLabel}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        aboutAlBahar: { ...contentRtl.aboutAlBahar, counterLabel: e.target.value },
                      })
                    }
                  />
                </div>
        
                {/* Tabs block – unchanged layout, just left as-is */}
                {/* keep your existing Tabs JSX here */}
        
                <div className="form-actions">
                  <button
                    className="button button-primary"
                    onClick={() => handleSaveSection('aboutAlBahar')}
                    disabled={saving === 'aboutAlBahar'}
                  >
                    {saving === 'aboutAlBahar' ? 'Saving...' : 'Save About Al-Bahar'}
                  </button>
                </div>
              </div>
            </div>
          );
          case 'aboutBDS':
            return (
              <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
                <div className="admin-cms-form">
                  {/* Tag */}
                  <div>
                    <div className="form-row-bilingual-header">
                      <div className="form-label-header">English</div>
                      <div className="form-label-header">العربية</div>
                    </div>
                    <div className="form-row-bilingual">
                      <div className="form-group">
                        <label>Tag</label>
                        <input
                          type="text"
                          value={contentLtr.aboutBDS.tag}
                          onChange={(e) =>
                            setContentLtr({
                              ...contentLtr,
                              aboutBDS: { ...contentLtr.aboutBDS, tag: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Tag</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={contentRtl.aboutBDS.tag}
                          onChange={(e) =>
                            setContentRtl({
                              ...contentRtl,
                              aboutBDS: { ...contentRtl.aboutBDS, tag: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
          
                  {/* Heading */}
                  <div>
                    <div className="form-row-bilingual-header">
                      <div className="form-label-header">English</div>
                      <div className="form-label-header">العربية</div>
                    </div>
                    <div className="form-row-bilingual">
                      <div className="form-group">
                        <label>Heading</label>
                        <input
                          type="text"
                          value={contentLtr.aboutBDS.heading}
                          onChange={(e) =>
                            setContentLtr({
                              ...contentLtr,
                              aboutBDS: { ...contentLtr.aboutBDS, heading: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Heading</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={contentRtl.aboutBDS.heading}
                          onChange={(e) =>
                            setContentRtl({
                              ...contentRtl,
                              aboutBDS: { ...contentRtl.aboutBDS, heading: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
          
                  {/* Description */}
                  <div>
                    <div className="form-row-bilingual-header">
                      <div className="form-label-header">English</div>
                      <div className="form-label-header">العربية</div>
                    </div>
                    <div className="form-row-bilingual">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={contentLtr.aboutBDS.description || ''}
                          onChange={(e) =>
                            setContentLtr({
                              ...contentLtr,
                              aboutBDS: { ...contentLtr.aboutBDS, description: e.target.value },
                            })
                          }
                          rows={4}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          dir="rtl"
                          value={contentRtl.aboutBDS.description || ''}
                          onChange={(e) =>
                            setContentRtl({
                              ...contentRtl,
                              aboutBDS: { ...contentRtl.aboutBDS, description: e.target.value },
                            })
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
          
                  {/* Services intro */}
                  <div>
                    <div className="form-row-bilingual-header">
                      <div className="form-label-header">English</div>
                      <div className="form-label-header">العربية</div>
                    </div>
                    <div className="form-row-bilingual">
                      <div className="form-group">
                        <label>Services Intro</label>
                        <textarea
                          value={contentLtr.aboutBDS.servicesIntro || ''}
                          onChange={(e) =>
                            setContentLtr({
                              ...contentLtr,
                              aboutBDS: { ...contentLtr.aboutBDS, servicesIntro: e.target.value },
                            })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="form-group">
                        <label>Services Intro</label>
                        <textarea
                          dir="rtl"
                          value={contentRtl.aboutBDS.servicesIntro || ''}
                          onChange={(e) =>
                            setContentRtl({
                              ...contentRtl,
                              aboutBDS: { ...contentRtl.aboutBDS, servicesIntro: e.target.value },
                            })
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
          
                  {/* Services list */}
                  <div>
                    <div className="form-row-bilingual-header">
                      <div className="form-label-header">English</div>
                      <div className="form-label-header">العربية</div>
                    </div>
                    <div className="form-row-bilingual">
                      <div className="form-group">
                        <label>Services (one per line)</label>
                        <textarea
                          value={
                            Array.isArray(contentLtr.aboutBDS.services)
                              ? contentLtr.aboutBDS.services.join('\n')
                              : ''
                          }
                          onChange={(e) => {
                            const services = e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            setContentLtr({
                              ...contentLtr,
                              aboutBDS: { ...contentLtr.aboutBDS, services },
                            });
                          }}
                          rows={6}
                        />
                      </div>
                      <div className="form-group">
                        <label>Services (one per line)</label>
                        <textarea
                          dir="rtl"
                          value={
                            Array.isArray(contentRtl.aboutBDS.services)
                              ? contentRtl.aboutBDS.services.join('\n')
                              : ''
                          }
                          onChange={(e) => {
                            const services = e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            setContentRtl({
                              ...contentRtl,
                              aboutBDS: { ...contentRtl.aboutBDS, services },
                            });
                          }}
                          rows={6}
                        />
                      </div>
                    </div>
                  </div>
          
                  <div className="form-actions">
                    <button
                      className="button button-primary"
                      onClick={() => handleSaveSection('aboutBDS')}
                      disabled={saving === 'aboutBDS'}
                    >
                      {saving === 'aboutBDS' ? 'Saving...' : 'Save About BDS'}
                    </button>
                  </div>
                </div>
              </div>
            );
            case 'aboutBPC':
              return (
                <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
                  <div className="admin-cms-form">
                    <div>
                      <div className="form-row-bilingual-header">
                        <div className="form-label-header">English</div>
                        <div className="form-label-header">العربية</div>
                      </div>
                      <div className="form-row-bilingual">
                        <div className="form-group">
                          <label>Tag</label>
                          <input
                            type="text"
                            value={contentLtr.aboutBPC.tag || ''}
                            onChange={(e) =>
                              setContentLtr({
                                ...contentLtr,
                                aboutBPC: { ...contentLtr.aboutBPC, tag: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Tag</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={contentRtl.aboutBPC.tag || ''}
                            onChange={(e) =>
                              setContentRtl({
                                ...contentRtl,
                                aboutBPC: { ...contentRtl.aboutBPC, tag: e.target.value },
                              })
                            }
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
                          <label>Heading</label>
                          <input
                            type="text"
                            value={contentLtr.aboutBPC.heading}
                            onChange={(e) =>
                              setContentLtr({
                                ...contentLtr,
                                aboutBPC: { ...contentLtr.aboutBPC, heading: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Heading</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={contentRtl.aboutBPC.heading}
                            onChange={(e) =>
                              setContentRtl({
                                ...contentRtl,
                                aboutBPC: { ...contentRtl.aboutBPC, heading: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Image</label>
                      <ImageUpload
                        value={contentLtr.aboutBPC.imagePath}
                        onChange={(value) => {
                          setContentLtr({
                            ...contentLtr,
                            aboutBPC: { ...contentLtr.aboutBPC, imagePath: value },
                          });
                          setContentRtl({
                            ...contentRtl,
                            aboutBPC: { ...contentRtl.aboutBPC, imagePath: value },
                          });
                        }}
                        folder="about"
                      />
                    </div>

                    <div>
                      <div className="form-row-stacked">
                        <RichTextEditor
                          label="Description (English)"
                          value={contentLtr.aboutBPC.description || ''}
                          onChange={(value) =>
                            setContentLtr({
                              ...contentLtr,
                              aboutBPC: { ...contentLtr.aboutBPC, description: value },
                            })
                          }
                          placeholder="Enter description..."
                        />
                        <RichTextEditor
                          label="Description (Arabic)"
                          value={contentRtl.aboutBPC.description || ''}
                          onChange={(value) =>
                            setContentRtl({
                              ...contentRtl,
                              aboutBPC: { ...contentRtl.aboutBPC, description: value },
                            })
                          }
                          placeholder="أدخل الوصف..."
                          className="rtl-editor"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        className="button button-primary"
                        onClick={() => handleSaveSection('aboutBPC')}
                        disabled={saving === 'aboutBPC'}
                      >
                        {saving === 'aboutBPC' ? 'Saving...' : 'Save About BPC'}
                      </button>
                    </div>
                  </div>
                </div>
              );  
              case 'team':
                return (
                  <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
                    <div className="admin-cms-form">
                      {/* Tag */}
                      <div>
                        <div className="form-row-bilingual-header">
                          <div className="form-label-header">English</div>
                          <div className="form-label-header">العربية</div>
                        </div>
                        <div className="form-row-bilingual">
                          <div className="form-group">
                            <label>Tag</label>
                            <input
                              type="text"
                              value={contentLtr.team.tag}
                              onChange={(e) =>
                                setContentLtr({
                                  ...contentLtr,
                                  team: { ...contentLtr.team, tag: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Tag</label>
                            <input
                              type="text"
                              dir="rtl"
                              value={contentRtl.team.tag}
                              onChange={(e) =>
                                setContentRtl({
                                  ...contentRtl,
                                  team: { ...contentRtl.team, tag: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
              
                      {/* Heading */}
                      <div>
                        <div className="form-row-bilingual-header">
                          <div className="form-label-header">English</div>
                          <div className="form-label-header">العربية</div>
                        </div>
                        <div className="form-row-bilingual">
                          <div className="form-group">
                            <label>Heading</label>
                            <input
                              type="text"
                              value={contentLtr.team.heading}
                              onChange={(e) =>
                                setContentLtr({
                                  ...contentLtr,
                                  team: { ...contentLtr.team, heading: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Heading</label>
                            <input
                              type="text"
                              dir="rtl"
                              value={contentRtl.team.heading}
                              onChange={(e) =>
                                setContentRtl({
                                  ...contentRtl,
                                  team: { ...contentRtl.team, heading: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
              
                      {/* Subheading */}
                      <div>
                        <div className="form-row-bilingual-header">
                          <div className="form-label-header">English</div>
                          <div className="form-label-header">العربية</div>
                        </div>
                        <div className="form-row-bilingual">
                          <div className="form-group">
                            <label>Subheading</label>
                            <textarea
                              value={contentLtr.team.subheading || ''}
                              onChange={(e) =>
                                setContentLtr({
                                  ...contentLtr,
                                  team: { ...contentLtr.team, subheading: e.target.value },
                                })
                              }
                              rows={3}
                            />
                          </div>
                          <div className="form-group">
                            <label>Subheading</label>
                            <textarea
                              dir="rtl"
                              value={contentRtl.team.subheading || ''}
                              onChange={(e) =>
                                setContentRtl({
                                  ...contentRtl,
                                  team: { ...contentRtl.team, subheading: e.target.value },
                                })
                              }
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
              
                      <div className="form-actions">
                        <button
                          className="button button-primary"
                          onClick={() => handleSaveSection('team')}
                          disabled={saving === 'team'}
                        >
                          {saving === 'team' ? 'Saving...' : 'Save Team'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
                case 'history':
                  return (
                    <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
                      <div className="admin-cms-form">
                        {/* Tag */}
                        <div>
                          <div className="form-row-bilingual-header">
                            <div className="form-label-header">English</div>
                            <div className="form-label-header">العربية</div>
                          </div>
                          <div className="form-row-bilingual">
                            <div className="form-group">
                              <label>Tag</label>
                              <input
                                type="text"
                                value={contentLtr.history.tag}
                                onChange={(e) =>
                                  setContentLtr({
                                    ...contentLtr,
                                    history: { ...contentLtr.history, tag: e.target.value },
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Tag</label>
                              <input
                                type="text"
                                dir="rtl"
                                value={contentRtl.history.tag}
                                onChange={(e) =>
                                  setContentRtl({
                                    ...contentRtl,
                                    history: { ...contentRtl.history, tag: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                
                        {/* Heading */}
                        <div>
                          <div className="form-row-bilingual-header">
                            <div className="form-label-header">English</div>
                            <div className="form-label-header">العربية</div>
                          </div>
                          <div className="form-row-bilingual">
                            <div className="form-group">
                              <label>Heading</label>
                              <input
                                type="text"
                                value={contentLtr.history.heading}
                                onChange={(e) =>
                                  setContentLtr({
                                    ...contentLtr,
                                    history: { ...contentLtr.history, heading: e.target.value },
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Heading</label>
                              <input
                                type="text"
                                dir="rtl"
                                value={contentRtl.history.heading}
                                onChange={(e) =>
                                  setContentRtl({
                                    ...contentRtl,
                                    history: { ...contentRtl.history, heading: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                
                        {/* Subheading */}
                        <div>
                          <div className="form-row-bilingual-header">
                            <div className="form-label-header">English</div>
                            <div className="form-label-header">العربية</div>
                          </div>
                          <div className="form-row-bilingual">
                            <div className="form-group">
                              <label>Subheading</label>
                              <textarea
                                value={contentLtr.history.subheading || ''}
                                onChange={(e) =>
                                  setContentLtr({
                                    ...contentLtr,
                                    history: { ...contentLtr.history, subheading: e.target.value },
                                  })
                                }
                                rows={3}
                              />
                            </div>
                            <div className="form-group">
                              <label>Subheading</label>
                              <textarea
                                dir="rtl"
                                value={contentRtl.history.subheading || ''}
                                onChange={(e) =>
                                  setContentRtl({
                                    ...contentRtl,
                                    history: { ...contentRtl.history, subheading: e.target.value },
                                  })
                                }
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                
                        {/* Timeline items (keep structure, just bilingual fields inside each) */}
                        <div className="form-group">
                          <label>Timeline Items</label>
                          <div className="hero-slides-container">
                            {Array.from({
                              length: Math.max(
                                contentLtr.history.items?.length || 0,
                                contentRtl.history.items?.length || 0
                              ),
                            }).map((_, index) => {
                              const itemLtr =
                                contentLtr.history.items?.[index] || {
                                  year: '',
                                  title: '',
                                  position: 'above' as const,
                                  logos: [],
                                };
                              const itemRtl =
                                contentRtl.history.items?.[index] || {
                                  year: '',
                                  title: '',
                                  position: 'above' as const,
                                  logos: [],
                                };
                
                              return (
                                <div key={index} className="hero-slide-card">
                                  <div className="hero-slide-header">
                                    <h4>Item {index + 1}</h4>
                                    {(contentLtr.history.items?.length || 0) > 0 && (
                                      <button
                                        type="button"
                                        className="hero-slide-remove"
                                        onClick={() => {
                                          const newItemsLtr =
                                            contentLtr.history.items?.filter((_: any, i: number) => i !== index) || [];
                                          const newItemsRtl =
                                            contentRtl.history.items?.filter((_: any, i: number) => i !== index) || [];
                                          setContentLtr({
                                            ...contentLtr,
                                            history: { ...contentLtr.history, items: newItemsLtr },
                                          });
                                          setContentRtl({
                                            ...contentRtl,
                                            history: { ...contentRtl.history, items: newItemsRtl },
                                          });
                                        }}
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                  <div className="hero-slide-fields">
                                    {/* Year */}
                                    <div className="form-group">
                                      <label>Year</label>
                                      <input
                                        type="text"
                                        value={itemLtr.year}
                                        onChange={(e) => {
                                          const newItems = [...(contentLtr.history.items || [])];
                                          newItems[index] = { ...itemLtr, year: e.target.value };
                                          setContentLtr({
                                            ...contentLtr,
                                            history: { ...contentLtr.history, items: newItems },
                                          });
                                          const newItemsRtl = [...(contentRtl.history.items || [])];
                                          newItemsRtl[index] = { ...itemRtl, year: e.target.value };
                                          setContentRtl({
                                            ...contentRtl,
                                            history: { ...contentRtl.history, items: newItemsRtl },
                                          });
                                        }}
                                      />
                                    </div>
                
                                    {/* Title */}
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
                                            value={itemLtr.title}
                                            onChange={(e) => {
                                              const newItems = [...(contentLtr.history.items || [])];
                                              newItems[index] = { ...itemLtr, title: e.target.value };
                                              setContentLtr({
                                                ...contentLtr,
                                                history: { ...contentLtr.history, items: newItems },
                                              });
                                            }}
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label>Title</label>
                                          <input
                                            type="text"
                                            dir="rtl"
                                            value={itemRtl.title}
                                            onChange={(e) => {
                                              const newItems = [...(contentRtl.history.items || [])];
                                              newItems[index] = { ...itemRtl, title: e.target.value };
                                              setContentRtl({
                                                ...contentRtl,
                                                history: { ...contentRtl.history, items: newItems },
                                              });
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                
                                    {/* Position (shared) */}
                                    <div className="form-group">
                                      <label>Position</label>
                                      <select
                                        value={itemLtr.position || 'above'}
                                        onChange={(e) => {
                                          const pos = e.target.value as 'above' | 'below';
                                          const newItems = [...(contentLtr.history.items || [])];
                                          newItems[index] = { ...itemLtr, position: pos };
                                          setContentLtr({
                                            ...contentLtr,
                                            history: { ...contentLtr.history, items: newItems },
                                          });
                                          const newItemsRtl = [...(contentRtl.history.items || [])];
                                          newItemsRtl[index] = { ...itemRtl, position: pos };
                                          setContentRtl({
                                            ...contentRtl,
                                            history: { ...contentRtl.history, items: newItemsRtl },
                                          });
                                        }}
                                      >
                                        <option value="above">Above Timeline</option>
                                        <option value="below">Below Timeline</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            className="button"
                            onClick={() => {
                              const newItem = {
                                year: '',
                                title: '',
                                position: 'above' as const,
                                logos: [],
                              } as (typeof contentLtr.history.items)[number];
                              setContentLtr({
                                ...contentLtr,
                                history: {
                                  ...contentLtr.history,
                                  items: [...(contentLtr.history.items || []), newItem],
                                },
                              });
                              setContentRtl({
                                ...contentRtl,
                                history: {
                                  ...contentRtl.history,
                                  items: [...(contentRtl.history.items || []), newItem],
                                },
                              });
                            }}
                            style={{ marginTop: '12px' }}
                          >
                            Add History Item
                          </button>
                        </div>
                
                        <div className="form-actions">
                          <button
                            className="button button-primary"
                            onClick={() => handleSaveSection('history')}
                            disabled={saving === 'history'}
                          >
                            {saving === 'history' ? 'Saving...' : 'Save History'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                  case 'faqs':
                    return (
                      <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
                        <div className="admin-cms-form">
                          {/* Tag */}
                          <div>
                            <div className="form-row-bilingual-header">
                              <div className="form-label-header">English</div>
                              <div className="form-label-header">العربية</div>
                            </div>
                            <div className="form-row-bilingual">
                              <div className="form-group">
                                <label>Tag</label>
                                <input
                                  type="text"
                                  value={contentLtr.faqs.tag}
                                  onChange={(e) =>
                                    setContentLtr({
                                      ...contentLtr,
                                      faqs: { ...contentLtr.faqs, tag: e.target.value },
                                    })
                                  }
                                />
                              </div>
                              <div className="form-group">
                                <label>Tag</label>
                                <input
                                  type="text"
                                  dir="rtl"
                                  value={contentRtl.faqs.tag}
                                  onChange={(e) =>
                                    setContentRtl({
                                      ...contentRtl,
                                      faqs: { ...contentRtl.faqs, tag: e.target.value },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                  
                          {/* Heading */}
                          <div>
                            <div className="form-row-bilingual-header">
                              <div className="form-label-header">English</div>
                              <div className="form-label-header">العربية</div>
                            </div>
                            <div className="form-row-bilingual">
                              <div className="form-group">
                                <label>Heading</label>
                                <input
                                  type="text"
                                  value={contentLtr.faqs.heading}
                                  onChange={(e) =>
                                    setContentLtr({
                                      ...contentLtr,
                                      faqs: { ...contentLtr.faqs, heading: e.target.value },
                                    })
                                  }
                                />
                              </div>
                              <div className="form-group">
                                <label>Heading</label>
                                <input
                                  type="text"
                                  dir="rtl"
                                  value={contentRtl.faqs.heading}
                                  onChange={(e) =>
                                    setContentRtl({
                                      ...contentRtl,
                                      faqs: { ...contentRtl.faqs, heading: e.target.value },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                  
                          {/* Subheading */}
                          <div>
                            <div className="form-row-bilingual-header">
                              <div className="form-label-header">English</div>
                              <div className="form-label-header">العربية</div>
                            </div>
                            <div className="form-row-bilingual">
                              <div className="form-group">
                                <label>Subheading</label>
                                <textarea
                                  value={contentLtr.faqs.subheading || ''}
                                  onChange={(e) =>
                                    setContentLtr({
                                      ...contentLtr,
                                      faqs: { ...contentLtr.faqs, subheading: e.target.value },
                                    })
                                  }
                                  rows={3}
                                />
                              </div>
                              <div className="form-group">
                                <label>Subheading</label>
                                <textarea
                                  dir="rtl"
                                  value={contentRtl.faqs.subheading || ''}
                                  onChange={(e) =>
                                    setContentRtl({
                                      ...contentRtl,
                                      faqs: { ...contentRtl.faqs, subheading: e.target.value },
                                    })
                                  }
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                  
                          {/* Button text */}
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
                                  value={contentLtr.faqs.buttonText || ''}
                                  onChange={(e) =>
                                    setContentLtr({
                                      ...contentLtr,
                                      faqs: { ...contentLtr.faqs, buttonText: e.target.value },
                                    })
                                  }
                                />
                              </div>
                              <div className="form-group">
                                <label>Button Text</label>
                                <input
                                  type="text"
                                  dir="rtl"
                                  value={contentRtl.faqs.buttonText || ''}
                                  onChange={(e) =>
                                    setContentRtl({
                                      ...contentRtl,
                                      faqs: { ...contentRtl.faqs, buttonText: e.target.value },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                  
                          {/* Button link (shared) */}
                          <div className="form-group">
                            <label>Button Link</label>
                            <input
                              type="text"
                              value={contentLtr.faqs.buttonLink || ''}
                              onChange={(e) => {
                                setContentLtr({
                                  ...contentLtr,
                                  faqs: { ...contentLtr.faqs, buttonLink: e.target.value },
                                });
                                setContentRtl({
                                  ...contentRtl,
                                  faqs: { ...contentRtl.faqs, buttonLink: e.target.value },
                                });
                              }}
                            />
                          </div>
                  
                          {/* FAQ items */}
                          <div className="form-group">
                            <label>FAQs</label>
                            <div className="hero-slides-container">
                              {Array.from({
                                length: Math.max(
                                  contentLtr.faqs.faqs?.length || 0,
                                  contentRtl.faqs.faqs?.length || 0
                                ),
                              }).map((_, index) => {
                                const faqLtr =
                                  contentLtr.faqs.faqs?.[index] || { question: '', answer: '', isOpen: false };
                                const faqRtl =
                                  contentRtl.faqs.faqs?.[index] || { question: '', answer: '', isOpen: false };
                  
                                return (
                                  <div key={index} className="hero-slide-card">
                                    <div className="hero-slide-header">
                                      <h4>FAQ {index + 1}</h4>
                                      {(contentLtr.faqs.faqs?.length || 0) > 0 && (
                                        <button
                                          type="button"
                                          className="hero-slide-remove"
                                          onClick={() => {
                                            const newFaqsLtr =
                                              contentLtr.faqs.faqs?.filter((_: any, i: number) => i !== index) || [];
                                            const newFaqsRtl =
                                              contentRtl.faqs.faqs?.filter((_: any, i: number) => i !== index) || [];
                                            setContentLtr({
                                              ...contentLtr,
                                              faqs: { ...contentLtr.faqs, faqs: newFaqsLtr },
                                            });
                                            setContentRtl({
                                              ...contentRtl,
                                              faqs: { ...contentRtl.faqs, faqs: newFaqsRtl },
                                            });
                                          }}
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                    <div className="hero-slide-fields">
                                      {/* Question */}
                                      <div>
                                        <div className="form-row-bilingual-header">
                                          <div className="form-label-header">English</div>
                                          <div className="form-label-header">العربية</div>
                                        </div>
                                        <div className="form-row-bilingual">
                                          <div className="form-group">
                                            <label>Question</label>
                                            <input
                                              type="text"
                                              value={faqLtr.question}
                                              onChange={(e) => {
                                                const newFaqs = [...(contentLtr.faqs.faqs || [])];
                                                newFaqs[index] = { ...faqLtr, question: e.target.value };
                                                setContentLtr({
                                                  ...contentLtr,
                                                  faqs: { ...contentLtr.faqs, faqs: newFaqs },
                                                });
                                              }}
                                            />
                                          </div>
                                          <div className="form-group">
                                            <label>Question</label>
                                            <input
                                              type="text"
                                              dir="rtl"
                                              value={faqRtl.question}
                                              onChange={(e) => {
                                                const newFaqs = [...(contentRtl.faqs.faqs || [])];
                                                newFaqs[index] = { ...faqRtl, question: e.target.value };
                                                setContentRtl({
                                                  ...contentRtl,
                                                  faqs: { ...contentRtl.faqs, faqs: newFaqs },
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                  
                                      {/* Answer */}
                                      <div>
                                        <div className="form-row-bilingual-header">
                                          <div className="form-label-header">English</div>
                                          <div className="form-label-header">العربية</div>
                                        </div>
                                        <div className="form-row-bilingual">
                                          <div className="form-group">
                                            <label>Answer</label>
                                            <textarea
                                              value={faqLtr.answer}
                                              onChange={(e) => {
                                                const newFaqs = [...(contentLtr.faqs.faqs || [])];
                                                newFaqs[index] = { ...faqLtr, answer: e.target.value };
                                                setContentLtr({
                                                  ...contentLtr,
                                                  faqs: { ...contentLtr.faqs, faqs: newFaqs },
                                                });
                                              }}
                                              rows={3}
                                            />
                                          </div>
                                          <div className="form-group">
                                            <label>Answer</label>
                                            <textarea
                                              dir="rtl"
                                              value={faqRtl.answer}
                                              onChange={(e) => {
                                                const newFaqs = [...(contentRtl.faqs.faqs || [])];
                                                newFaqs[index] = { ...faqRtl, answer: e.target.value };
                                                setContentRtl({
                                                  ...contentRtl,
                                                  faqs: { ...contentRtl.faqs, faqs: newFaqs },
                                                });
                                              }}
                                              rows={3}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <button
                              type="button"
                              className="button"
                              onClick={() => {
                                const newFaq = { question: '', answer: '', isOpen: false };
                                setContentLtr({
                                  ...contentLtr,
                                  faqs: {
                                    ...contentLtr.faqs,
                                    faqs: [...(contentLtr.faqs.faqs || []), newFaq],
                                  },
                                });
                                setContentRtl({
                                  ...contentRtl,
                                  faqs: {
                                    ...contentRtl.faqs,
                                    faqs: [...(contentRtl.faqs.faqs || []), newFaq],
                                  },
                                });
                              }}
                              style={{ marginTop: '12px' }}
                            >
                              Add FAQ
                            </button>
                          </div>
                  
                          <div className="form-actions">
                            <button
                              className="button button-primary"
                              onClick={() => handleSaveSection('faqs')}
                              disabled={saving === 'faqs'}
                            >
                              {saving === 'faqs' ? 'Saving...' : 'Save FAQs'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
        case 'heritage':
          return (
            <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
              <div className="admin-cms-form">
                {/* Tag */}
                <div>
                  <div className="form-row-bilingual-header">
                    <div className="form-label-header">English</div>
                    <div className="form-label-header">العربية</div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Tag</label>
                      <input
                        type="text"
                        value={contentLtr.heritage.tag}
                        onChange={(e) =>
                          setContentLtr({
                            ...contentLtr,
                            heritage: { ...contentLtr.heritage, tag: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Tag</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={contentRtl.heritage.tag}
                        onChange={(e) =>
                          setContentRtl({
                            ...contentRtl,
                            heritage: { ...contentRtl.heritage, tag: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
        
                {/* Heading */}
                <div>
                  <div className="form-row-bilingual-header">
                    <div className="form-label-header">English</div>
                    <div className="form-label-header">العربية</div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Heading</label>
                      <input
                        type="text"
                        value={contentLtr.heritage.heading}
                        onChange={(e) =>
                          setContentLtr({
                            ...contentLtr,
                            heritage: { ...contentLtr.heritage, heading: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Heading</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={contentRtl.heritage.heading}
                        onChange={(e) =>
                          setContentRtl({
                            ...contentRtl,
                            heritage: { ...contentRtl.heritage, heading: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
        
                {/* Image (shared) */}
                <div className="form-group">
                  <label>Image</label>
                  <ImageUpload
                    value={contentLtr.heritage.imagePath}
                    onChange={(value) => {
                      setContentLtr({
                        ...contentLtr,
                        heritage: { ...contentLtr.heritage, imagePath: value },
                      });
                      setContentRtl({
                        ...contentRtl,
                        heritage: { ...contentRtl.heritage, imagePath: value },
                      });
                    }}
                    folder="about"
                  />
                </div>
        
                {/* Paragraphs */}
                <div>
                  <div className="form-row-bilingual-header">
                    <div className="form-label-header">English</div>
                    <div className="form-label-header">العربية</div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Paragraphs (one per line)</label>
                      <textarea
                        value={
                          Array.isArray(contentLtr.heritage.paragraphs)
                            ? contentLtr.heritage.paragraphs.join('\n')
                            : ''
                        }
                        onChange={(e) => {
                          const paragraphs = e.target.value
                            .split('\n')
                            .map((p) => p.trim())
                            .filter(Boolean);
                          setContentLtr({
                            ...contentLtr,
                            heritage: { ...contentLtr.heritage, paragraphs },
                          });
                        }}
                        rows={6}
                      />
                    </div>
                    <div className="form-group">
                      <label>Paragraphs (one per line)</label>
                      <textarea
                        dir="rtl"
                        value={
                          Array.isArray(contentRtl.heritage.paragraphs)
                            ? contentRtl.heritage.paragraphs.join('\n')
                            : ''
                        }
                        onChange={(e) => {
                          const paragraphs = e.target.value
                            .split('\n')
                            .map((p) => p.trim())
                            .filter(Boolean);
                          setContentRtl({
                            ...contentRtl,
                            heritage: { ...contentRtl.heritage, paragraphs },
                          });
                        }}
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
        
                <div className="form-actions">
                  <button
                    className="button button-primary"
                    onClick={() => handleSaveSection('heritage')}
                    disabled={saving === 'heritage'}
                  >
                    {saving === 'heritage' ? 'Saving...' : 'Save Heritage'}
                  </button>
                </div>
              </div>
            </div>
          );
      case 'visionMissionValues':
        return (
          <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
            <div className="admin-cms-form">
              {/* Tag */}
              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">العربية</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Tag</label>
                    <input
                      type="text"
                      value={contentLtr.visionMissionValues.tag}
                      onChange={(e) =>
                        setContentLtr({
                          ...contentLtr,
                          visionMissionValues: { ...contentLtr.visionMissionValues, tag: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Tag</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentRtl.visionMissionValues.tag}
                      onChange={(e) =>
                        setContentRtl({
                          ...contentRtl,
                          visionMissionValues: { ...contentRtl.visionMissionValues, tag: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">العربية</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Heading</label>
                    <input
                      type="text"
                      value={contentLtr.visionMissionValues.heading}
                      onChange={(e) =>
                        setContentLtr({
                          ...contentLtr,
                          visionMissionValues: {
                            ...contentLtr.visionMissionValues,
                            heading: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Heading</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentRtl.visionMissionValues.heading}
                      onChange={(e) =>
                        setContentRtl({
                          ...contentRtl,
                          visionMissionValues: {
                            ...contentRtl.visionMissionValues,
                            heading: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Subheading */}
              <div>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">العربية</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Subheading</label>
                    <textarea
                      value={contentLtr.visionMissionValues.subheading || ''}
                      onChange={(e) =>
                        setContentLtr({
                          ...contentLtr,
                          visionMissionValues: {
                            ...contentLtr.visionMissionValues,
                            subheading: e.target.value,
                          },
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subheading</label>
                    <textarea
                      dir="rtl"
                      value={contentRtl.visionMissionValues.subheading || ''}
                      onChange={(e) =>
                        setContentRtl({
                          ...contentRtl,
                          visionMissionValues: {
                            ...contentRtl.visionMissionValues,
                            subheading: e.target.value,
                          },
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions" style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={addVisionMissionItem}
                >
                  Add Vision/Mission/Value Item
                </button>
              </div>

              {(contentLtr.visionMissionValues.items || []).map((item, itemIndex) => (
                <div
                  key={item.id || itemIndex}
                  style={{
                    border: '1px dashed #d1d5db',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  <div className="form-group">
                    <label>Item Image (shared for both languages)</label>
                    <ImageUpload
                      value={contentLtr.visionMissionValues.items[itemIndex]?.imagePath || ''}
                      onChange={(value) => {
                        const ltrItems = [...(contentLtr.visionMissionValues.items || [])];
                        const rtlItems = [...(contentRtl.visionMissionValues.items || [])];
                        ltrItems[itemIndex] = { ...ltrItems[itemIndex], imagePath: value };
                        rtlItems[itemIndex] = { ...rtlItems[itemIndex], imagePath: value };
                        setContentLtr({
                          ...contentLtr,
                          visionMissionValues: { ...contentLtr.visionMissionValues, items: ltrItems },
                        });
                        setContentRtl({
                          ...contentRtl,
                          visionMissionValues: { ...contentRtl.visionMissionValues, items: rtlItems },
                        });
                      }}
                      folder="aboutus/vision-mission-values"
                    />
                  </div>

                  <div className="form-row-bilingual-header">
                    <div className="form-label-header">English</div>
                    <div className="form-label-header">العربية</div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        value={contentLtr.visionMissionValues.items[itemIndex]?.label || ''}
                        onChange={(e) => {
                          const items = [...(contentLtr.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                          setContentLtr({
                            ...contentLtr,
                            visionMissionValues: { ...contentLtr.visionMissionValues, items },
                          });
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={contentRtl.visionMissionValues.items[itemIndex]?.label || ''}
                        onChange={(e) => {
                          const items = [...(contentRtl.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                          setContentRtl({
                            ...contentRtl,
                            visionMissionValues: { ...contentRtl.visionMissionValues, items },
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={contentLtr.visionMissionValues.items[itemIndex]?.title || ''}
                        onChange={(e) => {
                          const items = [...(contentLtr.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], title: e.target.value };
                          setContentLtr({
                            ...contentLtr,
                            visionMissionValues: { ...contentLtr.visionMissionValues, items },
                          });
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={contentRtl.visionMissionValues.items[itemIndex]?.title || ''}
                        onChange={(e) => {
                          const items = [...(contentRtl.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], title: e.target.value };
                          setContentRtl({
                            ...contentRtl,
                            visionMissionValues: { ...contentRtl.visionMissionValues, items },
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={contentLtr.visionMissionValues.items[itemIndex]?.description || ''}
                        onChange={(e) => {
                          const items = [...(contentLtr.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], description: e.target.value };
                          setContentLtr({
                            ...contentLtr,
                            visionMissionValues: { ...contentLtr.visionMissionValues, items },
                          });
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        dir="rtl"
                        value={contentRtl.visionMissionValues.items[itemIndex]?.description || ''}
                        onChange={(e) => {
                          const items = [...(contentRtl.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], description: e.target.value };
                          setContentRtl({
                            ...contentRtl,
                            visionMissionValues: { ...contentRtl.visionMissionValues, items },
                          });
                        }}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Points (one per line)</label>
                      <textarea
                        value={(contentLtr.visionMissionValues.items[itemIndex]?.points || []).join('\n')}
                        onChange={(e) => {
                          const points = e.target.value
                            .split('\n')
                            .map((p) => p.trim())
                            .filter(Boolean);
                          const items = [...(contentLtr.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], points };
                          setContentLtr({
                            ...contentLtr,
                            visionMissionValues: { ...contentLtr.visionMissionValues, items },
                          });
                        }}
                        rows={4}
                      />
                    </div>
                    <div className="form-group">
                      <label>Points (one per line)</label>
                      <textarea
                        dir="rtl"
                        value={(contentRtl.visionMissionValues.items[itemIndex]?.points || []).join('\n')}
                        onChange={(e) => {
                          const points = e.target.value
                            .split('\n')
                            .map((p) => p.trim())
                            .filter(Boolean);
                          const items = [...(contentRtl.visionMissionValues.items || [])];
                          items[itemIndex] = { ...items[itemIndex], points };
                          setContentRtl({
                            ...contentRtl,
                            visionMissionValues: { ...contentRtl.visionMissionValues, items },
                          });
                        }}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => removeVisionMissionItem(itemIndex)}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}

              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('visionMissionValues')}
                  disabled={saving === 'visionMissionValues'}
                >
                  {saving === 'visionMissionValues'
                    ? 'Saving...'
                    : 'Save Vision/Mission/Values'}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || !contentLtr || !contentRtl) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>About Us</h1>
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

      {/* Selected section form at the top */}
      {selectedSection && (
        <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '18px' }}>
          {ABOUT_SECTIONS.find((s) => s.id === selectedSection)?.label || selectedSection}
        </div>
      )}
      {renderSelectedSectionForm()}

      <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
        <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
          <div>
            <h3 style={{ margin: 0 }}>Team Members Management</h3>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Team members are managed separately.
            </div>
          </div>
          <Link href="/admin/manageteam" className="button button-primary">
            Go to Team Management →
          </Link>
        </div>
      </div>

      {/* Sections overview table (similar to Home Page CMS) */}
      <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
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
              {ABOUT_SECTIONS.map(({ id, label }) => {
                const ltr: any = (contentLtr as any)[id] || {};
                const rtl: any = (contentRtl as any)[id] || {};

                const titleEn =
                  ltr.heading ||
                  ltr.title ||
                  ltr.tag ||
                  ltr.subheading ||
                  label;

                const titleAr =
                  rtl.heading ||
                  rtl.title ||
                  rtl.tag ||
                  rtl.subheading ||
                  '';

                const isEditing = selectedSection === id;

                return (
                  <tr key={id}>
                    <td>
                      <strong>{label}</strong>
                    </td>
                    <td>{titleEn || '-'}</td>
                    <td style={{ direction: 'rtl', textAlign: 'right' }}>{titleAr || '-'}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-edit admin-cms-edit-btn"
                          onClick={() => {
                            if (isEditing) {
                              setSelectedSection(null);
                              return;
                            }
                            setSelectedSection(id);
                            if (typeof window !== 'undefined') {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

   
    </div>
  );
}
