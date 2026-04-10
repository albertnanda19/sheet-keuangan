import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSheet - Manajemen Keuangan Perusahaan",
  description:
    "Sistem manajemen keuangan terintegrasi untuk perusahaan. Pencatatan transaksi, anggaran, dan pelaporan keuangan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
