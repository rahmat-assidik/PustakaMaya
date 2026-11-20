"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookCopy,
  Building2,
  Check,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileBarChart2,
  FileCheck2,
  FileSpreadsheet,
  History,
  Plus,
  ScanLine,
  ShieldCheck,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";
import { CsvExportButton } from "@/components/csv-export-button";
import { DataTable, type DataRow, type TableColumn } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { acquisitionsData, auditData, inventoryData, staffData } from "@/lib/library-data";

const acquisitionColumns: TableColumn[] = [
  { key: "nomor", label: "Nomor pesanan" },
  { key: "pesanan", label: "Nama pesanan" },
  { key: "pemasok", label: "Pemasok", muted: true },
  { key: "tanggal", label: "Tanggal" },
  { key: "item", label: "Koleksi", muted: true },
  { key: "nilai", label: "Nilai" },
  { key: "status", label: "Status", status: true },
];

const inventoryColumns: TableColumn[] = [
  { key: "barcode", label: "Barcode" },
  { key: "judul", label: "Judul" },
  { key: "lokasi", label: "Lokasi", muted: true },
  { key: "hasil", label: "Hasil pemeriksaan", status: true },
  { key: "pemeriksa", label: "Petugas", muted: true },
  { key: "waktu", label: "Waktu" },
];

const staffColumns: TableColumn[] = [
  { key: "nama", label: "Nama" },
  { key: "email", label: "Email", muted: true },
  { key: "peran", label: "Peran" },
  { key: "cabang", label: "Cabang", muted: true },
  { key: "terakhirAktif", label: "Terakhir aktif", muted: true },
  { key: "status", label: "Status", status: true },
];

const auditColumns: TableColumn[] = [
  { key: "waktu", label: "Waktu", muted: true },
  { key: "pelaku", label: "Pelaku" },
  { key: "aksi", label: "Aktivitas" },
  { key: "entitas", label: "Entitas" },
  { key: "hasil", label: "Hasil", status: true },
];

const supplierRows: DataRow[] = [
  { pemasok: "Penerbit Gramedia", kontak: "pengadaan@gramedia.id", kategori: "Buku umum", pesananAktif: "3", status: "Aktif" },
  { pemasok: "Pustaka Jaya", kontak: "mitra@pustakajaya.co.id", kategori: "Sastra & pendidikan", pesananAktif: "1", status: "Aktif" },
  { pemasok: "Mitra Edukasi", kontak: "sales@mitraedu.id", kategori: "Referensi sekolah", pesananAktif: "2", status: "Aktif" },
  { pemasok: "Bintang Pustaka", kontak: "info@bintangpustaka.id", kategori: "Buku anak", pesananAktif: "0", status: "Aktif" },
];
const supplierColumns: TableColumn[] = [
  { key: "pemasok", label: "Nama pemasok" },
  { key: "kontak", label: "Kontak", muted: true },
  { key: "kategori", label: "Kategori", muted: true },
  { key: "pesananAktif", label: "Pesanan aktif" },
  { key: "status", label: "Status", status: true },
];
const receivingRows: DataRow[] = [
  { penerimaan: "RCV-2026-0038", pesanan: "PO-2026-0083", pemasok: "Mitra Edukasi", diterima: "16 Nov 2026", eksemplar: "12 dari 20", status: "Parsial" },
  { penerimaan: "RCV-2026-0036", pesanan: "PO-2026-0079", pemasok: "Penerbit Gramedia", diterima: "14 Nov 2026", eksemplar: "24 dari 24", status: "Diterima" },
  { penerimaan: "RCV-2026-0032", pesanan: "PO-2026-0074", pemasok: "Bintang Pustaka", diterima: "10 Nov 2026", eksemplar: "40 dari 40", status: "Diterima" },
];
const receivingColumns: TableColumn[] = [
  { key: "penerimaan", label: "Nomor penerimaan" },
  { key: "pesanan", label: "Nomor pesanan", muted: true },
  { key: "pemasok", label: "Pemasok" },
  { key: "diterima", label: "Tanggal" },
  { key: "eksemplar", label: "Eksemplar", muted: true },
  { key: "status", label: "Status", status: true },
];

function PageNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-secondary/40 bg-secondary/15 px-3 py-2.5 text-xs leading-5 text-foreground">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export function AcquisitionsPage() {
  const [rows, setRows] = useState(acquisitionsData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderName, setOrderName] = useState("");

  function addOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!orderName.trim()) return;
    setRows([
      {
        nomor: `PO-2026-${String(92 + rows.length - acquisitionsData.length).padStart(4, "0")}`,
        pesanan: orderName.trim(),
        pemasok: "Belum dipilih",
        tanggal: "20 Nov 2026",
        item: "Belum ditentukan",
        nilai: "—",
        status: "Draft",
      },
      ...rows,
    ]);
    setOrderName("");
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengadaan"
        title="Pengadaan & penerimaan"
        description="Kelola usulan, pesanan pemasok, penerimaan koleksi, dan nilai pengeluaran."
        action={
          <>
            <Button variant="outline" className="h-9 gap-2"><ArrowDownToLine aria-hidden="true" className="size-4" />Ekspor</Button>
            <Button className="h-9 gap-2" onClick={() => setDialogOpen(true)}><Plus aria-hidden="true" className="size-4" />Buat pesanan</Button>
          </>
        }
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Belanja tahun berjalan" value="Rp184,6 jt" detail="dari pagu Rp240 jt" icon={ShoppingBasket} tint="blue" />
        <MetricCard label="Pesanan aktif" value="8" detail="2 menunggu persetujuan" icon={FileCheck2} tint="violet" />
        <MetricCard label="Menunggu diterima" value="92" detail="eksemplar dari 4 pesanan" icon={Clock3} tint="orange" />
        <MetricCard label="Penerimaan bulan ini" value="286" detail="eksemplar koleksi" icon={BookCopy} tint="green" />
      </section>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
        <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
          <Tabs defaultValue="orders">
            <div className="border-b border-border/70 px-4 pt-4">
              <TabsList className="mb-3 h-9">
                <TabsTrigger value="orders">Pesanan</TabsTrigger>
                <TabsTrigger value="receiving">Penerimaan</TabsTrigger>
                <TabsTrigger value="suppliers">Pemasok</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="orders" className="mt-0">
              <div className="px-5 py-4">
                <h2 className="text-sm font-semibold">Daftar pesanan pengadaan</h2>
                <p className="mt-1 text-xs text-muted-foreground">Tahap pesanan: draft, persetujuan, dipesan, hingga diterima.</p>
              </div>
              <DataTable rows={rows} columns={acquisitionColumns} searchPlaceholder="Cari pesanan atau pemasok..." />
            </TabsContent>
            <TabsContent value="receiving" className="mt-0">
              <div className="px-5 py-4">
                <h2 className="text-sm font-semibold">Penerimaan koleksi</h2>
                <p className="mt-1 text-xs text-muted-foreground">Catat jumlah, kondisi, harga, faktur, dan sumber perolehan.</p>
              </div>
              <DataTable rows={receivingRows} columns={receivingColumns} searchPlaceholder="Cari nomor penerimaan..." />
            </TabsContent>
            <TabsContent value="suppliers" className="mt-0">
              <div className="px-5 py-4">
                <h2 className="text-sm font-semibold">Direktori pemasok</h2>
                <p className="mt-1 text-xs text-muted-foreground">Pemasok yang dapat digunakan pada pesanan baru.</p>
              </div>
              <DataTable rows={supplierRows} columns={supplierColumns} searchPlaceholder="Cari nama atau kontak pemasok..." />
            </TabsContent>
          </Tabs>
        </Card>
        <div className="space-y-4">
          <Card className="gap-0 border-border/80 shadow-none">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base">Alur pengadaan</CardTitle>
              <p className="text-xs text-muted-foreground">Pesanan aktif menurut tahap proses</p>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              {[
                ["Menunggu persetujuan", "2 pesanan", 22],
                ["Dipesan ke pemasok", "3 pesanan", 46],
                ["Penerimaan parsial", "2 pesanan", 66],
                ["Selesai diterima", "1 pesanan", 84],
              ].map(([label, count, progress]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <Progress value={Number(progress)} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="gap-0 border-border/80 shadow-none">
            <CardContent className="p-5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                <FileSpreadsheet aria-hidden="true" className="size-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">Sumber perolehan</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Selain pembelian, catat koleksi hibah, tukar-menukar, dan deposit dengan asal perolehan yang terlacak.</p>
              <Button variant="link" className="mt-2 h-auto p-0 text-xs">Lihat kebijakan koleksi <ArrowRight aria-hidden="true" className="ml-1 size-3.5" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat pesanan pengadaan</DialogTitle>
            <DialogDescription>Mulai dari nama kebutuhan; detail pemasok dan anggaran dapat dilengkapi berikutnya.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addOrder} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium">Nama pesanan</span>
              <Input value={orderName} onChange={(event) => setOrderName(event.target.value)} placeholder="Contoh: Pengayaan koleksi sains" required />
            </label>
            <PageNote>Pesanan baru hanya ditambahkan pada tampilan pratinjau ini.</PageNote>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit">Buat draft</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function InventoryPage() {
  const [rows, setRows] = useState(inventoryData);
  const [barcode, setBarcode] = useState("");
  const [condition, setCondition] = useState("Ditemukan");
  const [error, setError] = useState("");
  const [scanned, setScanned] = useState(false);
  const progressValue = Math.min(100, Math.round((rows.length / 16) * 100));

  function scanItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!barcode.trim()) {
      setError("Masukkan atau pindai barcode terlebih dahulu.");
      return;
    }
    const foundCopy = inventoryData.find((item) => item.barcode === barcode.trim());
    setRows([
      {
        barcode: barcode.trim(),
        judul: foundCopy?.judul ?? "Belum terdaftar",
        lokasi: foundCopy?.lokasi ?? "Perlu verifikasi",
        hasil: condition,
        pemeriksa: "Aditya Rahman",
        waktu: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      },
      ...rows,
    ]);
    setBarcode("");
    setError("");
    setScanned(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventaris"
        title="Stock opname koleksi"
        description="Pindai eksemplar per cabang dan lokasi, lalu tinjau perbedaan sebelum menyetujui hasil."
        action={
          <>
            <CsvExportButton rows={rows} filename="hasil-stock-opname.csv" />
            <Button variant="outline" className="h-9 gap-2"><History aria-hidden="true" className="size-4" />Riwayat sesi</Button>
          </>
        }
      />
      {scanned ? <PageNote>Hasil pemindaian ditambahkan ke pratinjau lokal dan belum disimpan ke database.</PageNote> : null}
      <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
        <div className="grid md:grid-cols-[1.2fr_0.8fr]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="Berjalan" />
              <span className="text-xs text-muted-foreground">Sesi INV-2026-011 · 20 Nov 2026</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold tracking-tight">Rak umum · Cabang Banyuwangi</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sesi dibuka oleh Aditya Rahman. Hasil perbedaan memerlukan pemeriksaan kedua.</p>
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="font-medium">Kemajuan pemindaian</span>
              <span className="tabular-nums text-muted-foreground">{rows.length} dari 16 eksemplar</span>
            </div>
            <Progress value={progressValue} className="mt-2 h-2" />
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-secondary/20 px-2.5 py-1 font-medium text-secondary-foreground">Ditemukan 3</span>
              <span className="rounded-full bg-accent/15 px-2.5 py-1 font-medium text-accent-foreground">Perlu tindak lanjut 3</span>
            </div>
          </div>
          <div className="border-t border-border/70 bg-muted/25 p-5 md:border-t-0 md:border-l sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary"><ClipboardCheck aria-hidden="true" className="size-4" /></span>
              <div>
                <h3 className="text-sm font-semibold">Alur pemeriksaan</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Perbedaan inventaris tidak menghapus atau mengubah status eksemplar otomatis.</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["Pindai", "Catat lokasi dan kondisi aktual", "Selesai"],
                ["Tinjau perbedaan", "Petugas kedua memverifikasi", "Berjalan"],
                ["Setujui sesi", "Perubahan dicatat ke riwayat", "Menunggu"],
              ].map(([label, description, status]) => (
                <div key={label} className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/80 p-2.5">
                  <span className={`flex size-6 items-center justify-center rounded-full ${status === "Selesai" ? "bg-secondary/20 text-secondary-foreground" : status === "Berjalan" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {status === "Selesai" ? <Check aria-hidden="true" className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.45fr)]">
        <Card className="gap-0 border-border/80 shadow-none">
          <CardHeader className="border-b border-border/70 px-5 py-4">
            <CardTitle className="text-base">Pindai eksemplar</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Input barcode lalu catat hasil pemeriksaan fisik.</p>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={scanItem} className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium">Barcode eksemplar</span>
                <span className="relative block">
                  <ScanLine aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={barcode} onChange={(event) => setBarcode(event.target.value)} placeholder="Pindai atau ketik barcode" className="h-10 pl-9 font-mono text-xs" />
                </span>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium">Hasil pemeriksaan</span>
                <Select value={condition} onValueChange={(value) => setCondition(String(value))}>
                  <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Ditemukan", "Salah lokasi", "Belum ditemukan", "Perlu verifikasi"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              {error ? <p role="alert" className="text-xs text-destructive">{error}</p> : null}
              <Button type="submit" className="h-10 w-full gap-2"><ScanLine aria-hidden="true" className="size-4" />Catat pemindaian</Button>
            </form>
            <PageNote>Formulir ini bekerja sebagai demonstrasi antarmuka. Hasil pemindaian hanya tersimpan di state browser.</PageNote>
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-base">Hasil pemindaian</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Eksemplar yang sudah diperiksa pada sesi berjalan</p>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable rows={rows} columns={inventoryColumns} searchPlaceholder="Cari barcode atau judul..." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const reportRows: DataRow[] = [
  { laporan: "Sirkulasi harian", cakupan: "Pinjam, kembali, perpanjang", diperbarui: "Hari ini · 10.00", format: "CSV / XLSX", status: "Siap" },
  { laporan: "Koleksi & ketersediaan", cakupan: "Kategori, status, lokasi", diperbarui: "Hari ini · 09.30", format: "CSV", status: "Siap" },
  { laporan: "Keanggotaan", cakupan: "Aktif, kedaluwarsa, pertumbuhan", diperbarui: "Kemarin · 18.00", format: "CSV / XLSX", status: "Siap" },
  { laporan: "Denda & pembayaran", cakupan: "Tagihan, pembayaran, saldo", diperbarui: "Hari ini · 09.45", format: "CSV", status: "Siap" },
  { laporan: "Pengadaan & penerimaan", cakupan: "Pesanan dan nilai pengeluaran", diperbarui: "Kemarin · 17.30", format: "CSV / XLSX", status: "Siap" },
  { laporan: "Hasil stock opname", cakupan: "Temuan dan selisih inventaris", diperbarui: "20 Nov 2026", format: "CSV", status: "Siap" },
  { laporan: "Audit aktivitas", cakupan: "Aksi pengguna dan perubahan data", diperbarui: "Hari ini · 09.42", format: "CSV", status: "Siap" },
];
const reportColumns: TableColumn[] = [
  { key: "laporan", label: "Nama laporan" },
  { key: "cakupan", label: "Cakupan", muted: true },
  { key: "diperbarui", label: "Diperbarui", muted: true },
  { key: "format", label: "Format" },
  { key: "status", label: "Status", status: true },
];

function ReportBars() {
  const data = [
    { month: "Jun", count: 150 },
    { month: "Jul", count: 183 },
    { month: "Agu", count: 164 },
    { month: "Sep", count: 210 },
    { month: "Okt", count: 194 },
    { month: "Nov", count: 238 },
  ];

  return (
    <div className="flex h-[180px] items-end justify-between gap-3 border-b border-border/70 px-2">
      {data.map(({ month, count }, index) => (
        <div key={month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[10px] font-medium tabular-nums text-muted-foreground">{count}</span>
          <div className="flex h-[132px] w-full items-end justify-center">
            <div
              className={`w-full max-w-9 rounded-t-md ${index === data.length - 1 ? "bg-primary" : "bg-primary/15 dark:bg-primary/25"}`}
              style={{ height: `${(count / 250) * 100}%` }}
            />
          </div>
          <span className="pb-2 text-[10px] text-muted-foreground">{month}</span>
        </div>
      ))}
    </div>
  );
}

export function ReportsPage() {
  const [period, setPeriod] = useState("30-hari");
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insight & analitik"
        title="Laporan perpustakaan"
        description="Telusuri kinerja sirkulasi, koleksi, anggota, keuangan, pengadaan, dan aktivitas."
        action={
          <>
            <Select value={period} onValueChange={(value) => setPeriod(String(value))}>
              <SelectTrigger className="h-9 w-[156px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7-hari">7 hari terakhir</SelectItem>
                <SelectItem value="30-hari">30 hari terakhir</SelectItem>
                <SelectItem value="90-hari">90 hari terakhir</SelectItem>
                <SelectItem value="tahun">Tahun berjalan</SelectItem>
              </SelectContent>
            </Select>
            <CsvExportButton rows={reportRows} filename="laporan-pustakamaya.csv" />
          </>
        }
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Transaksi sirkulasi" value="2.486" detail="periode terpilih" trend="+12,8%" icon={BookCopy} tint="blue" />
        <MetricCard label="Anggota baru" value="148" detail="pendaftaran berhasil" trend="+8,2%" icon={UsersRound} tint="green" />
        <MetricCard label="Denda terbentuk" value="Rp2,8 jt" detail="Rp2,3 jt telah dibayar" icon={CircleAlert} tint="orange" />
        <MetricCard label="Koleksi dipinjam" value="4.218" detail="judul unik" trend="+5,4%" icon={ShoppingBasket} tint="violet" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <Card className="gap-0 border-border/80 shadow-none">
          <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 pt-5 pb-4">
            <div>
              <CardTitle className="text-base">Tren peminjaman</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Jumlah transaksi per bulan · semua cabang</p>
            </div>
            <div className="rounded-lg bg-primary/8 p-2 text-primary"><FileBarChart2 aria-hidden="true" className="size-4" /></div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ReportBars />
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/45 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Rata-rata transaksi per bulan</p>
              <p className="text-sm font-semibold tabular-nums">1.976</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0 border-border/80 shadow-none">
          <CardHeader className="px-5 pt-5 pb-4">
            <CardTitle className="text-base">Sorotan periode</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Perbandingan dengan periode sebelumnya</p>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
            {[
              ["Kategori terpopuler", "Fiksi Indonesia", "1.284 peminjaman"],
              ["Cabang tersibuk", "Banyuwangi", "58% dari transaksi"],
              ["Waktu tunggu reservasi", "3,2 hari", "−0,8 hari"],
              ["Koleksi tidak bergerak", "216 judul", "Perlu evaluasi"],
            ].map(([label, value, detail]) => (
              <div key={label} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-semibold">{value}</p>
                </div>
                <span className="mt-1 text-right text-[11px] text-muted-foreground">{detail}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle className="text-base">Pustaka laporan</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Laporan dengan kontrol rentang tanggal dan cakupan cabang.</p>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable rows={reportRows} columns={reportColumns} searchPlaceholder="Cari jenis laporan..." />
        </CardContent>
      </Card>
      <PageNote>Ekspor laporan skala besar sebaiknya dibatasi berdasarkan izin dan dicatat pada audit. Data pada tampilan ini adalah contoh.</PageNote>
    </div>
  );
}

const policyRows: DataRow[] = [
  { jenisAnggota: "Umum", batasPinjaman: "3 eksemplar", masaPinjam: "14 hari", perpanjangan: "1 kali", tarifDenda: "Rp2.000 / hari" },
  { jenisAnggota: "Mahasiswa", batasPinjaman: "5 eksemplar", masaPinjam: "21 hari", perpanjangan: "2 kali", tarifDenda: "Rp1.000 / hari" },
  { jenisAnggota: "Pelajar", batasPinjaman: "2 eksemplar", masaPinjam: "7 hari", perpanjangan: "1 kali", tarifDenda: "Rp1.000 / hari" },
];
const policyColumns: TableColumn[] = [
  { key: "jenisAnggota", label: "Jenis anggota" },
  { key: "batasPinjaman", label: "Batas pinjaman" },
  { key: "masaPinjam", label: "Masa pinjam" },
  { key: "perpanjangan", label: "Perpanjangan" },
  { key: "tarifDenda", label: "Tarif denda" },
];
const branchRows: DataRow[] = [
  { cabang: "Banyuwangi", kode: "BWY", lokasi: "Jl. A. Yani No. 12", anggota: "1.842", koleksi: "8.420", status: "Aktif" },
  { cabang: "Genteng", kode: "GTG", lokasi: "Jl. Diponegoro No. 8", anggota: "986", koleksi: "5.218", status: "Aktif" },
  { cabang: "Rogojampi", kode: "RGP", lokasi: "Jl. Raya Rogojampi No. 4", anggota: "784", koleksi: "4.824", status: "Aktif" },
];
const branchColumns: TableColumn[] = [
  { key: "cabang", label: "Nama cabang" },
  { key: "kode", label: "Kode" },
  { key: "lokasi", label: "Alamat", muted: true },
  { key: "anggota", label: "Anggota" },
  { key: "koleksi", label: "Eksemplar" },
  { key: "status", label: "Status", status: true },
];
const permissionRows: DataRow[] = [
  { izin: "catalog.read", deskripsi: "Melihat katalog dan eksemplar", admin: "Ya", librarian: "Ya", circulation: "Ya" },
  { izin: "catalog.write", deskripsi: "Mengelola bibliografi dan eksemplar", admin: "Ya", librarian: "Ya", circulation: "Tidak" },
  { izin: "circulation.checkout", deskripsi: "Memproses peminjaman", admin: "Ya", librarian: "Ya", circulation: "Ya" },
  { izin: "circulation.override", deskripsi: "Mengesampingkan blokir transaksi", admin: "Ya", librarian: "Tidak", circulation: "Tidak" },
  { izin: "reports.export", deskripsi: "Mengekspor laporan", admin: "Ya", librarian: "Terbatas", circulation: "Tidak" },
  { izin: "settings.manage", deskripsi: "Mengubah pengaturan sistem", admin: "Ya", librarian: "Tidak", circulation: "Tidak" },
];
const permissionColumns: TableColumn[] = [
  { key: "izin", label: "Kode izin" },
  { key: "deskripsi", label: "Deskripsi", muted: true },
  { key: "admin", label: "Admin" },
  { key: "librarian", label: "Pustakawan" },
  { key: "circulation", label: "Sirkulasi" },
];

export function AdministrationPage() {
  const [saved, setSaved] = useState(false);
  const [effectiveFrom, setEffectiveFrom] = useState("2026-11-20");
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengelolaan sistem"
        title="Administrasi"
        description="Atur akun, peran, izin, cabang, kebijakan sirkulasi, dan audit aktivitas."
        action={<Button variant="outline" className="h-9 gap-2"><ShieldCheck aria-hidden="true" className="size-4" />Kontrol akses</Button>}
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pengguna petugas" value="24" detail="21 aktif" icon={UsersRound} tint="blue" />
        <MetricCard label="Peran aktif" value="7" detail="dengan izin terkonfigurasi" icon={ShieldCheck} tint="violet" />
        <MetricCard label="Cabang" value="3" detail="semua beroperasi" icon={Building2} tint="green" />
        <MetricCard label="Audit hari ini" value="86" detail="aksi tercatat" icon={History} tint="orange" />
      </section>
      <Tabs defaultValue="users" className="space-y-5">
        <div className="overflow-x-auto border-b border-border/70">
          <TabsList variant="line" className="min-w-max">
            <TabsTrigger value="users">Pengguna & peran</TabsTrigger>
            <TabsTrigger value="policies">Kebijakan</TabsTrigger>
            <TabsTrigger value="branches">Cabang & lokasi</TabsTrigger>
            <TabsTrigger value="permissions">Matriks izin</TabsTrigger>
            <TabsTrigger value="audit">Audit aktivitas</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="users" className="mt-0">
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pt-5 pb-3">
              <div>
                <CardTitle className="text-base">Akun petugas</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Status akses dan peran yang diberikan.</p>
              </div>
              <Button className="h-8 gap-1.5"><Plus aria-hidden="true" className="size-3.5" />Undang petugas</Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={staffData} columns={staffColumns} searchPlaceholder="Cari nama, email, atau peran..." />
            </CardContent>
          </Card>
          <PageNote>Peran yang tampil adalah contoh kebijakan. Otorisasi produksi wajib ditegakkan dan diaudit di server.</PageNote>
        </TabsContent>
        <TabsContent value="policies" className="mt-0">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(290px,0.75fr)]">
            <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle className="text-base">Kebijakan sirkulasi</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Aturan dibedakan menurut jenis anggota dan dapat diberi tanggal berlaku.</p>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable rows={policyRows} columns={policyColumns} searchPlaceholder="Cari jenis anggota..." />
              </CardContent>
            </Card>
            <Card className="gap-0 border-border/80 shadow-none">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle className="text-base">Versi kebijakan baru</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Perubahan berlaku untuk transaksi baru.</p>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium">Berlaku mulai</span>
                  <Input type="date" value={effectiveFrom} onChange={(event) => setEffectiveFrom(event.target.value)} className="h-9" />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium">Masa tenggang denda</span>
                  <Input defaultValue="0 hari" className="h-9" />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium">Maksimum denda</span>
                  <Input defaultValue="Rp100.000" className="h-9" />
                </label>
                {saved ? <PageNote>Perubahan contoh tersimpan pada tampilan sesi ini, belum dipersistenkan.</PageNote> : null}
                <Button className="w-full" onClick={() => setSaved(true)}>Simpan pratinjau kebijakan</Button>
                <p className="text-[11px] leading-5 text-muted-foreground">Versi kebijakan lama tetap tersedia untuk audit transaksi terdahulu.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="branches" className="mt-0">
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pt-5 pb-3">
              <div>
                <CardTitle className="text-base">Cabang dan lokasi</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Lokasi rak dan koleksi terhubung ke cabang induk.</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5"><Plus aria-hidden="true" className="size-3.5" />Tambah cabang</Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={branchRows} columns={branchColumns} searchPlaceholder="Cari cabang atau alamat..." />
            </CardContent>
          </Card>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["Banyuwangi", "24 lokasi rak", "8.420 eksemplar"],
              ["Genteng", "16 lokasi rak", "5.218 eksemplar"],
              ["Rogojampi", "12 lokasi rak", "4.824 eksemplar"],
            ].map(([branch, locations, copies]) => (
              <Card key={branch} className="gap-0 border-border/80 shadow-none">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Building2 aria-hidden="true" className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{branch}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{locations} · {copies}</p>
                  </div>
                  <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="permissions" className="mt-0">
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base">Matriks izin akses</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Contoh izin granular berdasarkan prinsip akses minimum.</p>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={permissionRows} columns={permissionColumns} searchPlaceholder="Cari kode izin..." />
            </CardContent>
          </Card>
          <PageNote>Izin sensitif seperti pengesampingan kebijakan dan ekspor harus memiliki alasan serta jejak audit server-side.</PageNote>
        </TabsContent>
        <TabsContent value="audit" className="mt-0">
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base">Jejak audit</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Perubahan data dan transaksi penting tidak dihapus dari riwayat.</p>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={auditData} columns={auditColumns} searchPlaceholder="Cari pelaku, aksi, atau entitas..." />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
