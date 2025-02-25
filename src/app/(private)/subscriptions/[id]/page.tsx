import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Calendar, AlertCircle } from "lucide-react";
import { formatDate } from "date-fns";
import { db } from "@/drizzle/db";
import SubscriptionBadge from "../SubscriptionBadge";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import UserHeader from "@/components/UserHeader";
import ExtendSubDatePicker from "@/components/ExtendSubscription";
import DeleteSubscription from "@/components/DeleteSubscription";
import { Metadata } from "next";
import { stripe } from "@/app/api/stripe-webhook/route";
import { SUBSCRIPTIONS_PLANS } from "@/constants";
import { cn } from "@/lib/utils";
import BtnFixedContainer from "@/components/BtnFixedContainer";

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
        {session?.isAdmin && <UserHeader user={subscription.user} />}
      </header>

      <main className="grow">
        <h1 className="text-2xl font-semibold mt-2">Dettagli Abbonamento</h1>
        <p className="mb-7 font-medium text-muted-foreground mt-2">
          Id abbonamento: {subscription.id}
        </p>
        <div className="space-y-6">
          <section>
            <SubscriptionBadge
              subscription={subscription}
              className="*:text-base"
            />
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-2">Dettagli Piano</h2>
            <div className="space-y-2">
              <p>
                <strong>Nome Piano:</strong> {SUBSCRIPTIONS_PLANS[0].name}
              </p>
              <p>
                <strong>Prezzo:</strong>{" "}
                {stripeSubscription?.items.data[0].price.unit_amount! / 100 ||
                  50}
                &euro;
              </p>
              <p>
                <strong>Durata:</strong> {SUBSCRIPTIONS_PLANS[0].duration}{" "}
                giorni
              </p>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-2">Date Importanti</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="!size-5" />
                <p>
                  <strong>Data Inizio:</strong>{" "}
                  {formatDate(subscription.createdAt, "dd/MM/yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="!size-5" />
                <p>
                  <strong>Data Fine:</strong>{" "}
                  {formatDate(subscription.endDate, "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          </section>
          <Separator />
          <section>
            <h2 className="text-xl font-semibold mb-2">Metodo di Pagamento</h2>
            <div className="flex items-center gap-2">
              <CreditCard className="!size-6" />
              <p>
                {subscriptionPayment
                  ? `${subscriptionPayment.card?.brand} che termina con ${subscriptionPayment.card?.last4}`
                  : "Pagato in contanti"}
              </p>
            </div>
          </section>
        </div>
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
