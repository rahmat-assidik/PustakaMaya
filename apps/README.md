# PustakaMaya

Aplikasi ini menggunakan Next.js dengan runtime Node.js sebagai backend dan PostgreSQL sebagai database.

## Persiapan

- Node.js 20.9 atau lebih baru
- PostgreSQL yang sedang berjalan

Install dependensi:

```bash
npm install
```

Buat database PostgreSQL bernama `pustakamaya`, lalu siapkan konfigurasi lokal:

```bash
cp .env.example .env.local
```

Ubah `DATABASE_URL` di `.env.local` sesuai kredensial dan alamat PostgreSQL Anda. Jangan commit file `.env.local`.

## Menjalankan aplikasi

```bash
npm run dev
```

Endpoint `GET /api/health` memeriksa koneksi database. Endpoint mengembalikan HTTP 200 jika database dapat diakses dan HTTP 503 jika koneksi atau konfigurasi database bermasalah.

## Antarmuka

Antarmuka menggunakan shadcn/ui, Tailwind CSS 4, dan font Geist. Halaman yang tersedia:

- `/` — dashboard dan ringkasan operasional
- `/circulation` — peminjaman, pengembalian, pinjaman, reservasi, serta denda
- `/members` dan `/catalog` — keanggotaan, bibliografi, dan eksemplar
- `/acquisitions` dan `/inventory` — pengadaan, penerimaan, serta stock opname
- `/reports` dan `/administration` — laporan, pengguna, kebijakan, izin, cabang, dan audit
- `/portal` — pratinjau portal anggota

Komponen shadcn/ui tambahan dapat dibuat dari direktori aplikasi dengan `npx shadcn add <nama-komponen>`.

**Catatan:** halaman saat ini menggunakan data contoh. Beberapa formulir hanya mengubah pratinjau lokal dan belum menulis ke PostgreSQL; portal anggota juga belum memiliki autentikasi. Jangan gunakan data pratinjau sebagai catatan operasional.
