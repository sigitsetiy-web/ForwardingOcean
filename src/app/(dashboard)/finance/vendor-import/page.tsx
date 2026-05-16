"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, Plus } from "lucide-react";
import Link from "next/link";

const importCostTypes = [
  "Biaya Bea Cukai / PNBP",
  "Biaya EMKL",
  "Biaya THC / Handling",
  "Biaya Storage / Demurrage",
  "Biaya Surveyor",
  "Biaya Fumigasi",
  "Biaya Dokumentasi Import",
  "Biaya Lainnya",
];

export default function VendorImportPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/finance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-cyan-600" />
              Pembayaran Biaya Import
            </h1>
            <p className="text-muted-foreground">
              Catat pembayaran biaya import (bea cukai, EMKL, handling, dll)
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Catat Pembayaran
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Form Pembayaran Biaya Import</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Biaya</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis biaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {importCostTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nama Vendor</Label>
                <Input placeholder="Nama vendor / EMKL" />
              </div>
              <div className="space-y-2">
                <Label>No. JO Terkait</Label>
                <Input placeholder="Nomor Job Order" />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Bayar</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Mata Uang</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="IDR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR - Rupiah</SelectItem>
                    <SelectItem value="USD">USD - Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jumlah</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>No. PIB / Referensi</Label>
                <Input placeholder="Nomor PIB atau referensi dokumen" />
              </div>
              <div className="space-y-2">
                <Label>Keterangan</Label>
                <Input placeholder="Catatan tambahan" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                <Button>Simpan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Pembayaran Import</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>No. JO</TableHead>
                <TableHead>Referensi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Belum ada data pembayaran
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
