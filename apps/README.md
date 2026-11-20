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
