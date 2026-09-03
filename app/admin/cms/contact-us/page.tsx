'use client';

import { useState, useEffect, useRef } from 'react';
import { saveWithPendingUploads, bilingualSaveOutcome } from '@/lib/pending-uploads';
import PageHeaderBackgroundField from '@/components/admin/PageHeaderBackgroundField';
import { ContactUsContent } from '@/types/contact-us';
import { toGoogleMapsEmbedUrl } from '@/lib/google-maps';

const CONTACT_US_SECTIONS = [
  { id: 'meta', label: 'Meta (SEO)', description: 'Title, description, keywords (English & Arabic)' },
  { id: 'header', label: 'Page Header', description: 'Breadcrumb, title, subtitle, background image' },
  { id: 'contact', label: 'Contact Section', description: 'Tag, heading, subheading, benefits, address, phone, email' },
  { id: 'map', label: 'Map Section', description: 'Google Maps embed URL' },
] as const;

type ContactUsSectionId = (typeof CONTACT_US_SECTIONS)[number]['id'];

export default function ContactUsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<ContactUsContent | null>(null);
  const contentLtrRef = useRef(contentLtr);
  contentLtrRef.current = contentLtr;
  const [contentRtl, setContentRtl] = useState<ContactUsContent | null>(null);
  const contentRtlRef = useRef(contentRtl);
  contentRtlRef.current = contentRtl;
  const [selectedSection, setSelectedSection] = useState<ContactUsSectionId | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const withDefaultContactLabels = (content: ContactUsContent): ContactUsContent => {
    const defaults =
      content.language === 'rtl'
        ? { address: 'العنوان', phone: 'الهاتف', email: 'البريد الإلكتروني' }
        : { address: 'Address', phone: 'Telephone', email: 'Email' };

    return {
      ...content,
      contactSection: {
        ...content.contactSection,
        benefits: Array.isArray(content.contactSection.benefits)
          ? content.contactSection.benefits
          : [],
        contactInfoLabels: {
          address: content.contactSection.contactInfoLabels?.address || defaults.address,
          phone: content.contactSection.contactInfoLabels?.phone || defaults.phone,
          email: content.contactSection.contactInfoLabels?.email || defaults.email,
        },
      },
    };
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      // Fetch both LTR and RTL content in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/contact-us?language=ltr'),
        fetch('/api/contact-us?language=rtl'),
      ]);
      
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      
      if (ltrResult.success && ltrResult.data) {
        setContentLtr(withDefaultContactLabels(ltrResult.data));
      } else {
        setContentLtr(getEmptyContent('ltr'));
      }
      
      if (rtlResult.success && rtlResult.data) {
        setContentRtl(withDefaultContactLabels(rtlResult.data));
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

  const getEmptyContent = (lang: 'ltr' | 'rtl'): ContactUsContent => ({
    language: lang,
    isActive: true,
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
    header: {
      breadcrumb: 'Contact Us',
      title: 'Contact Us',
      subtitle: 'Explore success stories from businesses that achieved growth through our tailored strategies and solutions.',
      imagePath: '',
      language: lang,
      isActive: true,
    },
    contactSection: {
      tag: 'Contact US',
      heading: 'Get in Touch with Us',
      subheading: 'Reach out today to discuss how we can support your business goals. Our team is ready to provide answers, offer solutions, and start your journey toward success.',
      benefits: [],
      contactInfoLabels: lang === 'rtl'
        ? { address: 'العنوان', phone: 'الهاتف', email: 'البريد الإلكتروني' }
        : { address: 'Address', phone: 'Telephone', email: 'Email' },
      contactInfo: {
        address: 'P.O. Box 148 Safat 13002-Kuwait, Block 1, Street 3, Shuwaikh Industrial 1',
        phone: '+965 184 8848',
        email: 'info.bpc@albahargroup.com',
      },
      isActive: true,
    },
    mapSection: {
      mapUrl: 'https://www.google.com/maps?q=29.362696,47.962198&hl=en&z=16&output=embed&cid=17293679640408904591',
      isActive: true,
    },
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveSection = async (section: string) => {
    setSaving(section);
    try {
      let errorMessage = 'Failed to save';
      const saved = await saveWithPendingUploads(async () => {
        const contentLtr = contentLtrRef.current;
        const contentRtl = contentRtlRef.current;
        if (!contentLtr || !contentRtl) return false;

        let ltrPayload = { ...contentLtr, language: 'ltr' as const };
        let rtlPayload = { ...contentRtl, language: 'rtl' as const };

        // Convert place/share links to iframe-safe embed URLs before saving
        if (section === 'map') {
          const embedUrl = toGoogleMapsEmbedUrl(contentLtr.mapSection.mapUrl);
          ltrPayload = {
            ...ltrPayload,
            mapSection: { ...ltrPayload.mapSection, mapUrl: embedUrl },
          };
          rtlPayload = {
            ...rtlPayload,
            mapSection: { ...rtlPayload.mapSection, mapUrl: embedUrl },
          };
          setContentLtr({ ...contentLtr, mapSection: { ...contentLtr.mapSection, mapUrl: embedUrl } });
          setContentRtl({ ...contentRtl, mapSection: { ...contentRtl.mapSection, mapUrl: embedUrl } });
        }

        const [ltrRes, rtlRes] = await Promise.all([
          fetch('/api/contact-us', {
            method: contentLtr._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ltrPayload),
          }),
          fetch('/api/contact-us', {
            method: contentRtl._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rtlPayload),
          }),
        ]);

        const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
        if (!(ltrResult.success && rtlResult.success)) {
          errorMessage = ltrResult.message || rtlResult.message || 'Failed to save';
        }
        return bilingualSaveOutcome(ltrResult.success, rtlResult.success);
      });

      if (saved) {
        showMessage('success', `${section} saved successfully!`);
        await loadContent();
      } else {
        showMessage('error', errorMessage);
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

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Contact Us</h1>
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

      {/* Selected section form (shown on top). Table below controls selection. */}
      {selectedSection === 'header' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Page Header</h3>
            <button
              type="button"
              className="admin-btn admin-btn-delete"
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
      )}

      {selectedSection === 'contact' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Contact Section</h3>
            <button
              type="button"
              className="admin-btn admin-btn-delete"
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
                <label>Section Tag</label>
                <input
                  type="text"
                  value={contentLtr.contactSection.tag}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: { ...contentLtr.contactSection, tag: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Section Tag</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.tag}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: { ...contentRtl.contactSection, tag: e.target.value },
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
                  value={contentLtr.contactSection.heading}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: { ...contentLtr.contactSection, heading: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Heading</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.heading}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: { ...contentRtl.contactSection, heading: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Subheading</label>
                <textarea
                  value={contentLtr.contactSection.subheading || ''}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: { ...contentLtr.contactSection, subheading: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Subheading</label>
                <textarea
                  dir="rtl"
                  value={contentRtl.contactSection.subheading || ''}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: { ...contentRtl.contactSection, subheading: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Benefits</label>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>
                Checklist items shown under the heading on the Contact Us page. Add, edit, or remove in English and Arabic.
              </div>
              <div className="hero-slides-container">
                {Array.from({
                  length: Math.max(
                    contentLtr.contactSection.benefits?.length || 0,
                    contentRtl.contactSection.benefits?.length || 0
                  ),
                }).map((_, index) => {
                  const ltrBenefit = contentLtr.contactSection.benefits?.[index] || { text: '' };
                  const rtlBenefit = contentRtl.contactSection.benefits?.[index] || { text: '' };

                  return (
                    <div key={index} className="hero-slide-card">
                      <div className="hero-slide-header">
                        <h4 style={{ margin: 0 }}>Benefit {index + 1}</h4>
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            setContentLtr({
                              ...contentLtr,
                              contactSection: {
                                ...contentLtr.contactSection,
                                benefits: (contentLtr.contactSection.benefits || []).filter(
                                  (_item, i) => i !== index
                                ),
                              },
                            });
                            setContentRtl({
                              ...contentRtl,
                              contactSection: {
                                ...contentRtl.contactSection,
                                benefits: (contentRtl.contactSection.benefits || []).filter(
                                  (_item, i) => i !== index
                                ),
                              },
                            });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="form-row-bilingual-header">
                        <div className="form-label-header">English</div>
                        <div className="form-label-header">Arabic</div>
                      </div>
                      <div className="form-row-bilingual">
                        <div className="form-group">
                          <label>Text</label>
                          <input
                            type="text"
                            value={ltrBenefit.text}
                            onChange={(e) => {
                              const next = [...(contentLtr.contactSection.benefits || [])];
                              while (next.length <= index) next.push({ text: '' });
                              next[index] = { text: e.target.value };
                              setContentLtr({
                                ...contentLtr,
                                contactSection: {
                                  ...contentLtr.contactSection,
                                  benefits: next,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Text</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={rtlBenefit.text}
                            onChange={(e) => {
                              const next = [...(contentRtl.contactSection.benefits || [])];
                              while (next.length <= index) next.push({ text: '' });
                              next[index] = { text: e.target.value };
                              setContentRtl({
                                ...contentRtl,
                                contactSection: {
                                  ...contentRtl.contactSection,
                                  benefits: next,
                                },
                              });
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
                    setContentLtr({
                      ...contentLtr,
                      contactSection: {
                        ...contentLtr.contactSection,
                        benefits: [...(contentLtr.contactSection.benefits || []), { text: '' }],
                      },
                    });
                    setContentRtl({
                      ...contentRtl,
                      contactSection: {
                        ...contentRtl.contactSection,
                        benefits: [...(contentRtl.contactSection.benefits || []), { text: '' }],
                      },
                    });
                  }}
                >
                  + Add Benefit
                </button>
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Address Label</label>
                <input
                  type="text"
                  value={contentLtr.contactSection.contactInfoLabels?.address || ''}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: {
                        ...contentLtr.contactSection,
                        contactInfoLabels: {
                          ...(contentLtr.contactSection.contactInfoLabels || { address: '', phone: '', email: '' }),
                          address: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Address Label</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.contactInfoLabels?.address || ''}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: {
                        ...contentRtl.contactSection,
                        contactInfoLabels: {
                          ...(contentRtl.contactSection.contactInfoLabels || { address: '', phone: '', email: '' }),
                          address: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Phone Label</label>
                <input
                  type="text"
                  value={contentLtr.contactSection.contactInfoLabels?.phone || ''}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: {
                        ...contentLtr.contactSection,
                        contactInfoLabels: {
                          ...(contentLtr.contactSection.contactInfoLabels || { address: '', phone: '', email: '' }),
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Phone Label</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.contactInfoLabels?.phone || ''}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: {
                        ...contentRtl.contactSection,
                        contactInfoLabels: {
                          ...(contentRtl.contactSection.contactInfoLabels || { address: '', phone: '', email: '' }),
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Email Label</label>
                <input
                  type="text"
                  value={contentLtr.contactSection.contactInfoLabels?.email || ''}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: {
                        ...contentLtr.contactSection,
                        contactInfoLabels: {
                          ...(contentLtr.contactSection.contactInfoLabels || { address: '', phone: '', email: '' }),
                          email: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email Label</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.contactInfoLabels?.email || ''}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: {
                        ...contentRtl.contactSection,
                        contactInfoLabels: {
                          ...(contentRtl.contactSection.contactInfoLabels || { address: '', phone: '', email: '' }),
                          email: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={contentLtr.contactSection.contactInfo.address}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: {
                        ...contentLtr.contactSection,
                        contactInfo: {
                          ...contentLtr.contactSection.contactInfo,
                          address: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.contactInfo.address}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: {
                        ...contentRtl.contactSection,
                        contactInfo: {
                          ...contentRtl.contactSection.contactInfo,
                          address: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={contentLtr.contactSection.contactInfo.phone}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: {
                        ...contentLtr.contactSection,
                        contactInfo: {
                          ...contentLtr.contactSection.contactInfo,
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.contactInfo.phone}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: {
                        ...contentRtl.contactSection,
                        contactInfo: {
                          ...contentRtl.contactSection.contactInfo,
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={contentLtr.contactSection.contactInfo.email}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      contactSection: {
                        ...contentLtr.contactSection,
                        contactInfo: {
                          ...contentLtr.contactSection.contactInfo,
                          email: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  dir="rtl"
                  value={contentRtl.contactSection.contactInfo.email}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      contactSection: {
                        ...contentRtl.contactSection,
                        contactInfo: {
                          ...contentRtl.contactSection.contactInfo,
                          email: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('contact')}
                  disabled={saving === 'contact'}
                >
                  {saving === 'contact' ? 'Saving...' : 'Save Contact Section'}
                </button>
              </div>
            </div>
        </div>
      )}

      {selectedSection === 'map' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Map Section</h3>
            <button
              type="button"
              className="admin-btn admin-btn-delete"
              onClick={() => setSelectedSection(null)}
            >
              Close
            </button>
          </div>
          <div className="admin-cms-form">
              <div className="form-group">
                <label>Map URL</label>
                <input
                  type="text"
                  value={contentLtr.mapSection.mapUrl}
                  onChange={(e) => {
                    const mapUrl = e.target.value;
                    setContentLtr({
                      ...contentLtr,
                      mapSection: { ...contentLtr.mapSection, mapUrl },
                    });
                    setContentRtl({
                      ...contentRtl,
                      mapSection: { ...contentRtl.mapSection, mapUrl },
                    });
                  }}
                  placeholder="Paste Google Maps link or coordinates"
                />
                <small style={{ display: 'block', marginTop: 8, lineHeight: 1.5 }}>
                  Paste any of these (auto-converted on save):
                  <br />
                  1) Coordinates: <code>29.339256,47.937339</code>
                  <br />
                  2) Place / share link from Google Maps (your link works)
                  <br />
                  3) Best: Google Maps → Share → Embed a map → copy iframe <code>src</code>
                </small>
              </div>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('map')}
                  disabled={saving === 'map'}
                >
                  {saving === 'map' ? 'Saving...' : 'Save Map Section'}
                </button>
              </div>
            </div>
        </div>
      )}

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
            {CONTACT_US_SECTIONS.map((section) => {
              const isEditing = selectedSection === section.id;
              let titleEn = '-';
              let titleAr = '-';
              if (section.id === 'meta') {
                titleEn = contentLtr?.seo?.title || '-';
                titleAr = contentRtl?.seo?.title || '-';
              } else if (section.id === 'header') {
                titleEn = contentLtr?.header?.title || '-';
                titleAr = contentRtl?.header?.title || '-';
              } else if (section.id === 'contact') {
                titleEn = contentLtr?.contactSection?.heading || '-';
                titleAr = contentRtl?.contactSection?.heading || '-';
              } else if (section.id === 'map') {
                titleEn = contentLtr?.mapSection?.mapUrl ? 'Embedded Map' : '-';
                titleAr = contentRtl?.mapSection?.mapUrl ? 'Embedded Map' : '-';
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
                        setSelectedSection(isEditing ? null : section.id);
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
