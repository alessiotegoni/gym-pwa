import { SUBSCRIPTIONS_PLANS } from "@/constants";
import { db } from "@/drizzle/db";
import { subscriptions } from "@/drizzle/schema";
import { formatDate } from "@/lib/utils";
import { SubscriptionStatus } from "@/types";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const ALLOWED_EVENTS: Stripe.Event["type"][] = [
  "checkout.session.completed",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
];


export async function POST(req: Request) {
  try {
    const sig = (await headers()).get("stripe-signature");
    if (!sig) throw new Error("Missing stripe signature");

    const body = await req.text();
    if (!body) throw new Error("Missing body");

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.WEBHOOK_SECRET_KEY!
    );

    if (!ALLOWED_EVENTS.includes(event.type))
      return NextResponse.json({ received: true }, { status: 403 });

    console.log(event.type);

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
        if (!metadata)
          throw new Error(`Metadata not found on event: ${event.type}`);

        stripeSubscriptionId = event.data.object.subscription;
        if (typeof stripeSubscriptionId !== "string")
          return NextResponse.json({ received: true }, { status: 403 });

        await db.insert(subscriptions).values({
          userId: parseInt(metadata.userId),
          stripeSubscriptionId,
          status: "active",
          endDate: formatDate(
            addDays(new Date(), SUBSCRIPTIONS_PLANS[0].duration)
          ),
        });

        break;
      case "invoice.payment_succeeded":
        stripeSubscriptionId = event.data.object.subscription;
        if (typeof stripeSubscriptionId !== "string")
          return NextResponse.json({ received: true }, { status: 403 });

        const res = await db.query.subscriptions.findFirst({
          where: ({ stripeSubscriptionId: subId }, { eq }) =>
            eq(subId, stripeSubscriptionId as string),
          columns: { userId: true },
        });

        if (!res) return NextResponse.json({ received: true }, { status: 403 });

        await db.insert(subscriptions).values({
          userId: res.userId,
          endDate: formatDate(
            addDays(new Date(), SUBSCRIPTIONS_PLANS[0].duration)
          ),
          status: "active",
          stripeSubscriptionId,
        });
        break;
      case "invoice.payment_failed":
        stripeSubscriptionId = event.data.object.subscription;
        if (typeof stripeSubscriptionId !== "string")
          return NextResponse.json({ received: true }, { status: 403 });

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
        throw new Error("Event type not allowed");
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err?.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
