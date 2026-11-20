# Spesifikasi Sistem Administrasi Perpustakaan PustakaMaya

Dokumen ini merangkum kebutuhan fungsional dan rancangan awal PustakaMaya sebagai aplikasi administrasi perpustakaan berbasis web. Dokumen berfungsi sebagai acuan produk dan implementasi; fitur-fitur di dalamnya merupakan target pengembangan, bukan pernyataan bahwa fitur tersebut sudah tersedia.

## 1. Ringkasan Produk

PustakaMaya membantu perpustakaan mengelola koleksi, anggota, sirkulasi, pengadaan, inventaris, dan pelaporan dalam satu sistem. Sistem ditujukan untuk penggunaan oleh petugas melalui web dan dapat dikembangkan untuk menyediakan katalog publik bagi anggota.

### Tujuan

- Menyatukan data bibliografi dan setiap eksemplar fisik agar mudah ditelusuri.
- Mempercepat proses peminjaman, pengembalian, perpanjangan, dan reservasi.
- Menjaga akurasi status koleksi serta riwayat transaksi.
- Memberikan kontrol akses, jejak audit, dan laporan operasional yang dapat dipertanggungjawabkan.
- Menyediakan fondasi yang dapat dikembangkan untuk beberapa cabang dan koleksi digital.

### Prinsip rancangan

1. **Satu sumber data:** transaksi sirkulasi selalu mengacu pada anggota dan eksemplar yang valid.
2. **Riwayat terjaga:** transaksi yang sudah diproses tidak dihapus; koreksi dilakukan melalui pembatalan atau penyesuaian tercatat.
3. **Akses minimum:** setiap pengguna hanya memperoleh izin yang diperlukan untuk tugasnya.
4. **Aturan dapat dikonfigurasi:** kebijakan pinjaman dan denda ditentukan per jenis anggota atau kategori koleksi, bukan tersebar sebagai nilai tetap di antarmuka.
5. **Status eksplisit:** perubahan status koleksi dan transaksi mengikuti alur yang tervalidasi.

## 2. Batasan dan Asumsi

- Aplikasi awal menggunakan Next.js. Pilihan basis data, penyedia autentikasi, dan infrastruktur produksi belum ditetapkan.
- PustakaMaya pada tahap pertama berfokus pada administrasi satu perpustakaan; model data sebaiknya mendukung cabang jika fitur multi-cabang diperlukan.
- Pembayaran denda dicatat oleh petugas. Integrasi pembayaran daring merupakan pengembangan lanjutan.
- Barcode/QR, notifikasi surel/WhatsApp, dan impor data dapat ditambahkan melalui integrasi terpisah.
- Kebijakan masa pinjam, batas pinjaman, denda, dan masa tenggang harus dapat disesuaikan dengan aturan tiap perpustakaan.

## 3. Peran dan Hak Akses

Hak akses harus diperiksa di sisi server untuk setiap operasi, bukan hanya dengan menyembunyikan tombol di antarmuka.

| Peran | Tanggung jawab utama |
| --- | --- |
| Administrator sistem | Mengelola akun petugas, peran, konfigurasi, cabang, kategori, dan kebijakan. |
| Kepala perpustakaan | Meninjau dashboard, laporan, persetujuan, serta audit operasional. |
| Petugas sirkulasi | Mengelola pendaftaran anggota dan transaksi pinjam, kembali, perpanjang, reservasi, serta pembayaran denda. |
| Pustakawan/kataloger | Mengelola data bibliografi, klasifikasi, eksemplar, dan kondisi koleksi. |
| Petugas pengadaan | Mengelola usulan, pemasok, pesanan, penerimaan, dan sumber perolehan. |
| Auditor/pembaca laporan | Melihat data dan laporan yang diizinkan tanpa mengubah transaksi. |
| Anggota | Mencari katalog, melihat pinjaman sendiri, memperpanjang jika memenuhi syarat, dan mengelola reservasi. |

