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
    <div className="flex items-center justify-center min-h-screen p-6 bg-muted/30">
      <LoginForm />
    </div>
  );
}
