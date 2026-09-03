'use client';

import { useState, useEffect, useRef} from 'react';
import { saveWithPendingUploads, bilingualSaveOutcome, discardPendingUploads } from '@/lib/pending-uploads';
import { FooterContent } from '@/types/footer';
import ImageUpload from '@/components/admin/ui/ImageUpload';

const FOOTER_SECTIONS = [
  { id: 'logo', label: 'Logo & Description', description: 'Logo image/link + bilingual description' },
  { id: 'social', label: 'Social Links', description: 'Manage LinkedIn, Instagram, and other social profiles' },
  { id: 'newsletter', label: 'Newsletter Section', description: 'Title, description, placeholder (bilingual)' },
  { id: 'quickLinks', label: 'Quick Links', description: 'Manage column titles, link titles, and shared link paths' },
  { id: 'serviceAssistance', label: 'Service & Assistance', description: 'Manage title and simple items (text + shared value/path)' },
  { id: 'contact', label: 'Contact Us', description: 'Manage title and simple items (text + shared value/path)' },
  { id: 'bottom', label: 'Footer Bottom', description: 'Copyright (bilingual)' },
] as const;

type FooterSectionId = (typeof FOOTER_SECTIONS)[number]['id'];

export default function FooterManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<FooterContent | null>(null);
  const contentLtrRef = useRef(contentLtr);
  contentLtrRef.current = contentLtr;
  const [contentRtl, setContentRtl] = useState<FooterContent | null>(null);
  const contentRtlRef = useRef(contentRtl);
  contentRtlRef.current = contentRtl;
  const [selectedSection, setSelectedSection] = useState<FooterSectionId | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Fetch both LTR and RTL content in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/footer?language=ltr'),
        fetch('/api/footer?language=rtl'),
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

  const getEmptyContent = (lang: 'ltr' | 'rtl'): FooterContent => ({
    language: lang,
    isActive: true,
    logo: {
      imagePath: '/image/logo/logo-footer.png',
      alt: 'Al Bahar & Partners',
      width: 169,
      height: 41,
      link: '#',
    },
    description: '',
    socialLinks: [],
    newsletter: {
      title: 'Subscribe for Updates & Insights',
      description: 'Get occasional updates on solutions, case studies, and company news. No spam.',
      placeholder: 'Enter your email address',
      isActive: true,
    },
    quickLinks: [],
    serviceAssistance: {
      title: 'Service & Assistance',
      items: [],
      isActive: true,
    },
    contactSection: {
      title: 'Contact Us',
      items: [],
      order: 0,
      isActive: true,
    },
    footerBottom: {
      copyright: '© 2025 Al Bahar & Partners. All Rights Reserved.',
      links: [],
    },
    backgroundImage: '/image/section/bg-footer-style-2.png',
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const updateBothContents = (updater: (ltr: FooterContent, rtl: FooterContent) => { ltr: FooterContent; rtl: FooterContent }) => {
    if (!contentLtr || !contentRtl) return;
    const next = updater(contentLtr, contentRtl);
    setContentLtr(next.ltr);
    setContentRtl(next.rtl);
  };

  const addQuickLinksColumn = () => {
    updateBothContents((ltr, rtl) => {
      const newColumn = {
        title: 'Quick Links',
        links: [],
        order: ltr.quickLinks.length,
        isActive: true,
      };
      return {
        ltr: { ...ltr, quickLinks: [...ltr.quickLinks, newColumn] },
        rtl: { ...rtl, quickLinks: [...rtl.quickLinks, { ...newColumn, title: 'روابط سريعة' }] },
      };
    });
  };

  const addSocialLink = () => {
    updateBothContents((ltr, rtl) => {
      const order = Math.max(ltr.socialLinks?.length || 0, rtl.socialLinks?.length || 0);
      const newLtr = {
        name: '',
        url: '',
        icon: 'linkedin',
        order,
        isActive: true,
      };
      const newRtl = {
        ...newLtr,
        name: '',
      };
      return {
        ltr: { ...ltr, socialLinks: [...(ltr.socialLinks || []), newLtr] },
        rtl: { ...rtl, socialLinks: [...(rtl.socialLinks || []), newRtl] },
      };
    });
  };

  const removeSocialLink = (index: number) => {
    updateBothContents((ltr, rtl) => ({
      ltr: {
        ...ltr,
        socialLinks: (ltr.socialLinks || [])
          .filter((_, i) => i !== index)
          .map((item, i) => ({ ...item, order: i })),
      },
      rtl: {
        ...rtl,
        socialLinks: (rtl.socialLinks || [])
          .filter((_, i) => i !== index)
          .map((item, i) => ({ ...item, order: i })),
      },
    }));
  };

  const updateSocialLinkShared = (
    index: number,
    field: 'url' | 'icon' | 'isActive' | 'order',
    value: string | boolean | number
  ) => {
    updateBothContents((ltr, rtl) => {
      const ltrLinks = [...(ltr.socialLinks || [])];
      const rtlLinks = [...(rtl.socialLinks || [])];
      while (rtlLinks.length < ltrLinks.length) {
        rtlLinks.push({ ...ltrLinks[rtlLinks.length], name: '' });
      }
      ltrLinks[index] = { ...ltrLinks[index], [field]: value };
      rtlLinks[index] = { ...rtlLinks[index], [field]: value };
      return {
        ltr: { ...ltr, socialLinks: ltrLinks },
        rtl: { ...rtl, socialLinks: rtlLinks },
      };
    });
  };

  const removeQuickLinksColumn = (columnIndex: number) => {
    updateBothContents((ltr, rtl) => ({
      ltr: {
        ...ltr,
        quickLinks: ltr.quickLinks.filter((_, idx) => idx !== columnIndex).map((col, idx) => ({ ...col, order: idx })),
      },
      rtl: {
        ...rtl,
        quickLinks: rtl.quickLinks.filter((_, idx) => idx !== columnIndex).map((col, idx) => ({ ...col, order: idx })),
      },
    }));
  };

  const addQuickLinkItem = (columnIndex: number) => {
    updateBothContents((ltr, rtl) => {
      const ltrColumns = [...ltr.quickLinks];
      const rtlColumns = [...rtl.quickLinks];
      if (!ltrColumns[columnIndex] || !rtlColumns[columnIndex]) return { ltr, rtl };

      const ltrLinks = [...ltrColumns[columnIndex].links];
      const rtlLinks = [...rtlColumns[columnIndex].links];
      const ltrItem = { title: 'New Link', href: '/', order: ltrLinks.length, isActive: true };
      const rtlItem = { title: 'رابط جديد', href: '/', order: rtlLinks.length, isActive: true };
      ltrColumns[columnIndex] = { ...ltrColumns[columnIndex], links: [...ltrLinks, ltrItem] };
      rtlColumns[columnIndex] = { ...rtlColumns[columnIndex], links: [...rtlLinks, rtlItem] };

      return {
        ltr: { ...ltr, quickLinks: ltrColumns },
        rtl: { ...rtl, quickLinks: rtlColumns },
      };
    });
  };

  const removeQuickLinkItem = (columnIndex: number, itemIndex: number) => {
    updateBothContents((ltr, rtl) => {
      const ltrColumns = [...ltr.quickLinks];
      const rtlColumns = [...rtl.quickLinks];
      if (!ltrColumns[columnIndex] || !rtlColumns[columnIndex]) return { ltr, rtl };

      ltrColumns[columnIndex] = {
        ...ltrColumns[columnIndex],
        links: ltrColumns[columnIndex].links.filter((_, idx) => idx !== itemIndex).map((item, idx) => ({ ...item, order: idx })),
      };
      rtlColumns[columnIndex] = {
        ...rtlColumns[columnIndex],
        links: rtlColumns[columnIndex].links.filter((_, idx) => idx !== itemIndex).map((item, idx) => ({ ...item, order: idx })),
      };

      return {
        ltr: { ...ltr, quickLinks: ltrColumns },
        rtl: { ...rtl, quickLinks: rtlColumns },
      };
    });
  };

  const addFooterItem = (section: 'serviceAssistance' | 'contactSection') => {
    updateBothContents((ltr, rtl) => {
      const ltrItems = [...ltr[section].items];
      const rtlItems = [...rtl[section].items];
      const ltrItem = { label: 'Item Text', value: '', order: ltrItems.length, isActive: true };
      const rtlItem = { label: 'نص العنصر', value: '', order: rtlItems.length, isActive: true };

      return {
        ltr: {
          ...ltr,
          [section]: {
            ...ltr[section],
            items: [...ltrItems, ltrItem],
          },
        },
        rtl: {
          ...rtl,
          [section]: {
            ...rtl[section],
            items: [...rtlItems, rtlItem],
          },
        },
      };
    });
  };

  const removeFooterItem = (section: 'serviceAssistance' | 'contactSection', itemIndex: number) => {
    updateBothContents((ltr, rtl) => ({
      ltr: {
        ...ltr,
        [section]: {
          ...ltr[section],
          items: ltr[section].items.filter((_, idx) => idx !== itemIndex).map((item, idx) => ({ ...item, order: idx })),
        },
      },
      rtl: {
        ...rtl,
        [section]: {
          ...rtl[section],
          items: rtl[section].items.filter((_, idx) => idx !== itemIndex).map((item, idx) => ({ ...item, order: idx })),
        },
      },
    }));
  };

  const handleSaveSection = async (section: string) => {
    setSaving(section);
    try {
      let errorMessage = 'Failed to save';
      const saved = await saveWithPendingUploads(async () => {
        const contentLtr = contentLtrRef.current;
        const contentRtl = contentRtlRef.current;
        if (!contentLtr || !contentRtl) return false;

        const [ltrRes, rtlRes] = await Promise.all([
          fetch('/api/footer', {
            method: contentLtr._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...contentLtr, language: 'ltr' }),
          }),
          fetch('/api/footer', {
            method: contentRtl._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...contentRtl, language: 'rtl' }),
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
        <h1>Footer</h1>
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
      {selectedSection === 'logo' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Logo & Description</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
              Close
            </button>
          </div>
          <div className="admin-cms-form">
              <div className="form-group">
                <label>Logo Image</label>
                <ImageUpload
                  value={contentLtr.logo.imagePath}
                  onChange={(value) => {
                    setContentLtr({
                      ...contentLtr,
                      logo: { ...contentLtr.logo, imagePath: value },
                    });
                    setContentRtl({
                      ...contentRtl,
                      logo: { ...contentRtl.logo, imagePath: value },
                    });
                  }}
                  folder="logo"
                  helperText="Recommended: 340 × 82 px (~4:1)."
                />
              </div>
              <div className="form-group">
                <label>Logo Link</label>
                <input
                  type="text"
                  value={contentLtr.logo.link}
                  onChange={(e) => {
                    const link = e.target.value;
                    setContentLtr({
                      ...contentLtr,
                      logo: { ...contentLtr.logo, link },
                    });
                    setContentRtl({
                      ...contentRtl,
                      logo: { ...contentRtl.logo, link },
                    });
                  }}
                />
              </div>
              <div className="form-row-bilingual-header">
                <div className="form-label-header">English</div>
                <div className="form-label-header">Arabic</div>
              </div>

              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={contentLtr.description || ''}
                    onChange={(e) =>
                      setContentLtr({
                        ...contentLtr,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    dir="rtl"
                    value={contentRtl.description || ''}
                    onChange={(e) =>
                      setContentRtl({
                        ...contentRtl,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('logo')}
                  disabled={saving === 'logo'}
                >
                  {saving === 'logo' ? 'Saving...' : 'Save Logo & Description'}
                </button>
              </div>
            </div>
        </div>
      )}

      {selectedSection === 'social' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Social Links</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
              Close
            </button>
          </div>
          <div className="admin-cms-form">
            <p style={{ marginBottom: 16, color: '#6b7280', fontSize: 14 }}>
              Active links appear in the footer. Add more platforms anytime (Facebook, X, etc.).
            </p>
            <div className="form-actions" style={{ marginBottom: 16 }}>
              <button type="button" className="button button-secondary" onClick={addSocialLink}>
                Add Social Link
              </button>
            </div>

            {(contentLtr.socialLinks || []).length === 0 ? (
              <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8, color: '#6b7280' }}>
                No social links yet. Click &quot;Add Social Link&quot; to create one.
              </div>
            ) : (
              (contentLtr.socialLinks || []).map((link, index) => {
                const rtlLink = contentRtl.socialLinks?.[index] || link;
                return (
                  <div
                    key={link._id || index}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <strong>Link #{index + 1}</strong>
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() => removeSocialLink(index)}
                        style={{ fontSize: 13, padding: '6px 12px' }}
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
                        <label>Name</label>
                        <input
                          type="text"
                          value={link.name || ''}
                          onChange={(e) => {
                            const socialLinks = [...(contentLtr.socialLinks || [])];
                            socialLinks[index] = { ...socialLinks[index], name: e.target.value };
                            setContentLtr({ ...contentLtr, socialLinks });
                          }}
                          placeholder="LinkedIn"
                        />
                      </div>
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={rtlLink.name || ''}
                          onChange={(e) => {
                            const socialLinks = [...(contentRtl.socialLinks || [])];
                            while (socialLinks.length <= index) {
                              socialLinks.push({
                                name: '',
                                url: link.url || '',
                                icon: link.icon || 'linkedin',
                                order: socialLinks.length,
                                isActive: true,
                              });
                            }
                            socialLinks[index] = { ...socialLinks[index], name: e.target.value };
                            setContentRtl({ ...contentRtl, socialLinks });
                          }}
                          placeholder="لينكد إن"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="text"
                        value={link.url || ''}
                        onChange={(e) => updateSocialLinkShared(index, 'url', e.target.value)}
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Platform / Icon</label>
                      <select
                        value={link.icon || 'linkedin'}
                        onChange={(e) => updateSocialLinkShared(index, 'icon', e.target.value)}
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="x">X (Twitter)</option>
                      </select>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={link.isActive !== false}
                        onChange={(e) => updateSocialLinkShared(index, 'isActive', e.target.checked)}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                );
              })
            )}

            <div className="form-actions">
              <button
                className="button button-primary"
                onClick={() => handleSaveSection('social')}
                disabled={saving === 'social'}
              >
                {saving === 'social' ? 'Saving...' : 'Save Social Links'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSection === 'newsletter' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Newsletter Section</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
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
                <label>Title</label>
                <input
                  type="text"
                  value={contentLtr.newsletter.title}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      newsletter: { ...contentLtr.newsletter, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.newsletter.title}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      newsletter: { ...contentRtl.newsletter, title: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={contentLtr.newsletter.description || ''}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      newsletter: { ...contentLtr.newsletter, description: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  dir="rtl"
                  value={contentRtl.newsletter.description || ''}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      newsletter: { ...contentRtl.newsletter, description: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Placeholder</label>
                <input
                  type="text"
                  value={contentLtr.newsletter.placeholder}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      newsletter: { ...contentLtr.newsletter, placeholder: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Placeholder</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.newsletter.placeholder}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      newsletter: { ...contentRtl.newsletter, placeholder: e.target.value },
                    })
                  }
                />
              </div>
            </div>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('newsletter')}
                  disabled={saving === 'newsletter'}
                >
                  {saving === 'newsletter' ? 'Saving...' : 'Save Newsletter'}
                </button>
              </div>
            </div>
        </div>
      )}

      {selectedSection === 'bottom' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Footer Bottom</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
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
                <label>Copyright Text</label>
                <input
                  type="text"
                  value={contentLtr.footerBottom.copyright}
                  onChange={(e) =>
                    setContentLtr({
                      ...contentLtr,
                      footerBottom: { ...contentLtr.footerBottom, copyright: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Copyright Text</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.footerBottom.copyright}
                  onChange={(e) =>
                    setContentRtl({
                      ...contentRtl,
                      footerBottom: { ...contentRtl.footerBottom, copyright: e.target.value },
                    })
                  }
                />
              </div>
            </div>
              <div className="form-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleSaveSection('bottom')}
                  disabled={saving === 'bottom'}
                >
                  {saving === 'bottom' ? 'Saving...' : 'Save Footer Bottom'}
                </button>
              </div>
            </div>
        </div>
      )}

      {selectedSection === 'quickLinks' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Quick Links</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
              Close
            </button>
          </div>
          <div className="admin-cms-form">
            <div className="form-actions" style={{ marginBottom: 16 }}>
              <button type="button" className="button button-secondary" onClick={addQuickLinksColumn}>
                Add Column
              </button>
            </div>
            {contentLtr.quickLinks.map((column, columnIndex) => (
              <div key={column._id || columnIndex} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">Arabic</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Column Title</label>
                    <input
                      type="text"
                      value={contentLtr.quickLinks[columnIndex]?.title || ''}
                      onChange={(e) => {
                        const quickLinks = [...contentLtr.quickLinks];
                        quickLinks[columnIndex] = { ...quickLinks[columnIndex], title: e.target.value };
                        setContentLtr({ ...contentLtr, quickLinks });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Column Title</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentRtl.quickLinks[columnIndex]?.title || ''}
                      onChange={(e) => {
                        const quickLinks = [...contentRtl.quickLinks];
                        quickLinks[columnIndex] = { ...quickLinks[columnIndex], title: e.target.value };
                        setContentRtl({ ...contentRtl, quickLinks });
                      }}
                    />
                  </div>
                </div>
                <div className="form-actions" style={{ marginBottom: 12 }}>
                  <button type="button" className="button button-secondary" onClick={() => addQuickLinkItem(columnIndex)}>
                    Add Link
                  </button>
                  <button type="button" className="button button-danger" onClick={() => removeQuickLinksColumn(columnIndex)}>
                    Remove Column
                  </button>
                </div>
                {column.links.map((link, linkIndex) => (
                  <div key={link._id || linkIndex} style={{ border: '1px dashed #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <div className="form-row-bilingual-header">
                      <div className="form-label-header">English</div>
                      <div className="form-label-header">Arabic</div>
                    </div>
                    <div className="form-row-bilingual">
                      <div className="form-group">
                        <label>Link Title</label>
                        <input
                          type="text"
                          value={contentLtr.quickLinks[columnIndex]?.links[linkIndex]?.title || ''}
                          onChange={(e) => {
                            const quickLinks = [...contentLtr.quickLinks];
                            const links = [...(quickLinks[columnIndex]?.links || [])];
                            links[linkIndex] = { ...links[linkIndex], title: e.target.value };
                            quickLinks[columnIndex] = { ...quickLinks[columnIndex], links };
                            setContentLtr({ ...contentLtr, quickLinks });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Link Title</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={contentRtl.quickLinks[columnIndex]?.links[linkIndex]?.title || ''}
                          onChange={(e) => {
                            const quickLinks = [...contentRtl.quickLinks];
                            const links = [...(quickLinks[columnIndex]?.links || [])];
                            links[linkIndex] = { ...links[linkIndex], title: e.target.value };
                            quickLinks[columnIndex] = { ...quickLinks[columnIndex], links };
                            setContentRtl({ ...contentRtl, quickLinks });
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Path (shared for both languages)</label>
                      <input
                        type="text"
                        value={contentLtr.quickLinks[columnIndex]?.links[linkIndex]?.href || ''}
                        onChange={(e) => {
                          const href = e.target.value;
                          updateBothContents((ltr, rtl) => {
                            const ltrQuick = [...ltr.quickLinks];
                            const rtlQuick = [...rtl.quickLinks];
                            const ltrLinks = [...(ltrQuick[columnIndex]?.links || [])];
                            const rtlLinks = [...(rtlQuick[columnIndex]?.links || [])];
                            ltrLinks[linkIndex] = { ...ltrLinks[linkIndex], href };
                            rtlLinks[linkIndex] = { ...rtlLinks[linkIndex], href };
                            ltrQuick[columnIndex] = { ...ltrQuick[columnIndex], links: ltrLinks };
                            rtlQuick[columnIndex] = { ...rtlQuick[columnIndex], links: rtlLinks };
                            return {
                              ltr: { ...ltr, quickLinks: ltrQuick },
                              rtl: { ...rtl, quickLinks: rtlQuick },
                            };
                          });
                        }}
                      />
                    </div>
                    <button type="button" className="admin-btn admin-btn-delete" onClick={() => removeQuickLinkItem(columnIndex, linkIndex)}>
                      Remove Link
                    </button>
                  </div>
                ))}
              </div>
            ))}
            <div className="form-actions">
              <button
                className="button button-primary"
                onClick={() => handleSaveSection('quick links')}
                disabled={saving === 'quick links'}
              >
                {saving === 'quick links' ? 'Saving...' : 'Save Quick Links'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSection === 'serviceAssistance' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Service & Assistance</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
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
                <label>Section Title</label>
                <input
                  type="text"
                  value={contentLtr.serviceAssistance.title}
                  onChange={(e) => setContentLtr({ ...contentLtr, serviceAssistance: { ...contentLtr.serviceAssistance, title: e.target.value } })}
                />
              </div>
              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.serviceAssistance.title}
                  onChange={(e) => setContentRtl({ ...contentRtl, serviceAssistance: { ...contentRtl.serviceAssistance, title: e.target.value } })}
                />
              </div>
            </div>
            <div className="form-actions" style={{ marginBottom: 12 }}>
              <button type="button" className="button button-secondary" onClick={() => addFooterItem('serviceAssistance')}>
                Add Item
              </button>
            </div>
            {contentLtr.serviceAssistance.items.map((item, itemIndex) => (
              <div key={item._id || itemIndex} style={{ border: '1px dashed #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">Arabic</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Item Text</label>
                    <input
                      type="text"
                      value={contentLtr.serviceAssistance.items[itemIndex]?.label || ''}
                      onChange={(e) => {
                        const items = [...contentLtr.serviceAssistance.items];
                        items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                        setContentLtr({ ...contentLtr, serviceAssistance: { ...contentLtr.serviceAssistance, items } });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Item Text</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentRtl.serviceAssistance.items[itemIndex]?.label || ''}
                      onChange={(e) => {
                        const items = [...contentRtl.serviceAssistance.items];
                        items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                        setContentRtl({ ...contentRtl, serviceAssistance: { ...contentRtl.serviceAssistance, items } });
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Value (shared for both languages)</label>
                  <input
                    type="text"
                    value={contentLtr.serviceAssistance.items[itemIndex]?.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateBothContents((ltr, rtl) => {
                        const ltrItems = [...ltr.serviceAssistance.items];
                        const rtlItems = [...rtl.serviceAssistance.items];
                        ltrItems[itemIndex] = { ...ltrItems[itemIndex], value };
                        rtlItems[itemIndex] = { ...rtlItems[itemIndex], value };
                        return {
                          ltr: { ...ltr, serviceAssistance: { ...ltr.serviceAssistance, items: ltrItems } },
                          rtl: { ...rtl, serviceAssistance: { ...rtl.serviceAssistance, items: rtlItems } },
                        };
                      });
                    }}
                  />
                </div>
                <button type="button" className="admin-btn admin-btn-delete" onClick={() => removeFooterItem('serviceAssistance', itemIndex)}>
                  Remove Item
                </button>
              </div>
            ))}
            <div className="form-actions">
              <button
                className="button button-primary"
                onClick={() => handleSaveSection('service & assistance')}
                disabled={saving === 'service & assistance'}
              >
                {saving === 'service & assistance' ? 'Saving...' : 'Save Service & Assistance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSection === 'contact' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Contact Us</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
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
                <label>Section Title</label>
                <input
                  type="text"
                  value={contentLtr.contactSection.title}
                  onChange={(e) => setContentLtr({ ...contentLtr, contactSection: { ...contentLtr.contactSection, title: e.target.value } })}
                />
              </div>
              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.contactSection.title}
                  onChange={(e) => setContentRtl({ ...contentRtl, contactSection: { ...contentRtl.contactSection, title: e.target.value } })}
                />
              </div>
            </div>
            <div className="form-actions" style={{ marginBottom: 12 }}>
              <button type="button" className="button button-secondary" onClick={() => addFooterItem('contactSection')}>
                Add Item
              </button>
            </div>
            {contentLtr.contactSection.items.map((item, itemIndex) => (
              <div key={item._id || itemIndex} style={{ border: '1px dashed #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <div className="form-row-bilingual-header">
                  <div className="form-label-header">English</div>
                  <div className="form-label-header">Arabic</div>
                </div>
                <div className="form-row-bilingual">
                  <div className="form-group">
                    <label>Item Text</label>
                    <input
                      type="text"
                      value={contentLtr.contactSection.items[itemIndex]?.label || ''}
                      onChange={(e) => {
                        const items = [...contentLtr.contactSection.items];
                        items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                        setContentLtr({ ...contentLtr, contactSection: { ...contentLtr.contactSection, items } });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Item Text</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentRtl.contactSection.items[itemIndex]?.label || ''}
                      onChange={(e) => {
                        const items = [...contentRtl.contactSection.items];
                        items[itemIndex] = { ...items[itemIndex], label: e.target.value };
                        setContentRtl({ ...contentRtl, contactSection: { ...contentRtl.contactSection, items } });
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Value (shared for both languages)</label>
                  <input
                    type="text"
                    value={contentLtr.contactSection.items[itemIndex]?.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateBothContents((ltr, rtl) => {
                        const ltrItems = [...ltr.contactSection.items];
                        const rtlItems = [...rtl.contactSection.items];
                        ltrItems[itemIndex] = { ...ltrItems[itemIndex], value };
                        rtlItems[itemIndex] = { ...rtlItems[itemIndex], value };
                        return {
                          ltr: { ...ltr, contactSection: { ...ltr.contactSection, items: ltrItems } },
                          rtl: { ...rtl, contactSection: { ...rtl.contactSection, items: rtlItems } },
                        };
                      });
                    }}
                  />
                </div>
                <button type="button" className="admin-btn admin-btn-delete" onClick={() => removeFooterItem('contactSection', itemIndex)}>
                  Remove Item
                </button>
              </div>
            ))}
            <div className="form-actions">
              <button
                className="button button-primary"
                onClick={() => handleSaveSection('contact')}
                disabled={saving === 'contact'}
              >
                {saving === 'contact' ? 'Saving...' : 'Save Contact Us'}
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
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {FOOTER_SECTIONS.map((section) => {
              const isEditing = selectedSection === section.id;
              return (
                <tr key={section.id} className={isEditing ? 'admin-table-row-active' : ''}>
                  <td><strong>{section.label}</strong></td>
                  <td>{section.description}</td>
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
