"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  ArrowUpRight,
  Bell,
  BookCopy,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  CircleHelp,
  Command,
  CreditCard,
  LayoutDashboard,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = { label: string; href: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "RINGKASAN",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "OPERASIONAL",
    items: [
      { label: "Sirkulasi", href: "/circulation", icon: BookOpen },
      { label: "Anggota", href: "/members", icon: UsersRound },
      { label: "Katalog", href: "/catalog", icon: BookCopy },
      { label: "Pengadaan", href: "/acquisitions", icon: ShoppingBasket },
      { label: "Inventaris", href: "/inventory", icon: Archive },
    ],
  },
  {
    label: "INSIGHT",
    items: [{ label: "Laporan", href: "/reports", icon: ChartNoAxesCombined }],
  },
  {
    label: "PENGELOLAAN",
    items: [
      { label: "Administrasi", href: "/administration", icon: Settings2 },
      { label: "Portal anggota", href: "/portal", icon: UsersRound },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark({ sidebar = false }: { sidebar?: boolean }) {
  const iconClassName = sidebar
    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sidebar-primary/20"
    : "bg-primary text-primary-foreground shadow-primary/20";
  const brandClassName = sidebar ? "text-sidebar-primary" : "text-primary";
  const subtitleClassName = sidebar ? "text-sidebar-foreground/75" : "text-muted-foreground";

  return (
    <Link href="/" className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className={`flex size-10 items-center justify-center rounded-xl shadow-sm ${iconClassName}`}>
        <BookOpen aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] leading-5 font-semibold tracking-tight">
          Pustaka<span className={brandClassName}>Maya</span>
        </span>
        <span className={`block text-[10px] font-medium tracking-[0.14em] uppercase ${subtitleClassName}`}>
          Library workspace
        </span>
      </span>
    </Link>
  );
}

function NavGroups({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Navigasi utama" className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/70">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`group flex min-h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    active
                      ? "bg-sidebar-primary/15 text-sidebar-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`size-[17px] shrink-0 ${active ? "text-sidebar-primary" : "text-sidebar-foreground/75 group-hover:text-sidebar-foreground"}`}
                    strokeWidth={1.8}
                  />
                  <span>{label}</span>
                  {active ? (
                    <span aria-hidden="true" className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto">
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/70 p-3.5">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck aria-hidden="true" className="size-4" />
          </span>
          <span className="text-xs font-semibold">Ruang kerja aman</span>
        </div>
        <p className="text-[11px] leading-4 text-sidebar-foreground/80">
          Aktivitas sensitif tercatat dalam jejak audit.
        </p>
        <Link
          href="/administration"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-sidebar-primary hover:underline"
        >
          Lihat pengaturan
          <ArrowUpRight aria-hidden="true" className="size-3" />
        </Link>
      </div>
      <p className="mt-4 px-1 text-[10px] text-sidebar-foreground/70">
        PustakaMaya <span className="tabular-nums">v0.1.0</span>
      </p>
    </div>
  );
}

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const items = navGroups.flatMap((group) => group.items);
    const normalized = query.trim().toLocaleLowerCase("id-ID");
    return normalized
      ? items.filter((item) => item.label.toLocaleLowerCase("id-ID").includes(normalized))
      : items.slice(0, 5);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border/70 p-4">
          <DialogTitle className="text-sm font-semibold">Pencarian cepat</DialogTitle>
          <DialogDescription className="text-xs">
            Temukan modul dan halaman kerja.
          </DialogDescription>
        </DialogHeader>
        <div className="relative p-4 pb-2">
          <Search
            aria-hidden="true"
            className="absolute top-[1.35rem] left-7 size-4 text-muted-foreground"
          />
          <Input
            autoFocus
            aria-label="Cari halaman"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari halaman, mis. katalog..."
            className="h-10 pl-9"
          />
        </div>
        <div className="max-h-72 overflow-y-auto px-2 pb-2">
          {results.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="font-medium">{label}</span>
              <ArrowUpRight aria-hidden="true" className="ml-auto size-4 text-muted-foreground" />
            </Link>
          ))}
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Tidak ada halaman yang cocok.
            </p>
          ) : null}
        </div>
        <Separator />
        <div className="flex items-center justify-between px-4 py-3 text-[11px] text-muted-foreground">
          <span>Tekan Esc untuk menutup</span>
          <span className="inline-flex items-center gap-1">
            <Command aria-hidden="true" className="size-3" /> K
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [branch, setBranch] = useState("Banyuwangi");

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Lewati ke konten utama
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground md:flex">
        <div className="px-2 pb-7">
          <BrandMark sidebar />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-1 scrollbar-hidden">
          <NavGroups pathname={pathname} />
        </div>
        <div className="mt-5 px-1">
          <SidebarFooter />
        </div>
      </aside>

      <div className="min-h-screen md:pl-[252px]">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="flex h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 md:hidden"
                      aria-label="Buka navigasi"
                    />
                  }
                >
                  <Menu aria-hidden="true" className="size-4" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[290px] gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground sm:max-w-[290px]">
                  <SheetHeader className="border-b border-sidebar-border px-5 py-5">
                    <SheetTitle className="text-left text-sidebar-foreground">
                      <BrandMark sidebar />
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 scrollbar-hidden">
                    <NavGroups
                      pathname={pathname}
                      onNavigate={() => setMobileOpen(false)}
                    />
                    <div className="mt-auto pt-6">
                      <SidebarFooter />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden min-w-0 items-center gap-2 text-sm sm:flex">
                <span className="text-muted-foreground">Workspace</span>
                <span aria-hidden="true" className="text-border">/</span>
                <span className="truncate font-medium text-foreground">
                  {navGroups.flatMap((group) => group.items).find((item) => isActive(pathname, item.href))?.label ?? "Halaman"}
                </span>
              </div>
              <div className="sm:hidden">
                <BrandMark />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="h-9 justify-start gap-2 px-2.5 text-muted-foreground sm:w-[210px] sm:px-3"
                aria-label="Buka pencarian cepat"
              >
                <Search aria-hidden="true" className="size-4" />
                <span className="hidden text-xs font-normal sm:inline">Cari modul...</span>
                <kbd className="ml-auto hidden rounded border border-border bg-muted/70 px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
                  ⌘ K
                </kbd>
              </Button>
              <Select value={branch} onValueChange={(value) => setBranch(String(value))}>
                <SelectTrigger
                  className="hidden h-9 w-[168px] gap-2 bg-background md:flex"
                  aria-label="Pilih cabang"
                >
                  <Building2 aria-hidden="true" className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Banyuwangi">Banyuwangi</SelectItem>
                  <SelectItem value="Rogojampi">Rogojampi</SelectItem>
                  <SelectItem value="Genteng">Genteng</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative size-9"
                aria-label="Lihat notifikasi"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell aria-hidden="true" className="size-[17px]" />
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-accent ring-2 ring-background" />
              </Button>
              <Separator orientation="vertical" className="mx-1 hidden h-7 sm:block" />
              <div className="hidden items-center gap-2.5 sm:flex">
                <Avatar className="size-8 border border-border">
                  <AvatarFallback className="bg-secondary/25 text-[11px] font-semibold text-secondary-foreground">
                    AR
                  </AvatarFallback>
                </Avatar>
                <div className="hidden leading-tight lg:block">
                  <p className="text-xs font-semibold">Aditya Rahman</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-8 items-center justify-between border-t border-border/50 bg-muted/25 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" />
              Mode pratinjau · data contoh
            </div>
            <Badge variant="outline" className="h-5 rounded-full border-primary/20 bg-primary/5 px-2 text-[10px] font-medium text-primary">
              <CircleHelp aria-hidden="true" className="mr-1 size-3" />
              Sandbox
            </Badge>
          </div>
        </header>

        <main id="main-content" className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifikasi operasional</DialogTitle>
            <DialogDescription>
              Hal yang memerlukan perhatian petugas hari ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-3 rounded-lg border border-accent/30 bg-accent/10 p-3">
              <CreditCard aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
              <div>
                <p className="text-sm font-medium">3 pengembalian terlambat</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Periksa denda dan kondisi eksemplar sebelum menutup transaksi.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-secondary/40 bg-secondary/15 p-3">
              <ShoppingBasket aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary-foreground" />
              <div>
                <p className="text-sm font-medium">2 pesanan menunggu penerimaan</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Penerimaan terakhir tercatat kemarin pukul 14.20.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
