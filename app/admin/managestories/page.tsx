'use client';

import { useState, useEffect, useRef } from 'react';
import { CustomerStory } from '@/types/customer-stories';
import ImageUpload from '@/components/admin/ui/ImageUpload';

export default function StoriesManagePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [storiesLtr, setStoriesLtr] = useState<CustomerStory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<{
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    imagePath: string;
    link: string;
    order: number;
    isActive: boolean;
  }>({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    imagePath: '',
    link: '#',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      // Only load LTR initially for faster page load
      const ltrRes = await fetch('/api/customer-stories?language=ltr');
      const ltrResult = await ltrRes.json();
      if (ltrResult.success && ltrResult.data) {
        setStoriesLtr(ltrResult.data.stories || []);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      showMessage('error', 'Failed to load stories');
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
    if (!formData.title.trim()) {
      showMessage('error', 'Title (English) is required');
      return;
    }

    setSaving(true);
    try {
      const isNew = editingIndex === null;
      const index = isNew ? storiesLtr.length : editingIndex!;

      const story: CustomerStory = {
        title: formData.title,
        titleAr: formData.titleAr || formData.title,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        imagePath: formData.imagePath,
        link: formData.link,
        order: formData.order,
        isActive: formData.isActive,
      };

      const response = await fetch(isNew ? '/api/customer-stories/add' : '/api/customer-stories/update', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'ltr',
          storyIndex: index,
          story,
        }),
      });
      const result = await response.json();

      if (result.success) {
        showMessage('success', isNew ? 'Story added successfully!' : 'Story updated successfully!');
        await loadStories();
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
    const storyLtr = storiesLtr[index];
    setEditingIndex(index);
    setFormData({
      title: storyLtr.title || '',
      titleAr: storyLtr.titleAr || storyLtr.title || '',
      description: storyLtr.description || '',
      descriptionAr: storyLtr.descriptionAr || storyLtr.description || '',
      imagePath: storyLtr.imagePath || '',
      link: storyLtr.link || '#',
      order: storyLtr.order || 0,
      isActive: storyLtr.isActive !== undefined ? storyLtr.isActive : true,
    });
    setShowForm(true);
    
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const res = await fetch(`/api/customer-stories/delete?language=ltr&index=${index}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showMessage('success', 'Story deleted successfully!');
        await loadStories();
      } else {
        showMessage('error', result.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showMessage('error', 'Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      imagePath: '',
      link: '#',
      order: 0,
      isActive: true,
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  const stories = storiesLtr; // Use LTR for display

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Customer Stories Management</h1>
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
            + Add New Story
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
            <h3 style={{ color: '#ffffff', fontWeight: '600' }}>{editingIndex !== null ? 'Edit Story' : 'Add New Story'}</h3>
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
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        dir="rtl"
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <ImageUpload
                      value={formData.imagePath}
                      onChange={(value) => setFormData({ ...formData, imagePath: value })}
                      folder="stories"
                      helperText="Recommended: 946 × 1260 px (~3:4 portrait). Center subject; edges may crop."
                    />
                  </div>
                  <div className="form-group">
                    <label>Link</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Update Story' : 'Add Story'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          {stories.length} stor{stories.length !== 1 ? 'ies' : 'y'} listed
        </p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.length === 0 ? (
                <tr>
                <td colSpan={5} className="admin-table-empty">
                  No stories added yet. Click &ldquo;Add New Story&rdquo; to get started.
                  </td>
                </tr>
              ) : (
              stories.map((story, index) => {
                const isEditing = editingIndex === index;
                return (
                  <tr key={index} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td>
                      <div className="admin-section-thumb">
                      {story.imagePath ? (
                        <img
                          src={story.imagePath}
                          alt={story.title || 'Story'}
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
                    <td><strong>{story.title || 'Untitled Story'}</strong></td>
                    <td>
                      {story.description ? (
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                          {story.description}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${story.isActive !== false ? 'published' : 'draft'}`}>
                        {story.isActive !== false ? 'Active' : 'Inactive'}
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
