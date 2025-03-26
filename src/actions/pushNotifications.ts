"use server";

import { db } from "@/drizzle/db";
import { pushNotifcations } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:pescivendolo@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

type PushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    auth: string;
    p256dh: string;
  };
};

export async function subscribeUser(sub: PushSubscription) {
  const session = await auth();

  if (!session?.userId || !sub) return { error: true };

  const { keys, ...restSub } = sub;
  const subscription = {
    ...restSub,
    auth: keys.auth,
    p256dh: keys.p256dh,
  };

  const { rowCount } = await db
    .insert(pushNotifcations)
    .values({ userId: session.userId, ...subscription })
    .onConflictDoUpdate({
      target: [pushNotifcations.userId],
      set: subscription,
    });

  if (!rowCount) return { error: true };
}

export async function unsubscribeUser() {
  const session = await auth();

  if (!session?.userId) return { error: true };

  const { rowCount } = await db
    .delete(pushNotifcations)
    .where(eq(pushNotifcations.userId, session.userId));

  if (!rowCount) return { error: true };
}

type NotificationPayload = {
  userId: number;
  title: string;
  body: string;
  url?: string;
  icon?: string;
};

export async function sendNotification(payload: NotificationPayload) {
  if (!payload.userId) return;

  const userPushSub = await db.query.pushNotifcations.findFirst({
    columns: { userId: false },
    where: ({ userId: notificationUserId }, { eq }) =>
      eq(notificationUserId, payload.userId),
  });

  if (!userPushSub) return;

  const { endpoint, expirationTime, auth: pushAuth, p256dh } = userPushSub;

  try {
    await webpush.sendNotification(
      { endpoint, expirationTime, keys: { auth: pushAuth, p256dh } },
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
