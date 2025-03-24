import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, AlertCircle, HandCoins } from "lucide-react";
import { formatDate } from "date-fns";
import { db } from "@/drizzle/db";
import SubscriptionBadge from "../SubscriptionBadge";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import UserHeader from "@/components/UserHeader";
import ExtendSubDatePicker from "@/components/ExtendSubscription";
import DeleteSubscription from "@/components/DeleteSubscription";
import { SUBSCRIPTIONS_PLANS, TRIAL_DAYS } from "@/constants";
import { cn } from "@/lib/utils";
import BtnFixedContainer from "@/components/BtnFixedContainer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Props = {
  params: Promise<{ id?: string }>;
};

export default async function SubscriptionPage({ params }: Props) {
  const [{ id: subId }, session] = await Promise.all([params, auth()]);

  if (!subId) return notFound();

  const subscription = await db.query.subscriptions.findFirst({
    where: ({ id }, { eq }) => eq(id, parseInt(subId)),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!session?.isAdmin && subscription?.userId !== session?.userId)
    redirect("/user/profile");

  if (!subscription)
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Errore</h1>
        <p className="text-center text-muted-foreground mb-4">
          Si è verificato un errore nel recupero dei dettagli dell'abbonamento.
          Per favore, riprova più tardi o contatta il supporto.
        </p>
        <Button asChild>
          <Link href="/subscriptions">Vedi abbonamenti</Link>
        </Button>
      </div>
    );

  const isPaidWithStripe = subscription.stripeSubscriptionId;

  const stripeSubscription = isPaidWithStripe
    ? await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId!)
    : null;

  const subscriptionPayment = stripeSubscription
    ? await stripe.paymentMethods.retrieve(
        stripeSubscription.default_payment_method as string
      )
    : null;

  return (
    <div className="flex flex-col h-full">
      <header>
        {session?.isAdmin && (
          <UserHeader user={subscription.user} showEditUser={false} />
        )}
      </header>

      <main className="grow mb-10">
        <section className="card-primary my-3">
          <h1 className="text-2xl font-semibold">Dettagli Abbonamento</h1>
          <p className="mb-7 font-medium text-muted-foreground mt-2">
            Id abbonamento: {subscription.id}
          </p>
          <SubscriptionBadge
            subscription={subscription}
            className="*:text-base"
          />
        </section>
        <section className="card-primary">
          <h2 className="text-xl font-semibold mb-4">Dettagli Piano</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Nome Piano:</span>{" "}
              {SUBSCRIPTIONS_PLANS[0].name}
            </p>
            <p>
              <span className="font-medium">Prezzo:</span>{" "}
              {subscription.status === "trial" ? (
                "Gratuito"
              ) : (
                <>
                  {stripeSubscription?.items.data[0].price.unit_amount! / 100 ||
                    50}
                  &euro;
                </>
              )}
            </p>
            <p>
              <span className="font-medium">Durata:</span>{" "}
              {subscription.status === "trial"
                ? TRIAL_DAYS
                : SUBSCRIPTIONS_PLANS[0].duration} giorni
            </p>
          </div>
        </section>
        <section className="card-primary my-3">
          <h2 className="text-xl font-semibold mb-4">Date Importanti</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="!size-5" />
              <p>
                <span className="font-medium">Data Inizio:</span>{" "}
                {formatDate(subscription.createdAt, "dd/MM/yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="!size-5" />
              <p>
                <span className="font-medium">Data Fine:</span>{" "}
                {formatDate(subscription.endDate, "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        </section>
        {subscription.status !== "trial" && (
          <section className="card-primary">
            <h2 className="text-xl font-semibold mb-4">Metodo di Pagamento</h2>
            <div className="flex items-center gap-2">
              {subscriptionPayment ? (
                <CreditCard
                  className="
                size-6"
                />
              ) : (
                <HandCoins className="size-6" />
              )}
              <p>
                {subscriptionPayment ? (
                  <>
                    <span className="capitalize">
                      {subscriptionPayment.card?.brand}{" "}
                    </span>
                    che termina con {subscriptionPayment.card?.last4}
                  </>
                ) : (
                  "Pagato in contanti"
                )}
              </p>
            </div>
          </section>
        )}
      </main>
      <BtnFixedContainer>
        <footer className="space-y-2 grid grid-cols-2 gap-2">
          {(session?.isAdmin || session?.userId === subscription.userId) && (
            <DeleteSubscription
              subscription={subscription}
              className={cn(!session.isAdmin && "col-span-2")}
            />
          )}
          {session?.isAdmin &&
            ["active", "trial"].includes(subscription.status) && (
              <ExtendSubDatePicker subscription={subscription} />
            )}
        </footer>
      </BtnFixedContainer>
    </div>
  );
}
