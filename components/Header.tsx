import React from "react";
import { LogOut } from "lucide-react";

interface UserSession {
  id: string;
  username: string;
  role: string;
}

interface HeaderProps {
  session: UserSession;
  isAdmin: boolean;
  onLogout: () => void;
}

export function Header({ session, isAdmin, onLogout }: HeaderProps) {
  return (
    <header style={{
      background: "rgba(255, 255, 255, 0.01)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      <div className="premium-container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px"
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
            <span className="gradient-text">E-Permit Portal</span>
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "14px", fontWeight: 600 }}>{session.username}</p>
            <p style={{
              fontSize: "11px",
              color: isAdmin ? "hsl(var(--primary))" : "hsl(var(--success))",
              fontWeight: 700,
              textTransform: "uppercase"
            }}>
              {session.role}
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "hsl(var(--destructive))",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
