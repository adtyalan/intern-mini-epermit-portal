"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import cookies from "js-cookie";
import { Header } from "@/components/Header";
import { PermitForm } from "@/components/PermitForm";
import { PermitList } from "@/components/PermitList";
import { Dialog } from "@/components/Dialog";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20">
        <p className="text-muted-foreground text-sm">Memuat sesi...</p>
      </div>
    );
  }

  const isAdmin = session.role === "ADMIN";

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <Header session={session} isAdmin={isAdmin} onLogout={handleLogout} />

      <main className="max-w-[1200px] w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-6 items-start">
          <PermitList
            permits={permits}
            permitsError={!!permitsError}
            isAdmin={isAdmin}
            onUpdateSuccess={() => mutate("/api/permits")}
            onAddClick={!isAdmin ? () => setIsModalOpen(true) : undefined}
          />
        </div>
      </main>

      {!isAdmin && (
        <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PermitForm
            onSuccess={() => {
              mutate("/api/permits");
              // Tutup modal otomatis setelah 1 detik notifikasi sukses tampil
              setTimeout(() => {
                setIsModalOpen(false);
              }, 1000);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
