"use client";

import { useEffect, useState } from "react";
import { Alert, Button } from "@/components/admin/ui";

interface JobInquiry {
  _id?: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  linkedInUrl?: string;
  resumeUrl: string;
  coverLetter?: string;
  createdAt: string;
}

interface JobInquiriesResponse {
  success: boolean;
  data: JobInquiry[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

export default function JobInquiriesPage() {
  const [items, setItems] = useState<JobInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<JobInquiry | null>(null);

  const loadJobInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/careers/apply?limit=100");
      const json = (await res.json()) as JobInquiriesResponse;
      if (!json.success) {
        throw new Error(json.message || "Failed to load job inquiries");
      }
      setItems(json.data || []);
    } catch (err: any) {
      console.error("Failed to load job inquiries", err);
      setError(err.message || "Failed to load job inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobInquiries();
  }, []);

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1>Job Inquiries</h1>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              View career applications submitted from the website
            </div>
          </div>
          <button
            type="button"
            className="button button-primary"
            onClick={loadJobInquiries}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div style={{ paddingTop: 16 }}>
        {error && (
          <div className="mb-3">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 140 }}>Date</th>
                <th style={{ width: 220 }}>Candidate</th>
                <th style={{ width: 280 }}>Email</th>
                <th>Job Role</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    Loading job inquiries...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    No job inquiries received yet.
                  </td>
                </tr>
              )}

              {items.map((item) => {
                const isActive =
                  selected &&
                  (selected._id && item._id
                    ? selected._id === item._id
                    : selected.email === item.email && selected.createdAt === item.createdAt);

                return (
                  <tr
                    key={item._id || `${item.email}-${item.createdAt}`}
                    className={isActive ? "admin-table-row-active" : ""}
                  >
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td>
                      <strong>{item.fullName || "-"}</strong>
                    </td>
                    <td>{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : "-"}</td>
                    <td>{item.jobTitle || "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-edit"
                        onClick={() => setSelected(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (
          <div
            className="position-fixed"
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              left: "260px",
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              zIndex: 1050,
            }}
            onClick={() => setSelected(null)}
          >
            <div
              className="d-flex justify-content-center align-items-center h-100 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-3 shadow-lg" style={{ maxWidth: "680px", width: "100%" }}>
                <div className="border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="h5 mb-1">{selected.fullName}</h2>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </div>

                <div className="px-4 py-3">
                  <dl className="row mb-0">
                    <dt className="col-4 text-muted">Job Role</dt>
                    <dd className="col-8 mb-2">{selected.jobTitle || "-"}</dd>

                    <dt className="col-4 text-muted">Email</dt>
                    <dd className="col-8 mb-2">
                      <a href={`mailto:${selected.email}`}>{selected.email}</a>
                    </dd>

                    <dt className="col-4 text-muted">Phone</dt>
                    <dd className="col-8 mb-2">{selected.phone || "-"}</dd>

                    <dt className="col-4 text-muted">Country</dt>
                    <dd className="col-8 mb-2">{selected.country || "-"}</dd>

                    <dt className="col-4 text-muted">LinkedIn</dt>
                    <dd className="col-8 mb-2">
                      {selected.linkedInUrl ? (
                        <a href={selected.linkedInUrl} target="_blank" rel="noopener noreferrer">
                          {selected.linkedInUrl}
                        </a>
                      ) : (
                        "-"
                      )}
                    </dd>

                    <dt className="col-4 text-muted">Resume</dt>
                    <dd className="col-8 mb-2">
                      {selected.resumeUrl ? (
                        <a href={selected.resumeUrl} target="_blank" rel="noopener noreferrer">
                          View Resume
                        </a>
                      ) : (
                        "-"
                      )}
                    </dd>

                    <dt className="col-12 text-muted mt-2">Cover Letter</dt>
                    <dd className="col-12 mb-0">
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          background: "var(--bg-1)",
                          borderRadius: "8px",
                          padding: "12px 14px",
                          lineHeight: 1.5,
                          minHeight: "64px",
                        }}
                      >
                        {selected.coverLetter || "-"}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

