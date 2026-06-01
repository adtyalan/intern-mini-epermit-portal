"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = cookies.get("user_session");
    if (session) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "24px",
      backgroundColor: "hsl(var(--muted) / 0.3)"
    }}>
      <LoginForm />
    </div>
  );
}
