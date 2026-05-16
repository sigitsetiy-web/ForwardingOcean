"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Clock,
  DollarSign,
  Truck,
  Activity,
  CheckCircle,
  Circle,
  ArrowLeft,
  Upload,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DocumentUploadDialog } from "@/components/document/upload-dialog";
import { StatusUpdateDialog } from "@/components/job-order/status-update-dialog";
import { FinancialDialog } from "@/components/job-order/financial-dialog";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  INVOICED: "bg-purple-100 text-purple-800",
  CLOSED: "bg-slate-100 text-slate-800",
};

const milestoneLabels: Record<string, string> = {
  ORDER_CONFIRMED: "Order Confirmed",
  DOCUMENT_RECEIVED: "Document Received",
  CUSTOMS_STARTED: "Customs Clearance Started",
  CUSTOMS_DONE: "Customs Clearance Done",
  CARGO_RELEASED: "Cargo Released",
  DELIVERY_TO_CONSIGNEE: "Delivery to Consignee",
  POD_RECEIVED: "POD Received",
  INVOICE_ISSUED: "Invoice Issued",
  PAYMENT_RECEIVED: "Payment Received",
  JOB_CLOSED: "Job Closed",
};

export default function JobOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useCurrentUser();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showFinancialDialog, setShowFinancialDialog] = useState<"revenue" | "cost" | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["job-order", id],
    queryFn: async () => {
      const res = await fetch(`/api/job-orders/${id}`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const jo = data?.data;
  if (!jo) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job Order tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/job-orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{jo.number}</h1>
              <Badge
                className={statusColors[jo.status] || ""}
                variant="secondary"
              >
                {jo.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {jo.customer?.name} • {jo.serviceType.replace("_", " ")} •{" "}
              {jo.branch?.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button onClick={() => setShowStatusDialog(true)}>Update Status</Button>
        </div>
      </div>

      {/* Milestone Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {jo.milestones?.map(
              (milestone: Record<string, unknown>, index: number) => (
                <div key={milestone.id as string} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[100px]">
                    {milestone.status === "DONE" ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : milestone.status === "IN_PROGRESS" ? (
                      <Clock className="h-6 w-6 text-amber-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300" />
                    )}
                    <span className="text-xs text-center mt-1 max-w-[90px]">
                      {milestoneLabels[milestone.type as string] ||
                        String(milestone.type)}
                    </span>
                  </div>
                  {index < jo.milestones.length - 1 && (
                    <div
                      className={`h-0.5 w-8 ${
                        milestone.status === "DONE"
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detail</TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-1" />
            Dokumen ({jo.documents?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-1" />
            Keuangan
          </TabsTrigger>
          <TabsTrigger value="trucking">
            <Truck className="h-4 w-4 mr-1" />
            Trucking
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-1" />
            Aktivitas
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informasi Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Shipper" value={jo.shipper} />
                <InfoRow label="Consignee" value={jo.consignee} />
                <InfoRow label="Port of Loading" value={jo.pol} />
                <InfoRow label="Port of Discharge" value={jo.pod} />
                <InfoRow label="Incoterms" value={jo.incoterms} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detail Kargo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Komoditas" value={jo.commodity} />
                <InfoRow label="HS Code" value={jo.hsCode} />
                <InfoRow label="Jumlah" value={jo.quantity?.toString()} />
                <InfoRow
                  label="Berat Kotor"
                  value={jo.grossWeight ? `${jo.grossWeight} kg` : null}
                />
                <InfoRow
                  label="Volume"
                  value={jo.cbm ? `${jo.cbm} CBM` : null}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vessel / Flight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Vessel" value={jo.vesselName} />
                <InfoRow label="Voyage No" value={jo.voyageNo} />
                <InfoRow label="Flight No" value={jo.flightNo} />
                <InfoRow
                  label="ETD"
                  value={
                    jo.etd
                      ? new Date(jo.etd).toLocaleDateString("id-ID")
                      : null
                  }
                />
                <InfoRow
                  label="ETA"
                  value={
                    jo.eta
                      ? new Date(jo.eta).toLocaleDateString("id-ID")
                      : null
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ringkasan Keuangan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow
                  label="Total Revenue"
                  value={formatCurrency(Number(jo.totalRevenue || 0))}
                />
                <InfoRow
                  label="Total Cost"
                  value={formatCurrency(Number(jo.totalCost || 0))}
                />
                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Gross Profit</span>
                  <span
                    className={
                      Number(jo.grossProfit || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formatCurrency(Number(jo.grossProfit || 0))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Dokumen</CardTitle>
              <Button size="sm" onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-1" />
                Upload Dokumen
              </Button>
            </CardHeader>
            <CardContent>
              {jo.documents?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada dokumen
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jo.documents?.map((doc: Record<string, unknown>) => (
                    <div
                      key={doc.id as string}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {doc.name as string}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {doc.type as string}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className={
                            doc.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : doc.status === "UPLOADED"
                              ? "bg-blue-100 text-blue-800"
                              : doc.status === "VERIFIED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {doc.status as string}
                        </Badge>
                        {(doc.fileUrl as string) ? (
                          <a
                            href={doc.fileUrl as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Lihat
                          </a>
                        ) : null}
                      </div>
                      {Number(doc.version) > 1 ? (
                        <p className="text-xs text-muted-foreground">
                          Versi {doc.version as number}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {showUploadDialog && user && (
            <DocumentUploadDialog
              jobOrderId={id}
              userId={user.id}
              onClose={() => setShowUploadDialog(false)}
            />
          )}
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Pendapatan (Revenue)</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowFinancialDialog("revenue")}>
                  Tambah
                </Button>
              </CardHeader>
              <CardContent>
                {jo.revenues?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Belum ada data pendapatan
                  </p>
                ) : (
                  <div className="space-y-2">
                    {jo.revenues?.map((rev: Record<string, unknown>) => (
                      <div
                        key={rev.id as string}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <span className="text-sm">{rev.item as string}</span>
                        <span className="font-medium text-sm">
                          {formatCurrency(Number(rev.amountIdr))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Biaya (Cost)</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowFinancialDialog("cost")}>
                  Tambah
                </Button>
              </CardHeader>
              <CardContent>
                {jo.costs?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Belum ada data biaya
                  </p>
                ) : (
                  <div className="space-y-2">
                    {jo.costs?.map((cost: Record<string, unknown>) => (
                      <div
                        key={cost.id as string}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <span className="text-sm">{cost.item as string}</span>
                          {cost.vendor ? (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({String(cost.vendor)})
                            </span>
                          ) : null}
                        </div>
                        <span className="font-medium text-sm">
                          {formatCurrency(Number(cost.amountIdr))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trucking Tab */}
        <TabsContent value="trucking">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Penugasan Kendaraan</CardTitle>
              <Button size="sm">Tambah Kendaraan</Button>
            </CardHeader>
            <CardContent>
              {jo.assignments?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada penugasan kendaraan
                </p>
              ) : (
                <div className="space-y-4">
                  {jo.assignments?.map((assign: Record<string, unknown>) => (
                    <div
                      key={assign.id as string}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span className="font-medium">
                            {assign.plateNumber as string}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {assign.status as string}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Driver: {assign.driverName as string}
                        {assign.vendorName ? ` • ${String(assign.vendorName)}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Log Aktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              {jo.activities?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada aktivitas
                </p>
              ) : (
                <div className="space-y-4">
                  {jo.activities?.map((activity: Record<string, unknown>) => (
                    <div
                      key={activity.id as string}
                      className="flex items-start gap-3 pb-4 border-b last:border-0"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.action as string}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description as string}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(
                            activity.createdAt as string
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Update Dialog */}
      {showStatusDialog && user && (
        <StatusUpdateDialog
          jobOrderId={id}
          currentStatus={jo.status}
          userId={user.id}
          onClose={() => setShowStatusDialog(false)}
        />
      )}

      {/* Financial Dialog */}
      {showFinancialDialog && (
        <FinancialDialog
          jobOrderId={id}
          type={showFinancialDialog}
          onClose={() => setShowFinancialDialog(null)}
        />
      )}
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
