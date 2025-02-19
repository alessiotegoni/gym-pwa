import { SUBSCRIPTIONS_PLANS } from "@/constants";
import { db } from "@/drizzle/db";
import { subscriptions } from "@/drizzle/schema";
import { SubscriptionStatus } from "@/types";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
  typescript: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_EVENTS: Stripe.Event["type"][] = [
  "checkout.session.completed",
  "customer.subscription.deleted",
  "customer.subscription.updated",
  "invoice.payment_failed",
];

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) throw new Error();

    const body = await req.text();
    if (!body) throw new Error();

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.WEBHOOK_SECRET_KEY!
    );

    if (!ALLOWED_EVENTS.includes(event.type)) return;

    const expireSubscription = async (
      subscriptionId: string,
      status: SubscriptionStatus = "expired"
    ) =>
      await db
        .update(subscriptions)
        .set({ status })
        .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

    let stripeSubscriptionId: string | Stripe.Subscription | null;
    let metadata: Stripe.Metadata | null;

    switch (event.type) {
      case "checkout.session.completed":
        metadata = event.data.object.metadata;
        if (!metadata) throw new Error();

        stripeSubscriptionId = event.data.object.subscription;
        if (typeof stripeSubscriptionId !== "string") return;

        await db.insert(subscriptions).values({
          userId: parseInt(metadata.userId),
          stripeSubscriptionId,
          status: "active",
          endDate: addDays(new Date(), SUBSCRIPTIONS_PLANS[0].duration),
        });

        break;
      case "invoice.payment_succeeded":
        stripeSubscriptionId = event.data.object.subscription;
        if (typeof stripeSubscriptionId !== "string") return;

        const res = await db.query.subscriptions.findFirst({
          where: ({ stripeSubscriptionId: subId }, { eq }) =>
            eq(subId, stripeSubscriptionId as string),
          columns: { userId: true },
        });

        if (!res) return;

        await db.insert(subscriptions).values({
          userId: res.userId,
          endDate: addDays(new Date(), SUBSCRIPTIONS_PLANS[0].duration),
          status: "active",
          stripeSubscriptionId,
        });
        break;
      case "invoice.payment_failed":
        stripeSubscriptionId = event.data.object.subscription;
        if (typeof stripeSubscriptionId !== "string") return;

        await expireSubscription(stripeSubscriptionId);
        break;
      // case "customer.subscription.updated":
      //   console.log(event.data.object);
      //   break;
      case "customer.subscription.deleted":
        await expireSubscription(
          event.data.object.id,
          event.data.object.cancellation_details?.comment
            ? "canceled"
            : "expired"
        );
        break;
      default:
        throw new Error();
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
