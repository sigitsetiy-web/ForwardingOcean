"use client";

import { useState, useRef } from "react";
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
import { Upload, X, FileText } from "lucide-react";

interface UploadDialogProps {
  jobOrderId: string;
  userId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const documentTypes = [
  { value: "BL", label: "Bill of Lading" },
  { value: "AWB", label: "Airway Bill" },
  { value: "COMMERCIAL_INVOICE", label: "Commercial Invoice" },
  { value: "PACKING_LIST", label: "Packing List" },
  { value: "PIB", label: "PIB (Pemberitahuan Impor Barang)" },
  { value: "PEB", label: "PEB (Pemberitahuan Ekspor Barang)" },
  { value: "SPPB", label: "SPPB" },
  { value: "DO", label: "Delivery Order" },
  { value: "POD", label: "Proof of Delivery" },
  { value: "COO", label: "Certificate of Origin" },
  { value: "SI", label: "Shipping Instruction" },
  { value: "SPK", label: "Surat Perintah Kerja" },
  { value: "SURAT_JALAN", label: "Surat Jalan" },
  { value: "BAST", label: "Berita Acara Serah Terima" },
  { value: "GATE_PASS", label: "Gate Pass" },
  { value: "ARRIVAL_NOTICE", label: "Arrival Notice" },
  { value: "PHYTOSANITARY", label: "Phytosanitary Certificate" },
  { value: "OTHER", label: "Lainnya" },
];

export function DocumentUploadDialog({
  jobOrderId,
  userId,
  onClose,
  onSuccess,
}: UploadDialogProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    deadline: "",
    notes: "",
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("File belum dipilih");

      const data = new FormData();
      data.append("file", file);
      data.append("jobOrderId", jobOrderId);
      data.append("type", formData.type);
      data.append("name", formData.name || file.name);
      data.append("uploadedById", userId);
      if (formData.deadline) data.append("deadline", formData.deadline);
      if (formData.notes) data.append("notes", formData.notes);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload gagal");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-order", jobOrderId] });
      onSuccess?.();
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.name) {
        setFormData((prev) => ({ ...prev, name: selectedFile.name }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Dokumen</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Label>File *</Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk memilih file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG, Excel (maks. 10MB)
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={handleFileChange}
            />
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label>Tipe Dokumen *</Label>
            <Select
              value={formData.type || undefined}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, type: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe dokumen" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Name */}
          <div className="space-y-2">
            <Label>Nama Dokumen</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nama dokumen (otomatis dari file)"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, deadline: e.target.value }))
              }
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Catatan tambahan..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                uploadMutation.isPending || !file || !formData.type
              }
            >
              {uploadMutation.isPending ? "Mengupload..." : "Upload"}
            </Button>
          </div>

          {uploadMutation.isError && (
            <p className="text-sm text-destructive">
              {uploadMutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
