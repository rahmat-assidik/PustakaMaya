"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookCopy,
  BookOpen,
  CalendarDays,
  CircleHelp,
  Clock3,
  CreditCard,
  Search,
  Sparkles,
} from "lucide-react";
import { DataTable, type DataRow, type TableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loansData, reservationsData } from "@/lib/library-data";

const memberLoans: DataRow[] = loansData
  .filter((loan) => loan.anggota.startsWith("Nadia Putri"))
  .concat([
    {
      transaksi: "TRX-2026-08064",
      anggota: "Nadia Putri · PM-240981",
      judul: "Pulang",
      dipinjam: "09 Nov 2026",
      jatuhTempo: "23 Nov 2026",
      status: "Berjalan",
    },
  ]);
const loanColumns: TableColumn[] = [
  { key: "judul", label: "Judul" },
  { key: "dipinjam", label: "Tanggal pinjam", muted: true },
  { key: "jatuhTempo", label: "Jatuh tempo" },
  { key: "status", label: "Status", status: true },
];
const memberReservations: DataRow[] = reservationsData
  .filter((reservation) => reservation.anggota === "Nadia Putri")
  .concat([
    {
      antrean: "RSV-00916",
      anggota: "Nadia Putri",
      judul: "Filosofi Teras",
      dibuat: "17 Nov 2026",
      berlaku: "23 Nov 2026",
      status: "Siap diambil",
    },
  ]);
const reservationColumns: TableColumn[] = [
  { key: "judul", label: "Judul" },
  { key: "dibuat", label: "Tanggal reservasi", muted: true },
  { key: "berlaku", label: "Batas pengambilan" },
  { key: "status", label: "Status", status: true },
];
const catalogSamples = [
  { title: "Laut Bercerita", author: "Leila S. Chudori", type: "Fiksi Indonesia", available: "9 tersedia" },
  { title: "Filosofi Teras", author: "Henry Manampiring", type: "Pengembangan diri", available: "3 tersedia" },
  { title: "Bumi Manusia", author: "Pramoedya A. Toer", type: "Sastra klasik", available: "7 tersedia" },
];

