"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { toast } from "sonner";
import SubmitBtn from "../SubmitBtn";
import { EventSchedules, EventScheduleSchemaType, WeekDay } from "@/types";
import { eventScheduleSchema } from "@/lib/schema/schedule";
import { updateEventSchedule } from "@/actions/schedules";
import Schedule from "@/app/(private)/admin/events/[id]/set-schedule/Schedule";
import { getSchedulesEntries } from "@/lib/utils";

interface Props {
  eventId: number;
  schedules: ReturnType<typeof getSchedulesEntries>;
}

export function EventScheduleForm({ eventId, schedules }: Props) {
  const form = useForm<EventScheduleSchemaType>({
    resolver: zodResolver(eventScheduleSchema),
    defaultValues: Object.fromEntries(schedules),
  });

  async function onSubmit(data: EventScheduleSchemaType) {
    const res = await updateEventSchedule(data, eventId);

    if (res?.error) {
      toast.error(
        "Si è verificato un errore durante l'aggiornamento del programma. Riprova più tardi."
      );
      return;
    }

    toast.success("Il programma dell'evento è stato aggiornato con successo.");
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {DAYS_OF_WEEK_IN_ORDER.map((day) => (
          <Schedule key={day} day={day} />
        ))}
        <SubmitBtn label="Aggiorna programma" loadingLabel="Aggiornando" />
      </form>
    </Form>
  );
}
