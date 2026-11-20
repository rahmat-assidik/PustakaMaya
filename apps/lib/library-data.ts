import type { DataRow } from "@/components/data-table";

export const membersData: DataRow[] = [
  { nomor: "PM-240981", nama: "Nadia Putri", kategori: "Mahasiswa", cabang: "Banyuwangi", pinjaman: "3", saldo: "Rp0", status: "Aktif" },
  { nomor: "PM-240978", nama: "Rizky Maulana", kategori: "Umum", cabang: "Banyuwangi", pinjaman: "2", saldo: "Rp12.000", status: "Perlu perhatian" },
  { nomor: "PM-240964", nama: "Siti Rahmawati", kategori: "Pelajar", cabang: "Genteng", pinjaman: "1", saldo: "Rp0", status: "Aktif" },
  { nomor: "PM-240953", nama: "Dimas Pratama", kategori: "Mahasiswa", cabang: "Rogojampi", pinjaman: "4", saldo: "Rp0", status: "Aktif" },
  { nomor: "PM-240942", nama: "Alya Safitri", kategori: "Pelajar", cabang: "Banyuwangi", pinjaman: "0", saldo: "Rp0", status: "Aktif" },
  { nomor: "PM-240933", nama: "Bagas Wicaksono", kategori: "Umum", cabang: "Genteng", pinjaman: "2", saldo: "Rp6.000", status: "Perlu perhatian" },
  { nomor: "PM-240927", nama: "Nabila Azzahra", kategori: "Mahasiswa", cabang: "Banyuwangi", pinjaman: "1", saldo: "Rp0", status: "Aktif" },
  { nomor: "PM-240916", nama: "Fajar Hidayat", kategori: "Pelajar", cabang: "Rogojampi", pinjaman: "0", saldo: "Rp0", status: "Aktif" },
  { nomor: "PM-240905", nama: "Intan Permata", kategori: "Umum", cabang: "Banyuwangi", pinjaman: "2", saldo: "Rp0", status: "Aktif" },
  { nomor: "PM-240899", nama: "Yusuf Firmansyah", kategori: "Mahasiswa", cabang: "Genteng", pinjaman: "1", saldo: "Rp18.000", status: "Perlu perhatian" },
];

export const bibliographyData: DataRow[] = [
  { judul: "Laut Bercerita", pengarang: "Leila S. Chudori", kategori: "Fiksi Indonesia", tahun: "2017", eksemplar: "12", tersedia: "9", status: "Tersedia" },
  { judul: "Filosofi Teras", pengarang: "Henry Manampiring", kategori: "Pengembangan diri", tahun: "2018", eksemplar: "8", tersedia: "3", status: "Dipinjam" },
  { judul: "Bumi Manusia", pengarang: "Pramoedya A. Toer", kategori: "Sastra klasik", tahun: "1980", eksemplar: "10", tersedia: "7", status: "Tersedia" },
  { judul: "Atomic Habits", pengarang: "James Clear", kategori: "Pengembangan diri", tahun: "2018", eksemplar: "6", tersedia: "0", status: "Dipinjam" },
  { judul: "Laskar Pelangi", pengarang: "Andrea Hirata", kategori: "Fiksi Indonesia", tahun: "2005", eksemplar: "14", tersedia: "10", status: "Tersedia" },
  { judul: "Sapiens", pengarang: "Yuval Noah Harari", kategori: "Sejarah", tahun: "2011", eksemplar: "5", tersedia: "2", status: "Tersedia" },
  { judul: "Pulang", pengarang: "Tere Liye", kategori: "Fiksi Indonesia", tahun: "2015", eksemplar: "7", tersedia: "5", status: "Tersedia" },
  { judul: "The Psychology of Money", pengarang: "Morgan Housel", kategori: "Ekonomi", tahun: "2020", eksemplar: "4", tersedia: "1", status: "Tersedia" },
];

export const copiesData: DataRow[] = [
  { barcode: "BK-0001842", judul: "Laut Bercerita", lokasi: "Rak F-02", cabang: "Banyuwangi", kondisi: "Baik", status: "Tersedia" },
  { barcode: "BK-0001843", judul: "Laut Bercerita", lokasi: "Rak F-02", cabang: "Banyuwangi", kondisi: "Baik", status: "Dipinjam" },
  { barcode: "BK-0001790", judul: "Filosofi Teras", lokasi: "Rak P-01", cabang: "Banyuwangi", kondisi: "Baik", status: "Reservasi" },
  { barcode: "BK-0001658", judul: "Bumi Manusia", lokasi: "Rak S-03", cabang: "Genteng", kondisi: "Perlu perbaikan", status: "Perbaikan" },
  { barcode: "BK-0001944", judul: "Laskar Pelangi", lokasi: "Rak F-01", cabang: "Rogojampi", kondisi: "Baik", status: "Tersedia" },
  { barcode: "BK-0002011", judul: "Atomic Habits", lokasi: "Rak P-02", cabang: "Banyuwangi", kondisi: "Baik", status: "Dipinjam" },
];

