'use client';

import { useState, useEffect, useRef } from 'react';
import { commitPendingUploads, discardPendingUploads } from '@/lib/pending-uploads';
import { NewsPost } from '@/types/news-updates';
import { newsMainImageSrc } from '@/lib/news-post-images';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import RichTextEditor from '@/components/admin/ui/RichTextEditor';

export default function NewsManagePage() {
  const monthToNumber: Record<string, number> = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  const parseDateValueToParts = (dateValue: string) => {
    if (!dateValue) return null;
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return null;
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = parsed
      .toLocaleString('en-US', { month: 'short' })
      .toUpperCase();
    return { day, month };
  };

  const partsToDateValue = (date?: { day: string; month: string }) => {
    if (!date?.day || !date?.month) return '';
    const monthIdx = monthToNumber[(date.month || '').toUpperCase()];
    const dayNum = Number(date.day);
    if (monthIdx === undefined || Number.isNaN(dayNum)) return '';
    const currentYear = new Date().getFullYear();
    const value = new Date(currentYear, monthIdx, dayNum);
    if (Number.isNaN(value.getTime())) return '';
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
      value.getDate()
    ).padStart(2, '0')}`;
  };

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [postsLtr, setPostsLtr] = useState<NewsPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<{
    title: string;
    titleAr: string;
    category: string;
    categoryAr: string;
    shortDescription: string;
    shortDescriptionAr: string;
    longDescription: string;
    longDescriptionAr: string;
    imagePath: string;
    detailImagePath: string;
    imgWidth: number;
    imgHeight: number;
    dateValue: string;
    isFeatured: boolean;
  }>({
    title: '',
    titleAr: '',
    category: '',
    categoryAr: '',
    shortDescription: '',
    shortDescriptionAr: '',
    longDescription: '',
    longDescriptionAr: '',
    imagePath: '',
    detailImagePath: '',
    imgWidth: 410,
    imgHeight: 546,
    dateValue: '',
    isFeatured: false,
  });
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // Only load LTR initially for faster page load
      const ltrRes = await fetch('/api/news-updates?language=ltr');
      const ltrResult = await ltrRes.json();
      if (ltrResult.success && ltrResult.data) {
        setPostsLtr(ltrResult.data.posts || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      showMessage('error', 'Failed to load posts');
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
      const dateParts = parseDateValueToParts(formData.dateValue);
      if (!dateParts) {
        showMessage('error', 'Valid date is required');
        setSaving(false);
        return;
      }

    try {
      const isNew = editingIndex === null;
      const index = isNew ? postsLtr.length : editingIndex!;

      const post: NewsPost = {
        title: formData.title,
        titleAr: formData.titleAr || formData.title,
        category: formData.category,
        categoryAr: formData.categoryAr || formData.category,
        shortDescription: formData.shortDescription,
        shortDescriptionAr: formData.shortDescriptionAr || formData.shortDescription,
        longDescription: formData.longDescription,
        longDescriptionAr: formData.longDescriptionAr || formData.longDescription,
        imagePath: formData.imagePath,
        detailImagePath: formData.detailImagePath,
        dateIso: formData.dateValue,
        imgWidth: formData.imgWidth,
        imgHeight: formData.imgHeight,
        date: dateParts,
        link: '#',
        isActive: true,
        isFeatured: formData.isFeatured,
      };

      const res = await fetch(isNew ? '/api/news-updates/add' : '/api/news-updates/update', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'ltr',
          postIndex: index,
          post,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showMessage('success', isNew ? 'Post added successfully!' : 'Post updated successfully!');
        await loadPosts();
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
    const postLtr = postsLtr[index];
    setEditingIndex(index);
    setFormData({
      title: postLtr.title || '',
      titleAr: postLtr.titleAr || postLtr.title || '',
      category: postLtr.category || '',
      categoryAr: postLtr.categoryAr || postLtr.category || '',
      shortDescription: postLtr.shortDescription || '',
      shortDescriptionAr: postLtr.shortDescriptionAr || postLtr.shortDescription || '',
      longDescription: postLtr.longDescription || '',
      longDescriptionAr: postLtr.longDescriptionAr || postLtr.longDescription || '',
      imagePath: postLtr.imagePath || '',
      detailImagePath: postLtr.detailImagePath || '',
      dateValue: postLtr.dateIso || partsToDateValue(postLtr.date),
      imgWidth: postLtr.imgWidth || 410,
      imgHeight: postLtr.imgHeight || 546,
      isFeatured: postLtr.isFeatured === true,
    });
    setShowForm(true);
    
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/news-updates/delete?language=ltr&index=${index}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showMessage('success', 'Post deleted successfully!');
        await loadPosts();
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
      title: '',
      titleAr: '',
      category: '',
      categoryAr: '',
      shortDescription: '',
      shortDescriptionAr: '',
      longDescription: '',
      longDescriptionAr: '',
      imagePath: '',
      detailImagePath: '',
      imgWidth: 410,
      imgHeight: 546,
      dateValue: '',
      isFeatured: false,
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  const posts = postsLtr; // Use LTR for display

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>News & Updates Management</h1>
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
            + Add New Post
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
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <div className="admin-cms-section-header" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
            <h3 style={{ color: '#1f2937', fontWeight: '600', margin: 0 }}>{editingIndex !== null ? 'Edit Post' : 'Add New Post'}</h3>
            <button
              onClick={resetForm}
              className="admin-btn admin-btn-edit"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
              }}
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit} className="admin-cms-form">
            {/* Title Row */}
            <div>
              <div className="form-row-bilingual-header">
                <div className="form-label-header">English</div>
                <div className="form-label-header">العربية</div>
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
            </div>

            {/* Category Row */}
            <div className="form-row-bilingual">
                  <div className="form-group">
                  <label>Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                  <label>Category</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.categoryAr}
                      onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })}
                    />
                  </div>
              </div>

            <div>
              <div className="form-row-bilingual-header">
                <div className="form-label-header">English</div>
                <div className="form-label-header">العربية</div>
              </div>
              <div className="form-row-bilingual">
                <div className="form-group">
                  <label>Short Description</label>
                  <textarea
                    rows={3}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Short Description</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={formData.shortDescriptionAr}
                    onChange={(e) => setFormData({ ...formData, shortDescriptionAr: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-row-bilingual-header">
              <div className="form-label-header">English</div>
              <div className="form-label-header">العربية</div>
            </div>
            <div className="form-row-bilingual">
              <RichTextEditor
                label="Long Description"
                value={formData.longDescription}
                onChange={(value) => setFormData({ ...formData, longDescription: value })}
                placeholder="Write full news content..."
              />
              <RichTextEditor
                label="Long Description"
                value={formData.longDescriptionAr}
                onChange={(value) => setFormData({ ...formData, longDescriptionAr: value })}
                placeholder="اكتب المحتوى التفصيلي..."
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFeatured: e.target.checked,
                      ...(e.target.checked
                        ? {}
                        : {
                            imagePath: '',
                          }),
                    })
                  }
                  style={{ marginRight: '8px' }}
                />
                Add Featured Post
              </label>
            </div>
            {formData.isFeatured && (
              <>
                <div className="form-group">
                  <label>Featured Image</label>
                  <ImageUpload
                    value={formData.imagePath}
                    onChange={(value) => setFormData({ ...formData, imagePath: value })}
                    folder="news"
                    helperText="Recommended: 2580 × 1200 px (~2:1)."
                  />
                </div>
              </>
            )}
            
                  <div className="form-group">
                    <label>Main Image</label>
                    <ImageUpload
                      value={formData.detailImagePath}
                      onChange={(value) => setFormData({ ...formData, detailImagePath: value })}
                      folder="news"
                      helperText="Recommended: 1820 × 1024 px (~16:9)."
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={formData.dateValue}
                      onChange={(e) => setFormData({ ...formData, dateValue: e.target.value })}
                      required
                      style={{ maxWidth: '260px' }}
                    />
                  </div>
            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Update Post' : 'Add Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          {posts.length} post{posts.length !== 1 ? 's' : ''} listed
        </p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
            <tr>
              <th>Main</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Featured</th>
              <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                <td colSpan={6} className="admin-table-empty">
                  No posts added yet. Click &ldquo;Add New Post&rdquo; to get started.
                  </td>
                </tr>
              ) : (
              posts.map((post, index) => {
                const isEditing = editingIndex === index;
                const thumbSrc = newsMainImageSrc(post);
                return (
                  <tr key={index} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td>
                      <div className="admin-section-thumb">
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={post.title || 'Post'}
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
                    <td><strong>{post.title || 'Untitled Post'}</strong></td>
                    <td>{post.category || '-'}</td>
                    <td>{post.date?.day} {post.date?.month}</td>
                    <td>
                      {post.isFeatured ? (
                        <span className="admin-badge published">Featured</span>
                      ) : (
                        <span className="admin-badge draft">-</span>
                      )}
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