Administrator dapat menetapkan izin lebih rinci, misalnya `catalog.read`, `catalog.write`, `circulation.checkout`, `circulation.override`, `members.manage`, `finance.record`, `reports.export`, dan `settings.manage`. Aksi sensitif seperti menghapus data master, mengubah denda, atau mengesampingkan blokir harus dibatasi dan dicatat.

## 4. Modul dan Kebutuhan Fungsional

### 4.1 Dashboard

- Menampilkan ringkasan koleksi aktif, anggota aktif, pinjaman berjalan, keterlambatan, reservasi menunggu, dan transaksi hari ini.
- Menyediakan daftar tugas yang perlu ditindaklanjuti, seperti jatuh tempo hari ini, antrean reservasi, dan pesanan belum diterima.
- Memungkinkan penyaringan berdasarkan rentang tanggal dan cabang bagi pengguna yang berwenang.
- Setiap angka ringkasan dapat ditelusuri ke daftar data sumbernya.

### 4.2 Katalog dan koleksi

- Mengelola rekaman bibliografi: judul, subjudul, pengarang, penerbit, tahun, edisi, ISBN/ISSN, bahasa, deskripsi, subjek, dan klasifikasi.
- Memisahkan rekaman bibliografi dari eksemplar. Satu judul dapat memiliki banyak eksemplar dengan barcode, lokasi, sumber perolehan, harga, kondisi, dan status masing-masing.
- Mendukung pencarian gabungan berdasarkan judul, pengarang, ISBN, subjek, nomor klasifikasi, atau barcode.
- Mendukung filter kategori, jenis media, bahasa, cabang, lokasi rak, dan ketersediaan.
- Menyediakan impor/ekspor dengan validasi, pratinjau kesalahan, dan hasil proses yang dapat diunduh.
- Memiliki status eksemplar minimal: `available`, `on_loan`, `reserved`, `in_processing`, `repair`, `lost`, dan `withdrawn`.
- Perubahan data bibliografi dan eksemplar penting dicatat dalam riwayat perubahan.

### 4.3 Keanggotaan

- Mencatat nomor anggota unik, nama, kontak, alamat, tanggal lahir bila diperlukan, jenis anggota, cabang asal, tanggal bergabung, masa berlaku, dan status.
- Mendukung status `pending`, `active`, `suspended`, `expired`, dan `closed`.
- Menampilkan ringkasan pinjaman, reservasi, tunggakan, dan riwayat transaksi anggota kepada petugas berwenang.
- Menyimpan persetujuan dan data pribadi seminimal mungkin sesuai kebutuhan perpustakaan.
- Mendukung pencarian, impor anggota, cetak kartu, perpanjangan keanggotaan, dan perubahan jenis anggota.
- Penonaktifan anggota tidak menghapus riwayat transaksi; sistem memberi peringatan jika masih ada pinjaman atau kewajiban terbuka.

### 4.4 Sirkulasi: peminjaman

Alur dasar:

1. Petugas mengidentifikasi anggota melalui nomor anggota atau pencarian.
2. Sistem memeriksa status keanggotaan, masa berlaku, batas pinjaman, pinjaman terlambat, dan blokir.
3. Petugas memindai atau memasukkan barcode eksemplar.
4. Sistem memastikan eksemplar tersedia, sesuai cabang/kebijakan, dan tidak sedang dialokasikan ke reservasi anggota lain.
5. Sistem membuat transaksi, menetapkan waktu pinjam dan jatuh tempo dari kebijakan yang berlaku, lalu mengubah status eksemplar menjadi `on_loan`.
6. Sistem menampilkan bukti transaksi dan, jika diaktifkan, mengirim pemberitahuan.

Transaksi harus atomik: dua petugas tidak boleh berhasil meminjamkan eksemplar yang sama secara bersamaan.

### 4.5 Sirkulasi: pengembalian dan perpanjangan

