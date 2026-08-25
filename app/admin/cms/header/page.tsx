'use client';

import { useState, useEffect, useRef} from 'react';
import { commitPendingUploads, discardPendingUploads } from '@/lib/pending-uploads';
import { HeaderContent, MenuItem } from '@/types/header';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import DocumentUpload from '@/components/admin/ui/DocumentUpload';

const HEADER_SECTIONS = [
  { id: 'logo', label: 'Logo Settings', description: 'Logo image, link, alt, size (shared)' },
  { id: 'menu', label: 'Navigation Menu', description: 'Menu items + dropdown items (bilingual)' },
  { id: 'button', label: 'Profile Button', description: 'Download / profile CTA on the right side of the header' },
] as const;

type HeaderSectionId = (typeof HEADER_SECTIONS)[number]['id'];

interface MenuItemsManagerProps {
  menuItemsLtr: MenuItem[];
  menuItemsRtl: MenuItem[];
  onUpdate: (ltrItems: MenuItem[], rtlItems: MenuItem[]) => void;
}

function MenuItemsManager({ menuItemsLtr, menuItemsRtl, onUpdate }: MenuItemsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const addMenuItem = () => {
    const maxOrder = Math.max(0, ...menuItemsLtr.map(item => item.order || 0));
    const newItem: MenuItem = {
      title: '',
      href: '#',
      order: maxOrder + 1,
      isActive: true,
      hasDropdown: false,
      dropdownItems: [],
    };
    onUpdate([...menuItemsLtr, newItem], [...menuItemsRtl, { ...newItem }]);
  };

  const removeMenuItem = (index: number) => {
    const newLtr = menuItemsLtr.filter((_, i) => i !== index);
    const newRtl = menuItemsRtl.filter((_, i) => i !== index);
    // Reorder items
    const reorderedLtr = newLtr.map((item, i) => ({ ...item, order: i + 1 }));
    const reorderedRtl = newRtl.map((item, i) => ({ ...item, order: i + 1 }));
    onUpdate(reorderedLtr, reorderedRtl);
  };

  const updateMenuItem = (index: number, field: keyof MenuItem, value: any, lang: 'ltr' | 'rtl') => {
    const sharedFields: Array<keyof MenuItem> = ['href', 'isActive', 'hasDropdown', 'order'];
    const shouldSyncBoth = sharedFields.includes(field);

    const newLtr = [...menuItemsLtr];
    const newRtl = [...menuItemsRtl];

    if (shouldSyncBoth || lang === 'ltr') {
      newLtr[index] = { ...newLtr[index], [field]: value };
    }
    if (shouldSyncBoth || lang === 'rtl') {
      newRtl[index] = { ...newRtl[index], [field]: value };
    }

    onUpdate(newLtr, newRtl);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === menuItemsLtr.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newLtr = [...menuItemsLtr];
    const newRtl = [...menuItemsRtl];

    // Swap items
    [newLtr[index], newLtr[newIndex]] = [newLtr[newIndex], newLtr[index]];
    [newRtl[index], newRtl[newIndex]] = [newRtl[newIndex], newRtl[index]];

    // Update orders
    newLtr.forEach((item, i) => { item.order = i + 1; });
    newRtl.forEach((item, i) => { item.order = i + 1; });

    onUpdate(newLtr, newRtl);
  };

  const addDropdownItem = (parentIndex: number) => {
    const parentLtr = menuItemsLtr[parentIndex];
    const parentRtl = menuItemsRtl[parentIndex];
    const maxOrder = Math.max(0, ...(parentLtr.dropdownItems || []).map(item => item.order || 0));
    
    const newDropdownItem: MenuItem = {
      title: '',
      href: '#',
      order: maxOrder + 1,
      isActive: true,
    };

    const newLtr = [...menuItemsLtr];
    const newRtl = [...menuItemsRtl];
    newLtr[parentIndex] = {
      ...parentLtr,
      hasDropdown: true,
      dropdownItems: [...(parentLtr.dropdownItems || []), newDropdownItem],
    };
    newRtl[parentIndex] = {
      ...parentRtl,
      hasDropdown: true,
      dropdownItems: [...(parentRtl.dropdownItems || []), newDropdownItem],
    };
    onUpdate(newLtr, newRtl);
  };

  const removeDropdownItem = (parentIndex: number, dropdownIndex: number) => {
    const newLtr = [...menuItemsLtr];
    const newRtl = [...menuItemsRtl];
    const parentLtr = newLtr[parentIndex];
    const parentRtl = newRtl[parentIndex];

    const newDropdownLtr = (parentLtr.dropdownItems || []).filter((_, i) => i !== dropdownIndex);
    const newDropdownRtl = (parentRtl.dropdownItems || []).filter((_, i) => i !== dropdownIndex);

    newLtr[parentIndex] = {
      ...parentLtr,
      hasDropdown: newDropdownLtr.length > 0,
      dropdownItems: newDropdownLtr.map((item, i) => ({ ...item, order: i + 1 })),
    };
    newRtl[parentIndex] = {
      ...parentRtl,
      hasDropdown: newDropdownRtl.length > 0,
      dropdownItems: newDropdownRtl.map((item, i) => ({ ...item, order: i + 1 })),
    };
    onUpdate(newLtr, newRtl);
  };

  const updateDropdownItem = (
    parentIndex: number,
    dropdownIndex: number,
    field: keyof MenuItem,
    value: any,
    lang: 'ltr' | 'rtl'
  ) => {
    const sharedFields: Array<keyof MenuItem> = ['href', 'isActive', 'order'];
    const shouldSyncBoth = sharedFields.includes(field);

    const newLtr = [...menuItemsLtr];
    const newRtl = [...menuItemsRtl];

    const updateSide = (items: MenuItem[]) => {
      const parent = items[parentIndex];
      const dropdownItems = [...(parent.dropdownItems || [])];
      dropdownItems[dropdownIndex] = { ...dropdownItems[dropdownIndex], [field]: value };
      items[parentIndex] = { ...parent, dropdownItems };
    };

    if (shouldSyncBoth || lang === 'ltr') {
      updateSide(newLtr);
    }
    if (shouldSyncBoth || lang === 'rtl') {
      updateSide(newRtl);
    }

    onUpdate(newLtr, newRtl);
  };

  return (
    <div className="menu-items-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h4 style={{ margin: 0 }}>Menu Items</h4>
        <button
          type="button"
          className="button button-secondary"
          onClick={addMenuItem}
          style={{ fontSize: '14px', padding: '8px 16px' }}
        >
          + Add Menu Item
        </button>
      </div>

      {menuItemsLtr.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', background: '#f9fafb', borderRadius: '6px' }}>
          No menu items yet. Click "Add Menu Item" to get started.
        </div>
      ) : (
        <div className="menu-items-list">
          {menuItemsLtr.map((itemLtr, index) => {
            const itemRtl = menuItemsRtl[index] || itemLtr;
            const isExpanded = expandedItems.has(index);

            return (
              <div key={index} className="menu-item-card" style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '16px',
                background: '#fff',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f9fafb',
                  borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
                  cursor: 'pointer',
                }} onClick={() => toggleExpand(index)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <span style={{ color: '#6b7280', fontSize: '14px', minWidth: '30px' }}>#{index + 1}</span>
                    <span style={{ fontWeight: 500 }}>
                      {itemLtr.title || '(Untitled)'} {itemLtr.hasDropdown && `(${(itemLtr.dropdownItems || []).length} sub-items)`}
                    </span>
                    {!itemLtr.isActive && (
                      <span style={{ fontSize: '12px', color: '#ef4444', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveItem(index, 'up');
                      }}
                      disabled={index === 0}
                      style={{
                        padding: '4px 8px',
                        background: '#fff',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        opacity: index === 0 ? 0.5 : 1,
                      }}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveItem(index, 'down');
                      }}
                      disabled={index === menuItemsLtr.length - 1}
                      style={{
                        padding: '4px 8px',
                        background: '#fff',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: index === menuItemsLtr.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: index === menuItemsLtr.length - 1 ? 0.5 : 1,
                      }}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <span style={{ fontSize: '18px', color: '#6b7280' }}>
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '20px' }}>
                    <div className="form-group">
                      <label>Title (English)</label>
                      <input
                        type="text"
                        value={itemLtr.title}
                        onChange={(e) => updateMenuItem(index, 'title', e.target.value, 'ltr')}
                        placeholder="Menu item title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Title (Arabic)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={itemRtl.title}
                        onChange={(e) => updateMenuItem(index, 'title', e.target.value, 'rtl')}
                        placeholder="عنوان عنصر القائمة"
                      />
                    </div>
                    <div className="form-group">
                      <label>Link (URL)</label>
                      <input
                        type="text"
                        value={itemLtr.href || ''}
                        onChange={(e) => updateMenuItem(index, 'href', e.target.value, 'ltr')}
                        placeholder="/about-us or /services-details-1/solution-id"
                      />
                      <small>Use paths like /about-us, /solutions, /contact-us</small>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={itemLtr.isActive}
                          onChange={(e) => updateMenuItem(index, 'isActive', e.target.checked, 'ltr')}
                        />
                        <span>Active</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={itemLtr.hasDropdown || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const newLtr = [...menuItemsLtr];
                            const newRtl = [...menuItemsRtl];
                            newLtr[index] = {
                              ...newLtr[index],
                              hasDropdown: checked,
                              dropdownItems: checked ? (newLtr[index].dropdownItems || []) : [],
                            };
                            newRtl[index] = {
                              ...newRtl[index],
                              hasDropdown: checked,
                              dropdownItems: checked ? (newRtl[index].dropdownItems || []) : [],
                            };
                            onUpdate(newLtr, newRtl);
                          }}
                        />
                        <span>Has Dropdown</span>
                      </label>
                    </div>

                    {itemLtr.hasDropdown && (
                      <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Dropdown Items</h5>
                          <button
                            type="button"
                            className="button button-secondary"
                            onClick={() => addDropdownItem(index)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            + Add Dropdown Item
                          </button>
                        </div>

                        {(itemLtr.dropdownItems || []).length === 0 ? (
                          <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                            No dropdown items yet.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(itemLtr.dropdownItems || []).map((dropdownItem, dropdownIndex) => {
                              const dropdownRtl = (itemRtl.dropdownItems || [])[dropdownIndex] || dropdownItem;
                              return (
                                <div key={dropdownIndex} style={{
                                  padding: '12px',
                                  background: '#fff',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '6px',
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Item #{dropdownIndex + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeDropdownItem(index, dropdownIndex)}
                                      style={{
                                        padding: '4px 8px',
                                        background: '#fee2e2',
                                        color: '#991b1b',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <div className="form-group" style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '12px' }}>Title (English)</label>
                                    <input
                                      type="text"
                                      value={dropdownItem.title}
                                      onChange={(e) => updateDropdownItem(index, dropdownIndex, 'title', e.target.value, 'ltr')}
                                      style={{ fontSize: '14px', padding: '8px' }}
                                    />
                                  </div>
                                  <div className="form-group" style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '12px' }}>Title (Arabic)</label>
                                    <input
                                      type="text"
                                      dir="rtl"
                                      value={dropdownRtl.title}
                                      onChange={(e) => updateDropdownItem(index, dropdownIndex, 'title', e.target.value, 'rtl')}
                                      style={{ fontSize: '14px', padding: '8px' }}
                                    />
                                  </div>
                                  <div className="form-group" style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '12px' }}>Link (URL)</label>
                                    <input
                                      type="text"
                                      value={dropdownItem.href || ''}
                                      onChange={(e) => updateDropdownItem(index, dropdownIndex, 'href', e.target.value, 'ltr')}
                                      placeholder="/solutions or /services-details-1/solution-id"
                                      style={{ fontSize: '14px', padding: '8px' }}
                                    />
                                  </div>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input
                                      type="checkbox"
                                      checked={dropdownItem.isActive}
                                      onChange={(e) => updateDropdownItem(index, dropdownIndex, 'isActive', e.target.checked, 'ltr')}
                                    />
                                    <span>Active</span>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => removeMenuItem(index)}
                        style={{
                          padding: '8px 16px',
                          background: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        Remove Menu Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HeaderManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<HeaderContent | null>(null);
  const contentLtrRef = useRef(contentLtr);
  contentLtrRef.current = contentLtr;
  const [contentRtl, setContentRtl] = useState<HeaderContent | null>(null);
  const contentRtlRef = useRef(contentRtl);
  contentRtlRef.current = contentRtl;
  const [selectedSection, setSelectedSection] = useState<HeaderSectionId | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Fetch both LTR and RTL content in parallel
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/header?language=ltr'),
        fetch('/api/header?language=rtl'),
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

  const getEmptyContent = (lang: 'ltr' | 'rtl'): HeaderContent => ({
    language: lang,
    isActive: true,
    logo: {
      imagePath: '/image/logo/logo-2.png',
      alt: 'Al Bahar & Partners',
      width: 169,
      height: 40,
      link: '/',
    },
    menuItems: [],
    buttonText: lang === 'rtl' ? 'الملف التعريفي' : 'Company Profile',
    buttonLink: '/files/company-profile.pdf',
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
      if (section === 'logo') {
        const method = contentLtr._id ? 'PUT' : 'POST';
        // Logo is shared, so save using LTR content
        const [ltrRes, rtlRes] = await Promise.all([
          fetch('/api/header', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...contentLtr, language: 'ltr' }),
          }),
          fetch('/api/header', {
            method: contentRtl._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...contentRtl,
              logo: contentLtr.logo,
              language: 'rtl',
            }),
          }),
        ]);
        const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
        if (ltrResult.success && rtlResult.success) {
          showMessage('success', `${section} saved successfully!`);
          await loadContent();
        } else {
          showMessage('error', ltrResult.message || rtlResult.message || 'Failed to save');
        }
      } else {
        // Save both LTR and RTL in parallel
        const [ltrRes, rtlRes] = await Promise.all([
          fetch('/api/header', {
            method: contentLtr._id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...contentLtr, language: 'ltr' }),
          }),
          fetch('/api/header', {
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
        <h1>Header</h1>
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
            <h3>Logo Settings</h3>
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
                helperText="Recommended: 340 × 80 px (~4:1)."
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
            <div className="form-group">
              <label>Logo Alt Text</label>
              <input
                type="text"
                value={contentLtr.logo.alt}
                onChange={(e) => {
                  const alt = e.target.value;
                  setContentLtr({
                    ...contentLtr,
                    logo: { ...contentLtr.logo, alt },
                  });
                  setContentRtl({
                    ...contentRtl,
                    logo: { ...contentRtl.logo, alt },
                  });
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Width</label>
                <input
                  type="number"
                  value={contentLtr.logo.width}
                  onChange={(e) => {
                    const width = Number(e.target.value);
                    setContentLtr({
                      ...contentLtr,
                      logo: { ...contentLtr.logo, width },
                    });
                    setContentRtl({
                      ...contentRtl,
                      logo: { ...contentRtl.logo, width },
                    });
                  }}
                />
              </div>
              <div className="form-group">
                <label>Height</label>
                <input
                  type="number"
                  value={contentLtr.logo.height}
                  onChange={(e) => {
                    const height = Number(e.target.value);
                    setContentLtr({
                      ...contentLtr,
                      logo: { ...contentLtr.logo, height },
                    });
                    setContentRtl({
                      ...contentRtl,
                      logo: { ...contentRtl.logo, height },
                    });
                  }}
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                className="button button-primary"
                onClick={() => handleSaveSection('logo')}
                disabled={saving === 'logo'}
              >
                {saving === 'logo' ? 'Saving...' : 'Save Logo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSection === 'menu' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Navigation Menu</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
              Close
            </button>
          </div>
          <div className="admin-cms-form">
            <MenuItemsManager
              menuItemsLtr={contentLtr.menuItems || []}
              menuItemsRtl={contentRtl.menuItems || []}
              onUpdate={(ltrItems, rtlItems) => {
                setContentLtr({ ...contentLtr, menuItems: ltrItems });
                setContentRtl({ ...contentRtl, menuItems: rtlItems });
              }}
            />
            <div className="form-actions">
              <button
                className="button button-primary"
                onClick={() => handleSaveSection('menu')}
                disabled={saving === 'menu'}
              >
                {saving === 'menu' ? 'Saving...' : 'Save Menu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSection === 'button' && (
        <div className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3>Profile Button</h3>
            <button type="button" className="admin-btn admin-btn-delete" onClick={() => { discardPendingUploads(); setSelectedSection(null); }}>
              Close
            </button>
          </div>
          <div className="admin-cms-form">
            <p style={{ marginBottom: 16, color: '#6b7280', fontSize: 14 }}>
              Upload a company profile PDF. The header button will download this file on click.
            </p>
            <div className="form-row-bilingual-header">
              <div className="form-label-header">English</div>
              <div className="form-label-header">Arabic</div>
            </div>
            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Button Text</label>
                <input
                  type="text"
                  value={contentLtr.buttonText || ''}
                  onChange={(e) => setContentLtr({ ...contentLtr, buttonText: e.target.value })}
                  placeholder="Company Profile"
                />
              </div>
              <div className="form-group">
                <label>Button Text</label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentRtl.buttonText || ''}
                  onChange={(e) => setContentRtl({ ...contentRtl, buttonText: e.target.value })}
                  placeholder="الملف التعريفي"
                />
              </div>
            </div>
            <div className="form-group">
              <DocumentUpload
                label="Profile File (PDF)"
                value={contentLtr.buttonLink || ''}
                onChange={(buttonLink) => {
                  setContentLtr({ ...contentLtr, buttonLink });
                  setContentRtl({ ...contentRtl, buttonLink });
                }}
                folder="files"
                fileName="bpc-profile.pdf"
                displayName="BPC Profile.pdf"
              />
              <small style={{ display: 'block', marginTop: 8 }}>
                Shared for English and Arabic. Leave empty / remove file to hide the button. Click Save after uploading.
              </small>
            </div>
            <div className="form-actions">
              <button
                className="button button-primary"
                onClick={() => handleSaveSection('button')}
                disabled={saving === 'button'}
              >
                {saving === 'button' ? 'Saving...' : 'Save Profile Button'}
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
            {HEADER_SECTIONS.map((section) => {
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
