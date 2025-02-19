import { EventScheduleForm } from "@/components/forms/EventScheduleForm";
import { getEventSchedule } from "@/lib/queries";
import { getSchedulesEntries } from "@/lib/utils";

type Props = {
  eventId: number;
  eventDuration: number;
};
export default async function SchedulesList({ eventId, eventDuration }: Props) {
  const schedules = await getEventSchedule(eventId);
  const schedulesEntries = getSchedulesEntries(schedules, eventDuration);

  return (
    <EventScheduleForm
      eventId={eventId}
      schedules={schedulesEntries}
      eventDuration={eventDuration}
    />
  );
}
