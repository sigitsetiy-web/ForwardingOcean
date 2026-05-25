"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CustomsClearanceDialogProps {
  jobOrderId: string;
  userId: string;
  initialData?: Record<string, unknown> | null;
  onClose: () => void;
}

export function CustomsClearanceDialog({
  jobOrderId,
  userId,
  initialData,
  onClose,
}: CustomsClearanceDialogProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    direction: stringValue(initialData?.direction) || "import",
    importirName: stringValue(initialData?.importirName),
    importirNpwp: stringValue(initialData?.importirNpwp),
    apiNumber: stringValue(initialData?.apiNumber),
    pibNumber: stringValue(initialData?.pibNumber),
    pibDate: dateValue(initialData?.pibDate),
    noPendaftaran: stringValue(initialData?.noPendaftaran),
    tglPendaftaran: dateValue(initialData?.tglPendaftaran),
    sppbNumber: stringValue(initialData?.sppbNumber),
    sppbDate: dateValue(initialData?.sppbDate),
    eksportirName: stringValue(initialData?.eksportirName),
    eksportirNpwp: stringValue(initialData?.eksportirNpwp),
    pebNumber: stringValue(initialData?.pebNumber),
    pebDate: dateValue(initialData?.pebDate),
    npeNumber: stringValue(initialData?.npeNumber),
    npeDate: dateValue(initialData?.npeDate),
    kantorPabean: stringValue(initialData?.kantorPabean),
    jalurPabean: stringValue(initialData?.jalurPabean),
    nilaiCIF: numberString(initialData?.nilaiCIF),
    nilaiFOB: numberString(initialData?.nilaiFOB),
    freightValue: numberString(initialData?.freightValue),
    insuranceValue: numberString(initialData?.insuranceValue),
    beaMasuk: numberString(initialData?.beaMasuk),
    ppnImpor: numberString(initialData?.ppnImpor),
    pphImpor: numberString(initialData?.pphImpor),
    cukai: numberString(initialData?.cukai),
    pnbp: numberString(initialData?.pnbp),
    beaKeluar: numberString(initialData?.beaKeluar),
    statusClearance: stringValue(initialData?.statusClearance),
    tglPemeriksaan: dateValue(initialData?.tglPemeriksaan),
    petugasPemeriksa: stringValue(initialData?.petugasPemeriksa),
    hasilPemeriksaan: stringValue(initialData?.hasilPemeriksaan),
    baNumber: stringValue(initialData?.baNumber),
    catatanPemeriksaan: stringValue(initialData?.catatanPemeriksaan),
    biayaPemeriksaan: numberString(initialData?.biayaPemeriksaan),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/customs-clearance/${jobOrderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal menyimpan custom clearance");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-order", jobOrderId] });
      queryClient.invalidateQueries({ queryKey: ["customs-clearance"] });
      onClose();
    },
  });

  const isImport = formData.direction === "import";
  const isExport = formData.direction === "export";

  const financialFields = useMemo(
    () => [
      ["nilaiCIF", "Nilai CIF"],
      ["nilaiFOB", "Nilai FOB"],
      ["freightValue", "Freight"],
      ["insuranceValue", "Insurance"],
      ["beaMasuk", "Bea Masuk"],
      ["ppnImpor", "PPN Impor"],
      ["pphImpor", "PPh Impor"],
      ["cukai", "Cukai"],
      ["pnbp", "PNBP"],
      ["beaKeluar", "Bea Keluar"],
      ["biayaPemeriksaan", "Biaya Pemeriksaan"],
    ] as const,
    []
  );

  const setField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Input Custom Clearance</h2>
            <p className="text-sm text-muted-foreground">
              Lengkapi data kepabeanan untuk job order ini
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={formData.direction}
                onValueChange={(value) => setField("direction", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kantor Pabean</Label>
              <Input
                value={formData.kantorPabean}
                onChange={(e) => setField("kantorPabean", e.target.value)}
                placeholder="Contoh: Tanjung Emas"
              />
            </div>

            <div className="space-y-2">
              <Label>Jalur Pabean</Label>
              <Select
                value={formData.jalurPabean || "none"}
                onValueChange={(value) =>
                  setField("jalurPabean", value === "none" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jalur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Belum ditentukan</SelectItem>
                  <SelectItem value="HIJAU">Hijau</SelectItem>
                  <SelectItem value="KUNING">Kuning</SelectItem>
                  <SelectItem value="MERAH">Merah</SelectItem>
                  <SelectItem value="MITA">MITA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status Clearance</Label>
              <Input
                value={formData.statusClearance}
                onChange={(e) => setField("statusClearance", e.target.value)}
                placeholder="Contoh: SPPB Terbit"
              />
            </div>
          </div>

          {isImport && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Data Import (PIB)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Nama Importir" value={formData.importirName} onChange={(v) => setField("importirName", v)} />
                <Field label="NPWP Importir" value={formData.importirNpwp} onChange={(v) => setField("importirNpwp", v)} />
                <Field label="API Number" value={formData.apiNumber} onChange={(v) => setField("apiNumber", v)} />
                <Field label="PIB Number" value={formData.pibNumber} onChange={(v) => setField("pibNumber", v)} />
                <DateField label="PIB Date" value={formData.pibDate} onChange={(v) => setField("pibDate", v)} />
                <Field label="No. Pendaftaran" value={formData.noPendaftaran} onChange={(v) => setField("noPendaftaran", v)} />
                <DateField label="Tgl Pendaftaran" value={formData.tglPendaftaran} onChange={(v) => setField("tglPendaftaran", v)} />
                <Field label="SPPB Number" value={formData.sppbNumber} onChange={(v) => setField("sppbNumber", v)} />
                <DateField label="SPPB Date" value={formData.sppbDate} onChange={(v) => setField("sppbDate", v)} />
              </div>
            </section>
          )}

          {isExport && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Data Export (PEB)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Nama Eksportir" value={formData.eksportirName} onChange={(v) => setField("eksportirName", v)} />
                <Field label="NPWP Eksportir" value={formData.eksportirNpwp} onChange={(v) => setField("eksportirNpwp", v)} />
                <Field label="PEB Number" value={formData.pebNumber} onChange={(v) => setField("pebNumber", v)} />
                <DateField label="PEB Date" value={formData.pebDate} onChange={(v) => setField("pebDate", v)} />
                <Field label="NPE Number" value={formData.npeNumber} onChange={(v) => setField("npeNumber", v)} />
                <DateField label="NPE Date" value={formData.npeDate} onChange={(v) => setField("npeDate", v)} />
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h3 className="text-sm font-semibold">Nilai & Bea</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {financialFields.map(([field, label]) => (
                <div className="space-y-2" key={field}>
                  <Label>{label}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData[field]}
                    onChange={(e) => setField(field, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold">Pemeriksaan Fisik</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DateField label="Tanggal Pemeriksaan" value={formData.tglPemeriksaan} onChange={(v) => setField("tglPemeriksaan", v)} />
              <Field label="Petugas Pemeriksa" value={formData.petugasPemeriksa} onChange={(v) => setField("petugasPemeriksa", v)} />
              <Field label="BA Number" value={formData.baNumber} onChange={(v) => setField("baNumber", v)} />
              <Field label="Hasil Pemeriksaan" value={formData.hasilPemeriksaan} onChange={(v) => setField("hasilPemeriksaan", v)} />
            </div>
            <div className="space-y-2">
              <Label>Catatan Pemeriksaan</Label>
              <Textarea
                value={formData.catatanPemeriksaan}
                onChange={(e) => setField("catatanPemeriksaan", e.target.value)}
                placeholder="Catatan tambahan terkait pemeriksaan fisik..."
                rows={3}
              />
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Menyimpan..." : "Simpan Custom Clearance"}
            </Button>
          </div>

          {saveMutation.isError && (
            <p className="text-sm text-destructive">
              {saveMutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberString(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function dateValue(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
