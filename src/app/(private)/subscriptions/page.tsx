import { db } from "@/drizzle/db";
import CurrentSubscription from "./ActiveSubscription";
import Subscription from "./Subscription";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "I tuoi abbonamenti",
  description: "Vedi tutti i tuoi abbonamenti",
};

export default async function SubscriptionsList() {
  const session = await auth();

  if (!session?.userId) return;

  const subscriptions = await db.query.subscriptions.findMany({
    where: ({ userId, endDate, status }, { and, eq, lte, or }) =>
      and(
        eq(userId, session.userId),
        or(lte(endDate, new Date()), eq(status, "canceled"))
      ),
  });

  return (
    <div className="space-y-6">
      <CurrentSubscription userId={session.userId} />

      {!!subscriptions.length && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold -mb-1">Altri abbonamenti</h2>
          {subscriptions.map((subscription) => (
            <Subscription key={subscription.id} subscription={subscription} />
          ))}
        </section>
      )}
    </div>
  );
}
