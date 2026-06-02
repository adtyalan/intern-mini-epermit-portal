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
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] w-full mx-auto px-6 py-3.5 flex justify-between items-center">
        <div>
          <h2>
            <span className="text-foreground font-semibold text-lg tracking-tight">
              E-Permit Portal
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{session.username}</p>
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              {session.role}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg bg-transparent hover:bg-destructive/8 hover:text-destructive hover:border-destructive/20 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
