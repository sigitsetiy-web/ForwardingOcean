import { Role } from "@prisma/client";

export type { Role } from "@prisma/client";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  branchId: string | null;
  supabaseUserId: string;
}

export interface Permission {
  action: "create" | "read" | "update" | "delete" | "approve" | "export";
  resource:
    | "job_order"
    | "quotation"
    | "customer"
    | "document"
    | "invoice"
    | "report"
    | "branch"
    | "user"
    | "approval"
    | "trucking"
    | "settings"
    | "dashboard";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  branchId?: string;
  status?: string;
  serviceType?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}
