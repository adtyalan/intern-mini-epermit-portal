# Mini E-Permit Portal

Mini E-Permit adalah purwarupa (prototipe) aplikasi web sederhana untuk mengelola pengajuan izin kerja berbasis hak akses (**Role-Based Access Control - RBAC**). 

Sistem ini membedakan peran antara **User (Pemohon)** yang mengajukan izin kerja, dan **Admin (Penyetuju)** yang menyetujui atau menolak izin kerja yang diajukan.

---

## 🛠️ Stack Teknologi

Aplikasi ini dibangun menggunakan tumpukan teknologi modern:
- **Frontend & Backend API:** Next.js (App Router)
- **Database & ORM:** PostgreSQL dengan Prisma ORM 7
- **Database Serverless:** Neon Database
- **Data Fetching:** SWR
- **Styling:** Premium Vanilla CSS dengan arsitektur HSL modern dan Glassmorphism

---

## 📐 Arsitektur & Kepatuhan Aturan Teknis

Aplikasi ini dibangun dengan kepatuhan tinggi terhadap spesifikasi yang ketat:
1. **Struktur Direktori Tanpa Folder `src`:** Semua komponen, utilitas, konfigurasi database, dan rute Next.js diletakkan langsung di *root directory* (seperti `/app`, `/prisma`, `/lib`, dan `/public`).
2. **Proteksi Sesi & RBAC via `proxy.ts`:** Menggunakan file konfigurasi filter `proxy.ts` di root directory, menggantikan peran `middleware.ts`.
3. **Kompatibilitas Prisma 7:** Menggunakan fitur-fitur mutakhir Prisma 7, seperti pendefinisian datasource `url` di file `prisma.config.ts` (bukan di dalam file `schema.prisma`).
4. **Clean Code & Bebas Komentar:** Seluruh berkas kode sumber bersih total dari komentar non-fungsional, komentar pengembangan, atau baris kode mati untuk menjaga kerapian arsitektur tim.

---

## 🔑 Akun Pengujian (Testing Accounts)

Kredensial bawaan berikut telah disediakan melalui skrip database seeder untuk memudahkan uji coba:

| Peran (Role) | Username | Password | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Dapat melihat seluruh izin & menyetujui/menolak pengajuan |
| **User 1** | `user1` | `user123` | Dapat membuat pengajuan & melihat izin miliknya sendiri |
| **User 2** | `user2` | `user123` | Dapat membuat pengajuan & melihat izin miliknya sendiri |

---

## 🚀 Panduan Instalasi & Cara Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal:

### 1. Kloning Repositori
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file bernama `.env` di root directory Anda dan masukkan konfigurasi berikut (silakan ganti dengan URL database PostgreSQL Anda sendiri):
```env
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]?sslmode=require"
JWT_SECRET="ganti-dengan-jwt-secret-anda"
```

### 4. Jalankan Migrasi Database
Untuk menyinkronkan skema database PostgreSQL Anda dengan model Prisma 7, jalankan perintah:
```bash
npx prisma migrate dev
```

### 5. Jalankan Database Seeding
Untuk memasukkan data akun dummy pengujian (Admin & User) ke dalam database, jalankan perintah:
```bash
npx prisma db seed
```

### 6. Jalankan Server Pengembangan (Local Development)
Jalankan perintah berikut untuk mengaktifkan server lokal:
```bash
npm run dev
```
Setelah aktif, buka browser Anda di [http://localhost:3000](http://localhost:3000).

---

## 📋 Kriteria Fitur yang Diuji

- **Autentikasi & Sesi:** Proses login cepat menggunakan database seeder kredensial.
- **Halaman User:** 
  - Form interaktif pembuatan izin kerja baru (Judul Pekerjaan, Deskripsi, Tanggal).
  - Tabel pemantauan status pengajuan secara real-time (`PENDING`, `APPROVED`, `REJECTED`).
- **Halaman Admin:**
  - Dashboard pemantauan seluruh data izin yang diajukan oleh semua pemohon.
  - Aksi instan berupa tombol **Setujui (Approve)** dan **Tolak (Reject)** untuk mengubah status izin secara real-time.
