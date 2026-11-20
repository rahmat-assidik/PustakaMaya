"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookCopy,
  Barcode,
  BookOpenCheck,
  CircleCheck,
  CircleHelp,
  Clock3,
  Plus,
  Search,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { DataTable, type DataRow, type TableColumn } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  bibliographyData,
  copiesData,
  loansData,
  membersData,
  paymentsData,
  reservationsData,
} from "@/lib/library-data";

const memberColumns: TableColumn[] = [
  { key: "nomor", label: "Nomor anggota" },
  { key: "nama", label: "Nama" },
  { key: "kategori", label: "Jenis anggota", muted: true },
  { key: "cabang", label: "Cabang", muted: true },
  { key: "pinjaman", label: "Pinjaman" },
  { key: "saldo", label: "Saldo denda" },
  { key: "status", label: "Status", status: true },
];

const bibliographyColumns: TableColumn[] = [
  { key: "judul", label: "Judul" },
  { key: "pengarang", label: "Pengarang", muted: true },
  { key: "kategori", label: "Kategori", muted: true },
  { key: "tahun", label: "Tahun" },
  { key: "eksemplar", label: "Eksemplar" },
  { key: "tersedia", label: "Tersedia" },
  { key: "status", label: "Status", status: true },
];

const copyColumns: TableColumn[] = [
  { key: "barcode", label: "Barcode" },
  { key: "judul", label: "Judul" },
  { key: "lokasi", label: "Lokasi rak", muted: true },
  { key: "cabang", label: "Cabang", muted: true },
  { key: "kondisi", label: "Kondisi", muted: true },
  { key: "status", label: "Status", status: true },
];

const loanColumns: TableColumn[] = [
  { key: "transaksi", label: "Transaksi" },
  { key: "anggota", label: "Anggota", muted: true },
  { key: "judul", label: "Judul" },
  { key: "dipinjam", label: "Tanggal pinjam", muted: true },
  { key: "jatuhTempo", label: "Jatuh tempo" },
  { key: "status", label: "Status", status: true },
];

const reservationColumns: TableColumn[] = [
  { key: "antrean", label: "Nomor antrean" },
  { key: "anggota", label: "Anggota" },
  { key: "judul", label: "Judul" },
  { key: "dibuat", label: "Tanggal reservasi", muted: true },
  { key: "berlaku", label: "Batas ambil" },
  { key: "status", label: "Status", status: true },
];

const paymentColumns: TableColumn[] = [
  { key: "referensi", label: "Referensi" },
  { key: "anggota", label: "Anggota" },
  { key: "transaksi", label: "Jenis transaksi", muted: true },
  { key: "nominal", label: "Nominal" },
  { key: "tanggal", label: "Tanggal", muted: true },
  { key: "status", label: "Status", status: true },
];

function LocalDemoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-secondary/40 bg-secondary/15 px-3 py-2.5 text-xs leading-5 text-foreground">
      <CircleHelp aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

function WorkflowInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  inputMode?: "text" | "search" | "numeric";
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className={icon ? "h-10 pl-9" : "h-10"}
        />
      </span>
    </label>
  );
}

