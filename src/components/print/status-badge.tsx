import { isDraftStatus, statusLabel, type PrintableDocType } from "@/lib/print-utils";

export function PrintStatusBadge({
  type,
  status,
}: {
  type: PrintableDocType;
  status: string;
}) {
  let className = "print-status-badge ";
  if (isDraftStatus(status) || status === "REJECTED" || status === "EXPIRED") {
    className += "print-status-draft";
  } else if (["APPROVED", "ACCEPTED", "COMPLETED", "CLOSED"].includes(status)) {
    className += "print-status-approved";
  } else if (["IN_PROGRESS", "CONFIRMED", "INVOICED"].includes(status)) {
    className += "print-status-progress";
  } else if (status === "SENT") {
    className += "print-status-sent";
  } else {
    className += "print-status-closed";
  }

  return (
    <span className={className}>{statusLabel(type, status)}</span>
  );
}
