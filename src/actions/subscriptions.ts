"use server";

import { db } from "@/drizzle/db";
import { subscriptions } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { addDays, getUnixTime } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateSubscriptionType, Subscription } from "@/types";
import { eq } from "drizzle-orm";
import { createSubscriptionSchema } from "@/lib/schema/subscription";
import { headers } from "next/headers";
import { after } from "next/server";
import { getActiveSubscriptions } from "@/lib/queries";
import { stripe } from "@/app/api/stripe-webhook/route";
import { SUBSCRIPTIONS_PLANS, TRIAL_DAYS } from "@/constants";

export async function createTrialSubscription() {
  const session = await auth();

  if (!session?.userId) return;

  await db.insert(subscriptions).values({
    userId: session.userId,
    status: "trial",
    endDate: addDays(new Date(), TRIAL_DAYS),
  });

  revalidatePath("/user/profile");
  redirect("/user/profile");
}

export async function userCreateSubscription() {
  const session = await auth();

  if (!session?.userId) return;

  const [reqHeaders, hasSubscription] = await Promise.all([
    headers(),
    getActiveSubscriptions(session.userId),
  ]);

  if (hasSubscription) return;

  const redirect_url = reqHeaders.get("origin") + "/user";

  const customerId = (
    await stripe.customers.list({
      email: session.user?.email!,
      limit: 1,
    })
  ).data[0]?.id;

  const checkout = await stripe.checkout.sessions.create({
    success_url: redirect_url + "?success=true",
    cancel_url: redirect_url + "?success=false",
    line_items: [{ price: SUBSCRIPTIONS_PLANS[0].priceId, quantity: 1 }],
    metadata: {
      userId: session.userId.toString(),
    },
    customer: customerId,
    customer_email: customerId ? undefined : session.user?.email!,
    mode: "subscription",
    payment_method_types: ["card"],
  });

  if (checkout.url) redirect(checkout.url);
}

export async function adminCreateSubscription(values: CreateSubscriptionType) {
  const session = await auth();

  if (!session?.userId || !session.isAdmin) return;

  const { success, data } = createSubscriptionSchema.safeParse(values);

  if (!success) return { error: true };

  const [result] = await db
    .insert(subscriptions)
    .values({
      userId: parseInt(data.userId),
      status: data.isTrial ? "trial" : "active",
      endDate: addDays(new Date(), SUBSCRIPTIONS_PLANS[0].duration),
    })
    .returning({ id: subscriptions.id });

  if (!result) return { error: true };

  redirect(`/subscriptions/${result.id}`);
}

export async function extendSubscription(
  id: number,
  previousEndDate: Date,
  newEndDate: Date,
  stripeSubscriptionId: string | null
) {
  const session = await auth();

  if (!session?.isAdmin) return { error: true };

  if (newEndDate <= previousEndDate) return { error: true };

  await db
    .update(subscriptions)
    .set({ endDate: newEndDate })
    .where(eq(subscriptions.id, id));

  after(async () => {
    if (stripeSubscriptionId) {
      await stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at: getUnixTime(newEndDate),
        proration_behavior: "none",
      });
    }
  });

  revalidatePath(`/subscriptions/${id}`);
}

export async function cancelSubscription({
  id,
  stripeSubscriptionId,
  userId,
  status,
}: Partial<Subscription>) {
  const session = await auth();

  if (
    !session?.userId ||
    (session.userId !== userId && !session.isAdmin) ||
    status === "canceled"
  ) {
    return { error: true };
  }

  const res = await db
    .update(subscriptions)
    .set({ status: "canceled" })
    .where(eq(subscriptions.id, id!));

  if (!res.rowCount) return { error: true };

  if (stripeSubscriptionId)
    await stripe.subscriptions.cancel(stripeSubscriptionId, {
      cancellation_details: {
        comment: `Abbonamento cancellato dall'utente: ${session.user?.email}`,
      },
    });

  revalidatePath(`/subscriptions/${id}`);
}