export function CirculationPage() {
  const [memberNumber, setMemberNumber] = useState("");
  const [barcode, setBarcode] = useState("");
  const [checkoutResult, setCheckoutResult] = useState<"idle" | "error" | "valid">("idle");
  const [returnCode, setReturnCode] = useState("");
  const [returnResult, setReturnResult] = useState<"idle" | "error" | "valid">("idle");

  const checkout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const memberKnown = membersData.some((member) => member.nomor === memberNumber.trim());
    const copyAvailable = copiesData.some(
      (copy) => copy.barcode === barcode.trim() && copy.status === "Tersedia",
    );
    setCheckoutResult(memberKnown && copyAvailable ? "valid" : "error");
  };

  const checkReturn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReturnResult(returnCode.trim() ? "valid" : "error");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sirkulasi"
        title="Kelola sirkulasi"
        description="Peminjaman, pengembalian, perpanjangan, reservasi, dan pembayaran dalam satu alur kerja."
        action={
          <>
            <Button variant="outline" className="h-9 gap-2">
              <ArrowDownToLine aria-hidden="true" className="size-4" />
              Ekspor
            </Button>
            <Button className="h-9 gap-2" onClick={() => document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" })}>
              <Plus aria-hidden="true" className="size-4" />
              Transaksi baru
            </Button>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pinjaman aktif" value="1.426" detail="di semua cabang" icon={BookOpenCheck} tint="blue" />
        <MetricCard label="Jatuh tempo hari ini" value="12" detail="4 perlu pengingat" icon={Clock3} tint="orange" />
        <MetricCard label="Terlambat" value="38" detail="Rp 486.000 terakumulasi" icon={ShieldAlert} tint="orange" />
        <MetricCard label="Reservasi menunggu" value="24" detail="4 siap diambil" icon={UsersRound} tint="green" />
      </section>

      <Tabs defaultValue="checkout" className="space-y-5">
        <div className="overflow-x-auto border-b border-border/70">
          <TabsList variant="line" className="min-w-max">
            <TabsTrigger value="checkout">Peminjaman</TabsTrigger>
            <TabsTrigger value="return">Pengembalian</TabsTrigger>
            <TabsTrigger value="loans">Pinjaman berjalan</TabsTrigger>
            <TabsTrigger value="reservations">Reservasi</TabsTrigger>
            <TabsTrigger value="payments">Denda & pembayaran</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="checkout" className="mt-0">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.75fr)]">
            <Card id="checkout-form" className="gap-0 border-border/80 shadow-none">
              <CardHeader className="border-b border-border/70 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Peminjaman baru</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">Identifikasi anggota, lalu pindai barcode eksemplar.</p>
                  </div>
                  <Badge variant="outline" className="rounded-full">Masa pinjam 14 hari</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={checkout} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <WorkflowInput
                      label="Nomor anggota"
                      value={memberNumber}
                      onChange={(value) => {
                        setMemberNumber(value);
                        setCheckoutResult("idle");
                      }}
                      placeholder="Contoh: PM-240981"
                      icon={<UsersRound aria-hidden="true" className="size-4" />}
                    />
                    <WorkflowInput
                      label="Barcode eksemplar"
                      value={barcode}
                      onChange={(value) => {
                        setBarcode(value);
                        setCheckoutResult("idle");
                      }}
                      placeholder="Pindai atau ketik barcode"
                      icon={<Barcode aria-hidden="true" className="size-4" />}
                    />
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                        <ShieldAlert aria-hidden="true" className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Pemeriksaan kelayakan otomatis</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Status anggota, masa berlaku, jumlah pinjaman, tunggakan, ketersediaan eksemplar, dan antrean reservasi perlu divalidasi sebelum transaksi disimpan.
                        </p>
                      </div>
                    </div>
                  </div>
                  {checkoutResult === "valid" ? (
                    <LocalDemoNote>
                      Data cocok untuk simulasi. Transaksi belum disimpan ke database karena backend sirkulasi belum terhubung.
                    </LocalDemoNote>
                  ) : null}
                  {checkoutResult === "error" ? (
                    <p role="alert" className="text-sm text-destructive">
                      Anggota atau eksemplar tidak ditemukan, atau eksemplar tidak tersedia.
                    </p>
                  ) : null}
                  <div className="flex flex-col-reverse gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[11px] text-muted-foreground">Jatuh tempo dihitung dari kebijakan anggota dan koleksi.</p>
                    <Button type="submit" className="h-10 gap-2">
                      <CircleCheck aria-hidden="true" className="size-4" />
                      Periksa kelayakan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="gap-0 border-border/80 shadow-none">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle className="text-base">Panduan petugas</CardTitle>
                <p className="text-xs text-muted-foreground">Urutan aman sebelum menyelesaikan pinjaman</p>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                {[
                  ["01", "Validasi anggota", "Pastikan status aktif dan tidak melewati batas pinjaman."],
                  ["02", "Pindai eksemplar", "Pastikan barcode cocok dan status koleksi tersedia."],
                  ["03", "Konfirmasi transaksi", "Periksa tanggal jatuh tempo dan bukti transaksi."],
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-[10px] font-semibold text-primary">
                      {number}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                  <p className="text-xs font-semibold text-accent-foreground">Transaksi tidak boleh ganda</p>
                  <p className="mt-1 text-xs leading-5 text-foreground/80">
                    Produksi memerlukan pemeriksaan stok secara atomik di server.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4 gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base">Aktivitas sirkulasi terbaru</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Pinjaman dan pengembalian yang tercatat</p>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={loansData} columns={loanColumns} searchPlaceholder="Cari anggota, judul, atau nomor transaksi..." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="return" className="mt-0">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <Card className="gap-0 border-border/80 shadow-none">
              <CardHeader className="border-b border-border/70 px-5 py-4">
                <CardTitle className="text-base">Pengembalian eksemplar</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Pindai barcode untuk melihat ringkasan pinjaman dan kondisi.</p>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={checkReturn} className="space-y-4">
                  <WorkflowInput
                    label="Barcode eksemplar"
                    value={returnCode}
                    onChange={(value) => {
                      setReturnCode(value);
                      setReturnResult("idle");
                    }}
                    placeholder="Contoh: BK-0001843"
                    icon={<Barcode aria-hidden="true" className="size-4" />}
                  />
                  {returnResult === "valid" ? (
                    <div className="space-y-3 rounded-xl border border-border/70 bg-muted/35 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Ringkasan pemeriksaan</p>
                        <StatusBadge status="Terlambat 3 hari" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><p className="text-muted-foreground">Anggota</p><p className="mt-1 font-medium">Rizky Maulana</p></div>
                        <div><p className="text-muted-foreground">Keterlambatan</p><p className="mt-1 font-medium">3 hari</p></div>
                        <div><p className="text-muted-foreground">Estimasi denda</p><p className="mt-1 font-semibold">Rp12.000</p></div>
                        <div><p className="text-muted-foreground">Kondisi awal</p><p className="mt-1 font-medium">Baik</p></div>
                      </div>
                      <LocalDemoNote>
                        Simulasi pengembalian. Status eksemplar dan denda tidak diubah atau disimpan.
                      </LocalDemoNote>
                    </div>
                  ) : null}
                  {returnResult === "error" ? (
                    <p role="alert" className="text-sm text-destructive">Masukkan barcode eksemplar terlebih dahulu.</p>
                  ) : null}
                  <div className="flex justify-end border-t border-border/70 pt-4">
                    <Button type="submit" className="h-10 gap-2">
                      <Search aria-hidden="true" className="size-4" />
                      Cari transaksi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className="gap-0 border-border/80 shadow-none">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle className="text-base">Pemeriksaan kondisi</CardTitle>
                <p className="text-xs text-muted-foreground">Pilih status sesuai kondisi fisik yang ditemukan</p>
              </CardHeader>
              <CardContent className="space-y-2 px-5 pb-5">
                {[
                  ["Baik", "Kembali ke koleksi tersedia", "green"],
                  ["Rusak ringan", "Alihkan ke pemeriksaan petugas", "amber"],
                  ["Rusak berat / hilang", "Tindak lanjuti dan catat alasan", "rose"],
                ].map(([label, detail, tone]) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border border-border/70 p-3">
                    <span className={`size-2 rounded-full ${tone === "green" ? "bg-secondary" : tone === "amber" ? "bg-accent" : "bg-foreground"}`} />
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
                    </div>
                  </div>
                ))}
                <p className="pt-2 text-[11px] leading-5 text-muted-foreground">
                  Eksemplar rusak atau hilang tidak otomatis kembali ke status tersedia.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loans" className="mt-0">
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base">Pinjaman berjalan</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Pantau status, tanggal jatuh tempo, dan keterlambatan.</p>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={loansData} columns={loanColumns} searchPlaceholder="Cari pinjaman..." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="mt-0">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Dalam antrean" value="24" detail="semua judul" icon={UsersRound} tint="blue" />
            <MetricCard label="Siap diambil" value="4" detail="2 berakhir hari ini" icon={BookOpenCheck} tint="green" />
            <MetricCard label="Waktu tunggu rata-rata" value="3,2 hari" detail="30 hari terakhir" icon={Clock3} tint="violet" />
          </div>
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base">Antrean reservasi</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Urutan antrean dan batas waktu pengambilan</p>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={reservationsData} columns={reservationColumns} searchPlaceholder="Cari anggota atau judul..." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-0">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Tagihan terbuka" value="Rp486.000" detail="38 anggota" icon={ShieldAlert} tint="orange" />
            <MetricCard label="Pembayaran bulan ini" value="Rp2.184.000" detail="146 transaksi" icon={CircleCheck} tint="green" />
            <MetricCard label="Menunggu verifikasi" value="3" detail="pembayaran parsial" icon={Clock3} tint="blue" />
          </div>
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base">Riwayat pembayaran</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Pembayaran tersimpan sebagai transaksi dan tidak dihapus.</p>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable rows={paymentsData} columns={paymentColumns} searchPlaceholder="Cari anggota atau referensi..." />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function MembersPage() {
  const [rows, setRows] = useState(membersData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberCategory, setMemberCategory] = useState("Umum");
  const [newMemberSaved, setNewMemberSaved] = useState(false);
  const [filter, setFilter] = useState("semua");

  const filteredRows = useMemo(() => {
    if (filter === "aktif") return rows.filter((row) => row.status === "Aktif");
    if (filter === "perhatian") return rows.filter((row) => row.status === "Perlu perhatian");
    return rows;
  }, [filter, rows]);

  function addMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memberName.trim()) return;
    const number = `PM-241${String(rows.length + 1).padStart(3, "0")}`;
    setRows([
      {
        nomor: number,
        nama: memberName.trim(),
        kategori: memberCategory,
        cabang: "Banyuwangi",
        pinjaman: "0",
        saldo: "Rp0",
        status: "Aktif",
      },
      ...rows,
    ]);
    setMemberName("");
    setNewMemberSaved(true);
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Keanggotaan"
        title="Kelola anggota"
        description="Pantau profil, kategori, masa berlaku, aktivitas pinjaman, dan kewajiban anggota."
        action={
          <>
            <Button variant="outline" className="h-9 gap-2">
              <ArrowDownToLine aria-hidden="true" className="size-4" />
              Impor data
            </Button>
            <Button className="h-9 gap-2" onClick={() => setDialogOpen(true)}>
              <Plus aria-hidden="true" className="size-4" />
              Anggota baru
            </Button>
          </>
        }
      />
      {newMemberSaved ? (
        <LocalDemoNote>Anggota ditambahkan ke tampilan pratinjau sesi ini. Data belum disimpan ke database.</LocalDemoNote>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total anggota" value="3.612" detail="semua status" icon={UsersRound} tint="blue" />
        <MetricCard label="Aktif" value="3.284" detail="91% dari total" trend="+2,1%" icon={CircleCheck} tint="green" />
        <MetricCard label="Segera kedaluwarsa" value="46" detail="dalam 30 hari" icon={Clock3} tint="orange" />
        <MetricCard label="Tunggakan terbuka" value="38" detail="perlu tindak lanjut" icon={ShieldAlert} tint="violet" />
      </section>
      <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
        <div className="flex flex-col gap-3 border-b border-border/70 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={filter} onValueChange={(value) => setFilter(String(value))}>
            <TabsList className="h-9">
              <TabsTrigger value="semua">Semua anggota</TabsTrigger>
              <TabsTrigger value="aktif">Aktif</TabsTrigger>
              <TabsTrigger value="perhatian">Perlu perhatian</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="sm" className="h-8 gap-2 self-start text-muted-foreground sm:self-auto">
            <UsersRound aria-hidden="true" className="size-4" />
            Kelola kategori
          </Button>
        </div>
        <DataTable rows={filteredRows} columns={memberColumns} searchPlaceholder="Cari nomor, nama, atau kontak anggota..." />
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daftarkan anggota</DialogTitle>
            <DialogDescription>Isi data dasar untuk melihat pratinjau kartu anggota.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addMember} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium">Nama lengkap</span>
              <Input value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="Nama sesuai identitas" required />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium">Jenis anggota</span>
              <Select value={memberCategory} onValueChange={(value) => setMemberCategory(String(value))}>
                <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Umum">Umum</SelectItem>
                  <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="Pelajar">Pelajar</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit">Buat pratinjau</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CatalogPage() {
  const [bookQuery, setBookQuery] = useState("");
  const [copyQuery, setCopyQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [extraBooks, setExtraBooks] = useState<DataRow[]>([]);

  const visibleBooks = useMemo(
    () => [...extraBooks, ...bibliographyData].filter((book) =>
      `${book.judul} ${book.pengarang} ${book.kategori}`.toLocaleLowerCase("id-ID").includes(bookQuery.toLocaleLowerCase("id-ID")),
    ),
    [bookQuery, extraBooks],
  );
  const visibleCopies = useMemo(
    () => copiesData.filter((copy) =>
      `${copy.barcode} ${copy.judul} ${copy.lokasi}`.toLocaleLowerCase("id-ID").includes(copyQuery.toLocaleLowerCase("id-ID")),
    ),
    [copyQuery],
  );

  function addBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setExtraBooks([
      {
        judul: title.trim(),
        pengarang: "Belum diisi",
        kategori: "Belum diklasifikasi",
        tahun: "—",
        eksemplar: "0",
        tersedia: "0",
        status: "Baru",
      },
      ...extraBooks,
    ]);
    setTitle("");
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Katalog & koleksi"
        title="Katalog perpustakaan"
        description="Kelola rekaman bibliografi dan eksemplar fisik secara terpisah dengan pencarian terpadu."
        action={
          <>
            <Button variant="outline" className="h-9 gap-2"><ArrowDownToLine aria-hidden="true" className="size-4" />Impor / ekspor</Button>
            <Button className="h-9 gap-2" onClick={() => setDialogOpen(true)}><Plus aria-hidden="true" className="size-4" />Tambah bibliografi</Button>
          </>
        }
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Judul bibliografi" value="12.840" detail="rekaman terbitan" icon={BookOpenCheck} tint="blue" />
        <MetricCard label="Total eksemplar" value="18.462" detail="3 cabang" icon={BookCopy} tint="violet" />
        <MetricCard label="Tersedia dipinjam" value="14.286" detail="77,4% dari koleksi" icon={CircleCheck} tint="green" />
        <MetricCard label="Perlu penanganan" value="41" detail="rusak, hilang, proses" icon={ShieldAlert} tint="orange" />
      </section>
      <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
        <Tabs defaultValue="bibliografi">
          <div className="flex flex-col gap-3 border-b border-border/70 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-9">
              <TabsTrigger value="bibliografi">Bibliografi</TabsTrigger>
              <TabsTrigger value="eksemplar">Eksemplar</TabsTrigger>
            </TabsList>
            <div className="hidden items-center gap-2 pb-1 text-xs text-muted-foreground sm:flex">
              <span className="size-1.5 rounded-full bg-secondary" />
              Sinkronisasi data contoh
            </div>
          </div>
          <TabsContent value="bibliografi" className="mt-0">
            <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={bookQuery} onChange={(event) => setBookQuery(event.target.value)} placeholder="Judul, pengarang, ISBN..." className="h-9 pl-9" />
              </div>
              <p className="text-xs text-muted-foreground">{visibleBooks.length} dari 12.840 judul</p>
            </div>
            <DataTable rows={visibleBooks} columns={bibliographyColumns} searchPlaceholder="Cari judul, pengarang, atau kategori..." />
          </TabsContent>
          <TabsContent value="eksemplar" className="mt-0">
            <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={copyQuery} onChange={(event) => setCopyQuery(event.target.value)} placeholder="Barcode, judul, lokasi..." className="h-9 pl-9" />
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-2 self-start sm:self-auto"><Barcode aria-hidden="true" className="size-4" />Pindai barcode</Button>
            </div>
            <DataTable rows={visibleCopies} columns={copyColumns} searchPlaceholder="Cari eksemplar..." />
          </TabsContent>
        </Tabs>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Klasifikasi", "Kategori, subjek, dan nomor klasifikasi"],
          ["Lokasi koleksi", "Cabang, ruang, rak, dan tingkat"],
          ["Riwayat perubahan", "Jejak pembaruan rekaman bibliografi"],
        ].map(([heading, detail]) => (
          <Card key={heading} className="gap-0 border-border/80 shadow-none">
            <CardContent className="flex items-start gap-3 p-4">
              <span className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"><BookCopy aria-hidden="true" className="size-4" /></span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{heading}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
              </div>
              <ArrowRight aria-hidden="true" className="ml-auto mt-1 size-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah bibliografi</DialogTitle>
            <DialogDescription>Mulai dengan judul; metadata lengkap dapat dilengkapi pada tahap katalogisasi.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addBook} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium">Judul buku</span>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Masukkan judul" required />
            </label>
            <LocalDemoNote>Pratinjau bibliografi hanya tersimpan di tampilan browser ini.</LocalDemoNote>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit">Buat pratinjau</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
