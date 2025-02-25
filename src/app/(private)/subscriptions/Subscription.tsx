import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { subscriptions } from "@/drizzle/schema"
import SubscriptionBadge from "./SubscriptionBadge"
import { cn } from "@/lib/utils"
import type { SubscriptionStatus } from "@/types"
import { formatDate } from "date-fns"

export const subscriptionStatuses: Record<
  SubscriptionStatus,
  { badgeClasses: string; cardClasses: string; text: string }
> = {
  active: {
    badgeClasses: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50",
    cardClasses: "bg-emerald-900/20 border border-emerald-600/30",
    text: "Attivo",
  },
  canceled: {
    badgeClasses: "bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/50",
    cardClasses: "bg-rose-900/20 border border-rose-600/30",
    text: "Cancellato",
  },
  trial: {
    badgeClasses: "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50",
    cardClasses: "bg-blue-900/20 border border-blue-600/30",
    text: "In Prova",
  },
  expired: {
    badgeClasses: "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50",
    cardClasses: "bg-amber-900/20 border border-amber-600/30",
    text: "Scaduto",
  },
}

type Props = {
  subscription: typeof subscriptions.$inferSelect & {
    users?: { firstName: string; lastName: string; email: string }
  }
}

export default function Subscription({ subscription }: Props) {
  const viewSubscriptionDetail = (
    <Button
      size="sm"
      variant="outline"
      className="rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border-gray-600"
      asChild
    >
      <Link href={`/subscriptions/${subscription.id}`}>
        Vedi Dettagli
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </Button>
  )

  return (
    <div
      className={cn(
        subscriptionStatuses[subscription.status].cardClasses,
        "p-4 rounded-xl min-h-[120px] flex flex-col justify-between shadow-lg backdrop-blur-sm",
      )}
    >
      {subscription.users && (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base capitalize font-semibold text-gray-100">
                {subscription.users.firstName} {subscription.users.lastName}
              </h3>
              <p className="text-sm !mt-0 text-gray-300">{subscription.users.email}</p>
            </div>
            <SubscriptionBadge subscription={{ status: subscription.status }} className="mb-2" />
          </div>
          <div className="mt-4 flex items-end">
            <div className="mb-2">
              {subscription.status === "canceled" && (
                <p className="text-sm font-medium text-gray-300 mb-1 grid grid-cols-[110px_auto]">
                  Creato il:
                  <span>{formatDate(subscription.createdAt, "dd/MM/yyyy")}</span>
                </p>
              )}
              <p className="text-sm font-medium grid grid-cols-[110px_auto]">
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
                    "dd/MM/yyyy",
                  )}
                </span>
              </p>
            </div>
            {subscription.status === "canceled" && (
              <div className="flex flex-1 justify-end">{viewSubscriptionDetail}</div>
            )}
          </div>
        </>
      )}

      {!subscription.users && <SubscriptionBadge subscription={subscription} className="mb-4" />}

      <div className="flex justify-between items-center">
        {subscription.status === "active" && (
          <span className="text-sm text-gray-200">
            {subscription.stripeSubscriptionId ? "Rinnovo automatico" : "Rinnovo non automatico"}
          </span>
        )}
        {(!["trial", "canceled"].includes(subscription.status) || !subscription.users) && (
          <div className="flex justify-end grow">{viewSubscriptionDetail}</div>
        )}
      </div>
    </div>
  )
}
