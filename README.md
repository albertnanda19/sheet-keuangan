# FinSheet - Aplikasi Keuangan Perusahaan

Sistem manajemen keuangan terintegrasi berbasis web untuk perusahaan.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **State Management**: Zustand
- **Charts**: Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM 7
- **Authentication**: JWT (jose) + bcrypt

## Prerequisites

- Node.js 20+
- PostgreSQL 15+

## Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
npm run db:push

# Seed demo data
npm run db:seed

# Run development server
npm run dev
```

## Demo Accounts

| Email | Password | Role |
|---|---|---|
| admin@finsheet.com | password123 | Super Admin |
| keuangan@finsheet.com | password123 | Admin Keuangan |
| manajer@finsheet.com | password123 | Manajer |
| viewer@finsheet.com | password123 | Viewer |

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:migrate` | Run database migrations |

## Features

- Dashboard keuangan dengan grafik real-time
- Pencatatan transaksi pemasukan & pengeluaran (CRUD)
- Manajemen anggaran per kategori
- Manajemen kategori transaksi
- Laporan keuangan (Laba Rugi, Arus Kas, Ringkasan Kategori, Rincian Transaksi)
- Ekspor laporan ke CSV
- Manajemen pengguna dengan RBAC (4 role)
- Floating quick action button
- Notifikasi in-app
- Responsive design
