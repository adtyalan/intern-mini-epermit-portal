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
    <div className="w-full max-w-[400px] p-8 border border-border rounded-lg bg-card shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] hover:border-border/150 transition-all duration-200">
      <div className="text-center mb-7">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-1.5">
          Mini E-Permit
        </h1>
        <p className="text-muted-foreground text-sm">
          Masuk untuk mengajukan atau meninjau izin kerja
        </p>
      </div>

      {error && (
        <div className="bg-destructive/8 border border-destructive/20 rounded-lg p-3.5 text-destructive text-sm text-left mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-foreground mb-1.5">
            Username
          </label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Contoh: admin atau user1"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-medium text-foreground mb-1.5">
            Password
          </label>
          <input
            type="password"
            className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-ring focus:ring-2 focus:ring-ring/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password Anda"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          disabled={loading}
        >
          {loading ? "Menghubungkan..." : "Masuk Sistem"}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Gunakan <strong>admin / admin123</strong> atau <strong>user1 / user123</strong> untuk mencoba
        </p>
      </div>
    </div>
  );
}
