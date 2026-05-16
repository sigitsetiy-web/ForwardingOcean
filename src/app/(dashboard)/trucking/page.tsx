"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, MapPin, Clock, Camera } from "lucide-react";

const statusColors: Record<string, string> = {
  ASSIGNED: "bg-blue-100 text-blue-800",
  DEPARTED: "bg-amber-100 text-amber-800",
  DELIVERED: "bg-green-100 text-green-800",
  POD_RECEIVED: "bg-emerald-100 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  ASSIGNED: "Ditugaskan",
  DEPARTED: "Berangkat",
  DELIVERED: "Terkirim",
  POD_RECEIVED: "POD Diterima",
};

export default function TruckingPage() {
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["trucking", { status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/trucking?${params}`);
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6" />
            Trucking & Operasional
          </h1>
          <p className="text-muted-foreground">
            Pantau status pengiriman darat dan penugasan kendaraan
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="ASSIGNED">Ditugaskan</SelectItem>
                <SelectItem value="DEPARTED">Berangkat</SelectItem>
                <SelectItem value="DELIVERED">Terkirim</SelectItem>
                <SelectItem value="POD_RECEIVED">POD Diterima</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data?.data?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada penugasan kendaraan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.map((assignment: Record<string, unknown>) => {
            const jobOrder = assignment.jobOrder as Record<string, unknown> | null;
            const driverPhone = assignment.driverPhone as string | null;
            const vendorName = assignment.vendorName as string | null;
            const origin = assignment.origin as string | null;
            const destination = assignment.destination as string | null;
            const departureTime = assignment.departureTime as string | null;
            const photos = assignment.photos as string[] | null;
            const spkNumber = assignment.spkNumber as string | null;

            return (
              <Card key={assignment.id as string}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {assignment.plateNumber as string}
                    </CardTitle>
                    <Badge
                      className={
                        statusColors[assignment.status as string] || ""
                      }
                      variant="secondary"
                    >
                      {statusLabels[assignment.status as string] ||
                        String(assignment.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <p className="font-medium">
                      {assignment.driverName as string}
                    </p>
                    {driverPhone ? (
                      <p className="text-muted-foreground text-xs">
                        {driverPhone}
                      </p>
                    ) : null}
                    {vendorName ? (
                      <p className="text-muted-foreground text-xs">
                        Vendor: {vendorName}
                      </p>
                    ) : null}
                  </div>

                  {(origin || destination) ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {origin || "?"} → {destination || "?"}
                      </span>
                    </div>
                  ) : null}

                  {departureTime ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Berangkat:{" "}
                        {new Date(departureTime).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ) : null}

                  {photos && photos.length > 0 ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Camera className="h-3 w-3" />
                      <span>{photos.length} foto</span>
                    </div>
                  ) : null}

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      JO: {(jobOrder?.number as string) || "-"}
                    </p>
                    {jobOrder?.customer ? (
                      <p className="text-xs text-muted-foreground">
                        {(jobOrder.customer as Record<string, string>)?.name}
                      </p>
                    ) : null}
                  </div>

                  {spkNumber ? (
                    <p className="text-xs font-mono text-muted-foreground">
                      SPK: {spkNumber}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
