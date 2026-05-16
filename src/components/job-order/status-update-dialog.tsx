"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface StatusUpdateDialogProps {
  jobOrderId: string;
  currentStatus: string;
  userId: string;
  onClose: () => void;
}

const statusFlow: Record<string, string[]> = {
  DRAFT: ["CONFIRMED"],
  CONFIRMED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: ["INVOICED"],
  INVOICED: ["CLOSED"],
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  INVOICED: "Invoiced",
  CLOSED: "Closed",
};

export function StatusUpdateDialog({
  jobOrderId,
  currentStatus,
  userId,
  onClose,
}: StatusUpdateDialogProps) {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  const allowedStatuses = statusFlow[currentStatus] || [];

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/job-orders/${jobOrderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          userId,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal update status");
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
    if (!newStatus) return;
    updateMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Update Status</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Status Saat Ini</Label>
            <p className="text-sm font-medium px-3 py-2 bg-muted rounded-md">
              {statusLabels[currentStatus] || currentStatus}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Status Baru *</Label>
            {allowedStatuses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada status selanjutnya yang tersedia.
              </p>
            ) : (
              <Select value={newStatus || undefined} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status baru" />
                </SelectTrigger>
                <SelectContent>
                  {allowedStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status] || status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan perubahan status..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                updateMutation.isPending ||
                !newStatus ||
                allowedStatuses.length === 0
              }
            >
              {updateMutation.isPending ? "Menyimpan..." : "Update Status"}
            </Button>
          </div>

          {updateMutation.isError && (
            <p className="text-sm text-destructive">
              {updateMutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
