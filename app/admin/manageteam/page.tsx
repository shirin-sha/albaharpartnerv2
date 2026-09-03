'use client';

import { useEffect, useState, useRef} from 'react';
import { saveWithPendingUploads, discardPendingUploads, deleteManagedUpload } from '@/lib/pending-uploads';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { AboutUsContent, TeamMember } from '@/types/aboutus';

type TeamMemberForm = {
  imgSrc: string;
  name: string;
  nameAr: string;
  position: string;
  positionAr: string;
};

export default function TeamManagePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [aboutLtr, setAboutLtr] = useState<AboutUsContent | null>(null);
  const [aboutRtl, setAboutRtl] = useState<AboutUsContent | null>(null);
  const [membersLtr, setMembersLtr] = useState<TeamMember[]>([]);
  const [membersRtl, setMembersRtl] = useState<TeamMember[]>([]);
  const [formData, setFormData] = useState<TeamMemberForm>({
    imgSrc: '',
    name: '',
    nameAr: '',
    position: '',
    positionAr: '',
  });
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const normalizeMember = (member?: Partial<TeamMember>, fallback?: Partial<TeamMember>): TeamMember => ({
    imgSrc: member?.imgSrc || fallback?.imgSrc || '',
    name: member?.name || fallback?.name || '',
    position: member?.position || fallback?.position || '',
  });

  const normalizeBilingualMembers = (
    ltrMembers: TeamMember[] = [],
    rtlMembers: TeamMember[] = []
  ): { ltr: TeamMember[]; rtl: TeamMember[] } => {
    const size = Math.max(ltrMembers.length, rtlMembers.length);
    const ltr: TeamMember[] = [];
    const rtl: TeamMember[] = [];

    for (let i = 0; i < size; i += 1) {
      const ltrItem = ltrMembers[i];
      const rtlItem = rtlMembers[i];
      const normalizedLtr = normalizeMember(ltrItem, rtlItem);
      // Keep Arabic row aligned; if missing in Arabic, seed from English to avoid index mismatch.
      const normalizedRtl = normalizeMember(rtlItem, normalizedLtr);
      ltr.push(normalizedLtr);
      rtl.push(normalizedRtl);
    }

    return { ltr, rtl };
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/aboutus?language=ltr'),
        fetch('/api/aboutus?language=rtl'),
      ]);
      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);

      if (!ltrResult.success || !rtlResult.success || !ltrResult.data || !rtlResult.data) {
        showToast('error', 'Failed to load team members');
        return;
      }

      setAboutLtr(ltrResult.data);
      setAboutRtl(rtlResult.data);
      const normalized = normalizeBilingualMembers(
        ltrResult.data.team?.members || [],
        rtlResult.data.team?.members || []
      );
      setMembersLtr(normalized.ltr);
      setMembersRtl(normalized.rtl);
    } catch (error) {
      console.error('Error loading team members:', error);
      showToast('error', 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    discardPendingUploads();
    setFormData({
      imgSrc: '',
      name: '',
      nameAr: '',
      position: '',
      positionAr: '',
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const saveMembers = async (nextMembersLtr: TeamMember[], nextMembersRtl: TeamMember[]) => {
    if (!aboutLtr || !aboutRtl) return false;

    setSaving(true);
    try {
      const normalized = normalizeBilingualMembers(nextMembersLtr, nextMembersRtl);
      const nextAboutLtr: AboutUsContent = {
        ...aboutLtr,
        team: { ...aboutLtr.team, members: normalized.ltr },
      };
      const nextAboutRtl: AboutUsContent = {
        ...aboutRtl,
        team: { ...aboutRtl.team, members: normalized.rtl },
      };

      const [ltrRes, rtlRes] = await Promise.all([
        fetch('/api/aboutus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextAboutLtr, language: 'ltr' }),
        }),
        fetch('/api/aboutus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextAboutRtl, language: 'rtl' }),
        }),
      ]);

      const [ltrResult, rtlResult] = await Promise.all([ltrRes.json(), rtlRes.json()]);
      if (!ltrResult.success || !rtlResult.success) {
        showToast('error', ltrResult.message || rtlResult.message || 'Failed to save team members');
        return false;
      }

      setMembersLtr(normalized.ltr);
      setMembersRtl(normalized.rtl);
      setAboutLtr(nextAboutLtr);
      setAboutRtl(nextAboutRtl);
      showToast('success', 'Team members saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving team members:', error);
      showToast('error', 'Failed to save team members');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index: number) => {
    const memberLtr = membersLtr[index] || { imgSrc: '', name: '', position: '' };
    const memberRtl = membersRtl[index] || { imgSrc: '', name: '', position: '' };
    setFormData({
      imgSrc: memberLtr.imgSrc || memberRtl.imgSrc || '',
      name: memberLtr.name || '',
      nameAr: memberRtl.name || '',
      position: memberLtr.position || '',
      positionAr: memberRtl.position || '',
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    const removed = membersLtr[index];
    const nextMembersLtr = membersLtr.filter((_, i) => i !== index);
    const nextMembersRtl = membersRtl.filter((_, i) => i !== index);
    const ok = await saveMembers(nextMembersLtr, nextMembersRtl);
    if (ok) {
      await deleteManagedUpload(removed?.imgSrc || '');
      if (membersRtl[index]?.imgSrc && membersRtl[index].imgSrc !== removed?.imgSrc) {
        await deleteManagedUpload(membersRtl[index].imgSrc);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ok = await saveWithPendingUploads(async () => {
        const formData = formDataRef.current;
        if (!formData.name.trim()) {
          showToast('error', 'Name (English) is required');
          return false;
        }

        const memberLtr: TeamMember = {
          imgSrc: formData.imgSrc,
          name: formData.name,
          position: formData.position,
        };
        const memberRtl: TeamMember = {
          imgSrc: formData.imgSrc,
          name: formData.nameAr || formData.name,
          position: formData.positionAr || formData.position,
        };

        const nextMembersLtr = [...membersLtr];
        const nextMembersRtl = [...membersRtl];

        if (editingIndex === null) {
          nextMembersLtr.push(memberLtr);
          nextMembersRtl.push(memberRtl);
        } else {
          nextMembersLtr[editingIndex] = memberLtr;
          nextMembersRtl[editingIndex] = memberRtl;
        }

        return await saveMembers(nextMembersLtr, nextMembersRtl);
      });
      if (ok) resetForm();
    } catch (err) {
      console.error('Upload error:', err);
      showToast('error', err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Team Management</h1>
        {!showForm && (
          <button
            className="button button-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Team Member
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
        <div className="admin-cms-section-card" style={{ marginBottom: '24px' }}>
          <div className="admin-cms-section-header" style={{ cursor: 'default' }}>
            <h3 style={{ margin: 0 }}>{editingIndex !== null ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <button type="button" className="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit} className="admin-cms-form">
            <div className="form-group">
              <label>Image</label>
              <ImageUpload
                value={formData.imgSrc}
                onChange={(value) => setFormData((prev) => ({ ...prev, imgSrc: value }))}
                folder="team"
                helperText="Recommended: 600 × 600 px (1:1)."
              />
            </div>

            <div className="form-row-bilingual-header">
              <div className="form-label-header">English</div>
              <div className="form-label-header">Arabic</div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.nameAr}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-row-bilingual">
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.positionAr}
                  onChange={(e) => setFormData((prev) => ({ ...prev, positionAr: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving...' : editingIndex !== null ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '16px', color: '#6b7280' }}>
        {membersLtr.length} member{membersLtr.length !== 1 ? 's' : ''} listed
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name (English)</th>
              <th>Name (Arabic)</th>
              <th>Position (English)</th>
              <th>Position (Arabic)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {membersLtr.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  No team members added yet.
                </td>
              </tr>
            ) : (
              membersLtr.map((member, index) => {
                const memberAr = membersRtl[index] || { imgSrc: member.imgSrc, name: '', position: '' };
                return (
                  <tr key={index}>
                    <td>{member.imgSrc ? 'Uploaded' : '-'}</td>
                    <td><strong>{member.name || '-'}</strong></td>
                    <td style={{ direction: 'rtl', textAlign: 'right' }}>{memberAr.name || '-'}</td>
                    <td>{member.position || '-'}</td>
                    <td style={{ direction: 'rtl', textAlign: 'right' }}>{memberAr.position || '-'}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(index)}
                          className="admin-btn admin-btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="admin-btn admin-btn-delete"
                        >
                          Delete
                        </button>
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
