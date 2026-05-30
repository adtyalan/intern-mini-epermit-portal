import React from "react";
import { FileText, ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Permit {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  createdAt: string;
  user?: {
    username: string;
  };
}

interface PermitListProps {
  permits: Permit[] | undefined;
  permitsError: boolean;
  isAdmin: boolean;
  onUpdateStatus: (id: string, newStatus: "APPROVED" | "REJECTED") => void;
}

export function PermitList({
  permits,
  permitsError,
  isAdmin,
  onUpdateStatus,
}: PermitListProps) {
  return (
    <section className="premium-card" style={{ width: "100%" }}>
      <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
        <ClipboardList size={18} style={{ color: "hsl(var(--primary))" }} />
        {isAdmin ? "Seluruh Pengajuan Izin Kerja" : "Pengajuan Izin Saya"}
      </h3>

      {permitsError && (
        <p style={{ color: "hsl(var(--destructive))" }}>Gagal memuat data pengajuan.</p>
      )}

      {!permits ? (
        <p style={{ color: "hsl(var(--muted-foreground))" }}>Memuat daftar pengajuan...</p>
      ) : permits.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "48px 24px",
          color: "hsl(var(--muted-foreground))"
        }}>
          <FileText size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
          <p>Belum ada pengajuan izin kerja.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left"
          }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {isAdmin && <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600 }}>Pemohon</th>}
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600 }}>Pekerjaan</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600 }}>Deskripsi</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600 }}>Tanggal</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600 }}>Status</th>
                {isAdmin && <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, textAlign: "right" }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {permits.map((permit) => (
                <tr key={permit.id} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.2s"
                }} className="table-row-hover">
                  {isAdmin && (
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: 600 }}>
                      {permit.user?.username || "Tidak diketahui"}
                    </td>
                  )}
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: 600 }}>
                    {permit.title}
                  </td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "hsl(var(--muted-foreground))", maxWidth: "250px" }}>
                    {permit.description}
                  </td>
                  <td style={{ padding: "16px", fontSize: "14px" }}>
                    {permit.date}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span className={`badge badge-${permit.status.toLowerCase()}`}>
                      {permit.status === "PENDING" && <Clock size={12} style={{ marginRight: "4px" }} />}
                      {permit.status === "APPROVED" && <CheckCircle2 size={12} style={{ marginRight: "4px" }} />}
                      {permit.status === "REJECTED" && <XCircle size={12} style={{ marginRight: "4px" }} />}
                      {permit.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      {permit.status === "PENDING" ? (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => onUpdateStatus(permit.id, "APPROVED")}
                            style={{
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "hsl(var(--success))",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "background 0.2s"
                            }}
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => onUpdateStatus(permit.id, "REJECTED")}
                            style={{
                              background: "rgba(239, 68, 68, 0.15)",
                              color: "hsl(var(--destructive))",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "background 0.2s"
                            }}
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
                          Selesai ditinjau
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