export const loansData: DataRow[] = [
  { transaksi: "TRX-2026-08142", anggota: "Nadia Putri · PM-240981", judul: "Laut Bercerita", dipinjam: "12 Nov 2026", jatuhTempo: "26 Nov 2026", status: "Berjalan" },
  { transaksi: "TRX-2026-08139", anggota: "Dimas Pratama · PM-240953", judul: "Bumi Manusia", dipinjam: "10 Nov 2026", jatuhTempo: "24 Nov 2026", status: "Berjalan" },
  { transaksi: "TRX-2026-08128", anggota: "Rizky Maulana · PM-240978", judul: "Filosofi Teras", dipinjam: "03 Nov 2026", jatuhTempo: "17 Nov 2026", status: "Terlambat" },
  { transaksi: "TRX-2026-08117", anggota: "Siti Rahmawati · PM-240964", judul: "Laskar Pelangi", dipinjam: "08 Nov 2026", jatuhTempo: "22 Nov 2026", status: "Berjalan" },
  { transaksi: "TRX-2026-08103", anggota: "Bagas Wicaksono · PM-240933", judul: "The Psychology of Money", dipinjam: "31 Okt 2026", jatuhTempo: "14 Nov 2026", status: "Terlambat" },
  { transaksi: "TRX-2026-08096", anggota: "Alya Safitri · PM-240942", judul: "Pulang", dipinjam: "09 Nov 2026", jatuhTempo: "23 Nov 2026", status: "Berjalan" },
  { transaksi: "TRX-2026-08085", anggota: "Nabila Azzahra · PM-240927", judul: "Sapiens", dipinjam: "05 Nov 2026", jatuhTempo: "19 Nov 2026", status: "Segera jatuh tempo" },
  { transaksi: "TRX-2026-08073", anggota: "Intan Permata · PM-240905", judul: "Atomic Habits", dipinjam: "07 Nov 2026", jatuhTempo: "21 Nov 2026", status: "Berjalan" },
];

export const reservationsData: DataRow[] = [
  { antrean: "RSV-00918", anggota: "Rizky Maulana", judul: "Atomic Habits", dibuat: "18 Nov 2026", berlaku: "24 Nov 2026", status: "Menunggu" },
  { antrean: "RSV-00916", anggota: "Nadia Putri", judul: "Filosofi Teras", dibuat: "17 Nov 2026", berlaku: "23 Nov 2026", status: "Siap diambil" },
  { antrean: "RSV-00912", anggota: "Yusuf Firmansyah", judul: "The Psychology of Money", dibuat: "15 Nov 2026", berlaku: "21 Nov 2026", status: "Siap diambil" },
  { antrean: "RSV-00907", anggota: "Intan Permata", judul: "Sapiens", dibuat: "14 Nov 2026", berlaku: "20 Nov 2026", status: "Menunggu" },
];

export const paymentsData: DataRow[] = [
  { referensi: "PAY-2026-00418", anggota: "Rizky Maulana", transaksi: "Denda keterlambatan", nominal: "Rp12.000", tanggal: "20 Nov 2026", status: "Lunas" },
  { referensi: "PAY-2026-00416", anggota: "Bagas Wicaksono", transaksi: "Denda keterlambatan", nominal: "Rp6.000", tanggal: "19 Nov 2026", status: "Lunas" },
  { referensi: "PAY-2026-00411", anggota: "Yusuf Firmansyah", transaksi: "Denda keterlambatan", nominal: "Rp18.000", tanggal: "18 Nov 2026", status: "Belum bayar" },
];

