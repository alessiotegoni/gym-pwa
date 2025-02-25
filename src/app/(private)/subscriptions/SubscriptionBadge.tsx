import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Subscription } from "@/types";
import { ReactNode } from "react";
import { subscriptionStatuses } from "./Subscription";

type Props = {
  subscription: Partial<Subscription>;
  className?: string;
  children?: ReactNode;
};
export default function SubscriptionBadge({
  subscription: { endDate, status, updatedAt },
  className = "",
  children,
}: Props) {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <Badge
        className={`
          ${subscriptionStatuses[status!].badgeClasses}
            rounded-full`}
      >
        {children ? children : subscriptionStatuses[status!].text}
      </Badge>
      {endDate && (
        <p className="text-sm font-medium">
          {status === "expired"
            ? "Scaduto"
            : status === "canceled"
            ? "Cancellato"
            : "Scade"}{" "}
          il{" "}
          {formatDate(
            status === "canceled" && updatedAt ? updatedAt : endDate,
            "dd/MM/yyyy"
          )}
        </p>
      )}
    </div>
  );
}
