import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { CalendarDays, Dumbbell, TestTubeDiagonal, Trophy } from "lucide-react";
import { redirect } from "next/navigation";
import { createTrialSubscription } from "@/actions/subscriptions";
import SubmitBtn from "@/components/SubmitBtn";
import Link from "next/link";
import CurrentSubscription from "../../subscriptions/ActiveSubscription";
import UserHeader from "@/components/UserHeader";
import { isWithinInterval, startOfDay } from "date-fns";
import DeleteSubscription from "@/components/DeleteSubscription";
import { TRIAL_DAYS } from "@/constants";
import BtnFixedContainer from "@/components/BtnFixedContainer";

export const revalidate = 60

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
    where: ({ id }, { eq }) => eq(id, session?.userId!),
    with: {
      subscriptions: {
        columns: {
          id: true,
          endDate: true,
          createdAt: true,
          status: true,
          userId: true,
          stripeSubscriptionId: true,
        },
      },
    },
  });

  if (!user) redirect("/sign-in");

  const currentSub = user.subscriptions.find((sub) =>
    isWithinInterval(startOfDay(new Date()), {
      start: startOfDay(sub.createdAt),
      end: startOfDay(new Date(sub.endDate)),
    })
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <UserHeader user={user} showLogout={true} />
      <main className="flex-1">
        <div className="space-y-6">
          {!user.subscriptions.length ? (
            <form
              action={createTrialSubscription}
              className="flex flex-col items-center justify-center h-full
              p-4 border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900 rounded-xl"
            >
              <TestTubeDiagonal className="!size-12" />
              <p className="text-center font-medium mt-3 text-white">
                Sei idoneo per un periodo di prova di {TRIAL_DAYS} giorni!
              </p>
              <SubmitBtn
                label="Inizia Periodo di Prova"
                loadingLabel="Creando abbonamento"
                className="w-fit mt-5"
              />
            </form>
          ) : (
            <CurrentSubscription userId={user.id} />
          )}

          <section>
            <h3 className="text-lg font-semibold mb-2">Statistiche</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-2 border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900 rounded-xl">
                <Dumbbell className="!size-6 mb-1 dark:text-primary" />
                <span className="text-xl font-bold">4</span>
                <span className="text-xs text-muted-foreground">
                  Allenamenti
                </span>
              </div>
              <div className="flex flex-col items-center p-2 border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900 rounded-xl">
                <CalendarDays className="!size-6 mb-1 dark:text-primary" />
                <span className="text-xl font-bold">50</span>
                <span className="text-xs text-muted-foreground">Classi</span>
              </div>
              <div className="flex flex-col items-center p-2 border border-zinc-300/40 bg-zinc-100 dark:border-zinc-700/40 dark:bg-zinc-900 rounded-xl">
                <Trophy className="!size-6 mb-1 dark:text-primary" />
                <span className="text-xl font-bold">34</span>
                <span className="text-xs text-muted-foreground">Traguardi</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer>
        <BtnFixedContainer className="flex gap-2">
          <DeleteSubscription
            subscription={currentSub}
            className="basis-1/2 p-0"
          />
          <Button className="grow w-full basis-1/2" asChild>
            <Link href="/subscriptions">Vedi Abbonamenti</Link>
          </Button>
        </BtnFixedContainer>
      </footer>
    </div>
  );
}