- Pengembalian mencatat waktu penerimaan, petugas, kondisi eksemplar, dan denda yang dihitung menurut kebijakan.
- Pengembalian ke cabang berbeda dapat dicatat bila kebijakan mengizinkan; status transit perlu ditambahkan jika ada perpindahan fisik.
- Eksemplar yang rusak atau hilang dialihkan ke alur penanganan, tidak otomatis kembali menjadi tersedia.
- Perpanjangan memeriksa batas perpanjangan, reservasi aktif oleh anggota lain, status anggota, dan kebijakan jenis koleksi.
- Perpanjangan mencatat tanggal jatuh tempo lama dan baru, waktu, pelaku, dan alasan bila ada pengesampingan.
- Petugas berwenang dapat mencatat pengecualian, tetapi wajib menyertakan alasan dan jejak audit.

### 4.6 Reservasi dan antrean

- Anggota dapat mengantre untuk judul atau eksemplar sesuai kebijakan.
- Antrean mempunyai urutan yang konsisten, waktu dibuat, masa berlaku pengambilan, serta status `queued`, `ready`, `fulfilled`, `cancelled`, atau `expired`.
- Saat eksemplar tersedia, sistem menawarkan eksemplar kepada reservasi terdepan yang memenuhi syarat.
- Reservasi kedaluwarsa secara otomatis setelah batas pengambilan; sistem mencatat perubahan dan menawarkan kepada pemesan berikutnya.
- Petugas dapat membatalkan reservasi dengan alasan yang tercatat.

### 4.7 Denda dan pembayaran

- Denda keterlambatan dihitung dari tanggal jatuh tempo, waktu pengembalian, masa tenggang, tarif, batas maksimum, dan jenis koleksi sesuai kebijakan.
- Sistem menyimpan rincian perhitungan sehingga nilai tagihan dapat dijelaskan dan diaudit.
- Petugas mencatat pembayaran sebagian atau penuh, waktu, nominal, metode, nomor referensi, dan penerima pembayaran.
- Penghapusan/pengurangan denda memerlukan izin khusus, alasan, dan pencatatan nilai sebelum serta sesudah.
- Status kewajiban minimal: `unpaid`, `partially_paid`, `paid`, `waived`, dan `disputed`.
- Pembayaran tercatat tidak boleh dihapus; koreksi dilakukan melalui transaksi pembalik yang terhubung.

### 4.8 Pengadaan dan penerimaan

- Mencatat usulan pengadaan, prioritas, pengusul, pemasok, penawaran, pesanan, dan sumber dana.
- Alur status pesanan: `draft`, `submitted`, `approved`, `ordered`, `partially_received`, `received`, `cancelled`.
- Penerimaan memperbarui jumlah eksemplar dan mencatat harga, nomor faktur, tanggal, kondisi, serta sumber perolehan.
- Mendukung sumber koleksi selain pembelian, seperti hibah, tukar-menukar, dan deposit.
- Pembatalan/penyesuaian pengadaan membutuhkan alasan dan tercatat pada audit.

### 4.9 Inventaris dan pemeliharaan

- Menyediakan stock opname per cabang/lokasi dengan daftar eksemplar yang diharapkan dan hasil pemindaian.
- Mencatat hasil sebagai ditemukan, tidak ditemukan, salah lokasi, rusak, atau perlu verifikasi.
- Perbedaan inventaris tidak langsung menghapus eksemplar; petugas menyelesaikan dan menyetujui hasil pemeriksaan.
- Menyediakan riwayat kondisi, perbaikan, kehilangan, penarikan, dan penggantian eksemplar.

### 4.10 Laporan

Laporan operasional yang disarankan:

- Pinjaman aktif, jatuh tempo, terlambat, dan riwayat sirkulasi.
- Denda terbentuk, pembayaran, pengurangan, dan saldo kewajiban.
- Koleksi menurut kategori, status, lokasi, usia terbit, dan frekuensi peminjaman.
- Anggota aktif, kedaluwarsa, pertumbuhan anggota, dan anggota tidak aktif.
- Reservasi dan waktu tunggu.
- Pengadaan, penerimaan, dan nilai pengeluaran.
- Hasil stock opname dan perubahan inventaris.
- Aktivitas pengguna dan perubahan data.

