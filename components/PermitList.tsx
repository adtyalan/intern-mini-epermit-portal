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
  onUpdateSuccess?: () => void;
  onAddClick?: () => void;
}

export function PermitList({
  permits,
  permitsError,
  isAdmin,
  onUpdateSuccess,
  onAddClick,
}: PermitListProps) {
  
  const handleUpdateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/permits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok && onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Gagal update status", err);
    }
  };

  return (
    <section className="premium-card" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "8px" }}>
          <ClipboardList size={16} style={{ color: "hsl(var(--foreground))" }} />
          {isAdmin ? "Seluruh Pengajuan Izin Kerja" : "Pengajuan Izin Saya"}
        </h3>

        {!isAdmin && onAddClick && (
          <button
            onClick={onAddClick}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              border: "none",
              borderRadius: "9999px", // Chip styled
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Tambah
          </button>
        )}
      </div>

      {permitsError && (
        <p style={{ color: "hsl(var(--destructive))", fontSize: "14px" }}>Gagal memuat data pengajuan.</p>
      )}

      {!permits ? (
        <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "14px" }}>Memuat daftar pengajuan...</p>
      ) : permits.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "48px 24px",
          color: "hsl(var(--muted-foreground))"
        }}>
          <FileText size={40} style={{ opacity: 0.3, marginBottom: "12px" }} />
          <p style={{ fontSize: "14px" }}>Belum ada pengajuan izin kerja.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left"
          }}>
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                {isAdmin && <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pemohon</th>}
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pekerjaan</th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Deskripsi</th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tanggal</th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                {isAdmin && <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {permits.map((permit) => (
                <tr key={permit.id} style={{
                  borderBottom: "1px solid hsl(var(--border) / 0.5)",
                  transition: "background 0.2s"
                }} className="table-row-hover">
                  {isAdmin && (
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                      {permit.user?.username || "Tidak diketahui"}
                    </td>
                  )}
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                    {permit.title}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "hsl(var(--muted-foreground))", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {permit.description}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "hsl(var(--muted-foreground))" }}>
                    {permit.date}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className={`badge badge-${permit.status.toLowerCase()}`} style={{ display: "inline-flex", gap: "4px" }}>
                      {permit.status === "PENDING" && <Clock size={12} />}
                      {permit.status === "APPROVED" && <CheckCircle2 size={12} />}
                      {permit.status === "REJECTED" && <XCircle size={12} />}
                      {permit.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      {permit.status === "PENDING" ? (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleUpdateStatus(permit.id, "APPROVED")}
                            style={{
                              background: "hsl(142.1 76.2% 36.3% / 0.08)",
                              color: "hsl(var(--success))",
                              border: "1px solid hsl(142.1 76.2% 36.3% / 0.2)",
                              padding: "5px 10px",
                              borderRadius: "var(--radius)",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "background 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(142.1 76.2% 36.3% / 0.15)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(142.1 76.2% 36.3% / 0.08)"}
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(permit.id, "REJECTED")}
                            style={{
                              background: "hsl(0 84.2% 60.2% / 0.08)",
                              color: "hsl(var(--destructive))",
                              border: "1px solid hsl(0 84.2% 60.2% / 0.2)",
                              padding: "5px 10px",
                              borderRadius: "var(--radius)",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "background 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(0 84.2% 60.2% / 0.15)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(0 84.2% 60.2% / 0.08)"}
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
