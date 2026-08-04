'use client';

import { useState, useEffect, useRef } from 'react';
import { Brand } from '@/types/brands';
import ImageUpload from '@/components/admin/ui/ImageUpload';

function moveItem<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function remapEditIndex(editingIndex: number | null, fromIndex: number, toIndex: number): number | null {
  if (editingIndex === null) return null;
  if (editingIndex === fromIndex) return toIndex;
  if (fromIndex < editingIndex && toIndex >= editingIndex) return editingIndex - 1;
  if (fromIndex > editingIndex && toIndex <= editingIndex) return editingIndex + 1;
  return editingIndex;
}

export default function BrandsManagePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [brandsLtr, setBrandsLtr] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<{
    name: string;
    nameAr: string;
    imagePath: string;
    link: string;
    description: string;
    descriptionAr: string;
    products: any[];
    isActive: boolean;
  }>({
    name: '',
    nameAr: '',
    imagePath: '',
    link: '#',
    description: '',
    descriptionAr: '',
    products: [],
    isActive: true,
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      // Only load LTR initially for faster page load
      const ltrRes = await fetch('/api/brands?language=ltr');
      const ltrResult = await ltrRes.json();
      if (ltrResult.success && ltrResult.data) {
        setBrandsLtr(ltrResult.data.brands || []);
      }
    } catch (error) {
      console.error('Error loading brands:', error);
      showMessage('error', 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || reordering) return;

    const previous = brandsLtr;
    const next = moveItem(brandsLtr, fromIndex, toIndex);
    setBrandsLtr(next);
    setEditingIndex((current) => remapEditIndex(current, fromIndex, toIndex));
    setReordering(true);

    try {
      const res = await fetch('/api/brands/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brands: next }),
      });
      const result = await res.json();
      if (!result.success) {
        setBrandsLtr(previous);
        setEditingIndex((current) => remapEditIndex(current, toIndex, fromIndex));
        showMessage('error', result.message || 'Failed to reorder brands');
      }
    } catch (error) {
      console.error('Error reordering brands:', error);
      setBrandsLtr(previous);
      setEditingIndex((current) => remapEditIndex(current, toIndex, fromIndex));
      showMessage('error', 'Failed to reorder brands');
    } finally {
      setReordering(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showMessage('error', 'Brand name (English) is required');
      return;
    }
    if (!formData.imagePath.trim()) {
      showMessage('error', 'Brand image is required');
      return;
    }

    setSaving(true);
    try {
      const isNew = editingIndex === null;
      const index = isNew ? brandsLtr.length : editingIndex!;

      const brand: Brand = {
        name: formData.name,
        nameAr: formData.nameAr || formData.name,
        imagePath: formData.imagePath,
        link: formData.link,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        products: formData.products,
        isActive: formData.isActive,
      };

      const res = await fetch(isNew ? '/api/brands/add' : '/api/brands/update', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'ltr',
          brandIndex: index,
          brand,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showMessage('success', isNew ? 'Brand added successfully!' : 'Brand updated successfully!');
        await loadBrands();
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
    const brandLtr = brandsLtr[index];
    setEditingIndex(index);
    setFormData({
      name: brandLtr.name || '',
      nameAr: brandLtr.nameAr || brandLtr.name || '',
      imagePath: brandLtr.imagePath || '',
      link: brandLtr.link || '#',
      description: brandLtr.description || '',
      descriptionAr: brandLtr.descriptionAr || brandLtr.description || '',
      products: brandLtr.products || [],
      isActive: brandLtr.isActive !== undefined ? brandLtr.isActive : true,
    });
    setShowForm(true);
    
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      const res = await fetch(`/api/brands/delete?language=ltr&index=${index}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showMessage('success', 'Brand deleted successfully!');
        await loadBrands();
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
      name: '',
      nameAr: '',
      imagePath: '',
      link: '#',
      description: '',
      descriptionAr: '',
      products: [],
      isActive: true,
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  const brands = brandsLtr; // Use LTR for display

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Brands Management</h1>
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
            + Add New Brand
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
            <h3 style={{ color: '#ffffff', fontWeight: '600' }}>{editingIndex !== null ? 'Edit Brand' : 'Add New Brand'}</h3>
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
                  <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, fontWeight: '500' }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        style={{ margin: 0, cursor: 'pointer', width: '16px', height: '16px' }}
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
                      <label>Brand Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Brand Name</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.nameAr}
                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Brand Image *</label>
                    <ImageUpload
                      value={formData.imagePath}
                      onChange={(value) => setFormData({ ...formData, imagePath: value })}
                      folder="brand"
                      required
                      helperText="Recommended: 1200 × 675 px (16:9)."
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
                </div>
              </div>
            </div>
            
            {/* Products Section */}
            <div className="form-group" style={{ marginTop: '24px' }}>
              <label style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>Products</label>
              <div className="hero-slides-container">
                {formData.products.map((product, index) => (
                  <div key={index} className="hero-slide-card">
                    <div className="hero-slide-header">
                      <h4>Product {index + 1}</h4>
                      {formData.products.length > 0 && (
                        <button
                          type="button"
                          className="hero-slide-remove"
                          onClick={() => {
                            const newProducts = formData.products.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, products: newProducts });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="hero-slide-fields">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          value={product.name || ''}
                          onChange={(e) => {
                            const newProducts = [...formData.products];
                            newProducts[index] = { ...product, name: e.target.value };
                            setFormData({ ...formData, products: newProducts });
                          }}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Product Image *</label>
                        <ImageUpload
                          value={product.imagePath || ''}
                          onChange={(value) => {
                            const newProducts = [...formData.products];
                            newProducts[index] = { ...product, imagePath: value };
                            setFormData({ ...formData, products: newProducts });
                          }}
                          folder="products"
                          required
                          helperText="Recommended: 1200 × 1200 px (1:1)."
                        />
                      </div>
                      <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                          value={product.description || ''}
                          onChange={(e) => {
                            const newProducts = [...formData.products];
                            newProducts[index] = { ...product, description: e.target.value };
                            setFormData({ ...formData, products: newProducts });
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    products: [...formData.products, { name: '', imagePath: '', description: '' }],
                  });
                }}
                style={{ marginTop: '12px' }}
              >
                + Add Product
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Update Brand' : 'Add Brand'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          {brands.length} brand{brands.length !== 1 ? 's' : ''} listed
          {brands.length > 1 ? ' · Drag rows to reorder' : ''}
        </p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr>
                <td colSpan={5} className="admin-table-empty">
                  No brands added yet. Click &ldquo;Add New Brand&rdquo; to get started.
                  </td>
                </tr>
              ) : (
              brands.map((brand, index) => {
                const isEditing = editingIndex === index;
                const isDragging = dragIndex === index;
                const isDragOver = dragOverIndex === index && dragIndex !== index;
                return (
                  <tr
                    key={`${brand._id || brand.name}-${index}`}
                    className={isEditing ? 'admin-table-row-active' : ''}
                    draggable={!reordering}
                    onDragStart={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest('button, a, input, textarea, label')) {
                        e.preventDefault();
                        return;
                      }
                      setDragIndex(index);
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', String(index));
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (dragOverIndex !== index) setDragOverIndex(index);
                    }}
                    onDragLeave={() => {
                      if (dragOverIndex === index) setDragOverIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from = dragIndex ?? Number(e.dataTransfer.getData('text/plain'));
                      setDragIndex(null);
                      setDragOverIndex(null);
                      if (!Number.isNaN(from)) {
                        void handleReorder(from, index);
                      }
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    style={{
                      cursor: reordering ? 'wait' : 'grab',
                      opacity: isDragging ? 0.5 : 1,
                      outline: isDragOver ? '2px solid #9ca3af' : undefined,
                      outlineOffset: isDragOver ? '-2px' : undefined,
                    }}
                  >
                    <td>
                      <div className="admin-section-thumb-brand">
                      {brand.imagePath ? (
                        <img
                          src={brand.imagePath}
                          alt={brand.name || 'Brand'}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                          <span className="admin-section-thumb-brand-placeholder">
                          No Image
                          </span>
                        )}
                        </div>
                    </td>
                    <td><strong>{brand.name || 'Untitled Brand'}</strong></td>
                    <td>
                      {brand.description ? (
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                          {brand.description}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${brand.isActive !== false ? 'published' : 'draft'}`}>
                        {brand.isActive !== false ? 'Active' : 'Inactive'}
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
