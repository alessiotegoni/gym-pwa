import ScheduleCarousel from "./ScheduleCarousel";
import { getEventsWithSchedules } from "@/lib/queries";

type Props = {
    searchParams: Promise<{ date?: string }>
};
export default async function SchedulePage({}: Props) {
  const events = await getEventsWithSchedules();

  console.log(events);

  return <ScheduleCarousel events={events} />;
}