export const acquisitionsData: DataRow[] = [
  { nomor: "PO-2026-0091", pesanan: "Koleksi literasi digital", pemasok: "Penerbit Gramedia", tanggal: "18 Nov 2026", item: "24 judul · 48 eks.", nilai: "Rp8.450.000", status: "Menunggu" },
  { nomor: "PO-2026-0088", pesanan: "Pengayaan sastra Indonesia", pemasok: "Pustaka Jaya", tanggal: "15 Nov 2026", item: "18 judul · 32 eks.", nilai: "Rp5.180.000", status: "Dipesan" },
  { nomor: "PO-2026-0083", pesanan: "Paket referensi sekolah", pemasok: "Mitra Edukasi", tanggal: "12 Nov 2026", item: "12 judul · 20 eks.", nilai: "Rp3.760.000", status: "Parsial" },
  { nomor: "PO-2026-0079", pesanan: "Koleksi pengembangan diri", pemasok: "Penerbit Gramedia", tanggal: "08 Nov 2026", item: "16 judul · 24 eks.", nilai: "Rp4.920.000", status: "Diterima" },
  { nomor: "PO-2026-0074", pesanan: "Buku bacaan anak", pemasok: "Bintang Pustaka", tanggal: "02 Nov 2026", item: "20 judul · 40 eks.", nilai: "Rp6.200.000", status: "Diterima" },
];

export const inventoryData: DataRow[] = [
  { barcode: "BK-0001842", judul: "Laut Bercerita", lokasi: "F-02 · Banyuwangi", hasil: "Ditemukan", pemeriksa: "A. Rahman", waktu: "09.14" },
  { barcode: "BK-0001843", judul: "Laut Bercerita", lokasi: "F-02 · Banyuwangi", hasil: "Ditemukan", pemeriksa: "A. Rahman", waktu: "09.16" },
  { barcode: "BK-0001790", judul: "Filosofi Teras", lokasi: "P-01 · Banyuwangi", hasil: "Salah lokasi", pemeriksa: "D. Pratama", waktu: "09.18" },
  { barcode: "BK-0001658", judul: "Bumi Manusia", lokasi: "S-03 · Genteng", hasil: "Perlu verifikasi", pemeriksa: "S. Lestari", waktu: "09.21" },
  { barcode: "BK-0001944", judul: "Laskar Pelangi", lokasi: "F-01 · Rogojampi", hasil: "Ditemukan", pemeriksa: "A. Rahman", waktu: "09.24" },
  { barcode: "BK-0002011", judul: "Atomic Habits", lokasi: "P-02 · Banyuwangi", hasil: "Belum ditemukan", pemeriksa: "D. Pratama", waktu: "09.26" },
];

export const staffData: DataRow[] = [
  { nama: "Aditya Rahman", email: "aditya@pustakamaya.id", peran: "Administrator", cabang: "Banyuwangi", terakhirAktif: "Sekarang", status: "Aktif" },
  { nama: "Dewi Pratiwi", email: "dewi@pustakamaya.id", peran: "Petugas sirkulasi", cabang: "Banyuwangi", terakhirAktif: "09.42 hari ini", status: "Aktif" },
  { nama: "Siti Lestari", email: "siti@pustakamaya.id", peran: "Pustakawan", cabang: "Genteng", terakhirAktif: "Kemarin", status: "Aktif" },
  { nama: "Fajar Nugraha", email: "fajar@pustakamaya.id", peran: "Petugas pengadaan", cabang: "Rogojampi", terakhirAktif: "18 Nov 2026", status: "Aktif" },
  { nama: "Maya Anggraini", email: "maya@pustakamaya.id", peran: "Pembaca laporan", cabang: "Semua cabang", terakhirAktif: "15 Nov 2026", status: "Nonaktif" },
];

export const auditData: DataRow[] = [
  { waktu: "20 Nov 2026 · 09.42", pelaku: "Dewi Pratiwi", aksi: "Mencatat pengembalian", entitas: "TRX-2026-08128", hasil: "Berhasil" },
  { waktu: "20 Nov 2026 · 09.18", pelaku: "Aditya Rahman", aksi: "Memperbarui profil anggota", entitas: "PM-240978", hasil: "Berhasil" },
  { waktu: "20 Nov 2026 · 08.56", pelaku: "Siti Lestari", aksi: "Mengubah lokasi eksemplar", entitas: "BK-0001790", hasil: "Berhasil" },
  { waktu: "19 Nov 2026 · 16.30", pelaku: "Aditya Rahman", aksi: "Mengekspor laporan sirkulasi", entitas: "REP-2026-112", hasil: "Berhasil" },
  { waktu: "19 Nov 2026 · 14.08", pelaku: "Dewi Pratiwi", aksi: "Mencatat pembayaran denda", entitas: "PAY-2026-00416", hasil: "Berhasil" },
];
