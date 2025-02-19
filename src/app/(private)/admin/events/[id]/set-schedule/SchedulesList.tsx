import { EventScheduleForm } from "@/components/forms/EventScheduleForm";
import { getEventSchedule } from "@/lib/queries";
import { getSchedulesEntries } from "@/lib/utils";

type Props = {
  eventId: number;
};
export default async function SchedulesList({ eventId }: Props) {
  const schedules = await getEventSchedule(eventId);
  const schedulesEntries = getSchedulesEntries(schedules);

  return <EventScheduleForm eventId={eventId} schedules={schedulesEntries} />;
}
