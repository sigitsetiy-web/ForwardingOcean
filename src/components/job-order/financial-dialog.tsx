"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface FinancialDialogProps {
  jobOrderId: string;
  type: "revenue" | "cost";
  onClose: () => void;
}

const revenueItems = [
  "Ocean Freight",
  "Air Freight",
  "Handling / THC",
  "Documentation Fee",
  "Custom Clearance Fee",
  "Trucking / Delivery Fee",
  "Storage / Detention",
  "Insurance",
  "Lainnya",
];

const costItems = [
  "Biaya Shipping Line / Airline",
  "Biaya EMKL / Trucking Vendor",
  "Biaya Bea Cukai / PNBP",
  "Biaya Surveyor / Fumigasi",
  "Biaya Handling",
  "Biaya Dokumentasi",
  "Biaya Storage",
  "Lainnya",
];

export function FinancialDialog({
  jobOrderId,
  type,
  onClose,
}: FinancialDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    item: "",
    customItem: "",
    vendor: "",
    currency: "IDR",
    amount: "",
    rate: "",
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const itemName =
        formData.item === "Lainnya" ? formData.customItem : formData.item;
      const amount = parseFloat(formData.amount);
      const rate = formData.rate ? parseFloat(formData.rate) : undefined;
      const amountIdr =
        formData.currency === "IDR" ? amount : amount * (rate || 1);

      const payload: Record<string, unknown> = {
        type,
        data: {
          item: itemName,
          currency: formData.currency,
          amount,
          rate,
          amountIdr,
          ...(type === "cost" && formData.vendor
            ? { vendor: formData.vendor }
            : {}),
        },
      };

      const res = await fetch(`/api/job-orders/${jobOrderId}/financial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal menambahkan data");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-order", jobOrderId] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate();
  };

  const items = type === "revenue" ? revenueItems : costItems;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Tambah {type === "revenue" ? "Pendapatan" : "Biaya"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item */}
          <div className="space-y-2">
            <Label>Item *</Label>
            <Select
              value={formData.item || undefined}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, item: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.item === "Lainnya" && (
            <div className="space-y-2">
              <Label>Nama Item *</Label>
              <Input
                value={formData.customItem}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customItem: e.target.value,
                  }))
                }
                placeholder="Nama item"
                required
              />
            </div>
          )}

          {/* Vendor (cost only) */}
          {type === "cost" && (
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Input
                value={formData.vendor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, vendor: e.target.value }))
                }
                placeholder="Nama vendor"
              />
            </div>
          )}

          {/* Currency */}
          <div className="space-y-2">
            <Label>Mata Uang</Label>
            <Select
              value={formData.currency}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, currency: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">IDR - Rupiah</SelectItem>
                <SelectItem value="USD">USD - Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Jumlah *</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="0"
              required
            />
          </div>

          {/* Exchange Rate (if USD) */}
          {formData.currency === "USD" && (
            <div className="space-y-2">
              <Label>Kurs (IDR per USD) *</Label>
              <Input
                type="number"
                min="0"
                value={formData.rate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rate: e.target.value }))
                }
                placeholder="e.g., 15500"
                required
              />
              {formData.amount && formData.rate && (
                <p className="text-xs text-muted-foreground">
                  ={" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(
                    parseFloat(formData.amount) * parseFloat(formData.rate)
                  )}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                addMutation.isPending ||
                !formData.item ||
                !formData.amount ||
                (formData.item === "Lainnya" && !formData.customItem) ||
                (formData.currency === "USD" && !formData.rate)
              }
            >
              {addMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>

          {addMutation.isError && (
            <p className="text-sm text-destructive">
              {addMutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
