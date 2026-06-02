import React from "react";
import { FileText, ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";

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

interface PermitListProps {
  permits: Permit[] | undefined;
  permitsError: boolean;
  isAdmin: boolean;
  onUpdateSuccess?: () => void;
  onAddClick?: () => void;
}

export function PermitList({
  permits,
  permitsError,
  isAdmin,
  onUpdateSuccess,
  onAddClick,
}: PermitListProps) {
  
  const handleUpdateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/permits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok && onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Gagal update status", err);
    }
  };

  return (
    <section className="w-full bg-card border border-border rounded-lg p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
          <ClipboardList size={16} className="text-foreground" />
          {isAdmin ? "Seluruh Pengajuan Izin Kerja" : "Pengajuan Izin Saya"}
        </h3>

        {!isAdmin && onAddClick && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-1 bg-primary text-primary-foreground border-none rounded-full px-3.5 py-1 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          >
            Tambah
          </button>
        )}
      </div>

      {permitsError && (
        <p className="text-destructive text-sm">Gagal memuat data pengajuan.</p>
      )}

      {!permits ? (
        <p className="text-muted-foreground text-sm">Memuat daftar pengajuan...</p>
      ) : permits.length === 0 ? (
        <div className="text-center py-12 px-6 text-muted-foreground">
          <FileText size={40} className="mx-auto opacity-30 mb-3" />
          <p className="text-sm">Belum ada pengajuan izin kerja.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                {isAdmin && <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pemohon</th>}
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pekerjaan</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deskripsi</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                {isAdmin && <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {permits.map((permit) => (
                <tr key={permit.id} className="border-b border-border/50 transition-colors hover:bg-muted/50">
                  {isAdmin && (
                    <td className="px-4 py-3.5 text-sm font-medium text-foreground">
                      {permit.user?.username || "Tidak diketahui"}
                    </td>
                  )}
                  <td className="px-4 py-3.5 text-sm font-medium text-foreground">
                    {permit.title}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {permit.description}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">
                    {permit.date}
                  </td>
                  <td className="px-4 py-3.5">
                    {permit.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border bg-warning/8 text-warning border-warning/20">
                        <Clock size={12} />
                        {permit.status}
                      </span>
                    )}
                    {permit.status === "APPROVED" && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border bg-success/8 text-success border-success/20">
                        <CheckCircle2 size={12} />
                        {permit.status}
                      </span>
                    )}
                    {permit.status === "REJECTED" && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border bg-destructive/8 text-destructive border-destructive/20">
                        <XCircle size={12} />
                        {permit.status}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3.5 text-right">
                      {permit.status === "PENDING" ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleUpdateStatus(permit.id, "APPROVED")}
                            className="px-2.5 py-1 text-xs font-medium rounded bg-success/8 text-success border border-success/20 cursor-pointer hover:bg-success/15 transition-colors"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(permit.id, "REJECTED")}
                            className="px-2.5 py-1 text-xs font-medium rounded bg-destructive/8 text-destructive border border-destructive/20 cursor-pointer hover:bg-destructive/15 transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Selesai ditinjau
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
