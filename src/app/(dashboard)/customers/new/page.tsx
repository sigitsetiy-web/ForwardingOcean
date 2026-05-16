"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    npwp: "",
    address: "",
    city: "",
    pic: "",
    phone: "",
    email: "",
    segment: "",
    creditLimit: "",
    rating: "",
    leadStatus: "PROSPECT",
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal membuat pelanggan");
      }
      return res.json();
    },
    onSuccess: () => {
      router.push("/customers");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      code: formData.code,
      name: formData.name,
      npwp: formData.npwp || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      pic: formData.pic || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      segment: formData.segment,
      creditLimit: formData.creditLimit
        ? parseFloat(formData.creditLimit)
        : undefined,
      rating: formData.rating ? parseInt(formData.rating) : undefined,
      leadStatus: formData.leadStatus,
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Tambah Pelanggan Baru</h1>
          <p className="text-muted-foreground">
            Isi data pelanggan untuk ditambahkan ke sistem
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Utama */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Utama</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kode Pelanggan *</Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value.toUpperCase())}
                placeholder="e.g., CUST001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Perusahaan *</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="PT Nama Perusahaan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Segmen *</Label>
              <Select
                value={formData.segment || undefined}
                onValueChange={(v) => updateField("segment", v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih segmen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMPORTER">Importer</SelectItem>
                  <SelectItem value="EXPORTER">Exporter</SelectItem>
                  <SelectItem value="SHIPPER">Shipper</SelectItem>
                  <SelectItem value="CONSIGNEE">Consignee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status Lead</Label>
              <Select
                value={formData.leadStatus}
                onValueChange={(v) => updateField("leadStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROSPECT">Prospect</SelectItem>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>NPWP</Label>
              <Input
                value={formData.npwp}
                onChange={(e) => updateField("npwp", e.target.value)}
                placeholder="XX.XXX.XXX.X-XXX.XXX"
              />
            </div>
            <div className="space-y-2">
              <Label>Kota</Label>
              <Input
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Jakarta"
              />
            </div>
          </CardContent>
        </Card>

        {/* Kontak */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kontak</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PIC (Person in Charge)</Label>
              <Input
                value={formData.pic}
                onChange={(e) => updateField("pic", e.target.value)}
                placeholder="Nama PIC"
              />
            </div>
            <div className="space-y-2">
              <Label>Telepon</Label>
              <Input
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="email@perusahaan.com"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Alamat</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Alamat lengkap perusahaan"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Keuangan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Keuangan & Rating</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Credit Limit (IDR)</Label>
              <Input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => updateField("creditLimit", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Select
                value={formData.rating || undefined}
                onValueChange={(v) => updateField("rating", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">⭐ 1</SelectItem>
                  <SelectItem value="2">⭐⭐ 2</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 3</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 4</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/customers">
            <Button variant="outline">Batal</Button>
          </Link>
          <Button
            type="submit"
            disabled={
              createMutation.isPending ||
              !formData.code ||
              !formData.name ||
              !formData.segment
            }
          >
            {createMutation.isPending ? "Menyimpan..." : "Simpan Pelanggan"}
          </Button>
        </div>

        {createMutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {createMutation.error.message}
          </div>
        )}
      </form>
    </div>
  );
}
