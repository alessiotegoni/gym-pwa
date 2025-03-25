import { createTrialSubscription } from "@/actions/subscriptions";
import SubmitBtn from "@/components/SubmitBtn";
import { TRIAL_DAYS } from "@/constants";
import { db } from "@/drizzle/db";
import { subscriptions } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { TestTubeDiagonal } from "lucide-react";

export default async function AllowedTrial({ userId }: { userId: number }) {
  const [res] = await db
    .select({ count: count() })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));

  return (
    !res.count && (
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
    )
  );
}
