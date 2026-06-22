"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PipelineStep {
  key: string;
  label: string;
}

interface StatusPipelineProps {
  steps: PipelineStep[];
  currentStep: string;
  size?: "sm" | "md";
  colorScheme?: "blue" | "green" | "amber";
}

const colorMap = {
  blue: {
    active: "bg-[#0070F2] text-white border-[#0070F2]",
    completed: "bg-[#0070F2] text-white border-[#0070F2]",
    pending: "bg-white text-[#6A6D70] border-[#D1D2D4]",
    connector: "bg-[#0070F2]",
    connectorPending: "bg-[#D1D2D4]",
  },
  green: {
    active: "bg-[#107E3E] text-white border-[#107E3E]",
    completed: "bg-[#107E3E] text-white border-[#107E3E]",
    pending: "bg-white text-[#6A6D70] border-[#D1D2D4]",
    connector: "bg-[#107E3E]",
    connectorPending: "bg-[#D1D2D4]",
  },
  amber: {
    active: "bg-[#E78C07] text-white border-[#E78C07]",
    completed: "bg-[#E78C07] text-white border-[#E78C07]",
    pending: "bg-white text-[#6A6D70] border-[#D1D2D4]",
    connector: "bg-[#E78C07]",
    connectorPending: "bg-[#D1D2D4]",
  },
};

export function StatusPipeline({
  steps,
  currentStep,
  size = "md",
  colorScheme = "blue",
}: StatusPipelineProps) {
  const colors = colorMap[colorScheme];
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Step */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "rounded-full border-2 flex items-center justify-center font-bold transition-all",
                  size === "sm" ? "h-6 w-6 text-[9px]" : "h-8 w-8 text-[10px]",
                  isCompleted && colors.completed,
                  isActive && colors.active,
                  isPending && colors.pending,
                  isActive && "ring-2 ring-offset-2 ring-[#0070F2]/30"
                )}
              >
                {isCompleted ? (
                  <Check className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-center leading-tight max-w-[80px]",
                  size === "sm" ? "text-[9px]" : "text-[10px]",
                  isActive ? "font-semibold text-[#32363A]" : "text-[#6A6D70]"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 mx-1",
                  size === "sm" ? "h-[2px]" : "h-[2px]",
                  index < currentIndex ? colors.connector : colors.connectorPending
                )}
                style={{ marginBottom: "18px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Pre-built pipeline for common use cases
export const JOB_ORDER_PIPELINE: PipelineStep[] = [
  { key: "DRAFT", label: "Draft" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
  { key: "INVOICED", label: "Invoiced" },
  { key: "CLOSED", label: "Closed" },
];

export const QUOTATION_PIPELINE: PipelineStep[] = [
  { key: "DRAFT", label: "Draft" },
  { key: "REVIEW", label: "Review" },
  { key: "APPROVED", label: "Approved" },
  { key: "SENT", label: "Sent" },
  { key: "ACCEPTED", label: "Accepted" },
];

export const INVOICE_PIPELINE: PipelineStep[] = [
  { key: "DRAFT", label: "Draft" },
  { key: "SENT", label: "Terkirim" },
  { key: "PARTIAL_PAID", label: "Sebagian" },
  { key: "PAID", label: "Lunas" },
];
