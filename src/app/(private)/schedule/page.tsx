import { auth } from "@/lib/auth";
import ScheduleCarousel from "./ScheduleCarousel";
import { getEventsWithSchedules } from "@/lib/queries";

type Props = {
  searchParams: Promise<{ bookingDate?: string }>;
};
export default async function SchedulePage({ searchParams }: Props) {
  const [session, events] = await Promise.all([
    auth(),
    getEventsWithSchedules(),
  ]);

  if (!session?.userId) return

  return <ScheduleCarousel events={events} userId={session.userId} />;
}
