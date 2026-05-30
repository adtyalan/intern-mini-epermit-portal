"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import cookies from "js-cookie";
import { Header } from "@/components/Header";
import { PermitForm } from "@/components/PermitForm";
import { PermitList } from "@/components/PermitList";

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
      <Header session={session} isAdmin={isAdmin} onLogout={handleLogout} />

      <main className="premium-container" style={{ marginTop: "32px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: !isAdmin ? "1fr 2fr" : "1fr",
          gap: "32px",
          alignItems: "start"
        }}>
          {!isAdmin && (
            <PermitForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              date={date}
              setDate={setDate}
              formError={formError}
              formSuccess={formSuccess}
              formLoading={formLoading}
              onSubmit={handleCreatePermit}
            />
          )}

          <PermitList
            permits={permits}
            permitsError={!!permitsError}
            isAdmin={isAdmin}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </main>
    </div>
  );
}
