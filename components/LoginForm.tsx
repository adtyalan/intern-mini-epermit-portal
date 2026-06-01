"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Kesalahan koneksi server");
      setLoading(false);
    }
  };

  return (
    <div className="premium-card" style={{ maxWidth: "400px", width: "100%", padding: "32px" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.03em", marginBottom: "6px" }}>
          Mini E-Permit
        </h1>
        <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "14px" }}>
          Masuk untuk mengajukan atau meninjau izin kerja
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: "hsl(var(--destructive) / 0.08)",
          border: "1px solid hsl(var(--destructive) / 0.2)",
          borderRadius: "var(--radius)",
          padding: "10px 14px",
          color: "hsl(var(--destructive))",
          fontSize: "13px",
          marginBottom: "20px",
          textAlign: "left"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "hsl(var(--foreground))" }}>
            Username
          </label>
          <input
            type="text"
            className="premium-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Contoh: admin atau user1"
            required
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "hsl(var(--foreground))" }}>
            Password
          </label>
          <input
            type="password"
            className="premium-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password Anda"
            required
          />
        </div>

        <button
          type="submit"
          className="premium-btn"
          style={{ width: "100%", padding: "11px", fontWeight: 600 }}
          disabled={loading}
        >
          {loading ? "Menghubungkan..." : "Masuk Sistem"}
        </button>
      </form>

      <div style={{ marginTop: "24px", borderTop: "1px solid hsl(var(--border))", paddingTop: "16px" }}>
        <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", textAlign: "center", lineHeight: "1.5" }}>
          Gunakan <strong>admin / admin123</strong> atau <strong>user1 / user123</strong> untuk mencoba
        </p>
      </div>
    </div>
  );
}
