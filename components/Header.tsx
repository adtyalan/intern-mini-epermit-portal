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
      background: "hsl(var(--background) / 0.85)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid hsl(var(--border))",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      <div className="premium-container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px"
      }}>
        <div>
          <h2>
            <span style={{ color: "hsl(var(--foreground))", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.02em" }}>
              E-Permit Portal
            </span>
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "hsl(var(--foreground))" }}>{session.username}</p>
            <p style={{
              fontSize: "11px",
              color: "hsl(var(--muted-foreground))",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              {session.role}
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              color: "hsl(var(--muted-foreground))",
              border: "1px solid hsl(var(--border))",
              padding: "7px 12px",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "hsl(var(--destructive) / 0.08)";
              e.currentTarget.style.color = "hsl(var(--destructive))";
              e.currentTarget.style.borderColor = "hsl(var(--destructive) / 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "hsl(var(--muted-foreground))";
              e.currentTarget.style.borderColor = "hsl(var(--border))";
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
