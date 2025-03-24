import { Inter } from "next/font/google";
import TopBar from "@/components/bars/TopBar";
import BottomBar from "@/components/bars/BottomBar";
import { auth } from "@/lib/auth";
import { after } from "next/server";
import { isAfter, startOfDay } from "date-fns";
import { db } from "@/drizzle/db";
import { subscriptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  after(async () => {
    const sub = await db.query.subscriptions.findFirst({
      where: ({ userId, status }, { and, eq }) =>
        and(eq(userId, session!.userId), eq(status, "trial")),
      orderBy: ({ endDate }, { desc }) => desc(endDate),
    });

    if (sub && isAfter(startOfDay(new Date()), new Date(sub.endDate))) {
      console.log("now", startOfDay(new Date()));
      console.log("endDate", new Date(sub.endDate));

      await db
        .update(subscriptions)
        .set({ status: "expired" })
        .where(eq(subscriptions.id, sub.id));
    }
  });

  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_auto]">
      <TopBar />
      <main
        className={`container py-4 ${inter.variable} antialiased font-inter`}
      >
        {children}
      </main>
      <BottomBar
        classNames={{
          nav: "standalone:my-0 standalone:h-[90px] standalone:items-start",
        }}
      />
    </div>
  );
}
