import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, children }: DialogProps) {
  // Mencegah scroll body ketika dialog terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-5">
      {/* Overlay Gelap Transparan dengan Blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[4px] transition-opacity duration-200"
      />

      {/* Card Dialog */}
      <div className="relative w-full max-w-[460px] p-7 bg-card border border-border rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] z-[110] animate-[scaleIn_0.2s_ease-out]">
        {/* Tombol Close 'X' */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-muted-foreground cursor-pointer p-1 rounded-md flex items-center justify-center hover:bg-muted hover:text-foreground transition-all duration-200"
          aria-label="Tutup"
        >
          <X size={16} />
        </button>

        {/* Konten */}
        <div>{children}</div>
      </div>
    </div>
  );
}
