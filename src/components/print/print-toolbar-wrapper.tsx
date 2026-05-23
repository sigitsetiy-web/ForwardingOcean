"use client";

import { Suspense } from "react";
import { PrintToolbar } from "./print-toolbar";

export function PrintToolbarWrapper({ title }: { title: string }) {
  return (
    <Suspense fallback={null}>
      <PrintToolbar title={title} />
    </Suspense>
  );
}