Laporan mendukung rentang tanggal, cabang, ekspor CSV, dan kontrol izin. Ekspor berskala besar harus dibatasi, dicatat, dan tidak memuat data pribadi yang tidak diperlukan.

### 4.11 Pengaturan dan administrasi

- Mengelola cabang, lokasi/rak, kategori, jenis media, jenis anggota, pemasok, dan kalender operasional.
- Mengelola kebijakan sirkulasi dengan tanggal mulai berlaku dan riwayat versi.
- Mengelola akun, peran, izin, status akun, dan mekanisme pemulihan akses.
- Mengatur format nomor anggota/barcode, zona waktu, bahasa, dan kanal notifikasi.
- Perubahan konfigurasi penting hanya berlaku untuk transaksi baru, kecuali aturan secara eksplisit menentukan penerapan ulang.

### 4.12 Katalog anggota

Jika portal anggota diaktifkan:

- Anggota dapat mencari dan melihat informasi ketersediaan tanpa melihat data pribadi anggota lain.
- Anggota dapat melihat pinjaman dan kewajibannya sendiri serta meminta perpanjangan atau reservasi.
- Sistem memberi alasan yang mudah dipahami saat tindakan tidak memenuhi syarat.
- Riwayat pribadi hanya tersedia setelah autentikasi dan pemeriksaan kepemilikan data.

## 5. Aturan Bisnis Inti

1. Nomor anggota, barcode eksemplar, dan identitas akun harus unik dalam cakupan yang ditetapkan.
2. Rekaman bibliografi boleh tidak memiliki eksemplar, tetapi peminjaman selalu merujuk ke satu eksemplar fisik yang valid.
3. Eksemplar hanya dapat berada dalam satu keadaan operasional pada satu waktu.
4. Eksemplar berstatus dipinjam, rusak, hilang, atau ditarik tidak dapat dipinjamkan.
5. Anggota yang tidak aktif, kedaluwarsa, atau diblokir tidak dapat melakukan transaksi baru kecuali terdapat pengecualian dengan izin khusus dan alasan.
6. Jatuh tempo dan denda dihitung berdasarkan kebijakan yang tersimpan beserta versinya; perubahan kebijakan tidak mengubah transaksi lama secara diam-diam.
7. Transaksi yang telah diselesaikan tidak dihapus. Koreksi mempertahankan keterlacakan pelaku, waktu, alasan, dan data sebelumnya.
8. Operasi sirkulasi dan pembayaran harus konsisten meskipun terjadi permintaan bersamaan atau kegagalan jaringan.
9. Penghapusan rekaman master dibatasi jika rekaman telah dipakai transaksi; gunakan pengarsipan/nonaktifkan sebagai gantinya.
10. Waktu disimpan secara konsisten (disarankan UTC) dan ditampilkan dalam zona waktu perpustakaan.

## 6. Model Data Konseptual

Entitas inti yang disarankan:

| Entitas | Isi utama dan relasi |
| --- | --- |
| `User` | Akun petugas/anggota, status, kredensial eksternal atau referensi autentikasi. |
| `Role`, `Permission`, `UserRole` | Peran dan izin; satu akun dapat memiliki beberapa peran sesuai kebijakan. |
| `Branch`, `Location` | Cabang dan lokasi/rak; eksemplar terkait ke lokasi. |
| `Member` | Profil keanggotaan, nomor unik, jenis, status, dan masa berlaku. |
| `BibliographicRecord` | Metadata judul yang dapat memiliki banyak eksemplar. |
| `Copy` | Eksemplar fisik, barcode, kondisi, lokasi, status, dan sumber perolehan. |
| `Loan` | Satu periode peminjaman anggota atas satu eksemplar. |
| `LoanEvent` | Peristiwa checkout, return, renew, atau koreksi yang membentuk riwayat pinjaman. |
| `Reservation` | Antrean anggota terhadap judul/eksemplar dengan status dan masa berlaku. |
| `CirculationPolicy` | Aturan menurut jenis anggota, koleksi, cabang, dan periode berlaku. |
| `Fine`, `Payment` | Tagihan, rincian kalkulasi, pembayaran, dan transaksi pembalik. |
| `Acquisition`, `Supplier`, `Receiving` | Usulan/pesanan, pemasok, dan penerimaan koleksi. |
| `InventorySession`, `InventoryScan` | Sesi stock opname dan hasil pemindaian tiap eksemplar. |
| `AuditLog` | Pelaku, waktu, aksi, entitas, perubahan, alasan, dan konteks permintaan. |
| `Notification` | Kanal, tujuan, isi/template, status pengiriman, dan waktu percobaan. |

