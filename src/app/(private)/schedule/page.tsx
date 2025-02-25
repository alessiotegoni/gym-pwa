import { auth } from "@/lib/auth";
import ScheduleCarousel from "./ScheduleCarousel";
import { hasSubscription, getEventsWithSchedules } from "@/lib/queries";

export const metadata = {
  title: "Palinsesto",
  description: "Scegli l'orario che fa meglio per te tra quelli disponibili",
};

type Props = {
  searchParams: Promise<{ currentDate?: string }>;
};

export default async function SchedulePage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.userId) return;

  const [eventsWithSchedules, isUserSubscripted, currentDate] =
    await Promise.all([
      getEventsWithSchedules(),
      hasSubscription(session.userId),
      searchParams,
    ]);

  return (
    <ScheduleCarousel
      events={eventsWithSchedules}
      userId={session.userId}
      hasSubscription={isUserSubscripted}
    />
  );
}
