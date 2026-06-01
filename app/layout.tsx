import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini E-Permit System",
  description: "Sistem pengajuan izin kerja sederhana yang clean dan minimalis bergaya shadcn/ui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
