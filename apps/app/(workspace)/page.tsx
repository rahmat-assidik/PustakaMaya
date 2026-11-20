import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookCopy,
  BookOpenCheck,
  CalendarClock,
  CircleAlert,
  Clock3,
  Plus,
  RotateCcw,
  UsersRound,
} from "lucide-react";
import { DataTable, type TableColumn } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loansData } from "@/lib/library-data";

const recentColumns: TableColumn[] = [
  { key: "transaksi", label: "Transaksi" },
  { key: "anggota", label: "Anggota" },
  { key: "judul", label: "Judul" },
  { key: "jatuhTempo", label: "Jatuh tempo", muted: true },
  { key: "status", label: "Status", status: true },
];

const recentLoans = loansData.slice(0, 5);
const loanSeries = [148, 172, 156, 196, 184, 224, 248, 216];
const returnSeries = [112, 132, 140, 148, 165, 178, 191, 202];
const chartLabels = ["04 Nov", "06 Nov", "08 Nov", "10 Nov", "12 Nov", "14 Nov", "16 Nov", "18 Nov"];

function CirculationChart() {
  const maxValue = 280;
  const chartHeight = 178;
  const chartTop = 12;
  const chartBottom = chartTop + chartHeight;
  const chartLeft = 32;
  const step = 76;
  const barWidth = 12;
  const ticks = [0, 70, 140, 210, 280];

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-sm bg-primary" /> Peminjaman
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-sm bg-secondary" /> Pengembalian
        </div>
        <span className="ml-auto text-[11px] text-muted-foreground">8–20 Nov 2026</span>
      </div>
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-labelledby="circulation-chart-title circulation-chart-description"
          viewBox="0 0 680 238"
          className="h-[210px] min-w-[560px] w-full"
        >
          <title id="circulation-chart-title">Aktivitas sirkulasi perpustakaan</title>
          <desc id="circulation-chart-description">
            Perbandingan jumlah peminjaman dan pengembalian selama delapan hari.
          </desc>
          {ticks.map((tick) => {
            const y = chartBottom - (tick / maxValue) * chartHeight;
            return (
              <g key={tick}>
                <line x1={chartLeft} x2="660" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 5" />
                <text x="0" y={y + 4} fill="var(--muted-foreground)" fontSize="10">
                  {tick}
                </text>
              </g>
            );
          })}
          {loanSeries.map((value, index) => {
            const x = chartLeft + 28 + index * step;
            const loanHeight = (value / maxValue) * chartHeight;
            const returnHeight = (returnSeries[index] / maxValue) * chartHeight;
            return (
              <g key={chartLabels[index]}>
                <rect
                  x={x}
                  y={chartBottom - loanHeight}
                  width={barWidth}
                  height={loanHeight}
                  rx="4"
                  fill="var(--primary)"
                  opacity="0.94"
                />
                <rect
                  x={x + 16}
                  y={chartBottom - returnHeight}
                  width={barWidth}
                  height={returnHeight}
                  rx="4"
                  fill="var(--chart-2)"
                  opacity="0.72"
                />
                <text x={x + 3} y="222" fill="var(--muted-foreground)" fontSize="9">
                  {chartLabels[index]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function TaskRow({
  icon: Icon,
  title,
  detail,
  href,
  count,
  tone,
}: {
  icon: typeof CircleAlert;
  title: string;
  detail: string;
  href: string;
  count: string;
  tone: "amber" | "blue" | "green";
}) {
  const iconTone = {
    amber: "bg-accent/15 text-accent-foreground",
    blue: "bg-secondary/25 text-secondary-foreground",
    green: "bg-secondary/15 text-secondary-foreground",
  }[tone];

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3 transition-colors hover:border-primary/25 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconTone}`}>
        <Icon aria-hidden="true" className="size-[17px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
      </span>
      <span className="text-right">
        <span className="block text-sm font-semibold tabular-nums">{count}</span>
        <ArrowRight aria-hidden="true" className="ml-auto mt-1 size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Jumat, 20 November 2026"
        title="Selamat pagi, Aditya"
        description="Ringkasan aktivitas perpustakaan dan prioritas operasional untuk hari ini."
        action={
          <>
            <Button nativeButton={false} render={<Link href="/reports" />} variant="outline" className="h-9 gap-2">
              <CalendarClock aria-hidden="true" className="size-4" />
              30 hari terakhir
            </Button>
            <Button nativeButton={false} render={<Link href="/circulation" />} className="h-9 gap-2 shadow-sm shadow-primary/15">
              <Plus aria-hidden="true" className="size-4" />
              Transaksi baru
            </Button>
          </>
        }
      />

      <section
        aria-label="Ringkasan perpustakaan"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard label="Total koleksi" value="12.840" detail="bibliografi aktif" trend="+4,8%" icon={BookCopy} tint="blue" />
        <MetricCard label="Anggota aktif" value="3.284" detail="dari 3.612 anggota" trend="+2,1%" icon={UsersRound} tint="green" />
        <MetricCard label="Pinjaman berjalan" value="1.426" detail="di semua cabang" trend="+8,4%" icon={BookOpenCheck} tint="violet" />
        <MetricCard label="Terlambat" value="38" detail="perlu ditindaklanjuti" trend="−12,5%" direction="down" icon={Clock3} tint="orange" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)]">
        <Card className="gap-0 border-border/80 shadow-none">
          <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pt-5 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Aktivitas sirkulasi</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Peminjaman dan pengembalian per hari</p>
            </div>
            <Button nativeButton={false} variant="ghost" size="icon-sm" aria-label="Lihat laporan sirkulasi" render={<Link href="/reports" />}>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-3">
            <CirculationChart />
          </CardContent>
        </Card>

        <Card className="gap-0 border-border/80 shadow-none">
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base font-semibold">Perlu ditindaklanjuti</CardTitle>
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent-foreground">
                6
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Tugas prioritas di semua cabang</p>
          </CardHeader>
          <CardContent className="space-y-2.5 px-4 pb-4">
            <TaskRow
              icon={CircleAlert}
              title="Pinjaman terlambat"
              detail="Periksa pengembalian dan denda"
              href="/circulation"
              count="38"
              tone="amber"
            />
            <TaskRow
              icon={CalendarClock}
              title="Jatuh tempo hari ini"
              detail="Kirim pengingat kepada anggota"
              href="/circulation"
              count="12"
              tone="blue"
            />
            <TaskRow
              icon={BookOpenCheck}
              title="Reservasi siap diambil"
              detail="Masa pengambilan segera berakhir"
              href="/circulation"
              count="4"
              tone="green"
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)]">
        <Card className="gap-0 overflow-hidden border-border/80 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pt-5 pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Pinjaman terbaru</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Aktivitas sirkulasi yang baru dicatat</p>
            </div>
            <Button nativeButton={false} render={<Link href="/circulation" />} variant="outline" size="sm" className="h-8 gap-1.5">
              Lihat semua <ArrowRight aria-hidden="true" className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              rows={recentLoans}
              columns={recentColumns}
              pageSize={5}
              searchPlaceholder="Cari pinjaman..."
            />
          </CardContent>
        </Card>

        <Card className="gap-0 border-border/80 shadow-none">
          <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 pt-5 pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Akses cepat</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Alur kerja yang sering digunakan</p>
            </div>
            <span className="rounded-lg bg-primary/8 p-2 text-primary">
              <RotateCcw aria-hidden="true" className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="grid gap-2 px-4 pb-4">
            {[
              { label: "Proses peminjaman", detail: "Pinjamkan eksemplar", href: "/circulation", icon: BookOpenCheck },
              { label: "Daftarkan anggota", detail: "Buat keanggotaan baru", href: "/members", icon: UsersRound },
              { label: "Tambah koleksi", detail: "Catat judul dan eksemplar", href: "/catalog", icon: BookCopy },
            ].map(({ label, detail, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-card text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:text-primary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <div>
                <p className="text-xs font-medium">Transaksi hari ini</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Semua cabang</p>
              </div>
              <span className="text-lg font-semibold tabular-nums">86</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
