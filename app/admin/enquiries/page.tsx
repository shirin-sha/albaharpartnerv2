"use client";

import { useEffect, useState } from "react";
import { Alert, Button } from "@/components/admin/ui";

interface Enquiry {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  comment: string;
  createdAt: string;
}

interface EnquiriesResponse {
  success: boolean;
  data: Enquiry[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries?limit=100");
      const json = (await res.json()) as EnquiriesResponse;
      if (!json.success) {
        throw new Error(json.message || "Failed to load enquiries");
      }
      setEnquiries(json.data || []);
    } catch (err: any) {
      console.error("Failed to load enquiries", err);
      setError(err.message || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1>Enquiries</h1>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              View contact form submissions from the website
            </div>
          </div>
          <button
            type="button"
            className="button button-primary"
            onClick={loadEnquiries}
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
                <th style={{ width: 220 }}>Name</th>
                <th style={{ width: 280 }}>Email</th>
                <th>Subject</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && enquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    Loading enquiries…
                  </td>
                </tr>
              )}

              {!loading && enquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    No enquiries received yet.
                  </td>
                </tr>
              )}

              {enquiries.map((enquiry) => {
                const isActive =
                  selected &&
                  (selected._id && enquiry._id
                    ? selected._id === enquiry._id
                    : selected.email === enquiry.email &&
                      selected.createdAt === enquiry.createdAt);

                return (
                  <tr
                    key={enquiry._id || `${enquiry.email}-${enquiry.createdAt}`}
                    className={isActive ? "admin-table-row-active" : ""}
                  >
                    <td>
                      {enquiry.createdAt
                        ? new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td>
                      <strong>{enquiry.name || "-"}</strong>
                    </td>
                    <td>
                      {enquiry.email ? <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a> : "-"}
                    </td>
                    <td>{enquiry.subject || "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-edit"
                        onClick={() => setSelected(enquiry)}
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


        {/* Details modal */}
        {selected && (
          <div
            className="position-fixed"
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              left: "260px", // align with sidebar width so modal sits over content only
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              zIndex: 1050,
            }}
            onClick={() => setSelected(null)}
          >
            <div
              className="d-flex justify-content-center align-items-center h-100 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-white rounded-3 shadow-lg"
                style={{ maxWidth: "640px", width: "100%" }}
              >
                <div className="border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="h5 mb-1">{selected.name}</h2>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {selected.createdAt
                        ? new Date(selected.createdAt).toLocaleString()
                        : ""}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </div>

                <div className="px-4 py-3">
                  <dl className="row mb-0">
                    <dt className="col-4 text-muted">Email</dt>
                    <dd className="col-8 mb-2">
                      <a href={`mailto:${selected.email}`}>{selected.email}</a>
                    </dd>

                    <dt className="col-4 text-muted">Phone</dt>
                    <dd className="col-8 mb-2">{selected.phone || "-"}</dd>

                    <dt className="col-4 text-muted">Country</dt>
                    <dd className="col-8 mb-2">{selected.country || "-"}</dd>

                    <dt className="col-4 text-muted">Subject</dt>
                    <dd className="col-8 mb-2">{selected.subject}</dd>

                    <dt className="col-12 text-muted mt-2">Message</dt>
                    <dd className="col-12 mb-0">
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          background: "var(--bg-1)",
                          borderRadius: "8px",
                          padding: "12px 14px",
                         
                          lineHeight: 1.5,
                        }}
                      >
                        {selected.comment}
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

