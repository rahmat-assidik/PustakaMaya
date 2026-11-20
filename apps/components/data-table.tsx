"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";

export type DataRow = Record<string, string>;
export type TableColumn = {
  key: string;
  label: string;
  status?: boolean;
  muted?: boolean;
};

type DataTableProps = {
  rows: DataRow[];
  columns: TableColumn[];
  searchPlaceholder?: string;
  pageSize?: number;
};

type SortState = { key: string; direction: "asc" | "desc" } | null;

const collator = new Intl.Collator("id-ID", {
  numeric: true,
  sensitivity: "base",
});

export function DataTable({
  rows,
  columns,
  searchPlaceholder = "Cari data...",
  pageSize = 7,
}: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [sort, setSort] = useState<SortState>(null);

  const filteredRows = useMemo(() => {
    const query = globalFilter.trim().toLocaleLowerCase("id-ID");
    if (!query) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        value.toLocaleLowerCase("id-ID").includes(query),
      ),
    );
  }, [globalFilter, rows]);

  const sortedRows = useMemo(() => {
    if (!sort) return filteredRows;
    return [...filteredRows].sort((left, right) => {
      const result = collator.compare(left[sort.key] ?? "", right[sort.key] ?? "");
      return sort.direction === "asc" ? result : -result;
    });
  }, [filteredRows, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const pageRows = sortedRows.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize,
  );
  const firstRow = sortedRows.length === 0 ? 0 : safePageIndex * pageSize + 1;
  const lastRow = Math.min((safePageIndex + 1) * pageSize, sortedRows.length);

  function toggleSort(key: string) {
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
              setPageIndex(0);
            }}
            placeholder={searchPlaceholder}
            className="h-9 border-border/80 bg-background pl-9 text-sm shadow-none"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {sortedRows.length.toLocaleString("id-ID")} data ditemukan
        </p>
      </div>

      <Table>
        <caption className="sr-only">Daftar data perpustakaan</caption>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => {
              const isSorted = sort?.key === column.key;
              const SortIcon = !isSorted
                ? ArrowUpDown
                : sort.direction === "asc"
                  ? ArrowUp
                  : ArrowDown;

              return (
                <TableHead
                  key={column.key}
                  aria-sort={
                    isSorted
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="h-11 px-4"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 px-3 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase hover:text-foreground"
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.label}
                    <SortIcon aria-hidden="true" className="size-3.5" />
                  </Button>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length ? (
            pageRows.map((row, rowIndex) => (
              <TableRow
                key={
                  row.id ??
                  row.nomor ??
                  row.barcode ??
                  row.transaksi ??
                  row.referensi ??
                  row.antrean ??
                  row.penerimaan ??
                  `${rowIndex}-${Object.values(row)[0]}`
                }
                className="h-14"
              >
                {columns.map((column) => {
                  const value = row[column.key] ?? "";
                  return (
                    <TableCell
                      key={column.key}
                      className="px-4 py-3 text-sm"
                    >
                      {column.status ? (
                        <StatusBadge status={value} />
                      ) : (
                        <span
                          className={
                            column.muted
                              ? "text-muted-foreground"
                              : "font-medium text-foreground"
                          }
                        >
                          {value}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-1">
                  <p className="text-sm font-medium">Data tidak ditemukan</p>
                  <p className="text-xs text-muted-foreground">
                    Coba ubah kata kunci pencarian Anda.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Menampilkan{" "}
          <span className="font-medium text-foreground">
            {firstRow}–{lastRow}
          </span>{" "}
          dari{" "}
          <span className="font-medium text-foreground">{sortedRows.length}</span>{" "}
          data
        </p>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-2.5"
            onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
            disabled={safePageIndex === 0}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            Sebelumnya
          </Button>
          <span className="px-1 text-[11px] tabular-nums text-muted-foreground">
            {safePageIndex + 1} / {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-2.5"
            onClick={() =>
              setPageIndex((current) => Math.min(pageCount - 1, current + 1))
            }
            disabled={safePageIndex >= pageCount - 1}
          >
            Berikutnya
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