export default function MemberPortalPage() {
  const [query, setQuery] = useState("");
  const visibleCatalog = useMemo(
    () =>
      catalogSamples.filter((book) =>
        `${book.title} ${book.author} ${book.type}`
          .toLocaleLowerCase("id-ID")
          .includes(query.toLocaleLowerCase("id-ID")),
      ),
    [query],
  );

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#member-content"
        className="sr-only z-[100] rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Lewati ke konten utama
      </a>
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen aria-hidden="true" className="size-[18px]" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Pustaka<span className="text-primary">Maya</span></span>
          </Link>
          <nav aria-label="Navigasi anggota" className="hidden items-center gap-6 md:flex">
            <a href="#koleksi" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Katalog</a>
            <a href="#aktivitas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Aktivitas saya</a>
            <a href="#bantuan" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Bantuan</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifikasi anggota" className="relative size-9">
              <Bell aria-hidden="true" className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary ring-2 ring-background" />
            </Button>
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-secondary/25 text-[11px] font-semibold text-secondary-foreground">NP</AvatarFallback>
            </Avatar>
            <span className="hidden text-xs font-medium sm:block">Nadia Putri</span>
          </div>
        </div>
      </header>

      <main id="member-content" className="mx-auto max-w-[1360px] space-y-8 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Portal anggota</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-foreground">Ringkasan saya</span>
          <Badge variant="outline" className="ml-auto rounded-full border-accent/40 bg-accent/10 text-[10px] text-accent-foreground">Pratinjau</Badge>
        </div>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
          <div className="relative overflow-hidden rounded-2xl bg-sidebar px-6 py-7 text-sidebar-foreground sm:px-8 sm:py-9">
            <div className="absolute -top-20 right-0 size-64 rounded-full bg-sidebar-primary/20 blur-3xl" />
            <div className="absolute -right-10 -bottom-28 size-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sidebar-foreground/15 bg-sidebar-foreground/8 px-3 py-1.5 text-[11px] text-sidebar-foreground/80">
                <Sparkles aria-hidden="true" className="size-3.5 text-sidebar-primary" />
                Selamat datang kembali
              </div>
              <h1 className="max-w-2xl text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                Halo, Nadia. <span className="text-sidebar-primary">Ada cerita baru</span> yang menunggu Anda.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-sidebar-foreground/80">
                Pantau pinjaman, kelola reservasi, dan temukan koleksi untuk bacaan berikutnya.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button nativeButton={false} render={<a href="#koleksi" />} className="h-9 gap-2 bg-background text-foreground hover:bg-muted">
                  Jelajahi katalog <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
                <Button nativeButton={false} render={<a href="#aktivitas" />} variant="outline" className="h-9 border-sidebar-foreground/20 bg-sidebar-foreground/5 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground">
                  Aktivitas saya
                </Button>
              </div>
            </div>
          </div>
          <Card className="gap-0 border-border/80 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pt-5 pb-3">
              <div>
                <CardTitle className="text-base">Kartu anggota digital</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Informasi keanggotaan Anda</p>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary"><CreditCard aria-hidden="true" className="size-4" /></span>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 border border-border">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">NP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">Nadia Putri</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">PM-240981</p>
                  </div>
                  <StatusBadge status="Aktif" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/70 pt-3 text-xs">
                  <div><p className="text-muted-foreground">Jenis anggota</p><p className="mt-1 font-medium">Mahasiswa</p></div>
                  <div><p className="text-muted-foreground">Berlaku hingga</p><p className="mt-1 font-medium">30 Jun 2027</p></div>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                <CircleHelp aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                Gunakan nomor anggota saat meminjam di meja sirkulasi.
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan akun anggota">
          {[
            { label: "Pinjaman aktif", value: "2 dari 5", detail: "3 slot masih tersedia", icon: BookCopy, tone: "text-primary bg-primary/8" },
            { label: "Jatuh tempo terdekat", value: "23 Nov", detail: "Pulang · 3 hari lagi", icon: CalendarDays, tone: "text-accent-foreground bg-accent/15" },
            { label: "Reservasi siap", value: "1 judul", detail: "Ambil sebelum 23 Nov", icon: Clock3, tone: "text-secondary-foreground bg-secondary/15" },
            { label: "Saldo denda", value: "Rp0", detail: "Tidak ada tagihan", icon: CreditCard, tone: "text-foreground bg-muted" },
          ].map(({ label, value, detail, icon: Icon, tone }) => (
            <Card key={label} className="gap-0 border-border/80 shadow-none">
              <CardContent className="flex items-start gap-3 p-4">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon aria-hidden="true" className="size-4" /></span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="aktivitas" className="scroll-mt-24">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Aktivitas pribadi</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">Koleksi dalam akun Anda</h2>
              <p className="mt-1 text-sm text-muted-foreground">Informasi yang hanya dapat dilihat setelah autentikasi anggota.</p>
            </div>
            <Button variant="outline" className="h-9 gap-2 self-start sm:self-auto">
              <CircleHelp aria-hidden="true" className="size-4" />Syarat perpanjangan
            </Button>
          </div>
          <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
            <Tabs defaultValue="loans">
              <div className="border-b border-border/70 px-4 pt-4">
                <TabsList className="mb-3 h-9">
                  <TabsTrigger value="loans">Pinjaman</TabsTrigger>
                  <TabsTrigger value="reservations">Reservasi</TabsTrigger>
                  <TabsTrigger value="fees">Denda</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="loans" className="mt-0">
                <DataTable rows={memberLoans} columns={loanColumns} searchPlaceholder="Cari pinjaman saya..." pageSize={5} />
              </TabsContent>
              <TabsContent value="reservations" className="mt-0">
                <DataTable rows={memberReservations} columns={reservationColumns} searchPlaceholder="Cari reservasi saya..." pageSize={5} />
              </TabsContent>
              <TabsContent value="fees" className="mt-0">
                <div className="p-5">
                  <div className="flex items-center gap-3 rounded-xl border border-secondary/40 bg-secondary/15 p-4">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-card text-secondary-foreground"><CreditCard aria-hidden="true" className="size-4" /></span>
                    <div><p className="text-sm font-semibold">Tidak ada tagihan terbuka</p><p className="mt-1 text-xs text-muted-foreground">Riwayat transaksi keuangan Anda tersedia di sini.</p></div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
            <CircleHelp aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            Perpanjangan hanya tersedia bila belum melewati batas, tidak ada reservasi anggota lain, dan keanggotaan masih aktif.
          </div>
        </section>

        <section id="koleksi" className="scroll-mt-24">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Temukan bacaan</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">Jelajahi katalog</h2>
              <p className="mt-1 text-sm text-muted-foreground">Cari berdasarkan judul, pengarang, atau kategori koleksi.</p>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mis. Laut Bercerita" className="h-10 pl-9" />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleCatalog.map((book, index) => (
              <Card key={book.title} className="gap-0 overflow-hidden border-border/80 shadow-none">
                <div className={`relative flex h-28 items-end p-4 ${index === 0 ? "bg-gradient-to-br from-secondary/30 via-card to-background" : index === 1 ? "bg-gradient-to-br from-accent/15 via-card to-background" : "bg-gradient-to-br from-foreground/10 via-card to-background"}`}>
                  <div className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/80 text-foreground shadow-sm">
                    <BookOpen aria-hidden="true" className="size-4" />
                  </div>
                  <Badge variant="outline" className="border-border/70 bg-card/80 text-[10px]">{book.type}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold">{book.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{book.author}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                    <StatusBadge status={book.available} />
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary">Detail <ArrowRight aria-hidden="true" className="size-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {visibleCatalog.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Tidak ada koleksi yang sesuai dengan pencarian.</div>
            ) : null}
          </div>
        </section>

        <footer id="bantuan" className="flex flex-col gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Data keanggotaan Anda bersifat pribadi dan hanya ditampilkan setelah autentikasi.</p>
          <a href="mailto:layanan@pustakamaya.id" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Hubungi pustakawan <ArrowRight aria-hidden="true" className="size-3.5" />
          </a>
        </footer>
      </main>
      <div className="fixed right-4 bottom-4 z-10 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] text-muted-foreground shadow-sm backdrop-blur">
        Demo · autentikasi belum diaktifkan
      </div>
    </div>
  );
}
