'use client';

import { useCustomerCareSections } from './hooks/useCustomerCareSections';
import CustomerCareSectionEditor from '@/components/admin/CustomerCareSectionEditor';
import { CCC_SECTION_LABELS, type CccSectionId } from './constants';

const CustomerCareCMS = () => {
  const { sections, loading, selectedSection, setSelectedSection, saveSection } = useCustomerCareSections();

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Customer Care Center CMS</h1>
      </div>
      {selectedSection && (
        <div key={selectedSection} style={{ marginTop: '20px' }}>
          <CustomerCareSectionEditor
            sectionId={selectedSection}
            section={sections.find((s) => s.sectionId === selectedSection)}
            onSave={saveSection}
            isOpen={true}
            onToggle={() => setSelectedSection(null)}
          />
        </div>
      )}
      <div className="admin-cms-section-card" style={{ marginBottom: '20px' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Title (English)</th>
                <th>Title (Arabic)</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    No sections loaded.
                  </td>
                </tr>
              ) : (
                sections
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((section) => {
                    const ltr = (section.ltr ?? {}) as Record<string, unknown>;
                    const rtl = (section.rtl ?? {}) as Record<string, unknown>;
                    const titleEn =
                      (ltr.heading as string) ||
                      (ltr.title as string) ||
                      (ltr.tag as string) ||
                      (ltr.locationLabel as string) ||
                      section.sectionId;
                    const titleAr =
                      (rtl.heading as string) ||
                      (rtl.title as string) ||
                      (rtl.tag as string) ||
                      (rtl.locationLabel as string) ||
                      '';
                    const imagePath = (ltr.imagePath as string | undefined) || undefined;
                    const isEditing = selectedSection === section.sectionId;
                    const label =
                      CCC_SECTION_LABELS[section.sectionId as CccSectionId] || section.sectionId;

                    return (
                      <tr key={section.sectionId}>
                        <td>
                          <strong>{label}</strong>
                        </td>
                        <td>{titleEn || '-'}</td>
                        <td style={{ direction: 'rtl', textAlign: 'right' }}>{titleAr || '-'}</td>
                        <td>
                          <div className="admin-section-thumb">
                            {imagePath ? (
                              <img
                                src={imagePath}
                                alt={String(titleEn) || section.sectionId}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="admin-section-thumb-placeholder">No Image</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="admin-btn admin-btn-edit admin-cms-edit-btn"
                              onClick={() => {
                                if (isEditing) {
                                  setSelectedSection(null);
                                  return;
                                }
                                setSelectedSection(section.sectionId);
                                if (typeof window !== 'undefined') {
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                              }}
                            >
                              {isEditing ? 'Close' : 'Edit'}
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
    </div>
  );
};

export default CustomerCareCMS;
