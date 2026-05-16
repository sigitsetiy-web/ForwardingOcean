"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, Mail, Phone, MapPin, FileText } from "lucide-react";
import Link from "next/link";

const segmentLabels: Record<string, string> = {
  IMPORTER: "Importer",
  EXPORTER: "Exporter",
  SHIPPER: "Shipper",
  CONSIGNEE: "Consignee",
};

const leadStatusColors: Record<string, string> = {
  PROSPECT: "bg-gray-100 text-gray-800",
  LEAD: "bg-blue-100 text-blue-800",
  QUALIFIED: "bg-amber-100 text-amber-800",
  CUSTOMER: "bg-green-100 text-green-800",
  LOST: "bg-red-100 text-red-800",
};

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await fetch(`/api/customers/${id}`);
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

  const customer = data?.data;
  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pelanggan tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <Badge variant="outline" className="font-mono">
                {customer.code}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {segmentLabels[customer.segment] || customer.segment}
              </Badge>
              <Badge
                className={leadStatusColors[customer.leadStatus] || ""}
                variant="secondary"
              >
                {customer.leadStatus}
              </Badge>
              {customer.rating && (
                <span className="text-sm">
                  {"⭐".repeat(customer.rating)}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline">Edit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Informasi Perusahaan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Nama" value={customer.name} />
            <InfoRow label="Kode" value={customer.code} />
            <InfoRow label="NPWP" value={customer.npwp} />
            <InfoRow label="Kota" value={customer.city} />
            {customer.address && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Alamat
                </p>
                <p className="text-sm mt-1">{customer.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Kontak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="PIC" value={customer.pic} />
            <InfoRow label="Telepon" value={customer.phone} />
            <InfoRow label="Email" value={customer.email} />
          </CardContent>
        </Card>

        {/* Financial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              label="Credit Limit"
              value={
                customer.creditLimit
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(Number(customer.creditLimit))
                  : null
              }
            />
            <InfoRow
              label="AO Customer ID"
              value={customer.aoCustomerId}
            />
            <InfoRow
              label="Terdaftar"
              value={new Date(customer.createdAt).toLocaleDateString("id-ID")}
            />
          </CardContent>
        </Card>
      </div>
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
