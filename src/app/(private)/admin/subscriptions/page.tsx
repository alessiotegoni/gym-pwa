import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import Subscription from "../../subscriptions/Subscription";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SUBSCRIPTION_STATUSES } from "@/constants";
import { filterByUsers, formatSubStatus } from "@/lib/utils";
import SubscriptionBadge from "../../subscriptions/SubscriptionBadge";
import { Plus } from "lucide-react";
import SearchUserBar from "@/components/SearchBar";

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function SubscriptionsList({ searchParams }: Props) {
  const session = await auth();

  if (!session?.userId) return;

  const search = (await searchParams).search?.toLowerCase();

  const subscriptions = await db.query.subscriptions.findMany({
    with: {
      user: {
        columns: { firstName: true, lastName: true, email: true },
      },
    },
  });

  const filteredSubscriptions = filterByUsers(subscriptions, search);

  const groupedSubscriptions = Object.groupBy(
    filteredSubscriptions,
    (sub) => sub.status
  );

  return (
    <>
      <header className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">Abbonamenti</h2>
          <Button className="text-xs h-fit p-0 size-7 rounded-full" asChild>
            <Link href="/admin/subscriptions/create">
              <Plus />
            </Link>
          </Button>
        </div>
        <SearchUserBar search={search} />
        <h3 className="text-lg font-medium mb-2">
          Totali: <strong>{filteredSubscriptions.length}</strong>
        </h3>
        <div className="flex flex-wrap gap-2">
          {SUBSCRIPTION_STATUSES.map((status) => (
            <a key={status} href={`#${status}`}>
              <SubscriptionBadge subscription={{ status }}>
                <strong className="text-base mr-1">
                  {groupedSubscriptions[status]?.length ?? 0}
                </strong>
                <p className="text-sm">{formatSubStatus(status)}</p>
              </SubscriptionBadge>
            </a>
          ))}
        </div>
      </header>
      {filteredSubscriptions.length ? (
        <div className="flex flex-col gap-4">
          {SUBSCRIPTION_STATUSES.map((status) => (
            <div key={status} id={status}>
              <h4 className="font-semibold text-xl mb-2">
                {formatSubStatus(status)}
              </h4>
              {groupedSubscriptions[status]?.length ? (
                <div className="space-y-3">
                  {groupedSubscriptions[status].map((subscription) => (
                    <Subscription
                      key={subscription.id}
                      subscription={subscription}
                    />
                  ))}
                </div>
              ) : (
                <h3 className="font-medium mt-1">Nessun abbonamento</h3>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="font-medium">
          {!search
            ? "Non hai abbonamenti"
            : `Nessun abbonamento associato a: ${search}`}
        </p>
      )}
    </>
  );
}
