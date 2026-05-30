import React from "react";
import { Plus } from "lucide-react";

interface PermitFormProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  formError: string;
  formSuccess: string;
  formLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function PermitForm({
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  formError,
  formSuccess,
  formLoading,
  onSubmit,
}: PermitFormProps) {
  return (
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

      <form onSubmit={onSubmit}>
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
  );
}
