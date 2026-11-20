"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataRow } from "@/components/data-table";

export function CsvExportButton({
  rows,
  filename,
  label = "Ekspor CSV",
}: {
  rows: DataRow[];
  filename: string;
  label?: string;
}) {
  const [exported, setExported] = useState(false);

  function exportRows() {
    if (rows.length === 0) return;
    const columns = Object.keys(rows[0]);
    const escapeCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const content = [
      columns.map(escapeCell).join(","),
      ...rows.map((row) => columns.map((column) => escapeCell(row[column] ?? "")).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExported(true);
    window.setTimeout(() => setExported(false), 1800);
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 gap-2"
      onClick={exportRows}
      disabled={rows.length === 0}
    >
      {exported ? (
        <Check aria-hidden="true" className="size-4 text-secondary-foreground" />
      ) : (
        <Download aria-hidden="true" className="size-4" />
      )}
      {exported ? "CSV diunduh" : label}
    </Button>
  );
}
