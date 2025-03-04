"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { DAYS_OF_WEEK_IN_ORDER, giorniSettimana } from "@/constants";
import { toast } from "sonner";
import SubmitBtn from "../SubmitBtn";
import { EventScheduleSchemaType, WeekDay } from "@/types";
import { eventScheduleSchema } from "@/lib/schema/schedule";
import { updateEventSchedule } from "@/actions/schedules";
import Schedule from "@/app/(private)/admin/events/[id]/set-schedule/Schedule";
import { getSchedulesEntries } from "@/lib/utils";
import BtnFixedContainer from "../BtnFixedContainer";

interface Props {
  eventId: number;
  eventDuration: number;
  schedulesEntries: ReturnType<typeof getSchedulesEntries>;
}

export function EventScheduleForm({
  eventId,
  schedulesEntries,
  eventDuration,
}: Props) {
  const form = useForm<EventScheduleSchemaType>({
    mode: "all",
    resolver: zodResolver(eventScheduleSchema),
    defaultValues: Object.fromEntries(schedulesEntries),
  });

  async function onSubmit(data: EventScheduleSchemaType) {
    const res = await updateEventSchedule(data, eventId);

    if (res?.error) {
      toast.error(
        "Errore durante l'aggiornamento del programma. Riprova più tardi."
      );
      return;
    }

    if (res?.errorSchedulesIds) {
      for (const [day, schedules] of schedulesEntries) {
        if (typeof schedules === "string") continue;

        for (const { scheduleId, startTime } of schedules) {
          if (!res.errorSchedulesIds.includes(scheduleId)) continue;
          const scheduleIndex = schedules.findIndex(
            (s) => s.scheduleId === scheduleId
          );

          form.setError(`${day as WeekDay}.${scheduleIndex}.startTime`, {
            message: `Questo orario (${startTime}) ha delle prenotazioni attive,
            eliminale per aggiornare o eliminare la programmazione`,
          });

          form.setFocus(`${day as WeekDay}.${scheduleIndex}.startTime`);
        }
      }

      toast.warning(
        `Alcuni orari non sono stati aggiornati correttamente
        perche hanno delle prenotazioni attive`,
        { duration: 10_000 }
      );

      return;
    }

    toast.success("Programma dell'evento aggiornato con successo.");
  }

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {DAYS_OF_WEEK_IN_ORDER.map((day) => (
          <Schedule key={day} day={day} eventDuration={eventDuration} />
        ))}
        <BtnFixedContainer>
          <SubmitBtn
            label="Aggiorna programma"
            loadingLabel="Aggiornando"
            className="sticky bottom-4"
          />
        </BtnFixedContainer>
      </form>
    </Form>
  );
}
