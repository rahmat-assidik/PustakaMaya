import { Badge } from "@/components/ui/badge";

const statusStyles: Array<{ match: RegExp; className: string; indicatorClassName: string }> = [
  {
    match: /aktif|tersedia|selesai|lunas|^ditemukan$|diterima|siap|approved|healthy/i,
    className: "border-secondary/50 bg-secondary/20 text-secondary-foreground",
    indicatorClassName: "bg-secondary-foreground",
  },
  {
    match: /terlambat|rusak|hilang|ditangguhkan|belum bayar|belum ditemukan|ditolak|overdue|lost/i,
    className: "border-accent/40 bg-accent/15 text-accent-foreground",
    indicatorClassName: "bg-accent-foreground",
  },
  {
    match: /menunggu|dipinjam|proses|reservasi|parsial|segera|draft|queued|partial|perlu perhatian|perlu verifikasi|salah lokasi|berjalan/i,
    className: "border-accent/30 bg-accent/10 text-accent-foreground",
    indicatorClassName: "bg-accent-foreground",
  },
  {
    match: /baru|diajukan|dipesan|pengadaan|berjalan|pending|review/i,
    className: "border-secondary/40 bg-secondary/10 text-secondary-foreground",
    indicatorClassName: "bg-secondary-foreground",
  },
];

export function StatusBadge({ status }: { status: string }) {
  const tone = statusStyles.find(({ match }) => match.test(status));

  return (
    <Badge
      variant="outline"
      className={`h-6 rounded-full px-2.5 text-[11px] font-medium ${tone?.className ?? "border-border bg-muted/70 text-muted-foreground"}`}
    >
      <span
        aria-hidden="true"
        className={`mr-1.5 size-1.5 rounded-full ${tone?.indicatorClassName ?? "bg-muted-foreground/60"}`}
      />
      {status}
    </Badge>
  );
}
