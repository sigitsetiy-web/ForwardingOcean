"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, UserCog } from "lucide-react";

const roleLabels: Record<string, string> = {
  OWNER: "Owner",
  BRANCH_MANAGER: "Branch Manager",
  CRM: "CRM",
  MARKETING: "Marketing",
  SALES: "Sales",
  CSO: "CSO",
  TRUCKING: "Trucking",
  FINANCE: "Finance",
  ADMIN: "Admin",
};

const roleColors: Record<string, string> = {
  OWNER: "bg-purple-100 text-purple-800",
  BRANCH_MANAGER: "bg-blue-100 text-blue-800",
  CRM: "bg-green-100 text-green-800",
  MARKETING: "bg-amber-100 text-amber-800",
  SALES: "bg-orange-100 text-orange-800",
  CSO: "bg-cyan-100 text-cyan-800",
  TRUCKING: "bg-slate-100 text-slate-800",
  FINANCE: "bg-emerald-100 text-emerald-800",
  ADMIN: "bg-red-100 text-red-800",
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "",
    branchId: "",
    phone: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["users", { search, role: roleFilter }],
    queryFn: async () => {
      const params = new URLSearchParams({ pageSize: "50" });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/users?${params}`);
      return res.json();
    },
  });

  const { data: branchesData } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await fetch("/api/branches");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (userData: Record<string, unknown>) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal membuat user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowForm(false);
      setNewUser({ email: "", name: "", role: "", branchId: "", phone: "" });
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...newUser,
      branchId: newUser.branchId || undefined,
      phone: newUser.phone || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCog className="h-6 w-6" />
            Manajemen Pengguna
          </h1>
          <p className="text-muted-foreground">
            Kelola akun pengguna dan hak akses
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nama *</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@company.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(v) =>
                    setNewUser((prev) => ({ ...prev, role: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cabang</Label>
                <Select
                  value={newUser.branchId}
                  onValueChange={(v) =>
                    setNewUser((prev) => ({ ...prev, branchId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchesData?.data?.map(
                      (b: Record<string, string>) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name} ({b.code})
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !newUser.email || !newUser.name || !newUser.role}
                >
                  {createMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
            {createMutation.isError && (
              <p className="text-sm text-destructive mt-2">
                {createMutation.error.message}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter || "all"} onValueChange={(v) => setRoleFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                {Object.entries(roleLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Cabang</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Belum ada pengguna
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((user: Record<string, unknown>) => (
                  <TableRow key={user.id as string}>
                    <TableCell className="font-medium">
                      {user.name as string}
                    </TableCell>
                    <TableCell>{user.email as string}</TableCell>
                    <TableCell>
                      <Badge
                        className={roleColors[user.role as string] || ""}
                        variant="secondary"
                      >
                        {roleLabels[user.role as string] || String(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(user.branch as Record<string, string>)?.name || "-"}
                    </TableCell>
                    <TableCell>{(user.phone as string) || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className={
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
