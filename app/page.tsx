"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = cookies.get("user_session");
    if (session) {
      router.push("/dashboard");
    }
  }, [router]);

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
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "24px"
    }}>
      <div className="premium-card" style={{ maxWidth: "420px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>
            <span className="gradient-text">Mini E-Permit</span>
          </h1>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "14px" }}>
            Masuk untuk mengajukan atau meninjau izin kerja
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            padding: "12px",
            color: "hsl(var(--destructive))",
            fontSize: "14px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
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

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
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
            style={{ width: "100%", padding: "14px" }}
            disabled={loading}
          >
            {loading ? "Menghubungkan..." : "Masuk Sistem"}
          </button>
        </form>

        <div style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
          <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", textAlign: "center" }}>
            Gunakan <strong>admin / admin123</strong> atau <strong>user1 / user123</strong> untuk mencoba
          </p>
        </div>
      </div>
    </div>
  );
}
