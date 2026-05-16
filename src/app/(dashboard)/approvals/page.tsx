"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, FileText, Eye, X, DollarSign, MapPin, Package, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const entityTypeLabels: Record<string, string> = {
  JOB_ORDER: "Job Order",
  QUOTATION: "Quotation",
  DOCUMENT: "Dokumen",
  INVOICE: "Invoice",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export default function ApprovalsPage() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["approvals", { status: statusFilter, entityType: entityTypeFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (entityTypeFilter) params.set("entityType", entityTypeFilter);
      const res = await fetch(`/api/approvals?${params}`);
      return res.json();
    },
  });

  // Fetch detail when processing
  const { data: detailData } = useQuery({
    queryKey: ["approval-detail", processingId],
    queryFn: async () => {
      if (!processingId) return null;
      const approval = data?.data?.find((a: Record<string, unknown>) => a.id === processingId);
      if (!approval) return null;

      const entityType = approval.entityType as string;
      const entityId = approval.entityId as string;

      if (entityType === "QUOTATION") {
        const res = await fetch(`/api/quotations/${entityId}`);
        if (res.ok) return { type: "QUOTATION", ...(await res.json()) };
      } else if (entityType === "JOB_ORDER") {
        const res = await fetch(`/api/job-orders/${entityId}`);
        if (res.ok) return { type: "JOB_ORDER", ...(await res.json()) };
      }
      return null;
    },
    enabled: !!processingId,
  });

  const processMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) => {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, approvedById: user?.id || "", notes: notes || undefined }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Gagal memproses");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setProcessingId(null);
      setNotes("");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="h-6 w-6" />
          Approval Center
        </h1>
        <p className="text-muted-foreground">Review dan setujui dokumen yang memerlukan persetujuan</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityTypeFilter || "all"} onValueChange={(v) => setEntityTypeFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="QUOTATION">Quotation</SelectItem>
                <SelectItem value="JOB_ORDER">Job Order</SelectItem>
                <SelectItem value="DOCUMENT">Dokumen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data?.data?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada approval yang menunggu</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.data?.map((approval: Record<string, unknown>) => {
            const quotation = approval.quotation as Record<string, unknown> | null;
            const jobOrder = approval.jobOrder as Record<string, unknown> | null;
            const entityName = quotation?.number || jobOrder?.number || approval.entityId;
            const customerName = (quotation?.customer as Record<string, string>)?.name || (jobOrder?.customer as Record<string, string>)?.name || "";
            const isProcessing = processingId === (approval.id as string);

            return (
              <Card key={approval.id as string} className={isProcessing ? "ring-2 ring-primary" : ""}>
                <CardContent className="pt-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entityTypeLabels[approval.entityType as string]}</Badge>
                        <Badge variant="secondary">Level {approval.level as number}</Badge>
                        <Badge className={approval.status === "PENDING" ? "bg-amber-100 text-amber-800" : approval.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {approval.status === "PENDING" && <Clock className="h-3 w-3 mr-1" />}
                          {approval.status === "APPROVED" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {approval.status === "REJECTED" && <XCircle className="h-3 w-3 mr-1" />}
                          {approval.status as string}
                        </Badge>
                      </div>
                      <p className="font-bold text-lg">{entityName as string}</p>
                      {customerName && <p className="text-sm text-muted-foreground">Pelanggan: {customerName}</p>}
                      <p className="text-xs text-muted-foreground">Dibuat: {new Date(approval.createdAt as string).toLocaleString("id-ID")}</p>
                    </div>

                    {approval.status === "PENDING" && !isProcessing && (
                      <Button onClick={() => setProcessingId(approval.id as string)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review & Proses
                      </Button>
                    )}
                    {isProcessing && (
                      <Button variant="ghost" size="sm" onClick={() => { setProcessingId(null); setNotes(""); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Detail Panel — shown when processing */}
                  {isProcessing && (
                    <div className="border-t pt-4 space-y-4">
                      {/* Document Summary */}
                      <DocumentSummary detail={detailData} entityType={approval.entityType as string} />

                      {/* Approval Actions */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <p className="text-sm font-medium">Keputusan Approval:</p>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Catatan untuk pemohon (opsional)..."
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => processMutation.mutate({ id: approval.id as string, status: "APPROVED" })}
                            disabled={processMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Setujui
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => processMutation.mutate({ id: approval.id as string, status: "REJECTED" })}
                            disabled={processMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Tolak
                          </Button>
                          <Button variant="outline" onClick={() => { setProcessingId(null); setNotes(""); }}>
                            Batal
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Document Summary Component
function DocumentSummary({ detail, entityType }: { detail: Record<string, unknown> | null | undefined; entityType: string }) {
  if (!detail || !detail.data) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex items-center gap-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        Memuat ringkasan dokumen...
      </div>
    );
  }

  const doc = detail.data as Record<string, unknown>;

  if (entityType === "QUOTATION") {
    const items = (doc.items as Record<string, unknown>[]) || [];
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
          <FileText className="h-4 w-4" />
          Ringkasan Quotation
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard icon={<Package className="h-4 w-4" />} label="Service" value={(doc.serviceType as string)?.replace("_", " ")} />
          <InfoCard icon={<MapPin className="h-4 w-4" />} label="Rute" value={`${doc.origin} → ${doc.destination}`} />
          <InfoCard icon={<User className="h-4 w-4" />} label="Customer" value={(doc.customer as Record<string, string>)?.name} />
          <InfoCard icon={<DollarSign className="h-4 w-4" />} label="Total" value={formatCurrency(Number(doc.totalAmount || 0))} highlight />
        </div>

        {/* Line Items Summary */}
        <div className="mt-3">
          <p className="text-xs font-medium text-blue-800 mb-2">Rincian Biaya ({items.length} items):</p>
          <div className="bg-white rounded border border-blue-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-1.5 text-left font-medium text-blue-700">Deskripsi</th>
                  <th className="px-3 py-1.5 text-center font-medium text-blue-700">Qty</th>
                  <th className="px-3 py-1.5 text-right font-medium text-blue-700">Harga</th>
                  <th className="px-3 py-1.5 text-right font-medium text-blue-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.filter((i) => Number(i.amount) > 0).map((item, idx) => (
                  <tr key={idx} className="border-t border-blue-50">
                    <td className="px-3 py-1.5 font-medium">{item.description as string}</td>
                    <td className="px-3 py-1.5 text-center">{String(item.quantity)}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{formatCurrency(Number(item.unitPrice))}</td>
                    <td className="px-3 py-1.5 text-right font-mono font-medium">{formatCurrency(Number(item.amount))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-blue-200 bg-blue-50">
                  <td colSpan={3} className="px-3 py-2 text-right font-bold text-blue-800">TOTAL</td>
                  <td className="px-3 py-2 text-right font-bold font-mono text-blue-800">{formatCurrency(Number(doc.totalAmount || 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white rounded p-2 border border-blue-100">
            <p className="text-blue-600">Mata Uang</p>
            <p className="font-bold">{doc.currency as string}</p>
          </div>
          <div className="bg-white rounded p-2 border border-blue-100">
            <p className="text-blue-600">Berlaku s/d</p>
            <p className="font-bold">{doc.validUntil ? new Date(doc.validUntil as string).toLocaleDateString("id-ID") : "-"}</p>
          </div>
          <div className="bg-white rounded p-2 border border-blue-100">
            <p className="text-blue-600">Cabang</p>
            <p className="font-bold">{(doc.branch as Record<string, string>)?.name}</p>
          </div>
        </div>

        {(doc.notes as string) ? (
          <div className="text-xs bg-white rounded p-2 border border-blue-100">
            <p className="text-blue-600 font-medium">Catatan:</p>
            <p className="mt-0.5">{doc.notes as string}</p>
          </div>
        ) : null}
      </div>
    );
  }

  // JOB_ORDER summary
  if (entityType === "JOB_ORDER") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
          <Package className="h-4 w-4" />
          Ringkasan Job Order
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard icon={<Package className="h-4 w-4" />} label="Service" value={(doc.serviceType as string)?.replace("_", " ")} />
          <InfoCard icon={<MapPin className="h-4 w-4" />} label="Rute" value={`${doc.pol || ""} → ${doc.pod || ""}`} />
          <InfoCard icon={<User className="h-4 w-4" />} label="Customer" value={(doc.customer as Record<string, string>)?.name} />
          <InfoCard icon={<DollarSign className="h-4 w-4" />} label="Revenue" value={formatCurrency(Number(doc.totalRevenue || 0))} highlight />
        </div>
      </div>
    );
  }

  return null;
}

function InfoCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-2.5 border ${highlight ? "bg-green-50 border-green-200" : "bg-white border-blue-100"}`}>
      <div className="flex items-center gap-1.5 text-xs text-blue-600 mb-0.5">{icon}{label}</div>
      <p className={`text-sm font-bold ${highlight ? "text-green-700" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
