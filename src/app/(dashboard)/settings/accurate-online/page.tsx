"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Database,
  User,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AccurateOnlineSettingsPage() {
  const [signatureSecret, setSignatureSecret] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Fetch current config
  const { data: config, isLoading, refetch } = useQuery({
    queryKey: ["accurate-config"],
    queryFn: async () => {
      const res = await fetch("/api/accurate-online/config");
      return res.json();
    },
  });

  // Test connection
  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/accurate-online/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureSecret,
          apiToken,
          action: "test",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Test koneksi gagal");
      }
      return data;
    },
  });

  // Save credentials
  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/accurate-online/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureSecret,
          apiToken,
          action: "save",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan konfigurasi");
      }
      return data;
    },
    onSuccess: () => {
      setSignatureSecret("");
      setApiToken("");
      refetch();
    },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Accurate Online Integration
        </h1>
        <p className="text-muted-foreground">
          Konfigurasi koneksi ke Accurate Online untuk sinkronisasi data
          akuntansi
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Status Koneksi
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memeriksa koneksi...</p>
          ) : config?.connected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">
                  Terhubung
                </Badge>
              </div>

              {config.database && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Database className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Database</p>
                      <p className="text-sm font-medium">
                        {config.database.alias}
                      </p>
                    </div>
                  </div>
                  {config.user && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">User</p>
                        <p className="text-sm font-medium">
                          {config.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {config.user.email}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Host</p>
                      <p className="text-sm font-medium font-mono">
                        {config.host}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Signature Secret: {config.signatureSecret}</p>
                <p>API Token: {config.apiToken}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <Badge className="bg-red-100 text-red-800">
                  {config?.configured ? "Gagal Terhubung" : "Belum Dikonfigurasi"}
                </Badge>
              </div>
              {config?.error && (
                <p className="text-sm text-destructive">{config.error}</p>
              )}
              {!config?.configured && (
                <p className="text-sm text-muted-foreground">
                  Isi Signature Secret dan API Token di bawah untuk menghubungkan
                  ke Accurate Online.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Konfigurasi Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Signature Secret</Label>
            <div className="relative">
              <Input
                type={showSecret ? "text" : "password"}
                value={signatureSecret}
                onChange={(e) => setSignatureSecret(e.target.value)}
                placeholder="Masukkan Signature Secret dari Developer Area"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Dapatkan dari:{" "}
              <a
                href="https://account.accurate.id/developer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://account.accurate.id/developer
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label>API Token</Label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="aat.xxx.your_api_token"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Dapatkan dari: Accurate Online → Accurate Store → API Token
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => testMutation.mutate()}
              disabled={
                testMutation.isPending || !signatureSecret || !apiToken
              }
            >
              {testMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Test Koneksi
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={
                saveMutation.isPending || !signatureSecret || !apiToken
              }
            >
              {saveMutation.isPending ? "Menyimpan..." : "Simpan & Hubungkan"}
            </Button>
          </div>

          {/* Test Result */}
          {testMutation.data && (
            <div
              className={`p-4 rounded-lg border ${
                testMutation.data.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {testMutation.data.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Koneksi Berhasil!
                    </span>
                  </div>
                  {testMutation.data.database && (
                    <div className="text-sm text-green-700">
                      <p>
                        Database: {testMutation.data.database.alias} (ID:{" "}
                        {testMutation.data.database.id})
                      </p>
                      {testMutation.data.user && (
                        <p>
                          User: {testMutation.data.user.fullName} (
                          {testMutation.data.user.email})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <span className="font-medium text-red-800">
                      Koneksi Gagal
                    </span>
                    <p className="text-sm text-red-700 mt-1">
                      {testMutation.data.error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {saveMutation.data && saveMutation.data.success && (
            <div className="p-4 rounded-lg border border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {saveMutation.data.message}
                </span>
              </div>
            </div>
          )}

          {saveMutation.isError && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <span className="font-medium text-red-800">Gagal Menyimpan</span>
                  <p className="text-sm text-red-700 mt-1">
                    {saveMutation.error instanceof Error
                      ? saveMutation.error.message
                      : "Terjadi kesalahan saat menyimpan"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fitur Integrasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Sinkronisasi Pelanggan</p>
                <p className="text-muted-foreground">
                  Data pelanggan di FMS otomatis tersinkron ke Accurate Online
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">AR Invoice (Piutang)</p>
                <p className="text-muted-foreground">
                  Invoice penjualan otomatis ter-posting ke Accurate saat JO
                  diinvoice
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">AP Invoice (Hutang)</p>
                <p className="text-muted-foreground">
                  Invoice pembelian/vendor otomatis ter-posting ke Accurate
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Status Pembayaran</p>
                <p className="text-muted-foreground">
                  Status lunas di Accurate otomatis update status JO di FMS
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Kurs Mata Uang</p>
                <p className="text-muted-foreground">
                  Ambil kurs harian dari Accurate untuk konversi USD → IDR
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