Setiap entitas transaksi sebaiknya memiliki identitas stabil, waktu pembuatan/perubahan, dan referensi pelaku. Gunakan kendala unik, foreign key, transaksi basis data, serta indeks pada kolom pencarian dan filter yang sering digunakan. Struktur final menyesuaikan pilihan basis data dan kebutuhan operasional.

## 7. Alur Status Eksemplar

Alur umum:

```text
in_processing -> available -> on_loan -> available
                         \-> reserved -> on_loan
available / on_loan -> repair -> available
available / on_loan -> lost
available / repair -> withdrawn
```

Transisi harus divalidasi oleh layanan domain. Pengembalian dapat membawa eksemplar ke `available`, `reserved`, `repair`, atau `lost` berdasarkan hasil pemeriksaan dan antrean reservasi; status tidak ditentukan hanya dari halaman pengguna.

## 8. Kebutuhan Nonfungsional

### Keamanan dan privasi

- Autentikasi yang aman, pembatasan percobaan masuk, pengelolaan sesi, dan pemulihan akun yang terkendali.
- Otorisasi server-side dan pemeriksaan kepemilikan untuk semua data anggota.
- Validasi input, perlindungan terhadap CSRF/XSS/injeksi sesuai pola framework, dan penggunaan query terparameterisasi.
- TLS saat transit, penyimpanan rahasia di environment/secret manager, dan enkripsi cadangan.
- Audit untuk autentikasi, perubahan izin, transaksi keuangan, pengesampingan kebijakan, ekspor, dan perubahan data.
- Retensi serta penghapusan data pribadi mengikuti kebijakan organisasi dan kewajiban hukum yang berlaku.

### Keandalan dan kinerja

- Operasi yang mengubah status koleksi menggunakan transaksi dan penanganan konflik.
- Pencarian katalog mendukung pagination dan tidak memuat seluruh koleksi sekaligus.
- Pekerjaan berat seperti impor, ekspor, dan notifikasi dapat dijalankan secara asinkron.
- Kegagalan layanan eksternal tidak boleh membatalkan transaksi inti yang sudah berhasil; status pengiriman dicatat dan dapat dicoba ulang.
- Sediakan backup terjadwal, prosedur pemulihan, pemantauan, dan log aplikasi tanpa kredensial atau data pribadi berlebihan.

### Aksesibilitas dan penggunaan

- Antarmuka responsif untuk desktop dan tablet, dengan alur pemindaian yang efisien.
- Formulir memiliki label, pesan validasi yang jelas, navigasi keyboard, dan kontras memadai.
- Tindakan berisiko memiliki konfirmasi dan ringkasan dampak.
- Bahasa utama antarmuka adalah Bahasa Indonesia; format tanggal, angka, dan zona waktu konsisten.

## 9. Rancangan Antarmuka dan Navigasi

Navigasi petugas yang disarankan:

```text
Dashboard
Sirkulasi
  - Peminjaman
  - Pengembalian
  - Reservasi
Anggota
Katalog
  - Bibliografi
  - Eksemplar
Pengadaan
Inventaris
Laporan
Administrasi
  - Pengguna dan peran
  - Kebijakan
  - Cabang dan lokasi
  - Pengaturan
```

