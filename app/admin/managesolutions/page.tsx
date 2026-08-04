'use client';

import { useState, useEffect, useRef } from 'react';
import { commitPendingUploads, discardPendingUploads } from '@/lib/pending-uploads';
import { SolutionItem } from '@/types/solutions';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import RichTextEditor from '@/components/admin/ui/RichTextEditor';

export default function SolutionsManagePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [solutionsLtr, setSolutionsLtr] = useState<SolutionItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<{
    id: string;
    tabTitle: string;
    tabTitleAr: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    detailDescription: string;
    detailDescriptionAr: string;
    benefits: string[];
    benefitsAr: string[];
    imgSrc: string;
    detailImgSrc: string;
    imgWidth: number;
    imgHeight: number;
    detailImgWidth: number;
    detailImgHeight: number;
    isActive: boolean;
  }>({
    id: '',
    tabTitle: '',
    tabTitleAr: '',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    detailDescription: '',
    detailDescriptionAr: '',
    benefits: [],
    benefitsAr: [],
    imgSrc: '',
    detailImgSrc: '',
    imgWidth: 410,
    imgHeight: 546,
    detailImgWidth: 850,
    detailImgHeight: 512,
    isActive: true,
  });
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    setLoading(true);
    try {
      // Only load LTR initially for faster page load
      const ltrRes = await fetch('/api/solutions?language=ltr');
      const ltrResult = await ltrRes.json();
      if (ltrResult.success && ltrResult.data) {
        setSolutionsLtr(ltrResult.data.solutions || []);
      }
    } catch (error) {
      console.error('Error loading solutions:', error);
      showMessage('error', 'Failed to load solutions');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await commitPendingUploads();
    } catch (uploadErr) {
      console.error('Upload error:', uploadErr);
      showMessage('error', uploadErr instanceof Error ? uploadErr.message : 'Failed to upload files');
      setSaving(false);
      return;
    }
    const formData = formDataRef.current;
    if (!formData.title.trim()) {
      showMessage('error', 'Title (English) is required');
      setSaving(false);
      return;
    }
    if (!formData.id.trim()) {
      showMessage('error', 'ID is required');
      setSaving(false);
      return;
    }

    try {
      const isNew = editingIndex === null;
      const index = isNew ? solutionsLtr.length : editingIndex!;

      const solution: SolutionItem = {
        id: formData.id,
        tabTitle: formData.tabTitle,
        tabTitleAr: formData.tabTitleAr || formData.tabTitle,
        title: formData.title,
        titleAr: formData.titleAr || formData.title,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        detailDescription: formData.detailDescription,
        detailDescriptionAr: formData.detailDescriptionAr || formData.detailDescription,
        benefits: formData.benefits,
        benefitsAr: formData.benefitsAr.length > 0 ? formData.benefitsAr : formData.benefits,
        imgSrc: formData.imgSrc,
        detailImgSrc: formData.detailImgSrc,
        imgWidth: formData.imgWidth,
        imgHeight: formData.imgHeight,
        detailImgWidth: formData.detailImgWidth,
        detailImgHeight: formData.detailImgHeight,
        isActive: formData.isActive,
      };

      const res = await fetch(isNew ? '/api/solutions/add' : '/api/solutions/update', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'ltr',
          solutionIndex: index,
          solution,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showMessage('success', isNew ? 'Solution added successfully!' : 'Solution updated successfully!');
        await loadSolutions();
        resetForm();
      } else {
        showMessage('error', result.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      showMessage('error', 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (index: number) => {
    const solutionLtr = solutionsLtr[index];
    setEditingIndex(index);
    setFormData({
      id: solutionLtr.id || '',
      tabTitle: solutionLtr.tabTitle || '',
      tabTitleAr: solutionLtr.tabTitleAr || solutionLtr.tabTitle || '',
      title: solutionLtr.title || '',
      titleAr: solutionLtr.titleAr || solutionLtr.title || '',
      description: solutionLtr.description || '',
      descriptionAr: solutionLtr.descriptionAr || solutionLtr.description || '',
      detailDescription: (solutionLtr as any).detailDescription || '',
      detailDescriptionAr: solutionLtr.detailDescriptionAr || (solutionLtr as any).detailDescription || '',
      benefits: solutionLtr.benefits || [],
      benefitsAr: solutionLtr.benefitsAr || solutionLtr.benefits || [],
      imgSrc: solutionLtr.imgSrc || '',
      detailImgSrc: solutionLtr.detailImgSrc || '',
      imgWidth: solutionLtr.imgWidth || 410,
      imgHeight: solutionLtr.imgHeight || 546,
      detailImgWidth: solutionLtr.detailImgWidth || 850,
      detailImgHeight: solutionLtr.detailImgHeight || 512,
      isActive: solutionLtr.isActive !== undefined ? solutionLtr.isActive : true,
    });
    setShowForm(true);
    
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this solution?')) return;

    try {
      const res = await fetch(`/api/solutions/delete?language=ltr&index=${index}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showMessage('success', 'Solution deleted successfully!');
        await loadSolutions();
      } else {
        showMessage('error', result.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showMessage('error', 'Failed to delete');
    }
  };

  const resetForm = () => {
    discardPendingUploads();
    setFormData({
      id: '',
      tabTitle: '',
      tabTitleAr: '',
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      detailDescription: '',
      detailDescriptionAr: '',
      benefits: [],
      benefitsAr: [],
      imgSrc: '',
      detailImgSrc: '',
      imgWidth: 410,
      imgHeight: 546,
      detailImgWidth: 850,
      detailImgHeight: 512,
      isActive: true,
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  const solutions = solutionsLtr; // Use LTR for display

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Solutions Management</h1>
        {!showForm && (
          <button
            className="button button-primary"
            onClick={async () => {
              resetForm();
              setShowForm(true);
              // Scroll to form after state update
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
          >
            + Add New Solution
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
        <div 
          ref={formRef}
          className="admin-cms-section-card" 
          style={{ 
            marginBottom: '24px',
            border: '2px solid #000000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <div className="admin-cms-section-header" style={{ background: '#000000', color: '#ffffff' }}>
            <h3 style={{ color: '#ffffff', fontWeight: '600' }}>{editingIndex !== null ? 'Edit Solution' : 'Add New Solution'}</h3>
            <button
              onClick={resetForm}
              style={{
                padding: '6px 12px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit} className="admin-cms-form">
            <div className="hero-slides-container">
              <div className="hero-slide-card">
                <div className="hero-slide-fields">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        style={{ marginRight: '8px' }}
                      />
                      Active
                    </label>
                  </div>
                  <div className="form-group">
                    <label>ID *</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                      placeholder="solution-1"
                    />
                  </div>
                  <div className="form-row-bilingual-header">
                    <div className="form-label-header">English</div>
                    <div className="form-label-header">Arabic</div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Tab Title *</label>
                      <input
                        type="text"
                        value={formData.tabTitle}
                        onChange={(e) => setFormData({ ...formData, tabTitle: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Tab Title</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.tabTitleAr}
                        onChange={(e) => setFormData({ ...formData, tabTitleAr: e.target.value })}
                      />
                    </div>
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
                      <label>Short Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label>Short Description</label>
                      <textarea
                        dir="rtl"
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <RichTextEditor
                        label="Detail Description"
                        value={formData.detailDescription}
                        onChange={(value) => setFormData({ ...formData, detailDescription: value })}
                        placeholder="This will appear in the details content on the service details page."
                      />
                    </div>
                    <div className="form-group">
                      <RichTextEditor
                        label="Detail Description"
                        value={formData.detailDescriptionAr}
                        onChange={(value) => setFormData({ ...formData, detailDescriptionAr: value })}
                        placeholder="هذا الوصف سيظهر في محتوى تفاصيل الخدمة."
                        className="rtl-editor"
                      />
                    </div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Benefits - one per line</label>
                      <textarea
                        value={formData.benefits.join('\n')}
                        onChange={(e) => {
                          const benefits = e.target.value.split('\n').filter(f => f.trim());
                          setFormData({ ...formData, benefits });
                        }}
                        rows={6}
                        placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                      />
                      <small>Enter each benefit on a new line</small>
                    </div>
                    <div className="form-group">
                      <label>Benefits - one per line</label>
                      <textarea
                        dir="rtl"
                        value={formData.benefitsAr.join('\n')}
                        onChange={(e) => {
                          const benefitsAr = e.target.value.split('\n').filter(f => f.trim());
                          setFormData({ ...formData, benefitsAr });
                        }}
                        rows={6}
                        placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                      />
                      <small>Enter each benefit on a new line</small>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <ImageUpload
                      value={formData.imgSrc}
                      onChange={(value) => setFormData({ ...formData, imgSrc: value })}
                      folder="solutions"
                      helperText="Recommended: 1120 × 840 px (4:3)."
                    />
                  </div>
                  <div className="form-group">
                    <label>Detail Page Image</label>
                    <ImageUpload
                      value={formData.detailImgSrc}
                      onChange={(value) => setFormData({ ...formData, detailImgSrc: value })}
                      folder="solutions"
                      helperText="Recommended: 1700 × 1024 px (~5:3)."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Update Solution' : 'Add Solution'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          {solutions.length} solution{solutions.length !== 1 ? 's' : ''} listed
        </p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Tab Title</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {solutions.length === 0 ? (
                <tr>
                <td colSpan={6} className="admin-table-empty">
                  No solutions added yet. Click &ldquo;Add New Solution&rdquo; to get started.
                  </td>
                </tr>
              ) : (
              solutions.map((solution, index) => {
                const isEditing = editingIndex === index;
                return (
                  <tr key={index} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td>
                      <div className="admin-section-thumb">
                      {solution.imgSrc ? (
                        <img
                          src={solution.imgSrc}
                          alt={solution.title || 'Solution'}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                          <span className="admin-section-thumb-placeholder">
                          No Image
                          </span>
                        )}
                        </div>
                    </td>
                    <td><strong>{solution.id || 'N/A'}</strong></td>
                    <td>{solution.tabTitle || 'N/A'}</td>
                    <td><strong>{solution.title || 'Untitled Solution'}</strong></td>
                    <td>
                      <span className={`admin-badge ${solution.isActive !== false ? 'published' : 'draft'}`}>
                        {solution.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          onClick={() => isEditing ? resetForm() : handleEdit(index)}
                          className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        {!isEditing && (
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                            className="admin-btn admin-btn-delete"
                        >
                          Delete
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}
