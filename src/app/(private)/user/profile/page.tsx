import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { CalendarDays, Dumbbell, Trophy } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import CurrentSubscription from "../../subscriptions/ActiveSubscription";
import UserHeader from "@/components/UserHeader";
import BtnFixedContainer from "@/components/BtnFixedContainer";
import AllowedTrial from "./AllowedTrial";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteSubscription from "@/components/DeleteSubscription";
import { getActiveSubscription, getUserWorkoutStats } from "@/lib/queries";
import UserStatistics, { UserStatisticsSkeleton } from "./UserStatistics";

export const revalidate = 60;

export const metadata = {
  title: "Profilo",
  description: "Il tuo profilo tabata",
};

type Props = {
  searchParams: Promise<{ trial?: boolean }>;
};

export default async function UserProfilePage({ searchParams }: Props) {
  const [session, { trial }] = await Promise.all([auth(), searchParams]);

  const user = await db.query.users.findFirst({
    columns: { password: false },
    where: ({ id }, { eq }) => eq(id, session!.userId),
  });

  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col h-full gap-4">
      <UserHeader user={user} showLogout={true} />
      <main className="flex-1">
        <Suspense
          fallback={<Skeleton className="card-primary w-full h-[150px]" />}
        >
          <AllowedTrial userId={user.id} />
          <CurrentSubscription userId={user.id} />
        </Suspense>
        <Suspense fallback={<UserStatisticsSkeleton />}>
          <UserStatistics statsPromise={getUserWorkoutStats(user.id)} />
        </Suspense>
      </main>
      <footer>
        <BtnFixedContainer>
          <DeleteSubscription
            subscription={await getActiveSubscription(user.id)}
            className="basis-1/2 p-0 mb-2"
          />
          <Button className="grow w-full basis-1/2" asChild>
            <Link href="/subscriptions">Vedi Abbonamenti</Link>
          </Button>
        </BtnFixedContainer>
      </footer>
    </div>
  );
}