Halaman daftar sebaiknya menyediakan pencarian, filter, pagination, status kosong, indikator pemuatan, dan pesan kesalahan. Formulir transaksi perlu mengutamakan input barcode dan konfirmasi hasil sebelum transaksi disimpan.

## 10. API dan Batas Layanan

Implementasi dapat menggunakan route handler/server action Next.js atau backend terpisah. Apa pun pilihannya:

- Antarmuka browser tidak boleh menjadi satu-satunya lapisan validasi atau otorisasi.
- Kelompok operasi mengikuti domain seperti `catalog`, `members`, `circulation`, `acquisitions`, `inventory`, `reports`, dan `administration`.
- Perintah perubahan status menggunakan validasi input dan mengembalikan hasil/error yang terstruktur.
- Operasi yang dapat dikirim ulang (misalnya checkout setelah timeout) sebaiknya mendukung kunci idempotensi.
- Endpoint daftar mendukung pagination, filter yang diizinkan, dan batas ukuran hasil.
- Perubahan kontrak API didokumentasikan dan diuji terhadap alur utama.

## 11. Tahapan Implementasi

### Tahap 1 — Fondasi

- Tetapkan kebutuhan bisnis, kebijakan awal, dan pilihan penyimpanan data.
- Bangun autentikasi, peran/izin, struktur cabang, audit dasar, dan validasi server.
- Siapkan desain navigasi serta komponen antarmuka yang aksesibel.

### Tahap 2 — Operasi inti

- Katalog bibliografi dan eksemplar.
- Pendaftaran anggota.
- Peminjaman, pengembalian, perpanjangan, dan status koleksi.
- Pencarian katalog internal dan dashboard dasar.

### Tahap 3 — Layanan anggota dan keuangan

- Reservasi dan antrean.
- Perhitungan denda, pencatatan pembayaran, dan bukti transaksi.
- Riwayat anggota, pemberitahuan, serta portal anggota.

### Tahap 4 — Operasi lanjutan

- Pengadaan, penerimaan, dan pemasok.
- Stock opname, pemeliharaan, dan penanganan koleksi hilang.
- Laporan lanjutan, ekspor, dan dukungan lintas cabang.

Setiap tahap harus memiliki migrasi basis data yang dapat ditinjau, pengujian otomatis, dokumentasi operasional, dan prosedur pemulihan sebelum dipakai pada data produksi.

## 12. Kriteria Penerimaan Alur Prioritas

- Petugas dapat meminjamkan eksemplar yang tersedia kepada anggota aktif; sistem menolak anggota yang tidak memenuhi kebijakan dengan alasan yang jelas.
- Dua permintaan serentak untuk satu eksemplar tidak menghasilkan dua pinjaman aktif.
- Pengembalian memperbarui pinjaman dan status eksemplar secara konsisten serta menghasilkan perhitungan denda yang dapat ditelusuri.
- Perpanjangan ditolak saat batas kebijakan tercapai atau terdapat reservasi yang menghalangi.
- Anggota hanya dapat melihat data miliknya sendiri melalui portal.
- Setiap perubahan sensitif menyimpan pelaku, waktu, aksi, dan alasan bila diperlukan.
- Daftar katalog besar tetap dapat dicari dan ditelusuri melalui pagination.
- Ekspor laporan dan perubahan izin hanya dapat dilakukan oleh pengguna dengan izin yang sesuai.

## 13. Hal yang Perlu Diputuskan Sebelum Produksi

- Basis data dan strategi migrasi/cadangan.
- Penyedia autentikasi dan kebijakan akun anggota.
- Kebijakan pinjaman per kategori dan jenis anggota, termasuk kalender libur, masa tenggang, denda, serta batas pinjaman.
- Kebutuhan satu atau beberapa cabang dan aturan peminjaman lintas cabang.
- Kebutuhan barcode/QR, perangkat pemindai, dan format label.
- Kanal notifikasi dan pengelolaan persetujuan komunikasi.
- Format impor data lama dan standar klasifikasi katalog.
- Retensi data, prosedur audit, dan kebijakan pemulihan bencana.
