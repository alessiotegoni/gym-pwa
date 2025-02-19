import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { subscriptions } from "@/drizzle/schema";
import SubscriptionBadge from "./SubscriptionBadge";
import { cn } from "@/lib/utils";
import { SubscriptionStatus } from "@/types";
import { formatDate } from "date-fns";

export const subscriptionStatuses: Record<
  SubscriptionStatus,
  { badgeClasses: string; cardClasses: string; text: string }
> = {
  active: {
    badgeClasses: "bg-green-100 text-green-800 ring ring-1 ring-green-800/40",
    cardClasses: "bg-green-50 ring ring-1 ring-green-800/30",
    text: "Attivo",
  },
  canceled: {
    badgeClasses: "bg-red-100 text-red-800 ring ring-1 ring-red-800/40",
    cardClasses: "bg-red-50 ring ring-1 ring-red-800/30",
    text: "Cancellato",
  },
  trial: {
    badgeClasses: "bg-blue-100 text-blue-800 ring ring-1 ring-blue-800/40",
    cardClasses: "bg-blue-50 ring ring-1 ring-blue-800/30",
    text: "In Prova",
  },
  expired: {
    badgeClasses:
      "bg-yellow-100 text-yellow-800 ring ring-1 ring-yellow-800/40",
    cardClasses: "bg-yellow-50 ring ring-1 ring-yellow-800/30",
    text: "Scaduto",
  },
};

type Props = {
  subscription: typeof subscriptions.$inferSelect & {
    users?: { firstName: string; lastName: string; email: string };
  };
};

export default function Subscription({ subscription }: Props) {
  const viewSubscriptionDetail = (
    <Button
      variant="ghost"
      size="sm"
      className="dark:text-black px-0 hover:bg-transparent"
      asChild
    >
      <Link href={`/subscriptions/${subscription.id}`}>
        Vedi Dettagli
        <ChevronRight />
      </Link>
    </Button>
  );

  return (
    <div
      className={cn(
        subscriptionStatuses[subscription.status].cardClasses,
        "p-4 rounded-xl"
      )}
    >
      {subscription.users && (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base capitalize font-semibold dark:text-black">
                {subscription.users.firstName} {subscription.users.lastName}
              </h3>
              <p className="text-sm !mt-0">{subscription.users.email}</p>
            </div>
            <SubscriptionBadge subscription={{ status: subscription.status }} className="mb-2" />
          </div>
          <div className="mt-4 flex items-end">
            <div className="mb-2">
              {subscription.status === "canceled" && (
                <p
                  className="text-sm font-medium text-muted-foreground mb-1
                dark:text-slate-400 grid grid-cols-[110px_auto]"
                >
                  Creato il:
                  <span>
                    {formatDate(subscription.createdAt, "dd/MM/yyyy")}
                  </span>
                </p>
              )}
              <p
                className="text-sm font-medium text-muted-foreground
              dark:text-slate-400 grid grid-cols-[110px_auto]"
              >
                {subscription.status === "expired"
                  ? "Scaduto"
                  : subscription.status === "canceled"
                  ? "Cancellato"
                  : "Scade"}{" "}
                il:{" "}
                <span>
                  {formatDate(
                    subscription.status === "canceled" && subscription.updatedAt
                      ? subscription.updatedAt
                      : subscription.endDate,
                    "dd/MM/yyyy"
                  )}
                </span>
              </p>
            </div>
            {subscription.status === "canceled" && (
              <div className="flex flex-1 justify-end">
                {viewSubscriptionDetail}
              </div>
            )}
          </div>
        </>
      )}

      {!subscription.users && <SubscriptionBadge subscription={subscription} className="mb-4" />}

      <div className="flex justify-between items-center">
        {subscription.status === "active" && (
          <span className="text-sm dark:text-black">
            {subscription.stripeSubscriptionId
              ? "Rinnovo automatico"
              : "Rinnovo non automatico"}
          </span>
        )}
        {(!["trial", "canceled"].includes(subscription.status) ||
          !subscription.users) && (
          <div className="flex justify-end grow">{viewSubscriptionDetail}</div>
        )}
      </div>
    </div>
  );
}
