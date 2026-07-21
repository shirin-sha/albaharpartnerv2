'use client';

import { useEffect, useRef, useState } from 'react';
import type { SupportContent, SupportService } from '@/types/support';

export default function SupportServicesManagePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contentLtr, setContentLtr] = useState<SupportContent | null>(null);
  const [contentRtl, setContentRtl] = useState<SupportContent | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<{
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    iconClass: string;
    iconSvg: string;
    isActive: boolean;
  }>({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    iconClass: 'icon-Briefcase',
    iconSvg: '',
    isActive: true,
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/support?language=ltr'),
        fetch('/api/support?language=rtl'),
      ]);
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);

      if (ltrResult.success && ltrResult.data) setContentLtr(ltrResult.data);
      else setContentLtr(null);

      if (rtlResult.success && rtlResult.data) setContentRtl(rtlResult.data);
      else setContentRtl(null);
    } catch (e) {
      console.error(e);
      showMessage('error', 'Failed to load support content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const servicesLtr = contentLtr?.servicesSection?.services || [];
  const servicesRtl = contentRtl?.servicesSection?.services || [];
  const maxServices = Math.max(servicesLtr.length, servicesRtl.length);

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      iconClass: 'icon-Briefcase',
      iconSvg: '',
      isActive: true,
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const upsertServiceAt = (index: number, ltr: SupportService, rtl: SupportService) => {
    if (!contentLtr || !contentRtl) return;

    const nextLtr = [...(contentLtr.servicesSection.services || [])];
    const nextRtl = [...(contentRtl.servicesSection.services || [])];
    nextLtr[index] = ltr;
    nextRtl[index] = rtl;

    setContentLtr({
      ...contentLtr,
      servicesSection: { ...contentLtr.servicesSection, services: nextLtr },
    });
    setContentRtl({
      ...contentRtl,
      servicesSection: { ...contentRtl.servicesSection, services: nextRtl },
    });
  };

  const saveAll = async (nextLtr: SupportContent, nextRtl: SupportContent) => {
    setSaving(true);
    try {
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/support', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextLtr, language: 'ltr' }),
        }),
        fetch('/api/support', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextRtl, language: 'rtl' }),
        }),
      ]);
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      if (ltrResult.success && rtlResult.success) {
        showMessage('success', 'Support services saved');
        await loadContent();
        resetForm();
      } else {
        showMessage('error', ltrResult.message || rtlResult.message || 'Failed to save');
      }
    } catch (e) {
      console.error(e);
      showMessage('error', 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentLtr || !contentRtl) {
      showMessage('error', 'Support content not found. Seed / create Support content first.');
      return;
    }
    if (!formData.title.trim()) {
      showMessage('error', 'Title (English) is required');
      return;
    }
    if (!formData.description.trim()) {
      showMessage('error', 'Description (English) is required');
      return;
    }

    const isNew = editingIndex === null;
    const index = isNew ? maxServices : editingIndex!;

    const shared = {
      iconClass: formData.iconClass || '',
      iconSvg: formData.iconSvg || '',
      isActive: formData.isActive,
    };

    const ltr: SupportService = {
      title: formData.title,
      description: formData.description,
      ...shared,
    };

    const rtl: SupportService = {
      title: formData.titleAr || formData.title,
      description: formData.descriptionAr || formData.description,
      ...shared,
    };

    const nextLtr: SupportContent = {
      ...contentLtr,
      servicesSection: {
        ...contentLtr.servicesSection,
        services: [...(contentLtr.servicesSection.services || [])],
      },
    };
    const nextRtl: SupportContent = {
      ...contentRtl,
      servicesSection: {
        ...contentRtl.servicesSection,
        services: [...(contentRtl.servicesSection.services || [])],
      },
    };

    nextLtr.servicesSection.services[index] = ltr;
    nextRtl.servicesSection.services[index] = rtl;

    await saveAll(nextLtr, nextRtl);
  };

  const handleEdit = (index: number) => {
    const ltr = servicesLtr[index];
    const rtl = servicesRtl[index];

    setEditingIndex(index);
    setFormData({
      title: ltr?.title || '',
      titleAr: rtl?.title || ltr?.title || '',
      description: ltr?.description || '',
      descriptionAr: rtl?.description || ltr?.description || '',
      iconClass: ltr?.iconClass || 'icon-Briefcase',
      iconSvg: ltr?.iconSvg || '',
      isActive: ltr?.isActive ?? true,
    });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleDelete = async (index: number) => {
    if (!contentLtr || !contentRtl) return;
    if (!confirm('Delete this service card?')) return;

    const nextLtr: SupportContent = {
      ...contentLtr,
      servicesSection: {
        ...contentLtr.servicesSection,
        services: [...(contentLtr.servicesSection.services || [])].filter((_, i) => i !== index),
      },
    };
    const nextRtl: SupportContent = {
      ...contentRtl,
      servicesSection: {
        ...contentRtl.servicesSection,
        services: [...(contentRtl.servicesSection.services || [])].filter((_, i) => i !== index),
      },
    };

    await saveAll(nextLtr, nextRtl);
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  if (!contentLtr || !contentRtl) {
    return (
      <div className="admin-cms-container">
        <div className="admin-cms-header">
          <h1>Support Services</h1>
        </div>
        <div className="admin-cms-section-card">
          <div className="admin-cms-section-header">
            <div>
              <h3 style={{ margin: 0 }}>Support content missing</h3>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Please seed / create Support content first.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Support Services</h1>
        {!showForm && (
          <button
            className="button button-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
              setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }}
          >
            + Add New Service
          </button>
        )}
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

      {showForm && (
        <div ref={formRef} className="admin-cms-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <div>
              <h3 style={{ margin: 0 }}>{editingIndex !== null ? 'Edit Service' : 'Add Service'}</h3>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Titles/descriptions are bilingual. Icons are shared.
              </div>
            </div>
            <button type="button" className="button" onClick={resetForm}>
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-cms-form">
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="form-row-bilingual-header">
              <div className="form-label-header">English</div>
              <div className="form-label-header">Arabic</div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Icon class (shared)</label>
              <input
                type="text"
                value={formData.iconClass}
                onChange={(e) => setFormData({ ...formData, iconClass: e.target.value })}
                placeholder="e.g. icon-Briefcase"
              />
            </div>

            <div className="form-group">
              <label>Icon SVG (shared, optional)</label>
              <textarea
                rows={3}
                value={formData.iconSvg}
                onChange={(e) => setFormData({ ...formData, iconSvg: e.target.value })}
                placeholder="<svg ...>...</svg>"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title (English)</th>
              <th>Title (Arabic)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxServices }).map((_, index) => {
              const ltr = servicesLtr[index];
              const rtl = servicesRtl[index];
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ltr?.title || '-'}</td>
                  <td style={{ direction: 'rtl', textAlign: 'right' }}>{rtl?.title || '-'}</td>
                  <td>
                    <span className={`admin-status ${ltr?.isActive ? 'active' : 'inactive'}`}>
                      {ltr?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="admin-btn admin-btn-edit" onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-delete"
                      style={{ marginLeft: 8 }}
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {maxServices === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 20, opacity: 0.7 }}>
                  No services yet. Click “Add New Service”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

