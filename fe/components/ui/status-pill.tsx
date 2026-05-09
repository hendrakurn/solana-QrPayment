import type { TransactionStatus } from "@/types";
import { CheckIcon, ClockIcon, AlertIcon } from "@/components/icons";
import { Badge } from "./badge";

const labels: Record<TransactionStatus, string> = {
  success: "Success",
  pending: "Pending",
  failed: "Failed",
};

export function StatusPill({ status }: { status: TransactionStatus }) {
  if (status === "success") {
    return (
      <Badge tone="success" iconLeft={<CheckIcon className="size-3.5" />}>
        {labels.success}
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge tone="warning" iconLeft={<ClockIcon className="size-3.5" />}>
        {labels.pending}
      </Badge>
    );
  }
  return (
    <Badge tone="danger" iconLeft={<AlertIcon className="size-3.5" />}>
      {labels.failed}
    </Badge>
  );
}
