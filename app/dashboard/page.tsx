"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import cookies from "js-cookie";
import { LogOut, Plus, FileText, ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";

interface UserSession {
  id: string;
  username: string;
  role: string;
}

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const rawSession = cookies.get("user_session");
    if (!rawSession) {
      router.push("/");
    } else {
      try {
        setSession(JSON.parse(rawSession));
      } catch {
        router.push("/");
      }
    }
  }, [router]);

  const { data: permits, error: permitsError } = useSWR<Permit[]>(
    session ? "/api/permits" : null,
    fetcher
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    cookies.remove("user_session");
    router.push("/");
  };

  const handleCreatePermit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch("/api/permits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Gagal mengirim pengajuan");
        setFormLoading(false);
        return;
      }

      setTitle("");
      setDescription("");
      setDate("");
      setFormSuccess("Pengajuan izin berhasil dikirim!");
      mutate("/api/permits");
    } catch {
      setFormError("Kesalahan jaringan");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/permits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        mutate("/api/permits");
      }
    } catch (err) {
      console.error("Gagal update status");
    }
  };

  if (!session) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>Memuat sesi...</p>
      </div>
    );
  }

  const isAdmin = session.role === "ADMIN";

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "64px" }}>
      <header style={{
        background: "rgba(255, 255, 255, 0.01)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div className="premium-container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px"
        }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              <span className="gradient-text">E-Permit Portal</span>
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "14px", fontWeight: 600 }}>{session.username}</p>
              <p style={{
                fontSize: "11px",
                color: isAdmin ? "hsl(var(--primary))" : "hsl(var(--success))",
                fontWeight: 700,
                textTransform: "uppercase"
              }}>
                {session.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: "hsl(var(--destructive))",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="premium-container" style={{ marginTop: "32px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: !isAdmin ? "1fr 2fr" : "1fr",
          gap: "32px",
          alignItems: "start"
        }}>
          {!isAdmin && (
            <section className="premium-card">
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Plus size={18} style={{ color: "hsl(var(--primary))" }} />
                Buat Izin Baru
              </h3>

              {formError && (
                <div style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "hsl(var(--destructive))",
                  fontSize: "13px",
                  marginBottom: "16px"
                }}>
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "hsl(var(--success))",
                  fontSize: "13px",
                  marginBottom: "16px"
                }}>
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleCreatePermit}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>
                    Judul Pekerjaan
                  </label>
                  <input
                    type="text"
                    className="premium-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Perbaikan AC Server"
                    required
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>
                    Deskripsi Pekerjaan
                  </label>
                  <textarea
                    className="premium-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan detail pekerjaan"
                    rows={4}
                    style={{ resize: "none" }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    className="premium-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="premium-btn"
                  style={{ width: "100%" }}
                  disabled={formLoading}
                >
                  {formLoading ? "Mengirim..." : "Kirim Pengajuan"}
                </button>
              </form>
            </section>
          )}

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
                                  onClick={() => handleUpdateStatus(permit.id, "APPROVED")}
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
                                  onClick={() => handleUpdateStatus(permit.id, "REJECTED")}
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
        </div>
      </main>
    </div>
  );
}
