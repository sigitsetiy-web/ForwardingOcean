"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ArrowRight, Package, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  SENT: "bg-purple-100 text-purple-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-slate-100 text-slate-800",
};

function formatCurrency(amount: number, currency: string = "IDR"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["quotation", id],
    queryFn: async () => {
      const res = await fetch(`/api/quotations/${id}`);
      return res.json();
    },
  });

  const convertMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/quotations/${id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createdById: user?.id }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal mengkonversi");
      }
      return res.json();
    },
    onSuccess: (data) => {
      router.push(`/job-orders/${data.data.id}`);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const res = await fetch(`/api/quotations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal update status");
      }
      return res.json();
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const qt = data?.data;
  if (!qt) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Quotation tidak ditemukan</p>
      </div>
    );
  }

  const canConvert =
    ["APPROVED", "ACCEPTED"].includes(qt.status) && !qt.salesOrder;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/quotations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{qt.number}</h1>
              <Badge
                className={statusColors[qt.status] || ""}
                variant="secondary"
              >
                {qt.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {qt.customer?.name} • {qt.serviceType.replace("_", " ")} •{" "}
              {qt.branch?.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {qt.status === "DRAFT" && (
            <Button
              variant="outline"
              onClick={() => statusMutation.mutate("REVIEW")}
              disabled={statusMutation.isPending}
            >
              Kirim ke Review
            </Button>
          )}
          {qt.status === "REVIEW" && (
            <Button
              onClick={() => statusMutation.mutate("APPROVED")}
              disabled={statusMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          )}
          {qt.status === "APPROVED" && !qt.salesOrder && (
            <Button
              variant="outline"
              onClick={() => statusMutation.mutate("SENT")}
              disabled={statusMutation.isPending}
            >
              Tandai Terkirim
            </Button>
          )}
          {canConvert && (
            <Button
              onClick={() => convertMutation.mutate()}
              disabled={convertMutation.isPending}
            >
              <Package className="h-4 w-4 mr-1" />
              {convertMutation.isPending
                ? "Mengkonversi..."
                : "Konversi ke Job Order"}
            </Button>
          )}
        </div>
      </div>

      {/* Linked Job Order */}
      {qt.salesOrder && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <span className="font-medium">
                  Sudah dikonversi ke Job Order
                </span>
              </div>
              <Link href={`/job-orders/${qt.salesOrder.id}`}>
                <Button variant="outline" size="sm">
                  {qt.salesOrder.number}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {convertMutation.isError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {convertMutation.error.message}
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detail Quotation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Pelanggan" value={qt.customer?.name} />
            <InfoRow label="Jenis Layanan" value={qt.serviceType.replace("_", " ")} />
            <InfoRow label="Origin" value={qt.origin} />
            <InfoRow label="Destination" value={qt.destination} />
            <InfoRow label="Mata Uang" value={qt.currency} />
            <InfoRow
              label="Berlaku Sampai"
              value={new Date(qt.validUntil).toLocaleDateString("id-ID")}
            />
            <InfoRow label="Cabang" value={qt.branch?.name} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              label="Total"
              value={formatCurrency(Number(qt.totalAmount || 0), qt.currency)}
            />
            <InfoRow label="Jumlah Item" value={String(qt.items?.length || 0)} />
            <InfoRow
              label="Dibuat"
              value={new Date(qt.createdAt).toLocaleDateString("id-ID")}
            />
            {qt.notes && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">Catatan:</p>
                <p className="text-sm mt-1">{qt.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item Harga</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qt.items?.map((item: Record<string, unknown>) => (
                <TableRow key={item.id as string}>
                  <TableCell className="font-medium">
                    {item.description as string}
                  </TableCell>
                  <TableCell>{(item.unit as string) || "-"}</TableCell>
                  <TableCell className="text-right">
                    {Number(item.quantity)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(item.unitPrice), qt.currency)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(Number(item.amount), qt.currency)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={4} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(Number(qt.totalAmount || 0), qt.currency)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  );
}
