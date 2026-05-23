"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function PrintToolbar({ title }: { title: string }) {
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("auto") === "1";

  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 600);
      return () => clearTimeout(t);
    }
  }, [autoPrint]);

  return (
    <div className="print-toolbar no-print">
      <button type="button" className="btn-print" onClick={() => window.print()}>
        Cetak / Simpan PDF
      </button>
      <button
        type="button"
        className="btn-close"
        onClick={() => window.close()}
      >
        Tutup
      </button>
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginLeft: 8 }}>
        {title}
      </span>
    </div>
  );
}
