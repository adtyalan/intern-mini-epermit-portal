"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

interface PermitFormProps {
  onSuccess?: () => void;
}

export function PermitForm({ onSuccess }: PermitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setFormError("Kesalahan jaringan");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.02em", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Plus size={16} style={{ color: "hsl(var(--foreground))" }} />
        Buat Izin Baru
      </h3>

      {formError && (
        <div style={{
          backgroundColor: "hsl(var(--destructive) / 0.08)",
          border: "1px solid hsl(var(--destructive) / 0.2)",
          borderRadius: "var(--radius)",
          padding: "10px 14px",
          color: "hsl(var(--destructive))",
          fontSize: "13px",
          marginBottom: "16px"
        }}>
          {formError}
        </div>
      )}

      {formSuccess && (
        <div style={{
          backgroundColor: "hsl(142.1 76.2% 36.3% / 0.08)",
          border: "1px solid hsl(142.1 76.2% 36.3% / 0.2)",
          borderRadius: "var(--radius)",
          padding: "10px 14px",
          color: "hsl(var(--success))",
          fontSize: "13px",
          marginBottom: "16px"
        }}>
          {formSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "hsl(var(--foreground))" }}>
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
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "hsl(var(--foreground))" }}>
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

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "hsl(var(--foreground))" }}>
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
          style={{ width: "100%", padding: "10px", fontWeight: 600 }}
          disabled={formLoading}
        >
          {formLoading ? "Mengirim..." : "Kirim Pengajuan"}
        </button>
      </form>
    </div>
  );
}
