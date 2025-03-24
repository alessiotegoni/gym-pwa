import Subscription from "./Subscription";
import { getActiveSubscription } from "@/lib/queries";
import CreateSubscriptionCard from "@/components/CreateSubscriptionCard";

type Props = {
  userId: number;
};

export default async function ActiveSubscription({ userId }: Props) {
  const currentSubscription = await getActiveSubscription(userId);

  return (
    <section>
      {currentSubscription ? (
        <div className="px-[1px]">
          <h2 className="text-lg font-semibold mb-2">Abbonamento in Corso</h2>
          <Subscription subscription={currentSubscription} />
          {currentSubscription.status === "canceled" && (
            <p className="text-xs mt-2">
              Se l'abbonamento e' stato cancellato per sbaglio contatta i
              titolari della palestra
            </p>
          )}
        </div>
      ) : (
        <CreateSubscriptionCard />
      )}
    </section>
  );
}
