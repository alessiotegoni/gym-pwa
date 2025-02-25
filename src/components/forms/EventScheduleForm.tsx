"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { toast } from "sonner";
import SubmitBtn from "../SubmitBtn";
import { EventScheduleSchemaType } from "@/types";
import { eventScheduleSchema } from "@/lib/schema/schedule";
import { updateEventSchedule } from "@/actions/schedules";
import Schedule from "@/app/(private)/admin/events/[id]/set-schedule/Schedule";
import { getSchedulesEntries } from "@/lib/utils";

interface Props {
  eventId: number;
  eventDuration: number;
  schedules: ReturnType<typeof getSchedulesEntries>;
}

export function EventScheduleForm({
  eventId,
  schedules,
  eventDuration,
}: Props) {
  const form = useForm<EventScheduleSchemaType>({
    mode: "all",
    resolver: zodResolver(eventScheduleSchema),
    defaultValues: Object.fromEntries(schedules),
  });

  async function onSubmit(data: EventScheduleSchemaType) {
    const res = await updateEventSchedule(data, eventId);

    if (res?.error) {
      toast.error(
        "Errore durante l'aggiornamento del programma. Riprova più tardi."
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
        <SubmitBtn label="Aggiorna programma" loadingLabel="Aggiornando" className="sticky bottom-4" />
      </form>
    </Form>
  );
}
