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
    <div className="w-full">
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-5 flex items-center gap-2">
        <Plus size={16} className="text-foreground" />
        Buat Izin Baru
      </h3>

      {formError && (
        <div className="bg-destructive/8 border border-destructive/20 rounded-lg p-3.5 text-destructive text-sm mb-4">
          {formError}
        </div>
      )}

      {formSuccess && (
        <div className="bg-success/8 border border-success/20 rounded-lg p-3.5 text-success text-sm mb-4">
          {formSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-foreground mb-1.5">
            Judul Pekerjaan
          </label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Perbaikan AC Server"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-foreground mb-1.5">
            Deskripsi Pekerjaan
          </label>
          <textarea
            className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/10 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan detail pekerjaan"
            rows={4}
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-foreground mb-1.5">
            Tanggal Pelaksanaan
          </label>
          <input
            type="date"
            className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/10"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          disabled={formLoading}
        >
          {formLoading ? "Mengirim..." : "Kirim Pengajuan"}
        </button>
      </form>
    </div>
  );
}
