'use client';

import { useState, useEffect, useRef } from 'react';
import { Job } from '@/types/careers';

export default function CareersManagePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [jobsLtr, setJobsLtr] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<{
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    responsibilities: string[];
    responsibilitiesAr: string[];
    salary: { amount: string; period: string };
    applyLink: string;
    order: number;
    isActive: boolean;
  }>({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    responsibilities: [],
    responsibilitiesAr: [],
    salary: { amount: '', period: '' },
    applyLink: '#',
    order: 0,
    isActive: true,
  });
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [responsibilityInputAr, setResponsibilityInputAr] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // Only load LTR initially for faster page load
      const ltrRes = await fetch('/api/careers?language=ltr');
      const ltrResult = await ltrRes.json();
      if (ltrResult.success && ltrResult.data) {
        setJobsLtr(ltrResult.data.jobs || []);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      showMessage('error', 'Failed to load jobs');
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
      const index = isNew ? jobsLtr.length : editingIndex!;

      const job: Job = {
        title: formData.title,
        titleAr: formData.titleAr || formData.title,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        responsibilities: formData.responsibilities,
        responsibilitiesAr: formData.responsibilitiesAr.length > 0 ? formData.responsibilitiesAr : formData.responsibilities,
        salary: formData.salary,
        applyLink: formData.applyLink,
        order: formData.order,
        isActive: formData.isActive,
      };

      const res = await fetch(isNew ? '/api/careers/add' : '/api/careers/update', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'ltr',
          jobIndex: index,
          job,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showMessage('success', isNew ? 'Job added successfully!' : 'Job updated successfully!');
        await loadJobs();
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
    const jobLtr = jobsLtr[index];
    setEditingIndex(index);
    setFormData({
      title: jobLtr.title || '',
      titleAr: jobLtr.titleAr || jobLtr.title || '',
      description: jobLtr.description || '',
      descriptionAr: jobLtr.descriptionAr || jobLtr.description || '',
      responsibilities: jobLtr.responsibilities || [],
      responsibilitiesAr: jobLtr.responsibilitiesAr || jobLtr.responsibilities || [],
      salary: jobLtr.salary || { amount: '', period: '' },
      applyLink: jobLtr.applyLink || '#',
      order: jobLtr.order || 0,
      isActive: jobLtr.isActive !== undefined ? jobLtr.isActive : true,
    });
    setShowForm(true);
    
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const res = await fetch(`/api/careers/delete?language=ltr&index=${index}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showMessage('success', 'Job deleted successfully!');
        await loadJobs();
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
      responsibilities: [],
      responsibilitiesAr: [],
      salary: { amount: '', period: '' },
      applyLink: '#',
      order: 0,
      isActive: true,
    });
    setEditingIndex(null);
    setShowForm(false);
    setResponsibilityInput('');
    setResponsibilityInputAr('');
  };

  const addResponsibility = (lang: 'en' | 'ar') => {
    const input = lang === 'en' ? responsibilityInput : responsibilityInputAr;
    if (input.trim()) {
      if (lang === 'en') {
        setFormData({
          ...formData,
          responsibilities: [...formData.responsibilities, input.trim()],
        });
        setResponsibilityInput('');
      } else {
        setFormData({
          ...formData,
          responsibilitiesAr: [...formData.responsibilitiesAr, input.trim()],
        });
        setResponsibilityInputAr('');
      }
    }
  };

  const removeResponsibility = (index: number, lang: 'en' | 'ar') => {
    if (lang === 'en') {
      setFormData({
        ...formData,
        responsibilities: formData.responsibilities.filter((_, i) => i !== index),
      });
    } else {
      setFormData({
        ...formData,
        responsibilitiesAr: formData.responsibilitiesAr.filter((_, i) => i !== index),
      });
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  const jobs = jobsLtr; // Use LTR for display

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Careers Management</h1>
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
            + Add New Job
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
            <h3 style={{ color: '#ffffff', fontWeight: '600' }}>{editingIndex !== null ? 'Edit Job' : 'Add New Job'}</h3>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Salary Amount</label>
                      <input
                        type="text"
                        value={formData.salary.amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salary: { ...formData.salary, amount: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Salary Period</label>
                      <input
                        type="text"
                        value={formData.salary.period}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salary: { ...formData.salary, period: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-row-bilingual">
                    <div className="form-group">
                      <label>Responsibilities</label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={responsibilityInput}
                          onChange={(e) => setResponsibilityInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addResponsibility('en');
                            }
                          }}
                          placeholder="Enter responsibility and press Enter"
                          style={{ flex: 1 }}
                        />
                        <button type="button" onClick={() => addResponsibility('en')} className="button" style={{ fontSize: '12px', padding: '6px 12px' }}>
                          Add
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {formData.responsibilities.map((resp, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '4px 8px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {resp}
                            <button
                              type="button"
                              onClick={() => removeResponsibility(idx, 'en')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0369a1',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: 0,
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Responsibilities</label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          dir="rtl"
                          value={responsibilityInputAr}
                          onChange={(e) => setResponsibilityInputAr(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addResponsibility('ar');
                            }
                          }}
                          placeholder="Enter responsibility and press Enter"
                          style={{ flex: 1 }}
                        />
                        <button type="button" onClick={() => addResponsibility('ar')} className="button" style={{ fontSize: '12px', padding: '6px 12px' }}>
                          Add
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {formData.responsibilitiesAr.map((resp, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '4px 8px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {resp}
                            <button
                              type="button"
                              onClick={() => removeResponsibility(idx, 'ar')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0369a1',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: 0,
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Update Job' : 'Add Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          {jobs.length} job{jobs.length !== 1 ? 's' : ''} listed
        </p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                <td colSpan={5} className="admin-table-empty">
                  No jobs added yet. Click &ldquo;Add New Job&rdquo; to get started.
                  </td>
                </tr>
              ) : (
              jobs.map((job, index) => {
                const isEditing = editingIndex === index;
                return (
                  <tr key={index} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td><strong>{job.title || 'Untitled Job'}</strong></td>
                    <td>
                      {job.description ? (
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                          {job.description}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{job.salary?.amount ? `${job.salary.amount} ${job.salary.period}` : '-'}</td>
                    <td>
                      <span className={`admin-badge ${job.isActive !== false ? 'published' : 'draft'}`}>
                        {job.isActive !== false ? 'Active' : 'Inactive'}
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
