"use client";

import { Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  canPrintDocument,
  printUrl,
  type PrintableDocType,
} from "@/lib/print-utils";

interface DocumentPrintButtonProps {
  type: PrintableDocType;
  id: string;
  status: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  showPdfHint?: boolean;
}

export function DocumentPrintButton({
  type,
  id,
  status,
  variant = "outline",
  size = "sm",
  showPdfHint = true,
}: DocumentPrintButtonProps) {
  if (!canPrintDocument(type, status)) return null;

  const openPrint = (auto: boolean) => {
    window.open(printUrl(type, id, auto), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex gap-2 no-print">
      <Button variant={variant} size={size} onClick={() => openPrint(false)}>
        <Printer className="h-4 w-4 mr-1" />
        Cetak
      </Button>
      {showPdfHint && (
        <Button variant={variant} size={size} onClick={() => openPrint(true)}>
          <FileDown className="h-4 w-4 mr-1" />
          PDF
        </Button>
      )}
    </div>
  );
}
