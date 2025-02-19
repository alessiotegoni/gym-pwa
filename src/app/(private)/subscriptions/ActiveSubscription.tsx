import Subscription from "./Subscription";
import { AlertCircle } from "lucide-react";
import { userCreateSubscription } from "@/actions/subscriptions";
import SubmitBtn from "@/components/SubmitBtn";
import { getActiveSubscriptions } from "@/lib/queries";

type Props = {
  userId: number;
};

export default async function ActiveSubscription({ userId }: Props) {
  const currentSubscription = await getActiveSubscriptions(userId);

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
        <div
          className="flex flex-col items-center justify-center h-full
          p-4 py-6 bg-secondary rounded-xl"
        >
          <AlertCircle className="!size-12" />
          <p className="text-center text-muted-foreground mt-3">
            Non hai abbonamenti attivi al momento.
          </p>
          <form action={userCreateSubscription} className="mt-4">
            <SubmitBtn label="Compra abbonamento" loadingLabel="Comprando" />
          </form>
        </div>
      )}
    </section>
  );
}
